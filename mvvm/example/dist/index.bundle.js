/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return observe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Dep; });
//消息订阅器，用来收集订阅者
class Dep {
	constructor() {
		this.subs = [];
	}

	//加入列表
	addSub(sub) {
		this.subs.push(sub);
	}
	//通知订阅者
	notify() {
		this.subs.forEach(sub => {
			sub.update();
		});
	}
}
Dep.target = null;

/*------------------------------------------------------------------------*/

//数据监听器
class Observer {
	constructor(data) {
		this.data = data;

		Object.keys(data).forEach(key => {
			this.defineReactive(this.data, key, data[key]);
		});
	}

	defineReactive(obj, key, val) {
		let dep = new Dep();
		let childObj = observe(val); //子对象
		Object.defineProperty(obj, key, {
			enumerable: true, //可枚举
			configurable: false, //不能再define
			get() {
				Dep.target && dep.addSub(Dep.target); //暂存watcher, 添加完移除
				return val;
			},
			set(newVal) {
				if (val === newVal) return;
				val = newVal;
				childObj = observe(newVal); //新的值是object的话，进行监听
				dep.notify(); //通知所有订阅者
			}
		});
	}
}

function observe(data) {
	if (!data || typeof data !== 'object') return;
	return new Observer(data);
}



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_mvvm__ = __webpack_require__(2);


const vm = new __WEBPACK_IMPORTED_MODULE_0__src_mvvm__["a" /* default */]({
	el: '#vue-app',
	data: {
		word: 'Hello World!'
	},
	methods: {
		sayHi() {
			this.word = 'Hi, everybody!';
			alert(1);
		}
	}
});

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compile__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observer__ = __webpack_require__(0);



class MVVM {
	constructor(options = {}) {
		this.$options = options;
		this.$data = this.$options.data;
		let data = this.$data;
		Object.keys(data).forEach(key => {
			this._proxyData(key);
		});
		Object(__WEBPACK_IMPORTED_MODULE_1__observer__["b" /* observe */])(data);
		this.$compile = new __WEBPACK_IMPORTED_MODULE_0__compile__["a" /* default */](options.el || document.body, this);
	}

	//使属性可直接访问
	_proxyData(key) {
		let that = this;
		Object.defineProperty(that, key, {
			configurable: false,
			enumerable: true,
			get() {
				return that.$data[key];
			},
			set(newVal) {
				that.$data[key] = newVal;
			}
		});
	}
}

/* harmony default export */ __webpack_exports__["a"] = (MVVM);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__watcher__ = __webpack_require__(4);


//指令解析器
class Compile {
	constructor(el, vm) {
		this.$vm = vm;
		this.$el = this.isElementNode(el) ? el : document.querySelector(el);
		if (this.$el) {
			this.$fragment = this.nodeToFragment(this.$el);
			this.compileElement(this.$fragment);
			this.$el.appendChild(this.$fragment);
		}
	}

	//获得原生节点的虚拟拷贝
	nodeToFragment(el) {
		let fragment = document.createDocumentFragment();
		let child;
		while (child = el.firstChild) fragment.appendChild(child); //之后el中无child
		return fragment;
	}

	//元素节点类型编译节点
	compileElement(el) {
		Array.from(el.childNodes).forEach(node => {
			let text = node.textContent; //每个子元素的文本
			let reg = /\{\{(.*)\}\}/;

			if (this.isElementNode(node)) {
				//元素节点
				this.compile(node);
			} else if (this.isTextNode(node) && reg.test(text)) {
				//文本节点且匹配'{{ }}'
				this.compileText(node, RegExp.$1);
			}

			// 遍历编译子节点
			if (node.childNodes && node.childNodes.length) this.compileElement(node);
		});
	}

