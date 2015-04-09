/**
 * SBMPS Module
 *
 * Description
 */

var SBMPS = angular.module('SBMPS', ['ui.router', 'starter.services']);

SBMPS.controller('spCtrl', ['$scope', '$http','getRequest','SBMJSONP','p_s', function($scope, $http,getRequest,SBMJSONP,p_s) {

	//购买按钮提示 区分安卓苹果
	if(navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
		$(".screenforbiden").css({"background-image":"url(/img/applegobuy.png)"});
	}else if(navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1){
		$(".screenforbiden").css({"background-image":"url(/img/azgobuy.png)"});
	}

	var getdata={
		orgName:getRequest("orgname"),
		detailId:getRequest("detailid"),
		method:"softbanana.app.detail.search"
	};
	var api= SBMJSONP("searchDetail",getdata);
	$http.jsonp(api.url)
		.success(function(data) {

			var getdata={
				orgName:getRequest("orgname"),
				detailId:getRequest("detailid"),
				plat:data.plat,
				method:"softbanana.app.detailProperty.search"
			};
			var api= SBMJSONP("searchDetaiProperty",getdata);
			$http.jsonp(api.url)
			.success(function(data){
				var i=0;
				var showpagema="";
				for(standa in data.desc.noSalesProperty){
					if(i<8&&data.desc.noSalesProperty[standa].length>0){
						i++;
						showpagema+=standa+":"+data.desc.noSalesProperty[standa][0]+"<br/>";
					}
				}
				$(".showstanda").html(showpagema);


				console.log(data);
			})
			.error(function(data){
				console.log(data);
			});


			$("#buybtn").on("touchend",function(){
				if(navigator.userAgent.match("MicroMessenger")&&data.detailUrl.match("taobao.com")){
					$(".screenforbiden").show();
				}else{
					location.href=data.detailUrl;
				}
			})
			$(".screenforbiden").on("touchstart",function(){
				$(this).hide();
			});


			$("#standabtn").on("touchend",function(){
				if($(this).hasClass("current")){
					$(this).removeClass("current");
					$(".showstanda").removeClass("showstandashow");
				}else{
					$(this).addClass("current");
					$(".showstanda").addClass("showstandashow");
					$("#parmabtn").removeClass("current");
					$(".showpagema").removeClass("showpagemashow");
				}
			});

			$("#parmabtn").on("touchend",function(){
				if($(this).hasClass("current")){
					$(this).removeClass("current");
					$(".showpagema").removeClass("showpagemashow");
				}else{
					$(this).addClass("current");
					$(".showpagema").addClass("showpagemashow");
					$("#standabtn").removeClass("current");
					$(".showstanda").removeClass("showstandashow");
				}
			});


			$(".topbar").on("touchend",function(){
				$(".currenttopbar").removeClass("currenttopbar");
				$(this).addClass("currenttopbar");
			});

			p_s.CreatDomtree(data);
			p_s.init_animation();
		});

	// $http.get("testdata/template1.json")
	// .success(function(data) {
	// 	p_s.CreatDomtree(data);
	// 	// $scope.show = data;
	// 	p_s.init_animation();
	// });

}])

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
