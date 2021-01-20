function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function getWatchlistLength () {
  const paginationText = document.querySelector('.pagination-info').textContent
  const listLength = parseInt(paginationText.split(' ').pop(), 0)

  return listLength
}

function pickRandomVideo (listLength) {
  const randomIndex = getRandomInt(listLength)

  const page = Math.floor(randomIndex / 10)
  const index = randomIndex % 10

  return [page, index]
}

function loadVideo (page, index) {
  const baseURL = window.location.href.split('?')[0]

  chrome.runtime.sendMessage({
    type: 'getVideoURL',
    baseURL: baseURL,
    page: page,
    index: index
  }, function (response) {
    window.location = response.content
  })
}

chrome.runtime.sendMessage({ type: 'showPageAction' })

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const listLength = getWatchlistLength()
  const [page, index] = pickRandomVideo(listLength)
  loadVideo(page, index)
})
