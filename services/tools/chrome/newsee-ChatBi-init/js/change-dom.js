// 1. 修改logo背景图片及样式
const logoElement = document.querySelector('.dash-logo-editor.f-pointer')
logoElement.style.backgroundImage =
  'url("https://poc.new-see.com/api/fastdfs/fastdfs/pictureUrl?fileId=Qh3nmSSc6mS%2FUrlliMsXWg%3D%3D")'
logoElement.style.width = '120px'
logoElement.style.backgroundSize = 'contain'

// 2. 修改系统标题
document.querySelector('.sys-title.f-fl').textContent = '新视窗总经理助手'

// 3. 修改所有非用户的聊天头像
function updateChatHeads() {
  const chatHeads = document.querySelectorAll('.chat-head:not(.user)')
  chatHeads.forEach((head) => {
    head.style.backgroundImage =
      'url("https://oa.new-see.com/M00/00/1F/rBC0aWcjH_uAXcAYAAAhqcNsoJA432.png")'

    head.style.backgroundSize = 'contain'
  })

  const chatHeadsUser = document.querySelectorAll('.chat-head.user')

  chatHeadsUser.forEach((head) => {
    head.style.background = '#3b95f9'
  })
}

// #3b95f9
// 4. 修改特定chat-item的内容
function updateChatItems() {
  // 使用组合选择器选择两种可能的id格式
  const chatItems = document.querySelectorAll('[id^="chat-item-"]')
  chatItems.forEach((item) => {
    // 检查是否匹配两种模式之一：chat-item-数字 或 chat-item-model-数字
    if (/^chat-item-\d+$/.test(item.id) || /^chat-item-model-\d+$/.test(item.id)) {
      const content = item.querySelector('.chat-body .content')
      if (content) {
        content.textContent =
          '您好，我是杭州新视窗打造的数据分析AI助理，我可以帮您分析下物业收缴、服务、运营等方面的数据。可分析的数据信息如下:'
      }
    }
  })
}

// 初次运行更新
updateChatHeads()
updateChatItems()

// 监听DOM变化
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      updateChatHeads() // 更新所有非用户头像

      // 检查是否需要更新chat-item内容
      mutation.addedNodes.forEach((node) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (/^chat-item-\d+$/.test(node.id) || /^chat-item-model-\d+$/.test(node.id))
        ) {
          updateChatItems()
        }
      })
    }
  })
})

observer.observe(document.body, { childList: true, subtree: true })
