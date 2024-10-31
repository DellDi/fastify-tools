// js/background.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://')) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['js/content.js'],
    });
  }
});
