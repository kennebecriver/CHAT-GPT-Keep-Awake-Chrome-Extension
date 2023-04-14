chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        chrome.scripting.executeScript({
            target: {
                tabId
            },
            func: () => console.log("INIT")
        });
    }

    if (changeInfo.status === "complete" && tab.url.includes('https://chat.openai.com')) {
        chrome.scripting.executeScript({
            target: {
                tabId
            },
            func: () => console.log("Start")
        });
        chrome.alarms.create("reloadTab", {
            delayInMinutes: 0.8
        });
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {

    if (alarm.name === "reloadTab") {
        chrome.tabs.query({
            currentWindow: true
        }, (tabs) => {
            for (let i = 0; i < tabs.length; i++) {
                if (tabs[i].url.includes('https://chat.openai.com')) {
                    chrome.scripting.executeScript({
                        target: {
                            tabId:tabs[i].id
                        },
                        func: () => fetch("https://chat.openai.com/backend-api/conversation", {"method": "GET","credentials": "include"})
                            .then(e=>e.json())
                            .then(console.log)
                    });

                    chrome.alarms.create("reloadTab", {delayInMinutes: 0.8});
                    break
                }
            }
        })
    }
});
