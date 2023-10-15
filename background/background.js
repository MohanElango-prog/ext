// MESSAGES passing between content script, popup and background scripts
const MESSAGES = {
    GET_CONTENT: 'GET_CONTENT',
    SEND_CONTENT: 'SEND_CONTENT'
}


chrome.runtime.onMessage.addListener((msg) => {
    console.log(msg)
}) 