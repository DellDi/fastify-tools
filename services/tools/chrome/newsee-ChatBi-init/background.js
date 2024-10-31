// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.indexOf('chrome://') !== 0) {
    chrome.tabs.executeScript(tabId, { file: 'content.js' })
  }
})
