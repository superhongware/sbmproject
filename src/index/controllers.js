var starterctrl = angular.module('starter.controllers', []);
starterctrl.controller('mainviewCtrl', ['$scope', '$rootScope','$ionicLoading', 'myCookie', 'loginCheck', function ($scope,$rootScope, $ionicLoading, myCookie, loginCheck) {


	$rootScope.orgName=loginCheck();




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
	// console.log(myCookie.get("userId"));
	//$ionicHistory  清全部数据
	// .fromTemplate() method
	$rootScope.orgName=loginCheck();
	// console.log($rootScope.orgName);
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






