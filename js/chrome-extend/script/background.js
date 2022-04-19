//var abductRequest = fn => chrome.webRequest.onBeforeRequest.addListener( details => fn(details), { urls: ["<all_urls>"], types: ["xmlhttprequest"] })
var abductRequest1 = fn => chrome.webRequest.onResponseStarted.addListener( details => fn(details), { urls: ["<all_urls>"], types: ["xmlhttprequest"] })

var getCurrentPage = fn => chrome.tabs.query({active: true}, tab => fn(tab[0]))
var getAllPage = fn => chrome.tabs.query({}, tab => fn(tab))
var getTab = (title, fn) => chrome.tabs.query({title}, tab => fn(tab[0]))
var postMessageCurrent = (obj, fn) => getCurrentPage( tab => chrome.tabs.sendMessage(tab.id, obj, response => fn(response)) )
var postMessageTab = (tab, obj, fn) => tab => chrome.tabs.sendMessage(tab.id, obj, response => fn(response))
var createTab = (url, b=true, fn=()=>{} ) => chrome.tabs.create({"active": b, url}, tab => fn(tab))
var download = url => chrome.downloads.download({url})
var notice =  (title, message) => chrome.notifications.create('', {type: 'basic', title, message, iconUrl: '../image/fish_128.png'}, id => setTimeout(() => chrome.notifications.clear(id), 3000))

function byteToString(arr) {
	var str = '', _arr = arr;
	for(var i = 0; i < _arr.length; i++) {
		var one = _arr[i].toString(2), v = one.match(/^1+?(?=0)/);
		if(v && one.length == 8) {
			var bytesLength = v[0].length;
			var store = _arr[i].toString(2).slice(7 - bytesLength);
			for(var st = 1; st < bytesLength; st++) {
				store += _arr[st + i].toString(2).slice(2);
			}
			str += String.fromCharCode(parseInt(store, 2));
			i += bytesLength - 1;
		} else {
			str += String.fromCharCode(_arr[i]);
		}
	}
	return str;
}
//config
let conf
async function getConfig() {
	return new Promise(resolve => {
		fetch("http://127.0.0.1:4444/get/config").then(data => data.json()).then(data => {
			conf = JSON.parse(data)
			resolve(data)
		})
	})
}
getConfig()
async function setHttp(body) {
	return new Promise(resolve => {
		fetch("http://127.0.0.1:4444/data/save",{
	 　   	method:"POST",
	 　   	mode: 'cors',
		　　headers: {
		　　　　'Content-Type': 'application/json'
		　　},
		　　body:JSON.stringify(body)
	　　}).then(data => data.json()).then( data => resolve(data) )
	})
}

chrome.webRequest.onBeforeRequest.addListener(details => {
	let url = details.url
	let method = details.method
	let body = '<empty>'
	if ( details.requestBody && details.requestBody.raw ) body = byteToString(new Uint8Array(details.requestBody.raw[0].bytes))

}, {
    urls: ["<all_urls>"]
}, ["requestBody", "blocking"]);


let index = 0
chrome.runtime.onMessage.addListener( async (response, sender, sendResponse) => {
	if ( response.cmd == "push" ) {
		sendResponse({ index })
		console.log(response)
		for (var i = 0; i < response.data.length; i++) {
			await sleep(500)
			createTab("http:"+response.data[i].str, false)
			//if ( i> 0 ) break
		}
		show(sender.tab.id)
	} else if ( response.cmd == "may i click?" ) {
		//check info
		console.log(response.data)
		sendResponse({ msg: true })
	} else if ( response.cmd == "close this window please" ) {
		sendResponse({ msg: 'okay!, you are welcome' })
		//closeTab(sender.tab.id)
	}
})


async function show(tab_id)
{
	postMessage({"cmd": "callback", tab_id}, (d) => {
		console.log(d)
	})
}