	//编译元素节点
	compile(node) {
		let nodeAttrs = node.attributes;
		Array.from(nodeAttrs).forEach(attr => {
			let attrName = attr.name;
			if (this.isDirective(attrName)) {
				//'v-'前缀
				let exp = attr.value;
				let dir = attrName.substring(2);

				if (this.isEventDirective(dir)) {
					//事件指令
					compileUtil.eventHandler(node, this.$vm, exp, dir);
				} else {
					//普通指令
					compileUtil[dir] && compileUtil[dir](node, this.$vm, exp);
				}
				node.removeAttribute(attrName);
			}
		});
	}

	//编译文本节点
	compileText(node, exp) {
		compileUtil.text(node, this.$vm, exp);
	}

	//是否'v-'前缀
	isDirective(attr) {
		return attr.startsWith('v-');
	}

	//是否事件指令
	isEventDirective(dir) {
		return dir.startsWith('on');
	}

	//判断节点类型
	isElementNode(node) {
		return node.nodeType == 1;
	}
	isTextNode(node) {
		return node.nodeType == 3;
	}
}

//指令处理集合
const compileUtil = {
	//事件处理
	eventHandler(node, vm, exp, dir) {
		let eventType = dir.split(':')[1];
		let fn = vm.$options.methods && vm.$options.methods[exp];
		if (eventType && fn) node.addEventListener(eventType, fn.bind(vm), false);
	},

	text(node, vm, exp) {
		this.bind(node, vm, exp, 'text');
	},
	html(node, vm, exp) {
		this.bind(node, vm, exp, 'html');
	},
	class(node, vm, exp) {
		this.bind(node, vm, exp, 'class');
	},
	model(node, vm, exp) {
		this.bind(node, vm, exp, 'model');

		let val = this._get(vm, exp);
		node.addEventListener('input', e => {
			let newValue = e.target.value;
			if (val === newValue) return;
			this._set(vm, exp, newValue);
			val = newValue;
		});
	},
	bind(node, vm, exp, dir) {
		let updaterFn = updater[dir];

		updaterFn && updaterFn(node, this._get(vm, exp));

		new __WEBPACK_IMPORTED_MODULE_0__watcher__["a" /* default */](vm, exp, (value, oldValue) => {
			updaterFn && updaterFn(node, value, oldValue);
		});
	},

	_get(vm, exp) {
		let val = vm;
		exp = exp.split('.');
		exp.forEach(k => {
			val = val[k];
		}); //非最后一个key，更新val的值
		return val;
	},

	_set(vm, exp, value) {
		let val = vm;
		exp = exp.split('.');
		exp.forEach((k, i) => {
			if (i < exp.length - 1) {
				val = val[k];
			} else {
				val[k] = value;
			}
		});
	}
};

const updater = {
	text(node, value) {
		node.textContent = typeof value == 'undefined' ? '' : value;
	},
	html(node, value) {
		node.innerHTML = typeof value == 'undefined' ? '' : value;
	},
	model(node, value) {
		node.value = typeof value == 'undefined' ? '' : value;
	},
	class(node, value, oldValue) {
		let className = node.className;
		className = className.replace(oldValue, '').replace(/\s$/, '');

		let space = className && String(value) ? ' ' : '';
		node.className = className + space + value;
	}
};

/* harmony default export */ __webpack_exports__["a"] = (Compile);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observer__ = __webpack_require__(0);


class Watcher {
	constructor(vm, exp, cb) {
		this.vm = vm;
		this.cb = cb;
		this.exp = exp;
		this.value = this.get();
	}

	update() {
		let value = this.get(); //取到最新值
		let oldVal = this.value;
		if (value !== oldVal) {
			this.value = value;
			this.cb.call(this.vm, value, oldVal); //执行Compile中绑定的回调，更新视图
		}
	}

	get() {
		__WEBPACK_IMPORTED_MODULE_0__observer__["a" /* Dep */].target = this;
		let value = this.vm[this.exp];
		__WEBPACK_IMPORTED_MODULE_0__observer__["a" /* Dep */].target = null;
		return value;
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Watcher);

/***/ })
/******/ ]);