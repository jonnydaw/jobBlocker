
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
      blockJobsStandardFormat(
        userSettings["reed.co.uk"],
        "[data-element='recruiter']", 
        "article" 
      )

    } else if (userSettings["linkedin.com"] && currentUrl.includes("linkedin.com")) {
      blockJobsStandardFormat(
        userSettings["linkedin.com"],
        ".job-card-container__primary-description", 
        "li" 
      )
    }  else if (userSettings["uk.indeed.com"] && currentUrl.includes("uk.indeed.com")) {
      blockJobsStandardFormat(
        userSettings["uk.indeed.com"],
        "[data-testid='company-name']", 
        "li" 
      )
    }  else if (userSettings["targetjobs.co.uk"] && currentUrl.includes("targetjobs.co.uk")) {
      console.log("hi")
      blockTargetJobs(
        userSettings["targetjobs.co.uk"],
       
      )
    }
  }
}, 1500);

const blockJobsStandardFormat = (recruiters, jobCardELement, jobCardParent) => {
  const jobCards  = document.querySelectorAll(jobCardELement)
      jobCards.forEach((job) => {
        const parent = job.closest(jobCardParent);
        if(recruiters.includes(job.textContent.trim())){
          parent.style.display = 'none'; 
        } else if(parent?.style.display == "none"){
          parent.style.display = "block"
        }
      }) 
}

const blockTargetJobs = (recruiters) => {
  const jobCards  = document.querySelectorAll('[data-cy="card:view-opportunity"]')
  jobCards.forEach((job) => {
    const ariaString = job.ariaLabel
    const employer = ariaString.split("-").pop().trim();
    const parent = job.closest("a");
    if(recruiters.includes(employer)){
      parent.style.display = 'none'; 
    } else if(parent?.style.display == "none"){
      parent.style.display = "block"
    }
  }) 
}



