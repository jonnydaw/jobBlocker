
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

  const newUrl = window.location.href;
  const newUserSettings = await getUserSettings();

  const urlChangeFlag = currentUrl !== newUrl;
  const settingsChangeFlag = JSON.stringify(userSettings) !== JSON.stringify(newUserSettings);

  if (urlChangeFlag || settingsChangeFlag) {
    currentUrl = newUrl;
    userSettings = JSON.parse(JSON.stringify(newUserSettings));

    if (userSettings["reed.co.uk"] && currentUrl.includes("reed.co.uk")) {
      blockReedJobs(userSettings["reed.co.uk"]);
    } else if (userSettings["linkedin.com"] && currentUrl.includes("linkedin.com")) {
      blockLinkedinJobs(userSettings["linkedin.com"]);
    }
  }
}, 1500);


const blockReedJobs = (recruiters)  =>{ 
  const jobCards  = document.querySelectorAll("[data-element='recruiter']")
      jobCards.forEach((job) =>{
        const parent = job.closest("article");
        if(recruiters.includes(job.textContent.trim())){
          parent.style.display = 'none'; 
        } else if(parent?.style.display == "none"){
          parent.style.display = "block"
        }
      }) 
  }

const blockLinkedinJobs = (recruiters) => {
    const jobCards = document.querySelectorAll(".job-card-container__primary-description");
    jobCards.forEach((job) => {
      const parent = job.closest("li");
      console.log(job.textContent.trim())
        if(recruiters.includes(job.textContent.trim())){
          parent.style.display = 'none'; 
        } else if(parent?.style.display == "none"){
          parent.style.display = "block"
        }
    })
}


