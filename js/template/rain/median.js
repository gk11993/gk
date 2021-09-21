let fs = require('fs')
let adb = require('../common/adb')

let path = require('path')
let process = require('child_process')

async function cmd(code) {
	let cmd = path.join(__dirname,'../')+'cmd/adb '+code
	return new Promise(resolve => {
		process.exec(cmd, function(error, stdout) {
			resolve(stdout);
		});
	})
}


module.exports = async _=> {

	if ( _[0][1] == 'save' ) {
		let data = fs.readFileSync("bench/median.json", 'utf-8')
		data = data ? JSON.parse(data) : []
		_[1].index = data.length
		data.push(_[1])
		fs.writeFileSync("bench/median.json", JSON.stringify(data))
	}
	else if ( _[0][1] == 'update' ) {
		await cmd(adb.capture)
		await cmd(adb.pull+path.join(__dirname,'../')+'bench/screenshot_0.png')
	}
	
	return {'msg': 'okay'}
}
