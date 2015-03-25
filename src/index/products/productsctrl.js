/**
* products Module
*
* 我的宝贝功能模块
*/
var productsmodule=angular.module('productsmodule', ['ionic','starter.services','starter.directives']);
productsmodule.controller('productsCtrl', ['$scope','$ionicBackdrop', '$timeout','$http','$ionicLoading',function($scope,$ionicBackdrop,$timeout,$http,$ionicLoading){
	
	$scope.action = function() {
		$ionicBackdrop.retain();
		$timeout(function() {
			$ionicBackdrop.release();
		}, 1000);
	};
	$scope.products=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33];

	$scope.show= function(){
		$ionicLoading.show({
			template:"loading...",
			duration:2000
		});
	};
	$scope.doRefresh = function() {

		$http.get('/testdata/products.json')

		.success(function(newItems) {
			console.log(newItems);
			$scope.products = newItems;
		})

		.finally(function() {
			// Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	// console.log(0);
}]);