var starterctrl = angular.module('starter.controllers', []);
starterctrl.controller('mainviewCtrl', ['$scope', '$ionicLoading', 'myCookie', 'loginCheck', function ($scope, $ionicLoading, myCookie, loginCheck) {

	// $scope.$on('$stateChangeStart',function(evt, toState, toParams, fromState, fromParams) {
	// 	// console.log(toState.controller);
	// 	$scope.navbarhide=toState.controller!=="indexCtrl"?false:true;
	// });
	loginCheck();
	//首页隐藏top-nav-bar
	// $scope.$on('$stateChangeStart',function(evt, toState, toParams, fromState, fromParams) {
	// 	// console.log(toState.controller);
	// 	$scope.navbarhide=toState.controller!=="indexCtrl"?false:true;
	// 	$scope.sncybtnhide=toState.controller==="productsCtrl"?false:true;
	// });
	$scope.show= function(){
		$ionicLoading.show({
			template:"loading...",
			duration:2000
		});
	};
	$scope.hide=function(){
		$ionicLoading.hide();
	};

}])

//首页
.controller('indexCtrl', ['$scope','loginCheck',function($scope,loginCheck){
	// userName
	// console.log(myCookie.get("userId"));
	//$ionicHistory  清全部数据
  // .fromTemplate() method
	loginCheck();

}])

//我的宝贝
.controller('productsCtrl', ['$scope','$ionicBackdrop', '$timeout','$http','$ionicLoading',function($scope,$ionicBackdrop,$timeout,$http,$ionicLoading){
	
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
}])

.controller('contentCtrl',['$scope','$ionicSideMenuDelegate',function($scope,$ionicSideMenuDelegate){
	$scope.toggleLeft=function(){
		$ionicSideMenuDelegate.toggleLeft();
	};
	$scope.toggleLeft();
}])

.controller('editpagesCtrl',['$scope','$ionicLoading',function($scope,$ionicLoading){
	$scope.show= function(){
		$ionicLoading.show({
			template:"正在保存...",
			duration:2000
		});
	};
	$scope.showdata={
		page:1
	};


}])
.controller('pagetemp1Ctrl',['$scope','$state',function($scope,$state){
	console.log($state);
	console.log("pagetemp1");
	// console.log("editerCtrl");

}])
.controller('pagetemp2Ctrl',['$scope','$state',function($scope,$state){
	// console.log($state);
	console.log("pagetemp2");
	// console.log("editerCtrl");

}]);






