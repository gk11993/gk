var abductRequest = fn => chrome.webRequest.onBeforeRequest.addListener( details => fn(details), { urls: ["<all_urls>"], types: ["xmlhttprequest"] })
var getCurrentPage = fn => chrome.tabs.query({active: true}, tab => fn(tab[0]))
var getAllPage = fn => chrome.tabs.query({}, tab => fn(tab))
var getTab = (title, fn) => chrome.tabs.query({title}, tab => fn(tab[0]))
var postMessageCurrent = (obj, fn) => getCurrentPage( tab => chrome.tabs.sendMessage(tab.id, obj, response => fn(response)) )
var postMessageTab = (tab, obj, fn) => tab => chrome.tabs.sendMessage(tab.id, obj, response => fn(response))
var createTab = (url, b=true, fn=()=>{} ) => chrome.tabs.create({"active": b, url}, tab => fn(tab))
var download = url => chrome.downloads.download({url})
var notice =  (title, message) => chrome.notifications.create('', {type: 'basic', title, message, iconUrl: '../image/fish_128.png'}, id => setTimeout(() => chrome.notifications.clear(id), 3000))


async function clickSpace(fn) {
	return new Promise(resolve => {
		fetch("http://127.0.0.1/hi/click").then(data => data.text()).then(data => {
			resolve(JSON.parse(data))
		})
		// fetch(new Request("http://127.0.0.1:8000/api/user", {
		//     method: 'post',
		//     headers: {
		//         'Content-Type': 'application/json;charset=utf-8;'
		//     },
		//     body: JSON.stringify(response.data)
		// })).then(data => data.json()).then(data => {
		// 	//console.log(data)
		// })
	})
}


chrome.runtime.onMessage.addListener( (response, sender, sendResponse) => {
	sendResponse({ index })

	
})


async function show()
{
	postMessageCurrent({"cmd": "key have been clicked", 'user_id': null}, backMsg => {
		console.log(backMsg)
	})
}

