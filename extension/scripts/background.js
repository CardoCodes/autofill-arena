const API_BASE = 'http://localhost:5123'
let panelWindowId = null

try {
  chrome.runtime.onInstalled.addListener(() => {
    console.log('[autofill] background ready')
  })
} catch {}

const actionApi = (chrome.action && chrome.action.onClicked) ? chrome.action : (chrome.browserAction || null)
if (actionApi && actionApi.onClicked) {
  actionApi.onClicked.addListener(() => {
    openOrFocusPanel()
  })
}

function openOrFocusPanel() {
  if (panelWindowId !== null) {
    try {
      chrome.windows.update(panelWindowId, { focused: true }, (win) => {
        if (chrome.runtime.lastError || !win) {
          lookupExistingOrCreate()
        }
      })
    } catch (e) {
      lookupExistingOrCreate()
    }
    return
  }
  lookupExistingOrCreate()
}

function createPanelWindow() {
  chrome.windows.create({
    url: 'popup.html',
    type: 'popup',
    width: 420,
    height: 640,
    focused: true
  }, (win) => {
    if (win && typeof win.id === 'number') {
      panelWindowId = win.id
    }
  })
}

function lookupExistingOrCreate() {
  const targetUrl = chrome.runtime.getURL('popup.html')
  try {
    chrome.windows.getAll({ populate: true }, (wins) => {
      if (!wins || wins.length === 0) {
        createPanelWindow()
        return
      }
      for (const w of wins) {
        if (w.tabs) {
          for (const t of w.tabs) {
            if (t.url === targetUrl) {
              panelWindowId = w.id || null
              if (panelWindowId !== null) {
                chrome.windows.update(panelWindowId, { focused: true })
                return
              }
            }
          }
        }
      }
      createPanelWindow()
    })
  } catch (e) {
    createPanelWindow()
  }
}

try {
  chrome.windows.onRemoved.addListener((windowId) => {
    if (panelWindowId === windowId) {
      panelWindowId = null
    }
  })
} catch {}

// Relay messages if needed
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'getApiBase') {
    sendResponse({ apiBase: API_BASE })
  }
  if (message?.type === 'openPanel') {
    openOrFocusPanel()
    sendResponse({ ok: true })
  }
})

