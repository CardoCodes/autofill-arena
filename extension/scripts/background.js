const API_BASE = 'http://localhost:5123'

chrome.runtime.onInstalled.addListener(() => {
  console.log('[autofill] background ready')
})

chrome.action.onClicked.addListener((tab) => {
  if (tab && tab.id) {
    chrome.tabs.sendMessage(tab.id, { action: 'scanAndFill', apiBase: API_BASE })
  }
})

// Relay messages if needed
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'getApiBase') {
    sendResponse({ apiBase: API_BASE })
  }
})
export {};
