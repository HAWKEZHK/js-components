window.onload = function(){
	/*淡入淡出*/
	let $container_1 = document.getElementsByClassName("imgbox")[0];
	let $pre_1 = document.getElementsByClassName("pre")[0];
	let $next_1 = document.getElementsByClassName("next")[0];
	let $tabs_1 = Array.from(document.getElementsByClassName("tab")[0].children);
	let hoverClass_1 = "on", time_gap_1 = 3000;
	const obj_1 = {
		$container: $container_1 ,
		$pre: $pre_1,
		$next: $next_1,
		$tabs: $tabs_1,
		hoverClass: hoverClass_1,
		time_gap: time_gap_1
	};
	LoopImgsFactory('fade', obj_1);

	/*无缝隙滑动*/
	let $container_2 = document.getElementsByClassName("imgbox")[1];
	let $pre_2 = document.getElementsByClassName("pre")[1];
	let $next_2 = document.getElementsByClassName("next")[1];
	let $tabs_2 = Array.from(document.getElementsByClassName("tab")[1].children);
	let hoverClass_2 = "on", time_gap_2 = 3000;
	const obj_2 = {
		$container: $container_2 ,
		$pre: $pre_2,
		$next: $next_2,
		$tabs: $tabs_2,
		hoverClass: hoverClass_2,
		time_gap: time_gap_2
	};
	LoopImgsFactory('slide', obj_2);
};
