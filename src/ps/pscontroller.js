/**
 * SBMPS Module
 *
 * Description
 */

var SBMPS = angular.module('SBMPS', ['ui.router', 'starter.services']);

SBMPS.controller('spCtrl', ['$scope', '$http', 'SBMJSONP','p_s', function($scope, $http, SBMJSONP,p_s) {



			$http.get("testdata/productshow.json")
				.success(function(data) {
					p_s.CreatDomtree(data);
					// $scope.show = data;

					p_s.init_animation();
				});

	// $scope.test= function(){
	// 		$scope.show.current = 1;
	// 		console.log($scope.show.current);

	// }
}])

.factory('p_s',['p_s_temp', function(p_s_temp) {
	function p_s() {
		this.startX = 0;
		this.startY = 0;
		this.startT = 0;
		this.currpage = 0;
		//翻页样式
		this.pagemovetype = 1;
		this.spwidth = $(window).width();
		this.spheight = $(window).height();
		this.pagesize = 0;
		this.pagemoving = 0;

	}

	p_s.prototype.CreatDomtree = function(data) {
		//设置页面数量
		this.pagesize = data.pages.length - 1;
		for (var i = 0; i < data.pages.length; i++) { //正排序
			// for (var i =data.pages.length-1; i >=0 ; i--) {//反排序

			//创建ps_page
			var pagedata = data.pages[i];

			var pageclass = "tmp" + pagedata.tmp;

			var ps_page = $("<div></div>")
				.addClass("beforestart ps_page " + pageclass);

			$("body").append(ps_page);

			//创建ps_img
			if (pagedata.imgs.length > 0) {

				for (var m = 0; m < pagedata.imgs.length; m++) {

					var imgurl = pagedata.imgs[m];

					var imgclass = "ps_img" + (m + 1);

					var ps_img = $("<div></div>")
						.addClass("ps_img " + imgclass)
						.css({
							"background-image": "url(" + imgurl + ")",
							// "background-position":imgdata.translateX+"px "+imgdata.translateY+"px",
						});

					$(ps_page).append(ps_img);

				}
			}

			//创建ps_text
			if (pagedata.texts.length > 0) {

				for (var t = 0; t < pagedata.texts.length; t++) {

					var contentdata = pagedata.texts[t];

					var ps_text = $("<div></div>")
						.addClass("ps_text ps_text" + (t + 1))
						.text(contentdata);

					$(ps_page).append(ps_text);

				}
			}

		}

	};

	p_s.prototype.init_animation = function() {
		
		//位置初始化
		this.pagemovemode("pageinit");

		//绑定touch控制
		this.touchbind();

		//开始
		this.showstart();

		//第一页内部动画
		this.pageinneract();

	};

	p_s.prototype.touchbind = function() {
		var _ = this;

		$("body").on("touchstart", function(e) {
			if (_.pagemoving  === 1) {
				return;
			}else if(_.pagemoving === 2){
				//pagemoving=2 说明动画结束 初始化pagemoving
				_.pagemoving = 0;
			}
			_.startX = e.targetTouches[0].clientX;
			_.startY = e.targetTouches[0].clientY;
			_.startT = e.timeStamp;

		}).on("touchmove", function(e) {
			e.preventDefault();
			if (_.pagemoving) return;
			
			_.moveX = e.targetTouches[0].clientX;
			_.moveY = e.targetTouches[0].clientY;
			_.moveT = e.timeStamp;

			//翻页操作
			_.pagemovemode("pagemove");

		}).on("touchend", function(e) {
			e.preventDefault();

			if (_.pagemoving === 1) {
				return;
			}else if(_.pagemoving === 2){
				//pagemoving=2 说明动画刚结束  此次touch作废
				_.pagemoving = 0;
				return;
			}else{
				_.pagemoving = 1;
			}

			_.endX = e.changedTouches[0].clientX;
			_.endY = e.changedTouches[0].clientY;
			_.endT = e.timeStamp;

			//页面清算
			_.pageclearing();
		});
	};

	p_s.prototype.showstart = function() {
		//全屏图片自适应
		var _ = this;
		if ((_.spwidth / _.spheight) > 0.635) {
			$(".ps_page").addClass("rotation");
		}
		$(".beforestart").removeClass("beforestart");

	};

	//页面清算
	p_s.prototype.pageclearing = function() {
		var action = this.animatemodeclass();
		action = action.animateclearing();
		//清算完运行动画调整页面顺序
		this.pagemovemode(action);
	};

	p_s.prototype.animatemodeclass = function() {
		var _ = this;
		var animatemode,action;
		switch (_.pagemovetype) {
			case 1:
				//上下翻
				 animatemode = {
					unit: _.spheight,
					d: _.moveY - _.startY,
					animatemode: function(index, movenum, time, z) {
						$(".ps_page").eq(index).css({
							"-webkit-transform": "translateY(" + movenum + "px)",
							"-webkit-transition": time + "s",
							"z-index": z
						});
					},
					animateclearing: function() {
						if (_.endY - _.startY > 40 && _.currpage > 0) {
							_.pageIndexRefresh(_.currpage-1);
							// _.currpage--;

							action = "pagechange";
						} else if (_.endY - _.startY < -40 && _.currpage < _.pagesize) {
							_.pageIndexRefresh(_.currpage+1);
							// _.currpage++;
							action = "pagechange";
						} else {
							action = "pagenochange";
						}
						return action;
					}
				};
				break;
			case 2:
				//左右翻
				 animatemode = {
					unit: _.spwidth,
					d: _.moveX - _.startX,
					animatemode: function(index, movenum, time, z) {
						$(".ps_page").eq(index).css({
							"-webkit-transform": "translateX(" + movenum + "px)",
							"-webkit-transition": time + "s",
							"z-index": z
						});
					},
					animateclearing: function() {
						if (_.endX - _.startX > 40 && _.currpage > 0) {
							_.pageIndexRefresh(_.currpage-1);
							action = "pagechange";
						} else if (_.endX - _.startX < -40 && _.currpage < _.pagesize) {
							_.pageIndexRefresh(_.currpage+1);
							action = "pagechange";
						} else {
							action = "pagenochange";
						}
						return action;
					}
				};

				break;
			default:
				break;
		}

		return animatemode;
	};

	p_s.prototype.pageIndexRefresh = function(currentindex) {
		this.currpage = currentindex;
		this.prevpage = currentindex - 1;
		this.nextpage = currentindex + 1;
	};

	// p_s.prototype.pagemove={
	// 	var _ = this,
	// 		animatemode = _.animatemodeclass(),
	// 		d = animatemode.d,
	// 		unit = animatemode.unit;
	// 		animatemode = animatemode.animatemode;

	// 	if(_.currpage !== 0){
	// 		animatemode(prev, d - unit, 0, 1);
	// 	}

	// 	animatemode(curr, 0, 0, 0);

	// 	//最后一页 禁止向下翻 
	// 	if(curr !== _.pagesize){
	// 		animatemode(next, d + unit, 0, 1);
	// 	}
	// }


	p_s.prototype.pagemovemode = function(action) {
		var _ = this,
			animatemode = _.animatemodeclass(),
			curr = _.currpage,
			prev = _.currpage - 1,
			next = _.currpage + 1,
			d = animatemode.d,
			unit = animatemode.unit;
		animatemode = animatemode.animatemode;

		switch (action) {
			case "pagemove":
				//拖动的时页面变化
				// console.log("pagemove pagemoving:" + _.pagemoving)
					//第一页 禁止向上翻 
				if(curr !== 0){
					animatemode(prev, d - unit, 0, 1);
				}

				animatemode(curr, 0, 0, 0);

				//最后一页 禁止向下翻 
				if(curr !== _.pagesize){
					animatemode(next, d + unit, 0, 1);
				}

				break;
			case "pageinit":
				//页面初始化

				$(".ps_page").each(function(index) {
					if (index < curr) {

						animatemode(index, -unit, 0, 1);

					} else if (index > curr) {

						animatemode(index, unit, 0, 1);

					} else {

						animatemode(index, 0, 0, 0);
					}

				});
				break;
			case "pagenochange":
				//拖动结束  页面动画
				//防止第一页 向上翻 会出现最后一张翻到最前的动画
				if(curr !== 0){
					animatemode(prev, -unit, 0.2, 1);
				}

				animatemode(curr, 0, 0.2, 0);

				animatemode(next, unit, 0.2, 1);

				_.pagemoving = 0;
				break;
			case "pagechange":
				$(".ps_page").eq(curr).on("webkitTransitionEnd", function() {
					$(".ps_page").eq(curr).off("webkitTransitionEnd");
					//若pagemoving=0,动画进行中touchmove的话动画结束后touchmove&touchend会继续
					_.pagemoving = 2;
					_.pageinneract();
				});
				animatemode(curr, 0, 0.5, 1);
				break;
			default:
				break;

		}
	};

	p_s.prototype.pageinneract = function(page) {
		var _=this;
		page=$(".ps_page").eq(_.currpage);

		p_s_temp(page);

		// console.log(page)
	};

	return new p_s();
}])


