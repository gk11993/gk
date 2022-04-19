
let callbacked = false
chrome.runtime.onMessage.addListener( async (response, sender, sendResponse) => {
	if ( response.cmd == 'callback' ) {
		callbacked = true
	}
	sendResponse("done")
})

async function postMessage(obj, fn = ()=>{}) {
	chrome.runtime.sendMessage(obj,
	response => fn(response))
}
async function getcallback() {
	return new Promise( async reject => {
		while ( !callbacked ) {
			await sleep(50)
		}
		callbacked = false
	    reject(true)
	})
}


async function closew(dm, way) {
	return new Promise( async reject => {
		if ( way ) {
			while ( gk(dm).dom[0] )
		    {
		    	await sleep(50)
		    }
		} else {
			while ( !gk(dm).dom[0] )
		    {
		    	await sleep(50)
		    }
		}
	    reject(true)
	})
}
async function downfollow(dm, way) {
	return new Promise( async reject => {
		if ( way ) {
			while ( gk(dm).dom[0] )
		    {
		    	await sleep(50)
		    }
		} else {
			while ( !gk(dm).dom[0] )
		    {
		    	await sleep(50)
		    }
		}
	    reject(true)
	})
}

console.log('INTO')

async function follow() {
    while ( true )
    {
    	await sleep(1000)
		if ( gk('#root > div > div > div > div > div > div > div > h1 > span > span > span > span > span').dom[0] ) {
			let data = {}
			data.name = gk('#root > div > div > div > div > div > div > div > h1 > span > span > span > span > span').dom[0].innerHTML
			data.number = gk('#root > div > div > div > div > div > div > p').dom[0].innerHTML
			data.follow = gk('#root > div > div > div > div > div > div > div > div > div:nth-child(1) > div').dom[1].innerHTML
			data.fun = gk('#root > div > div > div > div > div > div > div > div > div:nth-child(2) > div').dom[1].innerHTML
			data.nice = gk('#root > div > div > div > div > div > div > div > div > div:nth-child(3) > div').dom[1].innerHTML
			data.works = null
			if ( gk('#root > div > div > div > div > div > div > div > div > span').dom[0] ) {
				data.works = gk('#root > div > div > div > div > div > div > div > div > span').dom[0].innerHTML
			}
			data.desc = ""
			if ( gk('#root > div > div > div > div > div > div > p > span > span > span > span > span').dom[0] ) {
				data.desc = gk('#root > div > div > div > div > div > div > p > span > span > span > span > span').dom[0].innerHTML
			}
			
			data.home = window.location.href
			
			await downfollow('#root > div > div > div > div > div > div > div > div:nth-child(1) > button')
			postMessage({"cmd": 'may i click?', data}, async _=> {
				if ( _.msg ) {
					
					while (gk('#root > div > div > div > div > div > div > div > div:nth-child(1) > button').dom[0].innerHTML.indexOf('关注') == 0) {
						console.log('enter')
						await sleep(500)
						gk('#root > div > div > div > div > div > div > div > div:nth-child(1) > button', 'trigger')
						break
					}
				}
				postMessage({"cmd": 'close this window please'}, async _=> {})
			})
		}
		break;
    }
}

async function Done(dm, way) {
	return new Promise( async reject => {
		if ( way ) {
			while ( gk(dm).dom[0] )
		    {
		    	await sleep(50)
		    }
		} else {
			while ( !gk(dm).dom[0] )
		    {
		    	await sleep(50)
		    }
		}
	    reject(true)
	})
}

let isdowncomment = false
async function sendMsg() {
	let index = 0
    while ( true )
    {
    	await sleep(1000)
		if ( !isdowncomment ) {
			if ( gk( '#root > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > svg').dom[1] ) {
				gk( '#root > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > svg', 'trigger', 1)
				isdowncomment = true
			}
		} else {
			if ( gk( '#root > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > a').dom[0] ) {
				let doms = gk( '#root > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > a')
				let datas = []
				for (var i = 0; i < doms.dom.length; i++) {
					datas.push(gk(doms.dom[i], 'attr', 'href'))
				}

				let time = new Date*1
				await postMessage({"cmd": 'push', "data": datas}, a => {
					index = a.index
					console.log(index)
				})
				
				await getcallback()
				console.log(new Date*1 - time)
				break
				
				//开始下一个
				if ( await Done('#root > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > svg') === true ) {
					console.log(gk('#root > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > svg', "trigger"))
				}
				gk().keydown(40)
				isdowncomment = false
			}
		}
    }	
}

if ( window.location.href.indexOf('/user/') != -1 ) {
	follow()
} else {
	sendMsg()
}


