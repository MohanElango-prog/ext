(() => {
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    // CONSTANTS
    const CONSTS = {
        JOB_DESCRIPTION_DIV: '.jobs-description',
        POSTED_ON_ELEMENT: '.t-black--light.t-14.mt4',
    }

    // MESSAGES passing between content script, popup and background scripts
    const MESSAGES = {
        GET_CONTENT: 'GET_CONTENT',
        SEND_CONTENT: 'SEND_CONTENT'
    }

    const get_job_description = () => {
        let job_description = $(CONSTS.JOB_DESCRIPTION_DIV)
        job_description.querySelector(CONSTS.POSTED_ON_ELEMENT)?.remove()
        return job_description.textContent.trim().split('\n').map(s => s.trim()).join('\n') || ''
    }

    chrome.runtime.onMessage.addListener((msg) => {
        const { type } = msg
        switch (type) {
            case MESSAGES.GET_CONTENT: {
                chrome.runtime.sendMessage({ type: MESSAGES.SEND_CONTENT, content: get_job_description() })
                break
            }
            default:
                break
        }
    })
})()