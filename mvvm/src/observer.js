// 订阅者列表
class Dep {
	constructor(){ this.subs = [] }
	// 加入列表
	addSub(sub) { this.subs.push(sub) }
	// 通知订阅者
	notify() { this.subs.forEach((sub)=>{ sub.update() }) }
}
Dep.target = null

// 数据监听器
class Observer {
	constructor(data){
		this.data = data
		Object.keys(data).forEach((key)=> {
			this.defineReactive(this.data, key, data[key])
		})
	}
	defineReactive(obj, key, val) {
		let dep = new Dep()
		let childObj = observe(val)								// 子对象
		Object.defineProperty(obj, key, {
			enumerable: true,												// 可枚举
			configurable: false,										// 不能再define
			get() {
				Dep.target && dep.addSub(Dep.target)	// 暂存watcher, 添加完移除
				return val
			},
			set(newVal) {
				if (val === newVal) return
				val = newVal
				childObj = observe(newVal) 						// 新的值是object的话，进行监听
				dep.notify()													// 通知所有订阅者
			}
		})
	}
}
function observe(data) {
	if (!data || typeof data !== 'object') return
	return new Observer(data)
}
export {observe, Dep}
