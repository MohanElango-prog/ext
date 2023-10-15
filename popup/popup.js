// MESSAGES passing between content script, popup and background scripts
const MESSAGES = {
    GET_CONTENT: 'GET_CONTENT',
    SEND_CONTENT: 'SEND_CONTENT'
}


const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);


const jobs = {}

const btn = $('button');
btn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true })

    const { url, id } = tab

    if (url.includes('https://www.linkedin.com/jobs/collections')) {
        const job_id = url.split('=').at(-1)
        jobs[job_id] = {
            url,
            id,
            done: false
        }
        chrome.tabs.sendMessage(id, { type: MESSAGES.GET_CONTENT})

        console.log("request send")
    }

})


chrome.runtime.onMessage.addListener((msg, sender, response) => {
    const { id, content, control_id, type } = msg
    
    switch(type) {
        case MESSAGES.SEND_CONTENT: {
            $('#content').textContent = content
            break
        }
        default:
            break
    }
});

