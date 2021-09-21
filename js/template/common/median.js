
class Median {
	constructor() {
		this.data = null
		this.img = null
	}
	async getImg(img) {
		this.img = img
	}

	check(name, fun) {
		let obj = this.matching(name)
		let isClick = false
		let outxy = '0 0'
		if ( obj ) {
			isClick = obj.isClick
			outxy = `${parseInt(obj.x)+parseInt(obj.offsetX)} ${parseInt(obj.y)+parseInt(obj.offsetY)}`
		}
		fun(isClick, outxy)
		return obj ? true : false
	}
	matching(name) {
		let inc = 0
		let right = 0
		for ( let d of this.data ) {
			if ( d.name == name ) {
				d.inc = d.inc || 0
				if ( d.inc > 0 && d.onceClick == "1" ) break
				for (var x = d.x; x <d.w+d.x; x++) {
					for (var y = d.y; y < d.h+d.y; y++) {
						let index = (x+y*this.img.width)*4

						let r = this.img.data[index + 0]
						let g = this.img.data[index + 1]
						let b = this.img.data[index + 2]

						let color = 0
						if ( (r + g + b)/3 < d.mid ) color = 1

						if ( d.data[inc] == color ) right++

						if ( right >= d.data.length*d.percent ) return d.inc++, d
						inc++
					}
				}
			}
		}
		return null
	}
}





median = new Median
module.exports = median