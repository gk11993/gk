//拦截网页请求响应头
var abduct = fn => chrome.webRequest.onBeforeRequest.addListener( details => fn(details), { urls: ["<all_urls>"], types: ["xmlhttprequest"] })
//获取当前显示页面
var currentPage = fn => chrome.tabs.query({active: true, currentWindow: true}, tab => fn(tab[0]))
//获取全部页面
var getAllPage = fn => chrome.tabs.query({}, tab => fn(tab))
//获取指定页面
var getTab = (title, fn) => chrome.tabs.query({title}, tab => fn(tab[0]))
//向active所在页面发送消息
var postMessageCurrent = (obj, fn) => currentPage( tab => chrome.tabs.sendMessage(tab.id, obj, response => fn(response)) )
//向指定页面发送消息
var postMessageTab = (tab, obj, fn) => tab => chrome.tabs.sendMessage(tab.id, obj, response => fn(response))
//创建新选项卡
var createTab = (url, b=true, fn=()=>{} ) => chrome.tabs.create({"active": b, url}, tab => fn(tab))
//通过链接打开下载窗口
var download = url => chrome.downloads.download({url})
//右下角窗口弹窗
var notice =  (title, message) => chrome.notifications.create('', {type: 'basic', title, message, iconUrl: '../image/fish_128.png'}, id => setTimeout(() => chrome.notifications.clear(id), 3000))
