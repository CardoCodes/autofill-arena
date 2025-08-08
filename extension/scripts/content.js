;(() => {
  const UI_ID = 'ai-job-assistant-root'
  const API_DEFAULT = 'http://localhost:5123'
  // Persistent overlay constants
  const OVERLAY_ID = 'afa-overlay'
  const OVERLAY_HEADER_ID = 'afa-overlay-header'
  const OVERLAY_IFRAME_ID = 'afa-overlay-iframe'
  const OVERLAY_RESIZE_ID = 'afa-overlay-resize'
  const STORAGE_KEY = 'afa_overlay_state'

  async function loadOverlayState() {
    try {
      const stored = await chrome.storage.local.get([STORAGE_KEY])
      return stored?.[STORAGE_KEY] || { isOpen: false, top: 24, left: null, right: 24, width: 420, height: 640 }
    } catch {
      return { isOpen: false, top: 24, left: null, right: 24, width: 420, height: 640 }
    }
  }

  async function saveOverlayState(partial) {
    const current = await loadOverlayState()
    const next = { ...current, ...partial }
    await chrome.storage.local.set({ [STORAGE_KEY]: next })
    return next
  }

  function ensureOverlayElements() {
    let overlay = document.getElementById(OVERLAY_ID)
    if (!overlay) {
      overlay = document.createElement('div')
      overlay.id = OVERLAY_ID
      overlay.style.position = 'fixed'
      overlay.style.top = '24px'
      overlay.style.right = '24px'
      overlay.style.zIndex = '2147483647'
      overlay.style.width = '420px'
      overlay.style.height = '640px'
      overlay.style.background = 'white'
      overlay.style.color = '#111'
      overlay.style.border = '1px solid rgba(0,0,0,0.12)'
      overlay.style.borderRadius = '10px'
      overlay.style.boxShadow = '0 12px 32px rgba(0,0,0,0.22)'
      overlay.style.overflow = 'hidden'
      overlay.style.display = 'none'
      overlay.style.backdropFilter = 'saturate(140%)'
      overlay.style.userSelect = 'none'
      document.documentElement.appendChild(overlay)

      const header = document.createElement('div')
      header.id = OVERLAY_HEADER_ID
      header.style.cursor = 'move'
      header.style.height = '40px'
      header.style.display = 'flex'
      header.style.alignItems = 'center'
      header.style.justifyContent = 'space-between'
      header.style.padding = '0 10px'
      header.style.background = '#282a36'
      header.style.color = '#f8f8f2'
      header.style.fontFamily = 'system-ui, sans-serif'
      header.style.fontSize = '14px'
      header.style.fontWeight = '600'
      header.style.borderBottom = '1px solid rgba(255,255,255,0.08)'

      const title = document.createElement('div')
      title.textContent = 'AutoFill Arena'
      title.style.display = 'flex'
      title.style.alignItems = 'center'
      title.style.gap = '8px'

      const close = document.createElement('button')
      close.textContent = '×'
      close.setAttribute('aria-label', 'Close')
      close.style.background = 'transparent'
      close.style.border = 'none'
      close.style.color = '#f8f8f2'
      close.style.fontSize = '22px'
      close.style.lineHeight = '1'
      close.style.cursor = 'pointer'
      close.addEventListener('click', async () => {
        await hideOverlay()
        await saveOverlayState({ isOpen: false })
      })

      header.appendChild(title)
      header.appendChild(close)

      const iframe = document.createElement('iframe')
      iframe.id = OVERLAY_IFRAME_ID
      iframe.src = chrome.runtime.getURL('popup.html')
      iframe.style.width = '100%'
      iframe.style.height = 'calc(100% - 40px)'
      iframe.style.border = '0'
      iframe.style.display = 'block'
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups')

      const resizeHandle = document.createElement('div')
      resizeHandle.id = OVERLAY_RESIZE_ID
      resizeHandle.style.position = 'absolute'
      resizeHandle.style.width = '14px'
      resizeHandle.style.height = '14px'
      resizeHandle.style.right = '2px'
      resizeHandle.style.bottom = '2px'
      resizeHandle.style.cursor = 'nwse-resize'
      resizeHandle.style.background = 'transparent'

      overlay.appendChild(header)
      overlay.appendChild(iframe)
      overlay.appendChild(resizeHandle)

      // Dragging
      let dragging = false
      let dragStartX = 0
      let dragStartY = 0
      let startLeft = 0
      let startTop = 0
      header.addEventListener('mousedown', (e) => {
        dragging = true
        overlay.style.userSelect = 'none'
        dragStartX = e.clientX
        dragStartY = e.clientY
        const rect = overlay.getBoundingClientRect()
        startLeft = rect.left
        startTop = rect.top
        e.preventDefault()
      })
      window.addEventListener('mousemove', async (e) => {
        if (!dragging) return
        const dx = e.clientX - dragStartX
        const dy = e.clientY - dragStartY
        const newLeft = Math.min(window.innerWidth - 80, Math.max(-rectMargin(), startLeft + dx))
        const newTop = Math.min(window.innerHeight - 80, Math.max(-rectMargin(), startTop + dy))
        overlay.style.left = `${newLeft}px`
        overlay.style.top = `${newTop}px`
        overlay.style.right = 'auto'
        await saveOverlayState({ left: newLeft, right: null, top: newTop })
      })
      window.addEventListener('mouseup', () => {
        dragging = false
        overlay.style.userSelect = ''
      })

      // Resizing
      let resizing = false
      let resizeStartX = 0
      let resizeStartY = 0
      let startWidth = 0
      let startHeight = 0
      resizeHandle.addEventListener('mousedown', (e) => {
        resizing = true
        resizeStartX = e.clientX
        resizeStartY = e.clientY
        const rect = overlay.getBoundingClientRect()
        startWidth = rect.width
        startHeight = rect.height
        e.preventDefault()
        e.stopPropagation()
      })
      window.addEventListener('mousemove', async (e) => {
        if (!resizing) return
        const dx = e.clientX - resizeStartX
        const dy = e.clientY - resizeStartY
        const nextWidth = Math.max(320, Math.min(720, startWidth + dx))
        const nextHeight = Math.max(420, Math.min(window.innerHeight - 40, startHeight + dy))
        overlay.style.width = `${nextWidth}px`
        overlay.style.height = `${nextHeight}px`
        await saveOverlayState({ width: nextWidth, height: nextHeight })
      })
      window.addEventListener('mouseup', () => {
        resizing = false
      })
    }
    return overlay
  }

  function rectMargin() { return 16 }

  async function showOverlay() {
    const state = await loadOverlayState()
    const overlay = ensureOverlayElements()
    overlay.style.display = 'block'
    overlay.style.width = `${state.width || 420}px`
    overlay.style.height = `${state.height || 640}px`
    overlay.style.top = `${state.top ?? 24}px`
    if (state.left != null) {
      overlay.style.left = `${state.left}px`
      overlay.style.right = 'auto'
    } else {
      overlay.style.right = `${state.right ?? 24}px`
      overlay.style.left = 'auto'
    }
  }

  async function hideOverlay() {
    const overlay = document.getElementById(OVERLAY_ID)
    if (overlay) overlay.style.display = 'none'
  }

  async function toggleOverlay() {
    const overlay = ensureOverlayElements()
    const visible = overlay.style.display !== 'none'
    if (visible) {
      await hideOverlay()
      await saveOverlayState({ isOpen: false })
    } else {
      await showOverlay()
      await saveOverlayState({ isOpen: true })
    }
  }

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

  // Initialize overlay on page load if previously open
  ;(async () => {
    const state = await loadOverlayState()
    if (state?.isOpen) {
      await showOverlay()
    }
  })()
})()
