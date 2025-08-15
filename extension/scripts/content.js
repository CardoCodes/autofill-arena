;(() => {
  const UI_ID = 'ai-job-assistant-root'
  const CONTENT_ID = 'ai-job-assistant-content'
  const HEADER_ID = 'ai-job-assistant-header'
  const CLOSE_ID = 'ai-job-assistant-close'
  const API_DEFAULT = 'http://localhost:5123'

  let isDragging = false
  let dragOffsetX = 0
  let dragOffsetY = 0

  async function getOverlayOpacity() {
    try {
      if (typeof browser !== 'undefined' && browser.storage?.local?.get) {
        const res = await browser.storage.local.get(['overlayOpacity'])
        const v = res?.overlayOpacity
        if (typeof v === 'number' && v >= 0.1 && v <= 1) return v
      }
    } catch {}
    try {
      if (typeof chrome !== 'undefined' && chrome.storage?.local?.get) {
        const res = await new Promise((resolve) => chrome.storage.local.get(['overlayOpacity'], resolve))
        const v = res?.overlayOpacity
        if (typeof v === 'number' && v >= 0.1 && v <= 1) return v
      }
    } catch {}
    return 0.9
  }

  function centerElement(el) {
    const width = el.offsetWidth || 420
    const height = el.offsetHeight || 260
    const left = Math.max(12, Math.round((window.innerWidth - width) / 2))
    const top = Math.max(12, Math.round((window.innerHeight - height) / 2))
    el.style.left = left + 'px'
    el.style.top = top + 'px'
  }

  function attachDragHandlers(el, handle) {
    handle.style.cursor = 'move'
    handle.addEventListener('mousedown', (e) => {
      isDragging = true
      const rect = el.getBoundingClientRect()
      dragOffsetX = e.clientX - rect.left
      dragOffsetY = e.clientY - rect.top
      e.preventDefault()
    })
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return
      const x = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, e.clientX - dragOffsetX))
      const y = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, e.clientY - dragOffsetY))
      el.style.left = x + 'px'
      el.style.top = y + 'px'
    })
    document.addEventListener('mouseup', () => {
      isDragging = false
    })
  }

  async function ensureUi() {
    let el = document.getElementById(UI_ID)
    const opacity = await getOverlayOpacity()
    if (!el) {
      el = document.createElement('div')
      el.id = UI_ID
      el.style.position = 'fixed'
      el.style.zIndex = '2147483647'
      el.style.width = '420px'
      el.style.maxWidth = '90vw'
      el.style.background = `rgba(255,255,255,${opacity})`
      el.style.border = '1px solid #ddd'
      el.style.boxShadow = '0 12px 28px rgba(0,0,0,0.18)'
      el.style.borderRadius = '10px'
      el.style.fontFamily = 'system-ui, sans-serif'
      el.style.fontSize = '13px'
      el.style.color = '#1a1a1a'
      el.style.padding = '0'
      el.style.userSelect = 'none'

      const header = document.createElement('div')
      header.id = HEADER_ID
      header.style.display = 'flex'
      header.style.alignItems = 'center'
      header.style.gap = '8px'
      header.style.padding = '10px 12px'
      header.style.borderBottom = '1px solid #eaeaea'
      header.style.background = 'rgba(255,255,255,0.85)'

      const close = document.createElement('button')
      close.id = CLOSE_ID
      close.textContent = '✕'
      close.setAttribute('aria-label', 'Close')
      close.style.background = 'transparent'
      close.style.border = 'none'
      close.style.color = '#555'
      close.style.fontSize = '14px'
      close.style.cursor = 'pointer'
      close.addEventListener('click', removeUi)

      const title = document.createElement('div')
      title.textContent = 'AutoFill Arena'
      title.style.fontWeight = '600'
      title.style.flex = '1'

      header.appendChild(close)
      header.appendChild(title)

      const content = document.createElement('div')
      content.id = CONTENT_ID
      content.style.padding = '12px'
      content.style.minHeight = '120px'

      el.appendChild(header)
      el.appendChild(content)
      document.body.appendChild(el)

      // Position after in DOM so offsetWidth is available
      centerElement(el)

      // Dragging
      attachDragHandlers(el, header)

      // React to opacity changes live
      try {
        if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
          chrome.storage.onChanged.addListener((changes, area) => {
            if (area === 'local' && changes.overlayOpacity) {
              const v = changes.overlayOpacity.newValue
              if (typeof v === 'number') {
                el.style.background = `rgba(255,255,255,${v})`
              }
            }
          })
        }
      } catch {}
    } else {
      // Update opacity if it changed
      el.style.background = `rgba(255,255,255,${opacity})`
    }
    return el
  }

  function setUi(text) {
    const ui = document.getElementById(UI_ID)
    if (!ui) return
    const content = ui.querySelector('#' + CONTENT_ID)
    if (content) {
      content.textContent = text
    } else {
      // Fallback: legacy
      ui.textContent = text
    }
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
    if (el.id) {
      const lbl = document.querySelector(`label[for="${CSS.escape(el.id)}"]`)
      if (lbl) return lbl.textContent?.trim() || ''
    }
    const aria = el.getAttribute('aria-label')
    if (aria) return aria
    const parentLabel = el.closest('label')
    if (parentLabel) return parentLabel.textContent?.trim() || ''
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
    await ensureUi()
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
          markFileField(el, step.value)
        }
      }
      if (plan.unknown_fields?.length) {
        setUi(`Filled ${filled}. Needs input for ${plan.unknown_fields.length} fields.`)
        await promptLearn(plan, apiBase)
      } else {
        setUi(`Filled ${filled} fields.`)
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
