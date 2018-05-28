import {Dep} from './observer'

class Watcher {
	constructor(vm, exp, cb){
		this.vm = vm
		this.cb = cb
		this.exp = exp
		this.value = this.get()
	}

	update() {
		let value = this.get() //取到最新值
		let oldVal = this.value
		if (value !== oldVal) {
			this.value = value
			this.cb.call(this.vm, value, oldVal) //执行Compile中绑定的回调，更新视图
		}
	}

	get() {
		Dep.target = this
		let value = this.vm[this.exp]
		Dep.target = null
		return value
	}
}

export default Watcher