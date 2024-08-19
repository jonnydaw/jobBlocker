
const getUserSettings = async () => {
  let res;
   await chrome.storage.sync.get().then((result) => {
      res = result;
  });
  return res;
}

let userSettings = getUserSettings();
let currentUrl = window.location.href;

const interval =  setInterval(async () =>{
  if (!chrome.runtime?.id) {
    clearInterval(interval);
    return;
  }
  if(currentUrl !== window.location.href || userSettings !== await getUserSettings()){

    currentUrl = window.location.href;
    userSettings = await getUserSettings();

    if (userSettings["reed.co.uk"] && currentUrl.includes("reed.co.uk")){
      blockReedJobs(userSettings["reed.co.uk"])
    }
  }
}, 1500);


const blockReedJobs = (recruiters)  =>{
  const jobCards  = document.querySelectorAll("[data-element='recruiter']")
      jobCards.forEach((job) =>{
        let parent = job.closest("article");
        if(recruiters.includes(job.textContent)){
          parent.style.display = 'none'; 
        } else if(parent?.style.display == "none"){
          parent.style.display = "block"
        }
      })
      
  }


