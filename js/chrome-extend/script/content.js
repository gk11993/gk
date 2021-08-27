chrome.runtime.onMessage.addListener((response, sender, sendResponse) => {
	
})

async function postMessage(title, contentUrl, index) {
	chrome.runtime.sendMessage({txt: "from content", title, contentUrl, index},
	response => console.log(response))
}

console.log("EXTEND INTO")
