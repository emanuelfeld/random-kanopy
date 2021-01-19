browser.runtime.onMessage.addListener(getVideoURL)

function onError (error) {
  console.error(`Random Kanopy error: ${error}`)
}

function getVideoURL (message, sender, sendResponse) {
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
    }).catch(onError)

  return true
}

browser.pageAction.onClicked.addListener(function () {
  browser.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    browser.tabs.sendMessage(
      tabs[0].id,
      { content: 'kanopy-click' }
    ).then(function (response) {
      console.log(`Random Kanopy message from content script: ${response.content}`)
    }).catch(onError)
  })
})
