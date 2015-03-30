/**
 * SBMPS Module
 *
 * Description
 */

var SBMPS = angular.module('SBMPS', ['ui.router', 'starter.services']);

SBMPS.controller('spCtrl', ['$scope', '$http', 'SBMJSONP', function($scope, $http, SBMJSONP) {
	$http.get("testdata/productshow.json")
		.success(function(data) {
			$scope.show = data;
			$scope.show.current = 0;
			// domtree(data);
			console.log($scope.show.current);
		});


	// $scope.test= function(){
	// 		$scope.show.current = 1;
	// 		console.log($scope.show.current);

	// }
}])

.factory('p_s', ['$swipe', function($swipe) {
	function p_s() {
		this.startX = 0;
		this.startY = 0;
		this.startT = 0;
		this.currentpage = 0;
		//翻页样式
		this.pagemovetype = 1;
		this.spwidth = $(window).width();
		this.spheight = $(window).height();
		this.pagesize = 0;
		this.pagemoving = 0;
	}

	return p_s;
}])

.directive('showBox', function() {
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
			$("body").on("touchstart", function(e) {
				console.log(e);
			});
			$("body").on("touchmove", function(e) {
				console.log(e);
			});
			$("body").on("touchend", function(e) {
				console.log(e);
			});
		}
	};
});