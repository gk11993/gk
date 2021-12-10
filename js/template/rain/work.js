
let adb = require('../common/adb')
let fs = require('fs')

let path = require('path')
let process = require('child_process')
let median = require('../common/median')

let PNG = require("pngjs").PNG

let data = fs.readFileSync("bench/median.json", 'utf-8')
median.data = data ? JSON.parse(data) : []


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

async function capture() {
	await cmd(adb.capture)
	await cmd(adb.pull+path.join(__dirname,'../')+'bench/screenshot_0.png')
	median.getImg(PNG.sync.read(fs.readFileSync('bench/screenshot_0.png')))
}

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = async _=> {
	
	while ( true )
	{

		await sleep(1000)
		await capture()
		if ( median.check("应用中心", (isClick, outxy) => !isClick || click(outxy) ) ) continue;
		
		
		
	}

}
