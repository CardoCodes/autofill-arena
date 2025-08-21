;(() => {
  const OVERLAY_ID = 'autofill-arena-overlay'
  const HEADER_ID = 'autofill-arena-header'
  const CLOSE_ID = 'autofill-arena-close-btn'
  const API_DEFAULT = 'http://localhost:5123'

  function createOverlay() {
    if (document.getElementById(OVERLAY_ID)) return document.getElementById(OVERLAY_ID)

    const container = document.createElement('div')
    container.id = OVERLAY_ID
    container.className = 'autofill-overlay'
    container.style.position = 'fixed'
    container.style.top = '80px'
    container.style.left = '80px'
    container.style.zIndex = '999999'
    container.style.width = '420px'
    container.style.height = '640px'
    container.style.background = 'white'
    container.style.border = '1px solid #e5e7eb'
    container.style.borderRadius = '10px'
    container.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'
    container.style.userSelect = 'none'
    container.style.display = 'flex'
    container.style.flexDirection = 'column'
    container.style.overflow = 'hidden'
    container.style.boxSizing = 'border-box'

    const header = document.createElement('div')
    header.id = HEADER_ID
    header.textContent = 'AutoFill Arena'
    header.style.cursor = 'move'
    header.style.padding = '10px 14px'
    header.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    header.style.fontSize = '14px'
    header.style.fontWeight = '600'
    header.style.background = '#111827'
    header.style.color = 'white'
    header.style.borderTopLeftRadius = '10px'
    header.style.borderTopRightRadius = '10px'
    header.style.position = 'relative'

    const close = document.createElement('button')
    close.id = CLOSE_ID
    close.textContent = '✕'
    close.setAttribute('aria-label', 'Close')
    close.style.position = 'absolute'
    close.style.top = '6px'
    close.style.right = '8px'
    close.style.width = '28px'
    close.style.height = '28px'
    close.style.border = 'none'
    close.style.borderRadius = '6px'
    close.style.background = 'transparent'
    close.style.color = 'white'
    close.style.cursor = 'pointer'

    const body = document.createElement('div')
    body.style.flex = '1 1 auto'
    body.style.padding = '0'
    body.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    body.style.fontSize = '13px'
    body.style.overflow = 'hidden'
    body.style.boxSizing = 'border-box'

    const iframe = document.createElement('iframe')
    try {
      iframe.src = chrome.runtime.getURL('popup.html')
    } catch {
      iframe.src = 'popup.html'
    }
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.border = '0'
    iframe.style.display = 'block'
    iframe.setAttribute('title', 'AutoFill Arena')

    header.appendChild(close)
    container.appendChild(header)
    container.appendChild(body)
    body.appendChild(iframe)
    document.documentElement.appendChild(container)

    enableDragging(container, header)
    close.addEventListener('click', () => container.remove())
    return container
  }

  function toggleOverlay() {
    const existing = document.getElementById(OVERLAY_ID)
    if (existing) {
      existing.remove()
      return
    }
    createOverlay()
  }

  function enableDragging(container, handle) {
    let isDragging = false
    let startMouseX = 0
    let startMouseY = 0
    let startLeft = 0
    let startTop = 0

    const onMouseDown = (e) => {
      isDragging = true
      startMouseX = e.clientX
      startMouseY = e.clientY
      const rect = container.getBoundingClientRect()
      startLeft = rect.left
      startTop = rect.top
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    const onMouseMove = (e) => {
      if (!isDragging) return
      const dx = e.clientX - startMouseX
      const dy = e.clientY - startMouseY
      container.style.left = `${Math.max(0, startLeft + dx)}px`
      container.style.top = `${Math.max(0, startTop + dy)}px`
    }

    const onMouseUp = () => {
      isDragging = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    handle.addEventListener('mousedown', onMouseDown)
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
    const overlay = createOverlay()
    const body = overlay.querySelector('div:nth-child(2)')
    if (body) body.textContent = 'Scanning form...'
    const apiBase = await getApiBase()
    const url = location.href
    const fields = extractFields()
    try {
      if (body) body.textContent = 'Planning fill...'
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
        if (body) body.textContent = `Filled ${filled}. Needs input for ${plan.unknown_fields.length} fields.`
        await promptLearn(plan, apiBase)
      } else {
        if (body) body.textContent = `Filled ${filled} fields.`
        setTimeout(() => overlay.remove(), 1500)
      }
    } catch (e) {
      console.error(e)
      if (body) body.textContent = 'Autofill failed. See console.'
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
    if (request.action === 'toggleOverlay') {
      toggleOverlay()
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
