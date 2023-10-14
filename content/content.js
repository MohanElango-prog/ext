// (() => {
//     let oldPushState = history.pushState;
//     history.pushState = function pushState() {
//         let ret = oldPushState.apply(this, arguments);
//         window.dispatchEvent(new Event('pushstate'));
//         window.dispatchEvent(new Event('locationchange'));
//         return ret;
//     };

//     let oldReplaceState = history.replaceState;
//     history.replaceState = function replaceState() {
//         let ret = oldReplaceState.apply(this, arguments);
//         window.dispatchEvent(new Event('replacestate'));
//         window.dispatchEvent(new Event('locationchange'));
//         return ret;
//     };

//     window.addEventListener('popstate', () => {
//         window.dispatchEvent(new Event('locationchange'));
//     });
// })()

(() => {

    // document.body.addEventListener('click', ()=>{
    //     requestAnimationFrame(()=>{
    //       if(url!==location.href){
    //         console.log('url changed');
    //         url = location.href
    //       }
    //     });
    // }, true);

    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    const current_tab = {
        url: window.location.href
    }

    $.addEventListener('locationchange', async (d) => {
        console.log(d)
    })

    // document.addEventListener('')

    // window.addEventListener('hashchange', () => {
    //     console.log('hashchange')
    //     console.log(window.location.href)
    // })

    if(current_tab.url.includes('https://www.linkedin.com/jobs/collections/recommended/')){
        
        console.log("Searching for job description")
        const job = {
            id: current_tab.url.split('=').at(-1),
            content: '',
            done: false
        }

        const loop = setInterval(() => {
            if(job.done){
                clearInterval(loop)
                chrome.runtime.sendMessage(job)
                console.log(job)
                return
            }
            const job_description = get_job_description()
            if(job_description){
                job.content = job_description
                job.done = true
            }
        }, 1000)
    }
    

    chrome.runtime.onMessage.addListener((msg) => {
        const {id, url} = msg
        chrome.runtime.sendMessage({
            id,
            content: job_description
        })
    }) 
    
    
    const get_job_description = () => {
        let job_description = $('.jobs-description')
        job_description.querySelector('.t-black--light.t-14.mt4').remove()
        return job_description.textContent.trim().split('\n').map(s => s.trim()).join('\n')
    }
})()




// const description_table = {
//     linkedin: {
//         selector: '.jobs-description',
//         remove: '.t-black--light.t-14.mt4'
//     }
// }



