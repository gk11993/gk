
let adb = require('../common/adb')
let fs = require('fs')

let path = require('path')
let process = require('child_process')
let median = require('../common/median')

let { createCanvas, loadImage } = require('canvas')

let data = fs.readFileSync("bench/median.json", 'utf-8')
median.data = data ? JSON.parse(data) : []

async function getImg() {
	const myimg = await loadImage('bench/screenshot_0.png')
	const canvas = createCanvas(myimg.width, myimg.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(myimg, 0, 0)
    median.getImg(ctx.getImageData(0, 0, myimg.width, myimg.height))
}


let cmdadb = path.join(__dirname,'../')+'cmd/adb '
async function cmd(code) {
	return new Promise(resolve => {
		process.exec(cmdadb+code, function(error, stdout) {
			resolve(stdout);
		});
	})
}

function click(outxy) {
	cmd(adb.click+outxy)
}

async function sleep(ms)
{
	return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = async _=> {
	
	while ( true )
	{
		console.log("okay")
		await sleep(1000)
		await cmd(adb.capture)
		await cmd(adb.pull+path.join(__dirname,'../')+'bench/screenshot_0.png')
		await getImg()
		if ( median.check("应用中心", (isClick, outxy) => !isClick || click(outxy) ) ) continue;
		console.log('not find')
		
		
	}

}
