(() => {
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    // CURRENT JOB DATA in the jobs description section
    const CURRENT_JOB = {
        id: null,
        content: null,
        control_id: null
    }

    // CONSTANTS
    const CONSTS = {
        LINKED_IN_TAB_URL: 'https://www.linkedin.com/jobs/collections',
        PAGINATION: '.jobs-search-results-list__pagination',
        JOB_DESCRIPTION_DIV: '.jobs-description',
        POSTED_ON_ELEMENT: '.t-black--light.t-14.mt4',
        JOB_ID_DIV: '[data-job-id]',
        JOB_ID_ATTRIBUTE: 'data-job-id',
        CURRENT_TAB_URL: window.location.href,
        JOB_CONTROL_ID_ELEMENT: '[data-control-id]',
        JOB_CONTROL_ID_ATTRIBUTE: 'data-control-id',
    }
    
    // MESSAGES passing between content script, popup and background scripts
    const MESSAGES = {
        GET_CONTENT: 'GET_CONTENT',
        SEND_CONTENT: 'SEND_CONTENT'
    }

    
    chrome.runtime.onMessage.addListener((msg) => {
        const { type } = msg
        switch(type){
            case MESSAGES.GET_CONTENT: {
                chrome.runtime.sendMessage({type: MESSAGES.SEND_CONTENT, ...CURRENT_JOB})
                break
            }
            default:
                break
        }
    })

    // if current url matches with linkedin url
    if (CONSTS.CURRENT_TAB_URL.includes(CONSTS.LINKED_IN_TAB_URL)) {
        // all jobs stores all visible jobs id
        const all_jobs = new Set()

        // this interval creates a ```Click ME``` button in every jobs card.
        let interval = setInterval(() => {
            // get all jobs in the page
            const jobs_divs = [...document.querySelectorAll(CONSTS.JOB_ID_DIV)]
            for (let job_div of jobs_divs) {
                const job_id = job_div.getAttribute(CONSTS.JOB_ID_ATTRIBUTE)

                const job_control_id_ele = job_div.querySelector(CONSTS.JOB_CONTROL_ID_ELEMENT)
                if (job_control_id_ele === null) continue

                const job_control_id = job_control_id_ele.getAttribute(CONSTS.JOB_CONTROL_ID_ATTRIBUTE)

                if (all_jobs.has(job_id)) continue

                // if Click Me button clicked
                const btn_onclick = (e) => {
                    CURRENT_JOB.content = null
                    CURRENT_JOB.id = null
                    CURRENT_JOB.control_id = null


                    let inner_interval = setInterval(() => {
                        const content = get_job_description()
                        if (!content || content === '') return

                        CURRENT_JOB.content = get_job_description()
                        CURRENT_JOB.id = job_id
                        CURRENT_JOB.control_id = job_control_id

                        chrome.runtime.sendMessage({type: MESSAGES.SEND_CONTENT, ...CURRENT_JOB})
                        clearInterval(inner_interval)
                    }, 500)


                }
                const click_btn = click_me_button(job_id, btn_onclick)

                job_div.appendChild(click_btn)
                all_jobs.add(job_id)

            }

            // I double commented it because the interval will end when the pagination is in the viewport
            // but when the user clicks on next page like 2, the ```Click Me``` button will not be appended to the new jobs.
            // // if the pagination is shown in the page, then stop the interval
            // // if (elementIsVisibleInViewport(document.querySelector(CONSTS.PAGINATION))) {
            // //     console.log("FOUND THE END")

            // //     clearInterval(interval)
            // //     return
            // // }
        }, 2500);


        // console.log("Searching for job description")
        // const job = {
        //     id: CONSTS.CURRENT_TAB_URL.split('=').at(-1),
        //     content: '',
        //     done: false
        // }

        // const loop = setInterval(() => {
        //     if (job.done) {
        //         clearInterval(loop)
        //         chrome.runtime.sendMessage(job)
        //         console.log(job)
        //         return
        //     }
        //     const job_description = get_job_description()
        //     if (job_description) {
        //         job.content = job_description
        //         job.done = true
        //     }
        // }, 1000)
    }

    // https://www.30secondsofcode.org/js/s/element-is-visible-in-viewport/
    const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
        const { top, left, bottom, right } = el.getBoundingClientRect();
        const { innerHeight, innerWidth } = window;
        return partiallyVisible
            ? ((top > 0 && top < innerHeight) ||
                (bottom > 0 && bottom < innerHeight)) &&
            ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
            : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
    };


    const get_job_description = () => {
        let job_description = $(CONSTS.JOB_DESCRIPTION_DIV)
        job_description.querySelector(CONSTS.POSTED_ON_ELEMENT)?.remove()
        return job_description.textContent.trim().split('\n').map(s => s.trim()).join('\n') || ''
    }


    const click_me_button = (id, fn) => {
        const btn = document.createElement('button')
        btn.textContent = 'Click me'
        btn.id = id
        btn.style.backgroundColor = 'red'
        btn.style.color = 'white'
        btn.style.borderRadius = '10px'

        btn.addEventListener('click', fn)

        return btn
    }
})()


