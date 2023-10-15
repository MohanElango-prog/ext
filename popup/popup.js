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
        chrome.tabs.sendMessage(id, { type: MESSAGES.GET_CONTENT})
        console.log("content request send")
    }

})

const logged_in = () => {
    //check user logged in logic
    return true
}

const LOGIC_MAP = {
    [true]: (content) => {
        const file = new Blob([content], {type: 'text/plain'})
        const a = document.createElement('a')
        a.download = 'resume.txt'
        a.href = URL.createObjectURL(file)
        // document.appendChild(a)
        a.click()
        URL.revokeObjectURL(a.href)
        a.remove()
    },
    [false]: (content) => {

    }
}


chrome.runtime.onMessage.addListener((msg, sender, response) => {
    const { content, type } = msg
    
    switch(type) {
        case MESSAGES.SEND_CONTENT: {
            const d_res = $('#d_res')
            const download_btn = document.createElement('button')
            download_btn.textContent = 'Download Resume'
            download_btn.onclick = () => {
                LOGIC_MAP[logged_in()](content)
            }

            d_res.appendChild(download_btn)


            // $('#content').textContent = content
            break
        }
        default:
            break
    }
});

