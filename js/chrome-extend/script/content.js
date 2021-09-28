
chrome.runtime.onMessage.addListener( (response, sender, sendResponse) => {
	if ( response.cmd == 'key have been clicked' ) {
		
	}
	
	sendResponse("done")
})

async function postMessage(obj, fn = ()=>{}) {
	
	chrome.runtime.sendMessage(obj,
	response => fn(response))

}


console.log("EXTEND INTO")


