((_, factory) => {
	_.gk = factory()
})(this, ()=> {

(self => {
this.PI = Math.PI
this.sin = Math.sin
this.asin = Math.asin
this.cos = Math.cos
this.acos = Math.acos
this.tan = Math.tan
this.atan2 = Math.atan2
this.sqrt = Math.sqrt
this.pow = Math.pow
this.min = Math.min
this.max = Math.max
this.abs = Math.abs
this.exp = Math.exp
this.random = (...val) => val.length < 2 ? Math.random() * val[0] || Math.random() : Math.random() * (val[1] - val[0]) + val[0]
this.map = (num, min, max, mapMin, mapMax) => (num - min) / (max - min) * (mapMax - mapMin) + mapMin
this.constrain = (...arr) => {
	if (arr[0] < arr[1]) return arr[1]
	if (arr[0] > arr[2]) return arr[2]
	return arr[0]
}

})(self)
this.sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
class Vec2 {
	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}
	add(v1, v2) {
		if ( arguments.length === 2 ) return new Vec2(v1.x + v2.x, v1.y + v2.y)
		return this.x += v1.x, this.y += v1.y, this
	}
	sub(v1, v2) {
		if ( arguments.length === 2 ) return new Vec2(v1.x - v2.x, v1.y - v2.y)
		return this.x -= v1.x, this.y -= v1.y, this
	}
	mult(num) {
		return this.x *= num, this.y *= num, this
	}
	div(num) {
		return this.x /= num, this.y /= num, this
	}
	random2D() {
		return this.setMag(1, random(PI*2))
	}
	heading(angle, sum=0) {
		return arguments.length === 0 ? atan2(this.y, this.x) : this.setMag(this.mag(), angle + (typeof sum == 'number'? sum : this.heading()) )
	}
	mag() {
		return sqrt( abs(pow(this.x, 2) + pow(this.y, 2), + pow(this.z, 2)) )
	}
	setMag(num, angle, anchor={}) {
		angle = typeof angle == 'number' ? angle : atan2(this.y, this.x)
		return this.x = cos(angle) * num + (anchor.x || 0), this.y = sin(angle) * num + (anchor.y || 0), this
	}
	limit(num) {
		if ( num < this.mag() ) {
			this.normalize()
			this.setMag(num)
		}
		return this
	}
	dist(v1, v2) {
		return arguments.length === 2 ? sqrt( abs( pow(v1.x-v2.x, 2) + pow(v1.y-v2.y, 2) ) ) : sqrt( abs( pow(this.x-v1.x, 2) + pow(this.y-v1.y, 2) ) )
	}
	lerp(v1, v2, amt) {
		if ( arguments.length === 2 ) amt = v2, v2 = v1, v1 = this.copy()
		let x = amt * (v2.x - v1.x) + v1.x
		let y = amt * (v2.y - v1.y) + v1.y
		if ( arguments.length === 2 ) return this.x = x, this.y = y, this
		return new Vec2(x, y)
	}
	normalize() {
		return this.setMag(1), this
	}
	dot(v) {
		return this.x * v.x + this.y * v.y
	}
	cross(v, b=new Vec2(0, 0) ) {
		return (this.x - b.x)  * (v.y - b.y) - (this.y - b.y) * (v.x - b.x)
	}
	lineCross(a, a1, b, b1) {
		let denominator = (a.x - a1.x) * (b.y - b1.y) - (a.y - a1.y) * (b.x - b1.x)
		let t = ( (a.x - b.x) * (b.y - b1.y) - (a.y - b.y) * (b.x - b1.x) ) / denominator
		return new Vec2().sub(a1, a).mult(t).add(a)
	}
	angleBetween(v) {
		return acos(this.dot(v) / (this.mag()*v.mag()))
	}
	getNormalPoint(a, b, p) {
		if ( arguments.length === 2 ) p = this.copy()
		let ab = new Vec2().sub(b, a)
		let ap = new Vec2().sub(p, a)
		return ab.normalize().mult(ab.dot(ap)).add(a)
	}
	copy() {
		let copy = JSON.parse(JSON.stringify(this))
		let result = new Vec2
		for (let i in copy ) result[i] = copy[i]
		return result
	}
}
class Mover {
	constructor(pos) {
		this.pos = pos
		this.vel = new Vec2
		this.acc = new Vec2
		this.mass = 1
		this.liftspan = 255
		this.growUp = 0.001
		this.maxspeed = Infinity
		this.alignCenter = alignCenter
		this.isCheckEdges = true

	}
	run() {
		if ( this.done() ) return "done"
		this.update()
		this.display()
		if ( this.isCheckEdges ) this.checkEdges()
	}
	applyForce(force) {
		force.div(this.mass)
		this.acc.add(force)
	}
	update() {
		this.liftspan -= this.growUp
		this.vel.add(this.acc)
		this.vel.limit(this.maxspeed)
		this.pos.add(this.vel)
		this.acc.mult(0)
	}
	display() {
		point(this.pos)
	}
	done() {
		return this.liftspan < 0
	}
	checkEdges() {
		if ( this.alignCenter ) {
			if ( this.pos.x > width/2 ) {
				this.pos.x = -width/ 2
			} else if ( this.pos.x < -width/ 2 ) {
				this.pos.x = width/2
			}
			if ( this.pos.y > height/ 2 ) {
				this.pos.y = -height/ 2
			} else if ( this.pos.y < -height/ 2 ) {
				this.pos.y = height/2
			}
		} else {
			if ( this.pos.x > width ) {
				this.pos.x = 0
			} else if ( this.pos.x < 0 ) {
				this.pos.x = width
			}
			if ( this.pos.y > height ) {
				this.pos.y = 0
			} else if ( this.pos.y < 0 ) {
				this.pos.y = height
			}
		}
	}
}

this.Mover = Mover

class Dom {
	constructor(elt) {
		if (typeof elt === 'string') 
			elt.charAt(0) == '<' ? this.dom = this.genDom(elt) : this.dom = this.querys(elt)
		else if ( elt instanceof HTMLElement ) this.dom = [elt]
		else if ( elt instanceof Gk ) this.dom = elt.dom
	}
	querys(elt) { return document.querySelectorAll(elt) }
	genDom(elt) {
		let item = document.createElement('div')
		item.innerHTML = elt
		return item.children
	}
	find(t, way) {
		if (arguments.length === 0) return this.dom[0].parentNode
		if ( !way ) {
			let f = this.dom[0].querySelectorAll(t)
			return f ? f : gk()
		}
		if ( !(t instanceof Gk) ) t = gk(t)
		let p = this.dom[0].parentNode
		while(p !== t.dom[0]) {
			p = p.parentNode
			if (p.tagName == "HTML") break
		}
		if (p.tagName !== "HTML") return p
		return gk()
	}
	pipe(t, way) {
		if ( !(t instanceof Gk) ) t = gk(t)
		let a = this.dom[0]
		!way ? t.dom[0].appendChild(this.dom[0]) : way instanceof HTMLElement ? t.dom[0].insertBefore(this.dom[0], way) : t.dom[0].insertBefore(this.dom[0], t.dom[0].firstChild)
		return a
	}
	remove() { for (let d of this.dom) d.parentNode.removeChild(d) }
	attr(obj) {
		if (typeof obj == 'object') {
			for (let i in obj) this.dom[0].setAttribute(i, obj[i])
			return this.dom[0]
		}
		return { str: this.dom[0].getAttribute(obj) }
	}
	css(obj) {
		if (typeof obj == 'object') {
			for (let o in obj) this.dom[0].style[o] = obj[o]
			return this.dom[0]
		}

		let str = getComputedStyle(this.dom[0])[obj]
		if (str.substr(str.length - 2) == "px") str = str.substring(0, str.length - 2)
		return {str}
	}
	on(obj) { 
		for (let o in obj) {
			if ( this.dom ) {
				for (let i = 0; i < this.dom.length; i++) {
					this.dom[i].index = i
					this.dom[i].addEventListener(o, obj[o])
				}
			} else {
				document.addEventListener(o, obj[o])
			}
		}
	}
}

class Gk extends Dom {
	constructor (a) {
		super(a[0])
		if (a.length == 2) {
			if (typeof a[1] == 'string') return this[a[1]]()
			else if (typeof a[1] == 'object') for(let o in a[1]) this[o](a[1][o])
		}
		else if (a.length >= 3) return this[a[1]](a[2], a[3])
	}
}

let init = (...a) => new Gk(a)

class Make {
	constructor(a) {
		this.w = a[0]
		this.h = a[1]
		this.show = a[2]
		this.webgl = a[3]
		if ( !this.webgl ) {
			this.canvas = document.createElement('canvas')
			this.canvas.width = this.w
			this.canvas.height = this.h
			if ( this.show ) {
				gk(this.canvas, 'css', {position: 'absolute', left: '0', top: '0', 'z-index': "1"})
				gk(this.canvas, 'pipe', 'body')
			}
			this.context = this.canvas.getContext("2d")
			this.context.fillStyle = 'white'
			this.context.strokeStyle = 'black'
			this.context.textBaseline = 'middle'
			this.context.textAlign = 'center'
			this.context.font = '24px Copperplate'
			this.context.lineWidth = 1
			this.noFill = false
			this.noStroke = false

		} else {
			this._ = null
			this.loadingDone = false
		}
	}
	async run(fn) {
		if ( !this.webgl ) return 
		let self = this
		gk.gl( _=> {
			_.require = false
			_.width = self.w
			_.height = self.h
			_.preserve = true
			_.loadElement = self.show
			self._ = _

		}, async ready => {
			!self.show ? gk(self._.inner.gl.canvas, 'css', {display: 'none'}) : gk(self._.inner.gl.canvas, 'css', {position: 'absolute', left: '0', top: '0', 'z-index': "1"})
			fn(self._)
			await ready()
			this.loadingDone = true
 		})
		await new Promise(resolve => {
			let time = setInterval(() => {
				if ( self.loadingDone ) {
					resolve(clearInterval(time))
				}
			})
		})
		return await self.data()
	}
	fill(color) {
		color == 'none' ? this.noFill = true : this.noFill = false
		if ( this.noFill ) return false
		this.context.fillStyle = color
	}
	stroke(color) {
		color == 'none' ? this.noStroke = true : this.noStroke = false
		if ( this.noStroke ) return false
		this.context.strokeStyle = color
	}
	lineWidth(size) {
		this.context.lineWidth = size
	}
	font(font) {
		this.context.font = `${font}`.indexOf(" ") != -1 ? font : font + 'px Copperplate'
	}
	textAlign(row, col) {
		this.context.textAlign = !row || row == 'none' ? 'start' : row
		if ( arguments.length == 2 ) this.context.textBaseline =  !col || col == 'none' ? 'alphabetic' : col
	}
	save() {
		this.context.save()
		this.context.beginPath()
	}
	restore() {
		this.context.closePath()
		this.context.restore()
	}
	chunk(_) {
		this.save()
		_()
		this.restore()
	}
	translate(x, y) {
		this.context.translate(x, y)
	}
	rotate(angle) {
		this.context.rotate(angle)
	}
	rect(x, y, w, h) {
		this.chunk(() => {
			this.context.fillRect(x || 0, y || 0, typeof w == 'number' ? w : this.w, typeof h == 'number' ? h : this.h)
			if ( !this.noFill ) this.context.fill()
			if ( !this.noStroke ) {
				this.line(x, y, x+w, y)
				this.line(x+w, y, x+w, y+h)
				this.line(x+w, y+h, x, y+h)
				this.line(x, y+h, x, y)
				this.context.stroke()
			}
		})
	}
	point(size, x, y) {
		this.chunk(() => {
			this.context.arc(typeof x == 'number' ? x : this.w/2, typeof y == 'number' ? y : this.h/2, typeof size == 'number' ? size : this.noStroke ? min(this.w/2, this.h/2) : min(this.w/2-1, this.h/2-1), 0, Math.PI*2)
			if ( !this.noFill ) this.context.fill()
			if ( !this.noStroke ) this.context.stroke()
		})
	}
	line(...arr) {
		this.chunk(() => {
			this.translate(.5, .5)
			this.context.moveTo(arr[0], arr[1])
			for (var i = 2; i < arr.length; i+=2) {
				this.context.lineTo(arr[i], arr[i+1])
			}
			if ( !this.noStroke ) this.context.stroke()
		})
	}
	text(text, x, y) {
		this.chunk(() => {
			if ( !this.noFill ) this.context.fillText(text, typeof x == 'number' ? x : this.w/2, typeof y == 'number' ? y : this.h/2)
			if ( !this.noStroke ) this.context.strokeText(text, typeof x == 'number' ? x : this.w/2, typeof y == 'number' ? y : this.h/2)
		})
	}
	data(path) {
		let img = new Image()
		img.src = path || !this.webgl ? this.canvas.toDataURL("image/png") : this._.inner.gl.canvas.toDataURL("image/png")
		if ( path  ) img.width = this.w, img.height = this.h
		return new Promise( resolve => img.onload = () => resolve(img) )
	}
	getImgData(path) {
		let img = new Image()
		img.src = path
		img.width = this.w
		img.height = this.h
		return new Promise( resolve => {
			img.onload = () => {
				this.context.drawImage(img, 0, 0, img.width, img.height)
				resolve(this.context.getImageData(0, 0, img.width, img.height))
			}
		} )
	}
}
init.make = (...a) => new Make(a)

init.dom = new Proxy({}, {get(target, key) {
	return (arr, father) => {
		father = !father ? 'body' : father
		if ( key == 'input' ) {
			let [type, value, min, max, step] = [...arr]
			if ( type == 'range' ) {
				value = value || 50, min = min || 0, max = max || 100, step = step || 1
				return father == 'body' ? gk("<input type=range value="+value+" min="+min+" max="+max+" step="+step+" style='position: absolute; left: 0; top: 0; z-index: 1;'>", 'pipe', father) : gk("<input type=range value="+value+" min="+min+" max="+max+" step="+step+" >", 'pipe', father)
			}
			return father == 'body' ? gk("<input type="+type+" value="+value+"  style='position: absolute; left: 0; top: 0;'>", 'pipe', father) : gk("<input type="+type+" value="+value+" >", 'pipe', father)
		} else if ( key == 'obj' ) {
			let div = '<div style="width: 200px; display: inline-block; text-align: center; line-height: 100%;">'
			let text = arr[1] !== undefined ? arr[1] : ''
			div = father == 'body' ? gk(gk(div, 'css', {position: 'absolute', left: '0', top: '0', 'z-index': "1"}), 'pipe', 'body') : gk(div, 'pipe', father)
			let title = gk('<button>'+arr[0], 'pipe', div)
			gk(div, 'css', {marginTop: "10px"})
			return [div, title, gk(text instanceof HTMLElement ? text : arr[2] == undefined ? "<input style='width: 100px;' value="+text +'>' : '<'+arr[2]+'>'+ text, 'pipe', div)]
		}
		let text = typeof arr == 'object' ? arr[0] : typeof arr == 'string' ? arr : "" 
		return father == 'body' ? gk("<"+key+" style='width: 200px; position: absolute; left: 0; top: 0; z-index: 1;' class="+text+">", 'pipe', father) : gk("<"+key+">"+ text, 'pipe', father)
	}
}})

class SetView {
	constructor(title) {
		this.box = null
		this.title = title || 'settings'
		this.button = null
		this.background = 'rgba(255, 255, 0, 0.2)'
		this.init(this.title)
	}
	create(name, value, min, max, step) {
		let div = gk("<div>").dom[0]
		gk.dom.text([name+": "], div)
		let text = gk.dom.input(['text', value], div)
		let range = gk.dom.input(['range', value, min, max, step], div)

		gk(text, 'css', {background: 'none', border: '1px solid green', width: "50px", marginRight: '5px'})
		gk(range, 'css', {height: '10px'})
		this.change(text, range)
		
		this.add(div)
		return [text, range]
	}
	init(title) {
		this.box = gk(gk.dom.div('box'), 'css', {width: '300px'})
		gk(gk.dom.div([title], this.box), 'css', { textAlign: 'center', fontSize: '32px'})

		let buttonFather = gk("<div style='text-align: center; '>").dom[0]
		this.button = gk.dom.input(['button', 'click'], buttonFather)
		
		gk(buttonFather, 'pipe', this.box)
		gk(this.button, 'css', {textAlign: "center"})
		gk(this.box, 'css', {background: this.background, margin: "10px 0 0 10px", padding: '10px'})
	}
	add(dom) {
		gk(dom, 'attr', {style: ""})
		gk(dom, 'pipe', this.box, gk(this.button, 'find'))
		this.update()
	}
	update() {
		let list = gk(this.box, 'find', 'div')
		for (var i = 0; i < list.length; i++) {
			gk(list[i], 'css', {width: '100%', marginTop: '10px', textAlign: 'center'})
		}
	}
	change(text, range) {
		gk(text).on({input() {
			gk(range).dom[0].value = this.value
		}})
		gk(range).on({change() {
			gk(text).dom[0].value = this.value
		}})
	}
}

init.setView = name => new SetView(name)


init.ready = fn => document.addEventListener('DOMContentLoaded', () => fn())
init.curl = obj => {
	return new Promise((resolve, reject) => {
		let m, x = new XMLHttpRequest()
		obj.params ? m = "POST" : m = "GET"
		x.open(m, obj.url, true)
		obj.params ? x.send(JSON.stringify(obj.params)) : x.send()
		x.onreadystatechange = () => {
			if (x.readyState === 4) {
				if (x.status >= 200 && x.status < 300 || x.status === 304) {
					//console.warn(x.response)
					resolve(JSON.parse(x.response))
				} else {
					reject({code: x.status, msg: JSON.parse(x.response)})
				}
			}
		}
	})
}

class Webgl {
	constructor(index) {
		this.inner = {
			webgl: null,
			saveName: '',
			vs: `
				attribute vec4 layout;
				uniform vec4 position;
				attribute vec4 color;
				varying vec4 v_color;
				attribute vec2 texCoord;
				varying vec2 v_texCoord;
				uniform float pointSize;
				void main() {
					gl_Position = layout / position * vec4(1, -1, 1, 1);
					gl_PointSize = pointSize;
					v_color = color;
					v_texCoord = texCoord;
				}
			`,
			fs: `
				precision highp float;
				varying vec4 v_color;
				uniform sampler2D texture;
				varying vec2 v_texCoord;
				vec4 color;
				uniform float isSpirit;
				uniform float isTexture;
				uniform float discardAlphaSize;
				void main() {
					color = isTexture == 1.0 ? texture2D(texture, v_texCoord ) * v_color : v_color;
					if ( isSpirit == 1.0 ) color = texture2D(texture, gl_PointCoord) * v_color;;
					if ( color.a <= discardAlphaSize ) discard;
					gl_FragColor = color;
				}
			`,
			gl: null,
			layout: null,
			color: null,
			position: null,
			texture: null,
			texCoord: null,
			pointSize: null,
			isSpirit: null,
			isTexture: null,
			discardAlphaSize: null,
			stack: {
				points: [],
				lines: [],
				line_strips: [],
				triangles: [],
				triangle_strips: [],
			},
			attr: {
				scale: [1, 1, 1],
				translate: [0, 0, 0, 0],
				rotate: [0, 0, 0],
				lightFence: [0, 0, 0, undefined]
			}
		}
		this.require = true
		this.depthTest = true
		this.preserve = false
		this.loadElement = true
		this.started = false
		this.notExport = ['inner', 'require', 'depthTest', 'preserve', 'loadElement', 'started', 'notExport', 'constructor', 'lines', 'rects', 'rectsPlus', 'points']
		this.webglIndex = index
		this.width = null
		this.height = null
		this.delay = 0
		this.stop = false
		this.background = '#ccc'
		this.alignCenter = true
		this.period = {
			count: -1,
			prev: 0,
			time: 0
		}
	}
	save(name) {
		let self = this || webgls[requireIndex]
		self.inner.saveName = name
	}
	rotate(...angs) {
		let self = this || webgls[requireIndex]
		self.inner.attr.rotate = self.inner.attr.rotate.map((item, i) => item += angs[i] ? angs[i] : 0)
	}
	scale(...arr) {
		let self = this || webgls[requireIndex]
		arr.length === 1 ? self.inner.attr.scale.map((item, i) => self.inner.attr.scale[i] = item ) : arr.map((item, i) => self.inner.attr.scale[i] = item )
	}
	translate(x=0, y=0, z=0) {
		let self = this || webgls[requireIndex]
		self.inner.webgl.rotateDates([x, y, z], self.inner.attr.rotate).map((item, i) => self.inner.attr.translate[i] += item )
	}
	chunk(_) {
		let self = this || webgls[requireIndex]
		let clone = JSON.parse(JSON.stringify(self.inner.attr))
		clone.lightFence = [...self.inner.attr.lightFence]
		_()
		for (let a in clone) self.inner.attr[a] = clone[a]
	}
	texture(_, obj) {
		let self = this || webgls[requireIndex]
		let core = self.inner.webgl
		let clone = JSON.parse(JSON.stringify(self.inner.stack))
		let cloneLightFence = [...self.inner.attr.lightFence]
		self.hue(255, g => 255, 255, 255)
		for (let a in self.inner.stack) self.inner.stack[a] = []
		_()
		core.drawTexture(obj)
		self.inner.attr.lightFence = [...cloneLightFence]
		for (let a in clone) self.inner.stack[a] = clone[a]
	}
	hue(...arr) {
		let self = this || webgls[requireIndex]
		self.inner.attr.lightFence = [ arr[0], arr[1], arr[2], arr[3] ]
	}
	line(...arr) {
		let self = this || webgls[requireIndex]
		let core = self.inner.webgl
		let obj = {}
		if ( !Array.isArray(arr[0]) && !(arr[0] instanceof Vec2) ) {
			if ( typeof arr[0]  == 'object' ) {
				if ( typeof arr[1] == 'function' ) {
					return self.lines(...arr)
				} else {
					obj = arr[0]
					arr.splice(0, 1)
				}
			} else {
				if ( typeof arr[1] == 'function' ) arr.splice(0, 1)
				return self.lines(...arr)
			}
		}
		let begin = [], current = [], lineArr = [], x, y, z
		if ( obj.strip ) {
			for (var i = 0; i < arr.length; i++) {
				arr[i] instanceof Vec2 ? {x, y, z} = {...arr[i]} : [x, y, z] = [...[arr[i][0], arr[i][1], arr[i][2]] ]
				current = [x, y, z || obj.z || 0]
				current = core.positionCalc(current)
				current.push(...core.fencePositionColor(current), 1, 1)
				lineArr.push( ...current)
				if ( i == 0 ) begin = current
			}
			if ( obj.loop ) lineArr.push(...begin)
			self.inner.stack.line_strips.push(...lineArr, ...[undefined, undefined, 0, 0, 0, 0, 1, 1, 1])
		} else {
			for (var i = 0; i < arr.length; i++) {
				arr[i] instanceof Vec2 ? {x, y, z} = {...arr[i]} : [x, y, z] = [...[arr[i][0], arr[i][1], arr[i][2] || 0] ]
				current = [x, y, z || obj.z || 0]
				current = core.positionCalc(current)
				current.push(...core.fencePositionColor(current), 1, 1)
				lineArr.push(...current)
				if ( i == 0 ) begin = current
			}
			if ( obj.loop ) lineArr.push(...begin, ...current)
			self.inner.stack.lines.push(...lineArr)
		}
	}
	lines(obj, fn, max, inc, off) {
		let self = this || webgls[requireIndex]
		let lines = []
		if ( typeof obj == 'function' ) off = inc || 0, inc = max, max = fn, fn = obj, obj = { strip: true, loop: false }
		let noff = off
		max = typeof max == 'number' ? max : max || 360
		inc = inc || 1
		obj.strip = obj.strip == undefined ? true : obj.strip
		for (var i = 0; i < max; i+=inc) {
			lines.push(fn(i, noff))
			noff += off
		}
		self.line(obj, ...lines)
	}
	rect(...arr) {
		let self = this || webgls[requireIndex]
		let core = self.inner.webgl
		let obj = {}
		if ( typeof arr[0]  == 'object' ) {
			if ( typeof arr[1] == 'function' ) {
				return self.rectsPlus(...arr)
			} else if ( !(arr[0] instanceof Vec2) && !Array.isArray(arr[0]) ) {
				obj = arr[0]
				arr.splice(0, 1)
			}
		} else if ( typeof arr[0]  == 'function' ) {
			return self.rectsPlus(...arr)
		}
		if ( Array.isArray(arr[0]) || arr[0] instanceof Vec2 ) {
			if (  obj.half == undefined ) obj.half = true
			return self.rects(obj, ...arr)
		}

		let [x, y, w, h] = [...arr]
		let z = obj.z || 0
		if ( obj.center ) x -= w/2, y -= h/2
		let rect = [
			[x, y, z],
			[x, y + h, z],
			[x + w, y, z],
			[x + w, y + h, z],
			[undefined, undefined],
		]
		self.rects(obj, ...rect)
	}
	rects(...arr) {
		let self = this || webgls[requireIndex]
		let core = self.inner.webgl
		let obj = {}
		if ( !Array.isArray(arr[0]) ) {
			obj = arr[0]
			arr.splice(0, 1)
		}
		let rect = []
		let lines = []
		let x, y, z
		for (var i = 0; i < arr.length; i++) {
			arr[i] instanceof Vec2 ? {x, y, z} = {...arr[i]} : [x, y, z] = [...arr[i] ]
			rect.push([x, y, z || obj.z || 0])
		}
		let buffers = []
		let curr = []

		if ( obj.half ) {
			for (var i = 0; i < rect.length; i++) {
				curr = core.positionCalc([rect[i][0], rect[i][1], rect[i][2]])
				buffers.push(...curr, ...core.fencePositionColor(curr), 1, 1)
			}
			self.inner.stack.triangles.push(...buffers)
		} else {
			let len = self.inner.stack.triangle_strips.length / 9
			let vsVertex = [ [0, 0], [0, 1], [1, 0], [1, 1], [0, 0] ]
			for (var i = 0; i < rect.length; i++) {
				curr = core.positionCalc([rect[i][0], rect[i][1], rect[i][2]])
				buffers.push(...curr, ...core.fencePositionColor(curr), ...vsVertex[(len + i) % 5])
			}
			self.inner.stack.triangle_strips.push(...buffers)
		}
	}
	rectsPlus(obj, fn, max, inc, off) {
		let self = this || webgls[requireIndex]
		if ( typeof obj == 'function' ) off = inc || 0, inc = max, max = fn, fn = obj, obj = { half: false, strand: false }
		let noff = off
		max = typeof max == 'number' ? max : max || 360
		inc = inc || 1
		let points = []
		obj.w = obj.w/2 || 1
		
		for (var i = 0; i < max; i+=inc) {
			let f = fn(i, noff)
			points.push( Array.isArray(f) ? vec2(...f) : f )
			noff += off
		}
		if ( obj.strand ) {
			for (var i = 1; i < points.length; i++) {
				let v = vec2().sub(points[i], points[i-1])
				let segment = obj.segment || v.mag()
				for (var j = 0; j <= segment; j++) {
					self.point(vec2().lerp(points[i-1], points[i], j/segment), w)
				}
			}
		} else {
			let ls1 = [], ls2 = [], ls3 = [], ls4 = []
			for (var i = 0; i < points.length; i++) {
				let n1, n2, n3, n4
				if ( i > 0 ) {
					let heading = vec2().sub(points[i], points[i-1]).normalize().heading()
					n3 = vec2().setMag(obj.w, heading-PI/2, points[i])
					n4 = vec2().setMag(obj.w, heading+PI/2, points[i])
					ls1.push(n3)
					ls2.push(n4)
				}
				if ( i < points.length-1 ) {
					let heading = vec2().sub(points[i], points[i+1]).normalize().heading()
					n1 = vec2().setMag(obj.w, heading-PI/2, points[i])
					n2 = vec2().setMag(obj.w, heading+PI/2, points[i])
					ls1.push(n2)
					ls2.push(n1)
				} 
			}
			ls3.push(ls1[0])
			for (var i = 0; i < ls1.length-1-2; i+=2) {
				let a = ls1[i+0]
				let a1 = ls1[i+1]
				let index = (i/2+1)*2
				let b = ls1[index+0]
				let b1 = ls1[index+1]
				let mid = vec2().lineCross(a, a1, b, b1)
				ls3.push(mid)
			}
			ls3.push(ls1[ls1.length-1])
			
			ls4.push(ls2[0])
			for (var i = 0; i < ls2.length-1-2; i+=2) {
				let a = ls2[i+0]
				let a1 = ls2[i+1]
				let index = (i/2+1)*2
				let b = ls2[index+0]
				let b1 = ls2[index+1]
				let mid = vec2().lineCross(a, a1, b, b1)
				ls4.push(mid)
			}
			ls4.push(ls2[ls2.length-1])
			if ( obj.loop && ls3.length > 3 ) {
				let mid = vec2().lineCross(ls3[0], ls3[1], ls3[ls3.length-1], ls3[ls3.length-2])
				let mid1 = vec2().lineCross(ls4[0], ls4[1], ls4[ls4.length-1], ls4[ls4.length-2])
				ls3[0] = mid
				ls3[ls3.length-1] = mid
				ls4[0] = mid1
				ls4[ls4.length-1] = mid1
			}
			for (var i = 0; i < ls3.length; i++) {
				self.rects(obj, ls3[i], ls4[i])
			}
			self.rects({}, [ undefined, undefined ])
		}
	}
	point(...arr) {
		let self = this || webgls[requireIndex]
		let obj = {}
		if ( !Array.isArray(arr[0]) && !(arr[0] instanceof Vec2) ) {
			if ( typeof arr[0] == 'object' ) {
				obj = arr[0]
				arr.splice(0, 1)
			}
		}
		let r1 = typeof arr[arr.length-1] == 'number' && arr[0] instanceof Vec2 ? arr[arr.length-1] : 0
		for (var i = 0; i < arr.length; i++) {
			if ( arr[i] instanceof Vec2 ) {
				self.points(obj, arr[i], r1)
			} else if ( i < arr.length-1 ) {
				self.points(obj, arr)
				break
			}
		}
	}
	points(obj, arr, r1) {
		let self = this || webgls[requireIndex]
		let core = self.inner.webgl
		if ( typeof arr[0]  == 'object' ) Array.isArray(arr[0]) ? arr = [...arr[0]] : arr = arr[0]
		let x, y, z, r; arr instanceof Vec2 ? {x, y, z} = {...arr} : [x, y, z, r] = [...arr]
		z = z || obj.z || 0
		r = r || obj.r || r1 || 1
		if ( r > 1 ) {
			let degrees = obj.across || PI*2
			let root = obj.in || r
			let zoomX = obj.zoomX || 1
			let zoomY = obj.zoomY || 1
			let segment = obj.segment
			if ( !segment ) segment = ~~(r/10 < 0.6 ? r+5 : r/10+15)
			for (let i = 0; i < degrees; i+=degrees/segment) {
				let c = cos(i) * zoomX
			    let s = sin(i) * zoomY
			   	self.rects({}, [(r-root) * c + x, (r-root) * s + y, z], [r * c + x, r * s + y, z])
			}
			let c = cos(degrees) * zoomX
		    let s = sin(degrees) * zoomY
		   	self.rects({}, [(r-root) * c + x, (r-root) * s + y, z], [r * c + x, r * s + y, z], [ undefined, undefined ])
		} else {
			let curr = core.positionCalc([x, y, z])
			self.inner.stack.points.push(...curr, ...core.fencePositionColor(curr), ...[1, 1])
		}
	}
	pointSize(size) {
		let self = this || webgls[requireIndex]
		self.inner.webgl.setPointSize(size)
	}
	vec2(x, y) {
		return new Vec2(x, y)
	}
}

class WabglInner {
	constructor(gl, cloak, fun) {
		this.gl = gl
		this.cloakWebgl = cloak
		this.fun = fun
		this.textures = []
		this.emptyTextureLoadDone = false
		this.init()
	}
	init() {
		this.systemExtend()
		this.getWorkParams(this.shader())
		this.buffer()
	}
	systemExtend() {
		let gl = this.gl
		if ( this.cloakWebgl.depthTest ) gl.enable(gl.DEPTH_TEST)
	    gl.enable(gl.BLEND)
	    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
	}
	shader() {
		let webgl = this.cloakWebgl
		let gl = this.gl

		let vertex = gl.createShader(gl.VERTEX_SHADER)
		gl.shaderSource(vertex, webgl.inner.vs)
		gl.compileShader(vertex)

		let fragment = gl.createShader(gl.FRAGMENT_SHADER)
		gl.shaderSource(fragment, webgl.inner.fs)
		gl.compileShader(fragment)

		let program = gl.createProgram()
		gl.attachShader(program, vertex)
		gl.attachShader(program, fragment)
		gl.linkProgram(program)
		gl.useProgram(program)
		gl.viewport(0, 0, webgl.width, webgl.height)
		return program
	}
	async getWorkParams(program) {
		let webgl = this.cloakWebgl
		let gl = this.gl
		webgl.inner.layout = gl.getAttribLocation(program, "layout")
		webgl.inner.position = gl.getUniformLocation(program, "position")
		webgl.inner.color = gl.getAttribLocation(program, "color")
		webgl.inner.texCoord = gl.getAttribLocation(program, "texCoord")
		webgl.inner.texture = gl.getUniformLocation(program, "texture")
		webgl.inner.pointSize = gl.getUniformLocation(program, "pointSize")
		webgl.inner.isSpirit = gl.getUniformLocation(program, "isSpirit")
		webgl.inner.isTexture = gl.getUniformLocation(program, "isTexture")
		webgl.inner.discardAlphaSize = gl.getUniformLocation(program, "discardAlphaSize")

		gl.uniform4f(webgl.inner.position, webgl.width, webgl.height, webgl.width, 2)
		gl.uniform1f(webgl.inner.discardAlphaSize, 0)
		this.setPointSize(1)
		let empty = gk.make(1, 1)
		this.texture({}, false)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, await empty.data())
		this.emptyTextureLoadDone = true
	}
	buffer() {
		let webgl = this.cloakWebgl.inner
		let gl = this.gl
		let buf = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, buf)
		gl.enableVertexAttribArray(webgl.layout)
		gl.vertexAttribPointer(webgl.layout, 3, gl.FLOAT, false, 4 * 9, 0)

	    gl.enableVertexAttribArray(webgl.color)
		gl.vertexAttribPointer(webgl.color, 4, gl.FLOAT, false, 4 * 9, 4 * 3)

		gl.enableVertexAttribArray(webgl.texCoord)
		gl.vertexAttribPointer(webgl.texCoord, 2, gl.FLOAT, false, 4 * 9, 4 * 7)
	}
	texture(obj, isDelete=true) {
		let gl = this.gl
		var texture = gl.createTexture()
		gl.activeTexture(gl.TEXTURE0)	
		gl.uniform1i(this.cloakWebgl.inner.texture, 0)
		gl.bindTexture(gl.TEXTURE_2D, texture)
		//LINEAR //NEAREST
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
		obj = obj || {}
		let model = obj.repeat ?  gl.REPEAT : gl.CLAMP_TO_EDGE
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, obj.repeat && obj.s ? gl.MIRRORED_REPEAT : model)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, obj.repeat && obj.t ? gl.MIRRORED_REPEAT : model)
		if ( isDelete ) this.textures.push(texture)
	}
	drawSource(loop) {
		let webgl = this.cloakWebgl
		let gl = this.gl
		let fun = this.fun
		let self = this
		let w = 0
		let h = 0
		if ( !webgl.alignCenter ) {
			w = -webgl.width/2
			h = -webgl.height/2
		}
		let prevSum = 0
		let drawSourceLoop = async timestemp =>  {
			webgl.inner.attr.scale = [1, 1, 1]
			webgl.inner.attr.translate = [w, h, 0, 0]
			webgl.inner.attr.rotate = [0, 0, 0]
			webgl.inner.attr.lightFence = [0, 0, 0, undefined]
			if ( !webgl.preserve ) {
				gl.clear(gl.DEPTH_BUFFER_BIT)
				gl.clear(gl.STENCIL_BUFFER_BIT)
				gl.clear(gl.COLOR_BUFFER_BIT)
			}
			
			webgl.period.count++
			webgl.period.time = timestemp || 0
			webgl.period.prev = webgl.period.time - prevSum
			prevSum = webgl.period.time

			if ( !self.emptyTextureLoadDone ) await sleep() // because shader in 'if false' also run texture2D, for not see warning, so loading empty image the sleep 17ms, delete this that's okay
			if ( loop ) fun && fun()
			
			if ( webgl.inner.stack.triangles.length ) {
				//TRIANGLE_FAN
				gl.bufferData(gl.ARRAY_BUFFER,  new Float32Array(webgl.inner.stack.triangles), gl.STATIC_DRAW)
				gl.drawArrays(gl.TRIANGLES, 0, webgl.inner.stack.triangles.length/9)
				webgl.inner.stack.triangles = []
			}

			if ( webgl.inner.stack.triangle_strips.length ) {
				gl.bufferData(gl.ARRAY_BUFFER,  new Float32Array(webgl.inner.stack.triangle_strips), gl.STATIC_DRAW)
				gl.drawArrays(gl.TRIANGLE_STRIP, 0, webgl.inner.stack.triangle_strips.length/9)
				webgl.inner.stack.triangle_strips = []
			}

			if ( webgl.inner.stack.lines.length ) {
				//LINE_LOOP
				gl.bufferData(gl.ARRAY_BUFFER,  new Float32Array(webgl.inner.stack.lines), gl.STATIC_DRAW)
				gl.drawArrays(gl.LINES, 0, webgl.inner.stack.lines.length/9)
				webgl.inner.stack.lines = []
			}
			
			if ( webgl.inner.stack.line_strips.length ) {
				gl.bufferData(gl.ARRAY_BUFFER,  new Float32Array(webgl.inner.stack.line_strips), gl.STATIC_DRAW)
				gl.drawArrays(gl.LINE_STRIP, 0, webgl.inner.stack.line_strips.length/9)
				webgl.inner.stack.line_strips = []
			}
			
			if ( webgl.inner.stack.points.length ) {
				gl.bufferData(gl.ARRAY_BUFFER,  new Float32Array(webgl.inner.stack.points), gl.STATIC_DRAW)
				gl.drawArrays(gl.POINTS, 0, webgl.inner.stack.points.length/9)
				webgl.inner.stack.points = []
			}

			if ( self.textures.length ) {
				for (var i = 0; i < self.textures.length; i++) gl.deleteTexture(self.textures[i])
				self.textures = []
			}

			if ( webgl.inner.saveName || webgl.inner.saveName == undefined ) {
				self.downloadCanvasData(gl.canvas, webgl.inner.saveName)
				webgl.inner.saveName = ''
			}
			
			if ( loop && !webgl.stop ) {
				await sleep(webgl.delay)
				requestAnimationFrame(drawSourceLoop)
			}
		}

		if ( loop ) drawSourceLoop()
		return drawSourceLoop
	}
	downloadCanvasData(canvas, name) {
		let link = gk('<a href="' + canvas.toDataURL("image/png")+'">').dom[0]
		link.download = name + ".png"
		link.click()
	}
	rotateDates(buffers, rotate) {
		let date = (i, angle) => {
			let c = cos(angle)
			let s = sin(angle)
			return [ [ 1, 0, 0, 0, c, -s, 0, s, c ], [ c, 0, -s, 0, 1, 0, s, 0, c ], [ c, -s, 0, s, c, 0, 0, 0, 1 ] ][i]
		}
		for (var i = 0; i < rotate.length; i++) if ( rotate[i] ) buffers = this.matMult(date(i, rotate[i]), buffers)
		return buffers
	}
	matMult(a, b) {
		let result = []
		for (var i = 0; i < b.length; i++) {
			let sum = 0
			for (var k = 0; k < 3; k++) sum += a[(i % 3) * 3 + k] * b[k]
			result.push(sum)
		}
		return result
	}
	hslToRGB(arr) {
		let h = arr[0], s = arr[1], l = arr[2], r = null, g = null, b = null, a = arr[3], p2 = null, c = null
		if (  s == 0 ) r = g = b = l
		else {
			if ( l >= 0.5 ) p2 = l + s - l * s
			else p2 = l * (1+s)
			let p1 = 2 * l - p2
			let p = p3 => {
				if ( p3 < 0 ) p3 += 1
				if ( p3 > 1 ) p3 -= 1
				if ( 6 * p3 < 1 ) c = p1 + (p2 - p1) * 6 * p3
				else if( 2 * p3 < 1 ) c = p2 
				else if( 3 * p3 < 2 ) c = p1 + (p2-p1) * ((2/3)-p3) * 6
				else c = p1
				return c
			}
			r = p(h + 1 /3)
			g = p(h)
			b = p(h - 1 /3)
		}
		return [r, g, b, a]
	}
	fencePositionColor(arr) {
		let webgl = this.cloakWebgl.inner
		if ( typeof webgl.attr.lightFence[1] == 'function' ) {
			let hue = webgl.attr.lightFence[1]({x: arr[arr.length - 3] - webgl.attr.translate[0], y: arr[arr.length - 2] - webgl.attr.translate[1], z: arr[arr.length - 1] - webgl.attr.translate[2]})
			return [ typeof hue == 'object' && hue.length > 1 ?  hue[0] / 255 : typeof webgl.attr.lightFence[0] == 'number' ? webgl.attr.lightFence[0] / 255 : 0,
			typeof hue == 'number' || typeof hue == 'object' && hue.length >= 1 ? typeof hue == 'number' ? hue / 255 : hue.length  == 1 ? hue[0] / 255 :  hue.length  > 1 ? hue[1] / 255 : 0 : 0,
			typeof hue[2] == 'number' ? hue[2] / 255 : typeof webgl.attr.lightFence[2] == 'number' ? webgl.attr.lightFence[2] / 255 : 0,
			typeof hue[3] == 'number' ? hue[3] / 255 : typeof webgl.attr.lightFence[3] == 'number' ? webgl.attr.lightFence[3] / 255 : 1]
		}
		let color = []
		if ( typeof webgl.attr.lightFence[0] == 'function' ) {
			let hue = webgl.attr.lightFence[0]({x: arr[arr.length - 3] - webgl.attr.translate[0], y: arr[arr.length - 2] - webgl.attr.translate[1], z: arr[arr.length - 1] - webgl.attr.translate[2]})
			color = [typeof hue == 'object' ? typeof hue[0] == 'number' ? hue[0] / 360 : 0 : typeof hue == 'number' ? hue / 360 : 0,
			typeof hue[1] == 'number' ? hue[1] / 100 : typeof webgl.attr.lightFence[1] == 'number' ? webgl.attr.lightFence[1] / 100 : 0.5,
			typeof hue[2] == 'number' ? hue[2] / 100 : typeof webgl.attr.lightFence[2] == 'number' ? webgl.attr.lightFence[2] / 100 : 0.5,
			typeof hue[3] == 'number' ? hue[3] / 100 : typeof webgl.attr.lightFence[3] == 'number' ? webgl.attr.lightFence[3] / 100 : 1]
		}
		if ( color.length == 0 ) {
			color = [typeof webgl.attr.lightFence[0] == 'number' ? webgl.attr.lightFence[0] / 360 : 0,
			typeof webgl.attr.lightFence[1] == 'number' ? webgl.attr.lightFence[1] / 100 : 0.5,
			typeof webgl.attr.lightFence[2] == 'number' ? webgl.attr.lightFence[2] / 100 : 0.5,
			typeof webgl.attr.lightFence[3] == 'number' ? webgl.attr.lightFence[3] / 100 : 1]
		}
		return this.hslToRGB(color)
		//return [0, 0, 0, 1]
	}
	positionCalc(arr) {
		let webgl = this.cloakWebgl.inner
		arr = this.rotateDates(arr, webgl.attr.rotate)

		//plus translate and scale
		for (var i = 0; i < arr.length; i+=3) [webgl.attr.translate[0], webgl.attr.translate[1], webgl.attr.translate[2]].map( (item, n) => arr[i+n] += item)
		for (var i = 0; i < arr.length; i+=3) [webgl.attr.scale[0], webgl.attr.scale[1], webgl.attr.scale[2]].map( (item, n) => arr[i+n] *= item)

		//camera
		for (var i = 2; i < arr.length; i+=3) {
			// let pz = arr[i] / this.cloakWebgl.width

			// arr[i-2] -= arr[i-2] * (pz > 1 ? 1 : pz)
			// arr[i-1] -= arr[i-1] * (pz > 1 ? 1 : pz)

			// arr[i-2] -= arr[i-2] * (pz < -1 ? -1 : pz)
			// arr[i-1] -= arr[i-1] * (pz < -1 ? -1 : pz)
		
		}
		return arr
	}
	setPointSize(size) {
		this.gl.uniform1f(this.cloakWebgl.inner.pointSize, size)
	}
	drawPointTexture(obj) {
		let webgl = this.cloakWebgl
		let gl = this.gl

		if ( obj.size != undefined ) this.setPointSize(obj.size)
		if ( obj.side ) gl.uniform1f(webgl.inner.discardAlphaSize, obj.side)
		this.texture()
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, obj.img)
		
		gl.uniform1f(webgl.inner.isSpirit, 1)

		gl.bufferData(gl.ARRAY_BUFFER,  new Float32Array(webgl.inner.stack.points), gl.STATIC_DRAW)
		gl.drawArrays(gl.POINTS, 0, webgl.inner.stack.points.length/9)

		gl.uniform1f(webgl.inner.isSpirit, 0)
		if ( obj.side ) gl.uniform1f(webgl.inner.discardAlphaSize, 0)
	}
	drawTexture(obj) {
		let webgl = this.cloakWebgl
		if ( webgl.inner.stack.points.length ) {
			this.drawPointTexture(obj)
		}
		if ( webgl.inner.stack.triangle_strips.length ) {
			this.drawRectTexture(obj)
		}
	}
	drawRectTexture(obj) {
		let webgl = this.cloakWebgl
		let gl = this.gl
		this.texture(obj)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, obj.img)
		gl.uniform1f(webgl.inner.isTexture, 1)
		if ( obj.repeat ) {
			let temp = webgl.inner.stack.triangle_strips
			for (var i = 0; i < temp.length / 9; i+=5) {
				let index = i/5 * 45
				let x = temp[index]
				let y = temp[index + 1]
				let w = temp[index + 3*9] - x
				let h = temp[index + 3*9 + 1] - y
				let pw = w / obj.img.width
				let ph = h / obj.img.height
				for (var j = 0; j < 4; j++) {
					temp[index+j*9+9-2] *= pw
					temp[index+j*9+9-1] *= ph
				}
			}
		}
		gl.bufferData(gl.ARRAY_BUFFER,  new Float32Array(webgl.inner.stack.triangle_strips), gl.STATIC_DRAW)
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, webgl.inner.stack.triangle_strips.length/9)
		
		gl.uniform1f(webgl.inner.isTexture, 0)
	}
}

