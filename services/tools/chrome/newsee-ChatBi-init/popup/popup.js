document.addEventListener('DOMContentLoaded', function() {
  const enableButton = document.getElementById('enablePlugin')
  const disableButton = document.getElementById('disablePlugin')
  const jsCount = document.getElementById('jsCount')
  const cssCount = document.getElementById('cssCount')
  const pageTitle = document.getElementById('pageTitle')
  const pageDescription = document.getElementById('pageDescription')

  // Function to get page statistics
  function getPageStatistics() {
    jsCount.textContent = document.scripts.length
    cssCount.textContent = document.styleSheets.length
    pageTitle.textContent = document.title
    const metaDescription = document.querySelector('meta[name="description"]')
    pageDescription.textContent = metaDescription ? metaDescription.content : 'N/A'
  }

  // Enable plugin
  enableButton.addEventListener('click', function() {
    // Add your enable plugin logic here
    alert('Plugin enabled')
  })

  // Disable plugin
  disableButton.addEventListener('click', function() {
    // Add your disable plugin logic here
    alert('Plugin disabled')
  })

  // Get page statistics on load
  getPageStatistics()
})

document.addEventListener('DOMContentLoaded', function() {
  const sourceLanguageSelect = document.getElementById('source-language')
  const targetLanguageSelect = document.getElementById('target-language')
  const translationServiceSelect = document.getElementById('translation-service')

  const sourceLanguages = ['自动检测', '英语', '法语', '德语']
  const targetLanguages = ['简体中文', '繁体中文', '日语', '韩语']
  const translationServices = ['谷歌翻译', '百度翻译', '有道翻译']

  sourceLanguages.forEach(language => {
    const option = document.createElement('option')
    option.textContent = language
    sourceLanguageSelect.appendChild(option)
  })

  targetLanguages.forEach(language => {
    const option = document.createElement('option')
    option.textContent = language
    targetLanguageSelect.appendChild(option)
  })

  translationServices.forEach(service => {
    const option = document.createElement('option')
    option.textContent = service
    translationServiceSelect.appendChild(option)
  })
})
