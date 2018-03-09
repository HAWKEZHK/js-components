(function(window) {
	// 注册的回调函数

	let listener = {
		end: [],
		change: []
	}

	// 工具函数
	let utils = {
		extend(a, b) {
			for (let key in b) {
				if (b.hasOwnProperty(key)) {
					a[key] = b[key];
				}
			}
			return a;
		},
		getMetrics(el) {
			return {
				scrollHeight: document.documentElement.scrollHeight || document.body.scrollHeight,
				scrollTop: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
				clientWidth: document.documentElement.clientWidth,
				clientHeight: document.documentElement.clientHeight
			};
		},
		onCallback(type) {
			listener[type].forEach((cb, i) => {
				cb();
				if (cb.once) {
					listener[type].splice(i, 1);
				}
			});
		}
	}

	// 私有的方法
	let _ = {
		// progress-indicator dom对象
		$el: null,
		// 配置
		$option: {
			color: '#2b85e4'
		},
		// 初始化函数
		init(option) {
			this.$option = utils.extend(this.$option, option);
			this.create(arguments);
			this.onScroll = this.onScroll.bind(this);
			if (document.addEventListener) {
				document.addEventListener('scroll', this.onScroll);
			} else {
				document.attachEvent('onscroll', this.onScroll);
			}
		},
		// 创建dom
		create() {
			this.$el = document.createElement('div');
			this.$el.style.height = '5px';
			this.$el.style.width = '0px';
			this.$el.style.position = 'fixed';
			this.$el.style.top = '0';
			this.$el.style.left = '0';
			this.$el.style.backgroundColor = this.$option.color;
			document.body.appendChild(this.$el);
		},
		// 页面滚动的回调函数
		onScroll() {
			let metrics = utils.getMetrics();
			let curPos = metrics.scrollHeight <= metrics.scrollTop + metrics.clientHeight
				? metrics.clientWidth
				: Math.floor(metrics.clientWidth * (metrics.scrollTop / (metrics.scrollHeight - metrics.clientHeight)));
			this.$el.style.width = curPos + 'px';

			setTimeout(() => {
				if (metrics.scrollHeight <= metrics.scrollTop + metrics.clientHeight) {
					utils.onCallback('end');
				}
				utils.onCallback('change');
			}, 50);
		},
	}
	// 构造函数
	function progressIndicator(option) {
		_.init(option)
	}

	// 公有的方法
	// 该类只有监听结束事件，和改变事件
	// 分别对应 end 和 change
	// 监听类型有三种, 一个只监听一次，一个一直监听， 一个取消监听

	let prop = progressIndicator.prototype;

	prop.on = function (type, fn) {
		let cbs = listener[type];
		let index = cbs.indexOf(fn);
		if (index !== -1) {
			cbs[index] = fn;
		} else {
			cbs.push(fn);
		}
	}

	prop.once = function (type, fn) {
		fn.once = true;
		prop.on(type, fn);
	}
	prop.unsubscribe = function (type, fn) {
		let cbs = listener[type];
		listener[type] = cbs.filter(cb => cb !== fn);
	}

	prop.destoryed = function () {
		if (document.removeEventListener) {
			document.removeEventListener('scroll', _.onScroll);
		} else {
			document.detachEvent('onscroll', _.onScroll);
		}
		document.body.removeChild(_.$el);
	}

	// 最后将该组件挂载在window对象

	window.progressIndicator = progressIndicator;

})(window);