let generateBody = (fn, already, index) => {
	let webgl = webgls[index]
	webgl.width = window.innerWidth
	webgl.height = window.innerHeight
	let fun = fn && fn(webgl), gl, W, H
	webgl.started = true	
	// this is a the ready work about view
	if ( webgl.require && requireIndex == null ) {
		requireIndex = index
		document.body.parentNode.style.overflow = "hidden"
		gk('body', 'css', {margin: "0", padding: "0", position: 'relative'})
		if ( webgl.width != window.innerWidth || webgl.height != window.innerHeight ) document.body.parentNode.style.overflow = "auto"
		gl = webgl.inner.gl = gk('<canvas style="background: '+webgl.background+'; position: absolute; left: 0; top: 0;" webglIndex="'+index+'">', 'pipe', 'body').getContext('webgl', { preserveDrawingBuffer: webgl.preserve })

		var proxyObj = {}
		if ( webgl.width == window.innerWidth || webgl.height == window.innerHeight ) {
			window.addEventListener('resize', () => {
				proxyObj.width = W = webgl.width = gl.canvas.width = window.innerWidth
				proxyObj.height = H = webgl.heihght = gl.canvas.height = window.innerHeight
				gl.viewport(0, 0, W, H)
				gl.uniform4f(webgl.inner.position, W, H, W, 2)
			})
		}
		let proxy = key => Object.defineProperty(window, key, {get() { return proxyObj[key] }, set(value) { proxyObj[key] = value, webgl[key] = value }})
		
		for (let i in webgl) if ( !webgl.notExport.some( str => str == i ) ) proxy(i), window[i] = webgl[i]
		for (let o of Object.getOwnPropertyNames(Webgl.prototype)) if ( !webgl.notExport.some( str => str == o ) ) window[o] = webgl[o]
	} else {
		let canvas = document.createElement('canvas')
		gk(canvas, 'css', {background: webgl.background})
		gk(canvas, 'attr', {webglIndex: index})
		canvas = webgl.loadElement ? gk(canvas, 'pipe', 'body') : canvas
		gl = webgl.inner.gl = canvas.getContext('webgl', { preserveDrawingBuffer: webgl.preserve })
	}
	
	let proxyBackground = {}
	Object.defineProperty(webgl, 'background', {get() { return proxyBackground['background'] }, set(value) { proxyBackground['background'] = value, gk('canvas[webglindex="'+index+'"]', 'css', {background: value}), webgl.require ? proxyObj.background = value : 0 }})

	gl.canvas.width = webgl.width
	gl.canvas.height = webgl.height
	webgl.inner.webgl = new WabglInner(gl, webgl, fun)
	
	window.mouseX = 0
	window.mouseY = 0
	window.mousePressed = false
	gk().on({mousemove() {
		mouseX = event.clientX
		mouseY = event.clientY
	}, mousedown() {
		mousePressed = true
	}, mouseup() {
		mousePressed = false
	}})

	if ( !webgl.alignCenter ) webgl.inner.attr.translate = [-webgl.width/2, -webgl.height/2, 0, 0]

	already(webgl.inner.webgl.drawSource())
	if ( fun ) webgl.inner.webgl.drawSource(true)
}

let itemArr = []
let webgls = []
let webglIndex = -1
let requireIndex = null
let readyStarted = false
init.gl = (fn, already = () => {}) => {
	webglIndex++
	webgls.push(new Webgl(webglIndex))
	itemArr.push( { fn, already, webglIndex } )
	if ( readyStarted ) run()
}
let run = () => {
	for (var i = 0; i < itemArr.length; i++) if ( !webgls[itemArr[i].webglIndex].started ) generateBody(itemArr[i].fn, itemArr[i].already, itemArr[i].webglIndex)
}
init.ready( () => readyStarted = run() == undefined ? true : false)
return init
})