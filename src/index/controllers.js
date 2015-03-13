angular.module('starter.controllers', [])
.controller('mainviewCtrl', ['$scope','$state','myCookie','hrefGo', function($scope,$state,myCookie,hrefGo){

	// $scope.$on('$stateChangeStart',function(evt, toState, toParams, fromState, fromParams) {
	// 	// console.log(toState.controller);
	// 	$scope.navbarhide=toState.controller!=="indexCtrl"?false:true;
	// });
	$scope.hrefGo=hrefGo;
	$scope.$on('$stateChangeStart',function(evt, toState, toParams, fromState, fromParams) {
		// console.log(toState.controller);
		$scope.navbarhide=toState.controller!=="indexCtrl"?false:true;
	});


}])

//首页
.controller('indexCtrl', ['$scope','myCookie', function($scope,myCookie){

	// userName
	console.log(myCookie.get("userId"));
}])

//我的宝贝
.controller('productsCtrl', ['$scope','$ionicBackdrop', '$timeout','$http',function($scope,$ionicBackdrop,$timeout,$http){
	$scope.action = function() {
		$ionicBackdrop.retain();
		$timeout(function() {
			$ionicBackdrop.release();
		}, 1000);
	};
	$scope.products=[1,2,3];

	$scope.shouldShowDelete=true;

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
}])


//登录页
.controller('LoginCtrl', ['$scope','$rootScope', function($scope,$rootScope){
	$rootScope.viewanimate="gogogo";
	$scope.test=[1,2,3,4,5];
}])


//注册页
.controller('sign_upCtrl', ['$scope','$rootScope','$state',"$http",function($scope,$rootScope,$state,$http){
	$rootScope.viewanimate="goback";

	$scope.sign_up=function(){
		// var data={
		// 	nick:"softbanana",
		// 	name:"softbanana",
		// 	method:"softbanana.app.user.regist"
		// }
		// $http.post("http://api.softbanana.com/openApi/dyncSoftBanana/app/registUser",data)
		// .success(function(data){
		// 	console.log(data);
		// })
		// .error(function(error){
		// 	console.log(error);
		// })
		$state.go("home.shopinfo.authorization");
		$rootScope.viewanimate="gogogo";
	};

	$scope.sign_upForm={
		
	};
}]);