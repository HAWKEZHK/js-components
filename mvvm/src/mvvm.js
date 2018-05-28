import Compile from './compile'
import {observe} from './observer'

class MVVM {
	constructor(options = {}){
		this.$options = options
		this.$data = this.$options.data
		let data = this.$data
		Object.keys(data).forEach((key)=> { this._proxyData(key) })
		observe(data)
		this.$compile = new Compile(options.el || document.body, this)
	}

	//使属性可直接访问
	_proxyData(key) {
		let that = this
		Object.defineProperty(that, key, {
			configurable: false,
			enumerable: true,
			get() { return that.$data[key] },
			set(newVal) { that.$data[key] = newVal }
		})
	}
}

export default MVVM