
// to-do remove from blocked list

const blocked = {};
const blockForm =  document.querySelector("#blockForm");

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
    blocked[event.target.website.value] = event.target.recruiter.value; 
    updateUserSettings(blocked);
    blockForm.reset();
    
})

const updateUserSettings = async (params) => {

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

const getUserSettings = async () => {
    let res;
     await chrome.storage.sync.get().then((result) => {
        //alert("Value is " + JSON.stringify(result));
        res = result;
    });
    return res;
}

const setUserSettings = async (key, arr) => {
    chrome.storage.sync.set({[key] : arr}).then( async () => {
        // get user settings
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
                listItem.textContent = `${val} @ ${key}`;
                unorderedList.append(listItem);
            })
            
        })
}

