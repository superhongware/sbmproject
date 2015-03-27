/**
* SBMPS Module
*
* Description
*/
var SBMPS=angular.module('SBMPS', []);
SBMPS.controller('spCtrl', ['$scope','$http','domtree', function($scope,$http,domtree){
	$http.get("testdata/productshow.json")
	.success(function(data){
		$scope.show=data;
		// domtree(data);
	});
}])
.directive('showPage', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: function(elem, attr){
			return 'templates/ps/page1.html'},
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
		}
	};
})
.factory('domtree',  function(){
	return function domtree(data){
		for (var i = 0; i < data.pages.length; i++) { //正排序
			// for (var i =data.pages.length-1; i >=0 ; i--) {//反排序

			//创建p_s_page
			var pagedata = data.pages[i]

			var pageclass = "template" + pagedata.tmp;

			var p_s_page = $("<div></div>")
				.addClass("beforestart p_s_page " + pageclass);

			$("body").append(p_s_page);

			// //创建p_s_img
			if (pagedata.imgs.length > 0) {

				for (var m = 0; m < pagedata.imgs.length; m++) {

					var img = pagedata.imgs[m];

					var imgclass = "p_s_img" + (m + 1);

					var p_s_img = $("<div></div>")
						.addClass("p_s_img " + imgclass)
						.css({
							"background-image": "url(" + img + ")",
							// "background-position":imgdata.translateX+"px "+imgdata.translateY+"px",
						})

					$(p_s_page).append(p_s_img);

				};
			};

			// //创建p_s_text
			if (pagedata.contents.length > 0) {

				for (var t = 0; t < pagedata.contents.length; t++) {

					var contentdata = pagedata.contents[t];

					var p_s_text = $("<div></div>")
						.addClass("p_s_text p_s_text" + (t + 1))
						.text(contentdata);

					$(p_s_page).append(p_s_text);

				};
			};

		};

	};
});