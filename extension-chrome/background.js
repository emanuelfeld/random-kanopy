chrome.runtime.onMessage.addListener(messageHandler)

function messageHandler (message, sender, sendResponse) {
  if (message.type === 'showPageAction') {
    chrome.pageAction.show(sender.tab.id)
  } else if (message.type === 'getVideoURL') {
    const baseURL = message.baseURL
    const page = message.page
    const index = message.index

    fetch(`${baseURL}?page=${page}`)
      .then(function (response) {
        return response.text()
      }).then(function (html) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const videoTitle = doc.querySelectorAll('a.button[href*="/video/"]')[index].href.split('/video/')[1]
        const videoURL = `https://kanopy.com/video/${videoTitle}`
        return videoURL
      }).then(function (videoURL) {
        sendResponse({ content: videoURL })
      })

    return true
  }
}

chrome.pageAction.onClicked.addListener(function () {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { content: 'kanopy-click' }
    )
  })
})
