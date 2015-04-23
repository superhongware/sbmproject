var starterctrl = angular.module('starter.controllers', []);

starterctrl.controller('mainviewCtrl', ['$scope','$rootScope', '$ionicLoading', 'myCookie', 'loginCheck', function ($scope, $rootScope,$ionicLoading, myCookie, loginCheck) {

	// $scope.$on('$stateChangeStart',function(evt, toState, toParams, fromState, fromParams) {
	// 	// console.log(toState.controller);
	// 	$scope.navbarhide=toState.controller!=="indexCtrl"?false:true;
	// });
	
	//首页隐藏top-nav-bar
	// $scope.$on('$stateChangeStart',function(evt, toState, toParams, fromState, fromParams) {
	// 	// console.log(toState.controller);
	// 	$scope.navbarhide=toState.controller!=="indexCtrl"?false:true;
	// 	$scope.sncybtnhide=toState.controller==="productsCtrl"?false:true;
	// });
	var logininfo=loginCheck();
	if(typeof logininfo !== "object"){
		return;
	}else{
		$rootScope.orgName=logininfo.orgName;
		$rootScope.userName=logininfo.userName;
	}

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
.controller('indexCtrl', ['$scope','$rootScope','loginCheck','myCookie',function($scope,$rootScope,loginCheck,myCookie){
	// userName
	//$ionicHistory  清全部数据
	// .fromTemplate() method
	console.log($rootScope.orgName);
	if($rootScope.orgName===undefined){
		location.href = "preview.html";
	}
	// setTimeout(function(){
	// 	$rootScope.animate = false;
	// },1000);

	//首页动画只登陆时显示一次
	$rootScope.ishow = ($rootScope.ishow===undefined)?true:$rootScope.ishow;
	$rootScope.ishows = ($rootScope.ishows===undefined)?true:$rootScope.ishows;
	$rootScope.iup = ($rootScope.iup===undefined)?true:$rootScope.iup;
	$rootScope.showpic = ($rootScope.showpic===undefined)?true:$rootScope.showpic;
	setTimeout(function(){
		$rootScope.showpic = false;
		$rootScope.ishows = false;
		$rootScope.ishow = false;
		$rootScope.iup = false;
	},2000);
	
}])


.controller('contentCtrl',['$scope','$ionicSideMenuDelegate',function($scope,$ionicSideMenuDelegate){
	$scope.toggleLeft=function(){
		$ionicSideMenuDelegate.toggleLeft();
	};
	$scope.toggleLeft();
}]);











