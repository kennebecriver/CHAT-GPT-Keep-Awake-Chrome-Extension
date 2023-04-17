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
        chrome.alarms.create("reloadTab", { delayInMinutes: 0.3 });
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name !== "reloadTab") return
    chrome.tabs.query({url: "https://chat.openai.com/*"}, tabs => {
        if (!tabs.length) return
        chrome.scripting.executeScript({
            target: { tabId:tabs[0].id },
            func: () => fetch("https://chat.openai.com/backend-api/conversation", {"method": "GET","credentials": "include"})
                .then(e=>e.json())
                .then(console.log)
        });
        chrome.alarms.create("reloadTab", { delayInMinutes: 0.8 });
    })
    }
});
