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
	showadcheck();

	
	if(typeof Tida !=="undefined"){
		Tida.ready({
			interactId:"", // 互动实列ID type string 若无抽奖模块，此参数无须传入。给错误的实例ID会走错误流程
			module: ["device", "media", "server", "social", "widget", "sensor", "share","buy","draw","im"] // 应用所需要的模块。默认加载所有模块。支持的模块有draw:抽奖;sensor:传感器;buy:交易;device:基础设备接口 social:社交相关 widget:客户端UI
		}, function(){
			// alert(0);
			// Tida.openClient("taobao://h5.m.taobao.com/awp/core/detail.htm?id=45031625539&spm=2014.21758735.0.0")
			// alert(1);
			// options=


			// Tida.hideTitle();

			// Tida.doAuth(function(data){
			// 	alert(JSON.stringify(data));
			// 	if(data.finish){
			// 	// 授权成功 可以顺利调用需要授权的接口了

			// 	}else {
			// 	// 未能成功授权
			// 	}
			// });
		})
	}

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
'$scope','$rootScope','loginCheck','getRequest','myCookie','base64','TBAPI',
function($scope,$rootScope,loginCheck,getRequest,myCookie,base64,TBAPI){

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

	
	TBAPI.showTitle();

}])


.controller('appadoneCtrl', [
'$scope','$rootScope','myCookie',
function($scope,$rootScope,myCookie){

	myCookie.add("youhaveredad","yeah!youhaveredad",24)
	$rootScope.isthereshowad="";

	
}])

//整个app的导航的controller
.controller('navbarCtrl', ['$scope', '$ionicHistory', function($scope,$ionicHistory){
	$scope.myGoBack = function() {
		console.log("00000");
		history.go(-1);
		// $ionicHistory.goBack(-1);

	};

}])

.controller('contentCtrl',['$scope','$ionicSideMenuDelegate',function($scope,$ionicSideMenuDelegate){
	$scope.toggleLeft=function(){
		$ionicSideMenuDelegate.toggleLeft();
	};
	$scope.toggleLeft();
}])



//测试页面
.controller('maintestCtrl', ['$scope', 'checklocalimg2',function($scope,checklocalimg2){
	
	$scope.checklocalimg=function(){
		checklocalimg2(function(image){
			EXIF.getData(e.target.files[0], function() {
				alert(EXIF.pretty(this));
			});
		})
	}
	// console.log(EXIF.)


}])
;











