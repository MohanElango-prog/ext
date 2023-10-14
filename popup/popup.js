const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);


const jobs = {}

const btn = $('button');
btn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true })
    
    const {url, id} = tab
    
    const splitted_url = url.split('?')[0]
    

    if(splitted_url === 'https://www.linkedin.com/jobs/collections/recommended/'){
        const job_id = url.split('=').at(-1)
        jobs[job_id] = {
            url,
            id,
            done: false
        }
        chrome.tabs.sendMessage(id, { url, id, job_id })
        
    }

})


chrome.runtime.onMessage.addListener((msg, sender, response) => {
    const {id, content} = msg
    console.log(content)
    $('#content').textContent = content
});

