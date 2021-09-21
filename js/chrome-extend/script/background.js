var abductRequest = fn => chrome.webRequest.onBeforeRequest.addListener( details => fn(details), { urls: ["<all_urls>"], types: ["xmlhttprequest"] })
var getCurrentPage = fn => chrome.tabs.query({active: true, currentWindow: true}, tab => fn(tab[0]))
var getAllPage = fn => chrome.tabs.query({}, tab => fn(tab))
var getTab = (title, fn) => chrome.tabs.query({title}, tab => fn(tab[0]))
var postMessageCurrent = (obj, fn) => currentPage( tab => chrome.tabs.sendMessage(tab.id, obj, response => fn(response)) )
var postMessageTab = (tab, obj, fn) => tab => chrome.tabs.sendMessage(tab.id, obj, response => fn(response))
var createTab = (url, b=true, fn=()=>{} ) => chrome.tabs.create({"active": b, url}, tab => fn(tab))
var download = url => chrome.downloads.download({url})
var notice =  (title, message) => chrome.notifications.create('', {type: 'basic', title, message, iconUrl: '../image/fish_128.png'}, id => setTimeout(() => chrome.notifications.clear(id), 3000))