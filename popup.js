
// to-do remove from blocked list

const blocked = {};
const blockForm =  document.querySelector("#blockForm");
const validWebsites = ["reed.co.uk"]

// chrome.storage.local.clear(function() {
//     var error = chrome.runtime.lastError;
//     if (error) {
//         console.error(error);
//     }
//     // do something more
// });
// chrome.storage.sync.clear(); // callback is optional

const initialRender = async () => {
    await renderList();
}

document.addEventListener("DOMContentLoaded", async  () => {
     await initialRender();
});


blockForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if(blockForm.website.value === "" || 
        blockForm.recruiter.value === "" ||
        !validWebsites.includes(blockForm.website.value)){
            alert("Invalid Input");
        return;
    }
    blocked[blockForm.website.value] = blockForm.recruiter.value; 
    updateUserSettingsAddition(blocked);
    blockForm.reset();
    
})

// blockForm.addEventListener("keydown", (event) => {
    
//     if(event.key === 'Enter'){
//         event.preventDefault();
//     if(blockForm.website.value === "" || blockForm.recruiter.value === ""){
//         return;
//     }
//     blocked[blockForm.website.value] = blockForm.recruiter.value; 
//     updateUserSettingsAddition(blocked);
//     blockForm.reset();
// }
    
// })

const updateUserSettingsAddition = async (params) => {
    // check if already in
    let userSettings = await getUserSettings();
    let arr = []
    
    const key = Object.keys(params)[0];
    const value = Object.values(params)[0];
    
    if(key in userSettings){
        arr = [...userSettings[key], value];
    } else{
        arr.push(value);
    }
    setUserSettings(key,arr)
}

const updateUserSettingsRemoval = async (key, value) => {
    // check if not in

    let userSettings = await getUserSettings();
    let arr = []

    if(key in userSettings && userSettings[key].includes(value)){
        arr = userSettings[key];
        arr = arr.filter(item => item !== value);
        if(arr.length === 0){
            chrome.storage.sync.remove(key, () => {alert("removed")})
        }
    }
    setUserSettings(key,arr);
    //alert(JSON.stringify(await getUserSettings()));
    
}

const getUserSettings = async () => {
    let res;
     await chrome.storage.sync.get().then((result) => {
        res = result;
    });
    return res;
}

const setUserSettings = async (key, arr) => {
    chrome.storage.sync.set({[key] : arr}).then( async () => {
        renderList()
        
      });
}

const renderList = async () => {
    let updatedUserSettings = await getUserSettings();
        const unorderedList = document.querySelector("#blockedList");
        unorderedList.innerHTML = "";
        Object.keys(updatedUserSettings).forEach( (key) => {
            updatedUserSettings[key].forEach((val) => {
                const listItem = document.createElement("li");
                const unblockButton = document.createElement("button");
                unblockButton.textContent = "\u2715"
                unblockButton.classList.add("unblock-button");
                listItem.textContent = `${val} @ ${key}`;
                listItem.append(unblockButton);
                unorderedList.append(listItem);
                unblockButton.addEventListener('click', () => {
                    updateUserSettingsRemoval(key,val)
                });
            }) 
        })
}



