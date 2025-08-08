;(() => {
  const UI_ID = 'ai-job-assistant-root'
  const API_DEFAULT = 'http://localhost:5123'

  function ensureUi() {
    let el = document.getElementById(UI_ID)
    if (!el) {
      el = document.createElement('div')
      el.id = UI_ID
      el.style.position = 'fixed'
      el.style.top = '12px'
      el.style.right = '12px'
      el.style.zIndex = '2147483647'
      el.style.background = 'white'
      el.style.border = '1px solid #ddd'
      el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
      el.style.borderRadius = '8px'
      el.style.padding = '12px'
      el.style.fontFamily = 'system-ui, sans-serif'
      el.style.fontSize = '12px'
      document.body.appendChild(el)
    }
    return el
  }

  function setUi(text) {
    const ui = ensureUi()
    ui.textContent = text
  }

  function removeUi() {
    const ui = document.getElementById(UI_ID)
    if (ui) ui.remove()
  }

  function extractFields() {
    const inputs = Array.from(document.querySelectorAll('input, select, textarea'))
    const fields = []
    for (const el of inputs) {
      const label = findLabelText(el)
      const data_attrs = {}
      for (const a of el.attributes) {
        if (a.name.startsWith('data-')) data_attrs[a.name] = a.value
      }
      const selector = computeSelector(el)
      fields.push({
        selector,
        type: el.getAttribute('type') || el.tagName.toLowerCase(),
        name: el.getAttribute('name') || undefined,
        id: el.id || undefined,
        placeholder: el.getAttribute('placeholder') || undefined,
        aria_label: el.getAttribute('aria-label') || undefined,
        label,
        data_attrs
      })
    }
    return fields
  }

  function computeSelector(el) {
    if (el.id) return `#${CSS.escape(el.id)}`
    const parts = []
    let node = el
    while (node && node.nodeType === 1 && parts.length < 4) {
      const name = node.nodeName.toLowerCase()
      const nth = Array.from(node.parentNode ? node.parentNode.children : []).filter(c => c.nodeName === node.nodeName).indexOf(node) + 1
      parts.unshift(`${name}:nth-of-type(${nth})`)
      node = node.parentElement
    }
    return parts.join(' > ')
  }

  function findLabelText(el) {
    // for/label
    if (el.id) {
      const lbl = document.querySelector(`label[for="${CSS.escape(el.id)}"]`)
      if (lbl) return lbl.textContent?.trim() || ''
    }
    // aria-label
    const aria = el.getAttribute('aria-label')
    if (aria) return aria
    // closest label ancestor
    const parentLabel = el.closest('label')
    if (parentLabel) return parentLabel.textContent?.trim() || ''
    // nearby text
    const prev = el.previousElementSibling
    if (prev && prev.tagName.toLowerCase() === 'label') return prev.textContent?.trim() || ''
    return ''
  }

  async function getApiBase() {
    try {
      const resp = await chrome.runtime.sendMessage({ type: 'getApiBase' })
      return resp?.apiBase || API_DEFAULT
    } catch {
      return API_DEFAULT
    }
  }

  async function planAndFill() {
    setUi('Scanning form...')
    const apiBase = await getApiBase()
    const url = location.href
    const fields = extractFields()
    try {
      setUi('Planning fill...')
      const planResp = await fetch(`${apiBase}/fill/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, fields })
      })
      if (!planResp.ok) throw new Error('plan failed')
      const plan = await planResp.json()
      let filled = 0
      for (const step of plan.steps) {
        const el = document.querySelector(step.selector)
        if (!el) continue
        if (step.action === 'setValue') {
          setElementValue(el, step.value)
          filled++
        } else if (step.action === 'setFile') {
          // cannot programmatically set file from disk; show prompt
          markFileField(el, step.value)
        }
      }
      if (plan.unknown_fields?.length) {
        setUi(`Filled ${filled}. Needs input for ${plan.unknown_fields.length} fields.`)
        await promptLearn(plan, apiBase)
      } else {
        setUi(`Filled ${filled} fields.`)
        setTimeout(removeUi, 1500)
      }
    } catch (e) {
      console.error(e)
      setUi('Autofill failed. See console.')
    }
  }

  function setElementValue(el, value) {
    const tag = el.tagName.toLowerCase()
    if (tag === 'input' || tag === 'textarea') {
      const type = (el.getAttribute('type') || '').toLowerCase()
      if (type === 'checkbox') {
        el.checked = !!value && value !== 'false'
        el.dispatchEvent(new Event('change', { bubbles: true }))
        return
      }
      if (type === 'radio') {
        const name = el.getAttribute('name')
        if (name) {
          const radios = document.querySelectorAll(`input[type="radio"][name="${CSS.escape(name)}"]`)
          for (const r of radios) {
            if (r.value === value || r.getAttribute('aria-label') === value || findLabelText(r) === value) {
              r.checked = true
              r.dispatchEvent(new Event('change', { bubbles: true }))
              return
            }
          }
        }
      }
      el.focus()
      el.value = value
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
      el.blur()
    } else if (tag === 'select') {
      el.value = value
      el.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  async function promptLearn(plan, apiBase) {
    for (const unknown of plan.unknown_fields) {
      const el = document.querySelector(unknown.selector)
      if (!el) continue
      const key = prompt('Label this field (e.g., email, first_name, phone):', '')
      if (!key) continue
      try {
        await fetch(`${apiBase}/learn`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: plan.domain, mapping: { selector: unknown.selector, field_key: key, type: el.getAttribute('type') || el.tagName.toLowerCase() } })
        })
      } catch (e) {
        console.warn('learn failed', e)
      }
    }
  }

  function markFileField(el, filename) {
    el.setAttribute('data-autofill-needed', 'true')
    el.title = `Please upload: ${filename}`
    const hint = document.createElement('div')
    hint.textContent = `Upload required: ${filename}`
    hint.style.fontSize = '11px'
    hint.style.color = '#8a2be2'
    hint.style.marginTop = '4px'
    el.parentElement?.appendChild(hint)
  }

  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'scanAndFill') {
      planAndFill()
    }
  })

  // After filling, if password was generated, save credentials
  window.addEventListener('submit', async (e) => {
    try {
      const form = e.target
      if (!(form instanceof HTMLFormElement)) return
      const apiBase = await getApiBase()
      const domain = location.hostname
      const usernameEl = form.querySelector('input[type="email"], input[name*="user" i], input[name*="email" i]')
      const passwordEl = form.querySelector('input[type="password"]')
      if (passwordEl && passwordEl.value) {
        await fetch(`${apiBase}/credentials`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain, username: usernameEl ? usernameEl.value : undefined, password: passwordEl.value })
        })
      }
    } catch {}
  }, { capture: true })
})()
