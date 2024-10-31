// 检查是否已经执行过，防止重复执行
if (!window.hasRun) {
  window.hasRun = true

  function initChatBi() {
    const script = document.createElement('script')
    script.src = chrome.runtime.getURL('newsee-ChatBI-init.js')
    script.type = 'text/javascript'
    script.onload = function() {
      console.log('newsee-ChatBI-init.js loaded successfully')
    }
    script.onerror = function() {
      console.error('Failed to load newsee-ChatBI-init.js')
    };
    (document.head || document.documentElement).appendChild(script)
  }

  const arr = ['kk1234001.youdata.163.com', 'poc.new-see.com', 'localhost', 'saastest.new-see.com', 'qw.yswg360.com']
// 限制域名进行执行
  if (arr.includes(window.location.hostname)) {
    // 确保在适当的时机调用
    if (document.readyState === 'loading') {

      document.addEventListener('DOMContentLoaded', initChatBi)
    } else {
      initChatBi()
    }
  }
}
