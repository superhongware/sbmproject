/**
 * SBMPS Module
 *
 * Description
 */

// var SBMPS = angular.module('SBMPS', ['ui.router', 'starter.services','ngTouch']);
var SBMPS = angular.module('SBMPS', ['ionic','starter.services']);

SBMPS.controller('spCtrl', ['$scope', '$http', 'getRequest', 'SBMJSONP', 'p_s',  function($scope, $http, getRequest, SBMJSONP, p_s) {

	$scope.showdata="";
	$scope.shownoshowdata=false;
	$scope.showmainbox = false;

	//获取宝贝秀数据
	var getdata = {
		orgName: getRequest("orgname"),
		detailId: getRequest("detailid"),
		method: "softbanana.app.detail.search"
	};
	var api = SBMJSONP("searchDetail", getdata);
	$http.jsonp(api.url)
		.success(function(data) {
			//宝贝秀删除后不执行后面代码
			if(!data.isSuccess){
				$scope.showmainbox = true;
				$scope.shownoshowdata=true;
				return;

			}
			$scope.showdata = data;
			// p_s.CreatDomtree(data);
			$scope.$broadcast("showdataready");
		})
		.error(function(){
			$scope.showmainbox = true;
			$scope.shownoshowdata=true;
		});
	$scope.$on("showdataready",function(){
		setTimeout(function(){
			p_s.init_animation();
		},100);
	});


	$scope.hidePagemaStanda=function(){
		$(".pagema_standa_show").removeClass("pagema_standa_show");
		$(".centerround").removeClass("current");
	};

}])

.controller('spCtrlpre', ['$scope', '$http', 'getRequest', 'SBMJSONP', 'p_s',  function($scope, $http, getRequest, SBMJSONP, p_s) {

		setTimeout(function(){
			p_s.init_animation();
		},100);

}])



//三个点
.directive('threePoints',['$http','threePointData','getRequest','SBMJSONP',function($http, threePointData, getRequest, SBMJSONP) {
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
		templateUrl: 'templates/ps/threepoints.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {

			//购买按钮提示 区分安卓苹果
			if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
				$(".screenforbiden").css({
					"background-image": "url(img/applegobuy.png)"
				});
			} else if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1) {
				$(".screenforbiden").css({
					"background-image": "url(img/azgobuy.png)"
				});
			}

			//三个点数据
			$scope.pinfo="";

			//三个点
			threePointData(function(data){

				console.log(["三个点数据",data]);
				if(!data.desc){
					return;
				}

				$scope.pinfo=data.desc;

				// $scope.pinfo.salesProperty={
				// 	"颜色分类":["紫罗兰","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色"],
				// 	"尺码":["大","中","小"]
				// };

				var pnum=0;
				for (var i in $scope.pinfo.salesProperty) {
					pnum++;
				}
				// $scope.pinfo.pnum={"width":(100/pnum)+"%"};
				$scope.pinfo.textboxstyle=function(index){
					return {"width":(100/pnum)+"%","left":(100/pnum)*index+"%"};
				};
				// $scope.$broadcast("pinfochange");

				// var i = 0;
				// var showpagema = "";

				// for (standa in data.desc.noSalesProperty) {
				// 	if (i < 8 && data.desc.noSalesProperty[standa].length > 0) {
				// 		i++;
				// 		showpagema += standa + ":" + data.desc.noSalesProperty[standa][0] + "<br/>";
				// 	}
				// }
				// $(".showstanda").html(showpagema);
			});


			//购买按钮点击事件
			$scope.buybuybuy=function(url){
				if (navigator.userAgent.match("MicroMessenger") && url.match("taobao.com")) {
					$(".screenforbiden").show();
				} else if(url!==""){
					location.href = url;
				}
			};
			$scope.buywx=function(){
				var getdata = {
						orgName: getRequest("orgname"),
						numIid: getRequest("productid"),
						plat:getRequest("plat"),
						method: "softbanana.app.item.detail.search"
				};
				var api = SBMJSONP("searchItemDetail", getdata);
				$http.jsonp(api.url)
					.success(function(data) {
						//宝贝秀删除后不执行后面代码
						if(!data.isSuccess){
							$scope.showmainbox = true;
							$scope.shownoshowdata=true;
							return;

						}
						$scope.showdata = data;
						var Url = data.item.detailUrl;
						if (navigator.userAgent.match("MicroMessenger") && Url.match("taobao.com")) {
							$(".screenforbiden").show();
						} else if(Url!==""){
							location.href = Url;
						}
						// p_s.CreatDomtree(data);
						$scope.$broadcast("showdataready");
					})
					.error(function(){
						$scope.showmainbox = true;
						$scope.shownoshowdata=true;
					});
				
				// if (navigator.userAgent.match("MicroMessenger") && url.match("taobao.com")) {
				// 	$(".screenforbiden").show();
				// } else if(url!==""){
				// 	location.href = url;
				// }
			};


			$scope.igetitjustgobuynow=function(){
				$(".screenforbiden").hide();
			};

			//standa 切换
			$scope.standaindex=0;
			$scope.standatopbar=function(index){
				$scope.standaindex=index;
			};


			$scope.parma=function(e){
				e.preventDefault();
				// alert(e.srcElement)
				// for(d in e){
				// 	alert(d)
				// }
				console.dir(e);
				if ($(e.srcElement).parent().hasClass("current")) {
					$(e.srcElement).parent().removeClass("current");
					$(".showpagema").removeClass("pagema_standa_show");
				} else {
					$(e.srcElement).parent().addClass("current");
					$(".showpagema").addClass("pagema_standa_show");
					$("#standabtn").removeClass("current");
					$(".showstanda").removeClass("pagema_standa_show");
				}
			};


			$scope.standa=function(e){
				if ($(e.srcElement).parent().hasClass("current")) {
					$(e.srcElement).parent().removeClass("current");
					$(".showstanda").removeClass("pagema_standa_show");
				} else {
					$(e.srcElement).parent().addClass("current");
					$(".showstanda").addClass("pagema_standa_show");
					$("#parmabtn").removeClass("current");
					$(".showpagema").removeClass("pagema_standa_show");
				}

			};



		}
	};
}])

.directive('showBox', ['$http', 'p_s', function($http, p_s) {
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
