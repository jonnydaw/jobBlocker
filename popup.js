
const blocked = {};
const blockForm =  document.querySelector("#blockForm");
const validWebsites = ["reed.co.uk", "linkedin.com","uk.indeed.com"]

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
    blocked[blockForm.website.value.trim()] = blockForm.recruiter.value.trim(); 
    updateUserSettingsAddition(blocked);
    blockForm.reset();
    blockForm.website.focus();
    
})


const updateUserSettingsAddition = async (params) => {
    try {

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

    } catch (error) {
        throw new Error(`Addition to blocked list failed ${error}`);
        
    }
    
}

const updateUserSettingsRemoval = async (key, value) => {
    // check if not in

    try {
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
    } catch (error) {
        throw new Error(`Removal from blocked list failed ${error}`);
    }
    
}

const getUserSettings = async () => {
    try {
        let res;
        await chrome.storage.sync.get().then((result) => {
            res = result;
        });
        return res;
    } catch (error) {
        throw new Error(`Retrieval from blocked list failed ${error}`);
    }
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



