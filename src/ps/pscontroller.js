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
