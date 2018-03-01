;(function (window) {
	//继承父类原型
	function inheritPrototype(Sub, Super) {
		let prototype = Object.create(Super.prototype);
		prototype.constructor = Sub;
		Sub.prototype = prototype;
	};

	/*-------------------------------------------------------------*/

	//用于继承的父类
	function LoopImgs(params) {
		const {$container ,$pre, $next, $tabs, hoverClass, time_gap = 3000} = params;

		this.$container = $container; //图片容器
		this.time_gap = time_gap; //轮播时间
		this.$pre = $pre; //上一张
		this.$next = $next; //下一张
		this.$tabs = $tabs; //选择器
		this.hoverClass = hoverClass; //tab的hover类

		this.$items = $container.children;
		this.oldLen = this.$items.length;
		this.num = 0; //当前索引
		this.timer = null;

		this.init();
	}
	LoopImgs.prototype = {
		constructor: LoopImgs,

		init(){
			this.change();
			this.addEvent();
			this.autoPlay();
		},
		pre(){ //上一张
			this.beforeChange();
			this.num--;
			this.change();
		},
		next(){ //下一张
			this.beforeChange();
			this.num++;
			this.change();
		},
		autoPlay(){ //定时轮播
			if(this.timer){ clearInterval(this.timer); }
			this.timer = setInterval(()=> { this.next(); }, this.time_gap);
		},
		addEvent(){
			const {$container, $tabs, $pre, $next} = this;
			//悬浮停顿
			$container.parentNode.onmouseover = ()=> { clearInterval(this.timer); };
			$container.parentNode.onmouseout = ()=> { this.autoPlay(); };
			//上一张下一张
			if($pre){ $pre.onclick = ()=> { this.pre(); }; }
			if($next){ $next.onclick = ()=> { this.next(); }; }
			//选择器
			if($tabs){
				for(let i = 0 ; i < $tabs.length ; i++){
					$tabs[i].onmouseover = ()=> {
						this.beforeChange();
						this.num = (this.num < this.oldLen) ? i : this.oldLen + i;
						this.change();
					}
				}
			}
		},
		handleNum(){ /*边界检测*/ },
		beforeChange(){ /*切换img之前*/ },
		change(){ /*切换img*/ }
	};

	/*-------------------------------------------------------------*/

	//淡入淡出
	function FadeLoopImgs(params) { LoopImgs.call(this, params); }
	inheritPrototype(FadeLoopImgs, LoopImgs);

	FadeLoopImgs.prototype.handleNum = function(){
		const len = this.oldLen;
		if(this.num < 0){ this.num = len - 1; }
		if(this.num > len - 1){ this.num = 0; }
	};
	FadeLoopImgs.prototype.beforeChange = function(){
		const {$items, $tabs, hoverClass, num} = this;
		$items[num].style.zIndex = '1';
		$items[num].style.opacity = '0';
		if($tabs){ $tabs[num].classList.remove(hoverClass); }
	};
	FadeLoopImgs.prototype.change = function(){
		this.handleNum();
		const {$items, $tabs, hoverClass, num} = this;
		$items[num].style.zIndex = '2';
		$items[num].style.opacity = '1';
		if($tabs){ $tabs[num].classList.add(hoverClass); }
	};

	/*-------------------------------------------------------------*/

	//无缝滑动
	function SlideLoopImgs(params) {
		LoopImgs.call(this, params);
		this.itemWidth = this.$items[0].offsetWidth;

		let _copy = this.$container.cloneNode(true);
		for(let i = 0 ; i < this.oldLen; i++)
			this.$container.appendChild(_copy.children[0]);
		this.newLen = this.$container.children.length;
		this.$container.style.width = this.itemWidth * this.newLen + "px";
	}
	inheritPrototype(SlideLoopImgs, LoopImgs);

	SlideLoopImgs.prototype.handleNum = function(){
		let {num, oldLen, newLen} = this;
		if(num == 0){ this.num = oldLen; }
		if(num == newLen - 1){ this.num = oldLen - 1; }
	};
	SlideLoopImgs.prototype.beforeChange = function(){
		this.handleNum();
		let {$container, num, itemWidth} = this;
		$container.style.transition = "0s";
		$container.style.webkitTransition = "0s";
		$container.style.left = -num * itemWidth + "px";
	};
	SlideLoopImgs.prototype.change = function(){
		setTimeout(()=> {
			let {$container, num, oldLen, itemWidth, $tabs, hoverClass} = this;
			let tabNum = (num >= oldLen) ? (num - oldLen) : num;

			$container.style.transition = "1s";
			$container.style.webkitTransition = "1s";
			$container.style.left = -num * itemWidth + "px";

			if($tabs){
				for(let i = 0 ; i < $tabs.length ; i++)
					$tabs[i].classList.remove(hoverClass);
				$tabs[tabNum].classList.add(hoverClass);
			}
		},30);
	};

	/*-------------------------------------------------------------*/

	/*工厂*/
	function LoopImgsFactory(type, params) {
		switch (type){
			case 'slide': return new SlideLoopImgs(params);
			case 'fade': return new FadeLoopImgs(params);
		}
	}
	window.LoopImgsFactory = LoopImgsFactory;
})(window);