var starterctrl = angular.module('starter.controllers', []);

starterctrl.controller('mainviewCtrl', ['$scope','$rootScope','$log', '$ionicLoading', 'getRequest', 'loginCheck', function ($scope, $rootScope,$log,$ionicLoading, getRequest, loginCheck) {

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
'$scope','$rootScope','loginCheck','getRequest','myCookie',
function($scope,$rootScope,loginCheck,getRequest,myCookie){
	// userName
	//$ionicHistory  清全部数据
	// .fromTemplate() method
	// console.log($rootScope.orgName);
	// if($rootScope.orgName===undefined){
	// 	location.href = "preview.html";
	// }
	//?orgName=work&plat=
	// setTimeout(function(){
	// 	$rootScope.animate = false;
	// },1000);
// myCookie.delete("orgName");

	//淘宝判断
	$rootScope.orgName=getRequest("orgName");
	$rootScope.plat=getRequest("plat");

	if($rootScope.orgName&&$rootScope.plat){
		$rootScope.istaobao=true;
	}else{
		$rootScope.istaobao=false;
	}

	if(!$rootScope.istaobao){
		var logininfo=loginCheck();
		if(typeof logininfo === "object"){
			$rootScope.orgName=logininfo.orgName;
			$rootScope.userName=logininfo.userName;
		}
	}
	// console.log(logininfo)

	
}])


.controller('contentCtrl',['$scope','$ionicSideMenuDelegate',function($scope,$ionicSideMenuDelegate){
	$scope.toggleLeft=function(){
		$ionicSideMenuDelegate.toggleLeft();
	};
	$scope.toggleLeft();
}]);











