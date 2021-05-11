
let fs = require('fs') 

let main = args => args.length > 2 ? require('./js/main')[args[2]](global.param = args[1]) : { msg: "failed", comand: "", rersult: "" }

require('http').createServer( (request, response) => {
	if (request.url.indexOf('.') != -1) {
		let getStat = path => new Promise( resolve => fs.stat( path, (err, stats) => err ? resolve(false) : resolve(stats) ) )
		~async function () {
			if( await getStat(__dirname + request.url) ) {
				fs.createReadStream(__dirname + request.url).pipe(response)
			} else {
				response.writeHead(200, {"Content-Type": "application/json"})
				response.end(JSON.stringify( main(request.url.split("/")) ))
			}
		}()
	}
	else {
		response.writeHead(200, {"Content-Type": "application/json"})
		response.end(JSON.stringify( main(request.url.split("/")) ))
	}
		
}  ).listen(4444)
