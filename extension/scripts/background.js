const API_BASE = 'http://localhost:5123'

try {
  chrome.runtime.onInstalled.addListener(() => {
    console.log('[autofill] background ready')
  })
} catch {}

const actionApi = (chrome.action && chrome.action.onClicked) ? chrome.action : (chrome.browserAction || null)
if (actionApi && actionApi.onClicked) {
  actionApi.onClicked.addListener(() => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs && tabs[0]
        if (!tab || tab.id == null) return

        chrome.tabs.sendMessage(tab.id, { action: 'toggleOverlay' }, () => {
          if (chrome.runtime.lastError) {
            // No receiver: inject content and CSS, then retry
            injectOverlayBundle(tab.id)
          }
        })
      })
    } catch (e) {
      console.warn('toggleOverlay send failed', e)
    }
  })
}

function injectOverlayBundle(tabId) {
  try {
    if (chrome.scripting && chrome.scripting.executeScript) {
      // MV3 path
      const applyMessage = () => chrome.tabs.sendMessage(tabId, { action: 'toggleOverlay' })
      const injectScript = () => chrome.scripting.executeScript({ target: { tabId }, files: ['scripts/content.js'] }, applyMessage)
      if (chrome.scripting.insertCSS) {
        chrome.scripting.insertCSS({ target: { tabId }, files: ['scripts/styles.css'] }, injectScript)
      } else {
        injectScript()
      }
    } else {
      // MV2 path (Firefox)
      const injectScript = () => chrome.tabs.executeScript(tabId, { file: 'scripts/content.js' }, () => chrome.tabs.sendMessage(tabId, { action: 'toggleOverlay' }))
      if (chrome.tabs.insertCSS) {
        chrome.tabs.insertCSS(tabId, { file: 'scripts/styles.css' }, injectScript)
      } else {
        injectScript()
      }
    }
  } catch (e) {
    console.warn('overlay bundle injection failed', e)
  }
}

// Remove legacy popup window handling

// Relay messages if needed
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'getApiBase') {
    sendResponse({ apiBase: API_BASE })
  }
  // no-op: no more openPanel; overlay is toggled via action click
})

