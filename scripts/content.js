  
const currentUrl = window.location.href;

const getUserSettings = async () => {
  let res;
   await chrome.storage.sync.get().then((result) => {
      //alert("Value is " + JSON.stringify(result));
      res = result;
  });
  return res;
}

const test = async () => {
  console.log(JSON.stringify(await getUserSettings()));
}

displayUserSettings();

const blockReedJobs = ()  =>{
  const jobCards  = document.querySelectorAll("[data-element='recruiter']")
      jobCards.forEach((j) =>{
        if(j.textContent === "Sparta Global" || j.textContent === "ITonlinelearning Recruitment"){
          const parent = j.closest("article");
          parent.style.display = 'none';
        } else{
            console.log(j)
        }
      })
      
    console.log("hit");
  }

if (currentUrl.includes("reed.co.uk")) {
  blockReedJobs();
  
} else{
  console.log("not hit")
}

