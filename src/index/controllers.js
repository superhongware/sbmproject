var starterctrl = angular.module('starter.controllers', []);

starterctrl.controller('mainviewCtrl', [
'$scope','$rootScope','$log', '$ionicLoading', 'getRequest', 'loginCheck','showadcheck',
function ($scope, $rootScope,$log,$ionicLoading, getRequest, loginCheck,showadcheck) {

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
	
	loginCheck();
	showadcheck()
	// $scope.show= function(){
	// 	$ionicLoading.show({
	// 		template:"loading...",
	// 		duration:2000
	// 	});
	// };
	// $scope.hide=function(){
	// 	$ionicLoading.hide();
	// };
}])


//首页
.controller('indexCtrl', [
'$scope','$rootScope','loginCheck','getRequest','myCookie','base64',
function($scope,$rootScope,loginCheck,getRequest,myCookie,base64){

	loginCheck();

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


.controller('appadoneCtrl', [
'$scope','$rootScope','myCookie',
function($scope,$rootScope,myCookie){

	myCookie.add("youhaveredad","yeah!youhaveredad",24)
	$rootScope.isthereshowad="";

	
}])

.controller('contentCtrl',['$scope','$ionicSideMenuDelegate',function($scope,$ionicSideMenuDelegate){
	$scope.toggleLeft=function(){
		$ionicSideMenuDelegate.toggleLeft();
	};
	$scope.toggleLeft();
}]);











