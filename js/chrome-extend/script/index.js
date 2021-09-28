var bg = chrome.extension.getBackgroundPage()

chrome.runtime.onMessage.addListener( (response, sender, sendResponse) => {
	sendResponse({index: 0})
	
})


gk('.click', "on", {click() {

	bg.postMessageCurrent({cmd: "show face"},
	 response => console.log('content: ' + response))
	
}})
