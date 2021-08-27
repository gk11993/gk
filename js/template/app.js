
let main = async (...args) => args[0].length > 2 ? await require('./rain/main')[args[0][2]](args) : { msg: "failed", comand: "", rersult: "" }

require('http').createServer( (request, response) => {
	
	if(request.method == "GET") {
		if (request.url.indexOf('.') != -1) {
			let fs = require('fs') 
			let getStat = path => new Promise( resolve => fs.stat( path, (err, stats) => err ? resolve(false) : resolve(stats) ) )
			~async function () {
				if( await getStat(__dirname + request.url) ) {
					fs.createReadStream(__dirname + request.url).pipe(response)
				} else {
					response.writeHead(200, {"Content-Type": "application/json"})
					response.end(JSON.stringify( await main(request.url.split("/")) ))
				}
			}()
		}
		else {
			response.writeHead(200, {"Content-Type": "application/json"})
			~async function () {
				response.end(JSON.stringify( await main(request.url.split("/")) ))
			}()
			
		}
	} else {
		let postdata = ""
        request.addListener("data", data => postdata += data)
        request.addListener("end",() => {
            ~async function () {
            	response.writeHead(200, {"Content-Type": "application/json"})
				response.end(JSON.stringify( await main(request.url.split("/"), JSON.parse(postdata)) ))
			}()
        })
	}

}  ).listen(4444)