.factory('p_s_temp', function(){
	var p_s_temp=function(page){
		var temp=page[0].className.match(/tmp\w*\s?/)[0].replace(/tmp/,"");
		console.log(temp);

		switch(temp){
			case "ht1":
				console.log(0);
				page.children(".ps_img3").addClass("picanimate2");

				page.children(".ps_img3").on("webkitAnimationEnd",function(){

					$(this).off("webkitAnimationEnd");

					page.children(".ps_img2").addClass("picanimate15");

					page.children(".ps_img2").on("webkitAnimationEnd",function(){
						$(this).off("webkitAnimationEnd");
					});

					page.children(".ps_text1").addClass("picanimate2");

					page.children(".ps_text1").on("webkitAnimationEnd",function(){
						$(this).off("webkitAnimationEnd");
					});
				});

			break;
			case "ht2":


			break;
			default:
				console.log("1"+temp);

			break;
		}

	};
	return p_s_temp;
})


.directive('showBox', ['$http','p_s', function($http,p_s) {
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: "templates/ps/page1.html",
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {

			$http.get("testdata/productshow.json")
				.success(function(data) {
					$scope.show = data;
					$scope.show.current = 0;

					p_s.init_animation();

				});



		}
	};
}]);


// {
// 	"id": "123",
// 	"title": "宝贝秀标题",
// 	"des": "宝贝秀描述",
// 	"img": "img/pic1.png",
// 	"buyurl": "http://www.taobao.com",
// 	"pages": [{
// 		"tmp": 1,
// 		"imgs": [
// 			"img/pic1.png",
// 			"img/pic2.png",
// 			"img/pic1.jpg"
// 		],
// 		"contents": [
// 			"用心做好宝贝手机详情",
// 			"用心做好宝贝手机详情"
// 		]
// 	},{
// 		"tmp": 1,
// 		"imgs": [
// 			"img/pic1.png",
// 			"img/pic2.png",
// 			"img/pic1.jpg"
// 		],
// 		"contents": [
// 			"用心做好宝贝手机详情",
// 			"用心做好宝贝手机详情"
// 		]
// 	}, {
// 		"tmp": 1,
// 		"imgs": [
// 			"img/pic1.png",
// 			"img/pic2.png",
// 			"img/pic1.jpg"
// 		],
// 		"contents": [
// 			"用心做好宝贝手机详情",
// 			"用心做好宝贝手机详情"
// 		]
// 	}]
// }
