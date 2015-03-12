angular.module('starter.controllers', [])
.controller('indexCtrl', ['$scope','myCookie', function($scope,myCookie){
	// console.dir(document)

	// userName
	console.log(myCookie.get("userId"));



}])
.controller('mainviewCtrl', ['$scope', function($scope){
}])
.controller('LoginCtrl', ['$scope','$rootScope', function($scope,$rootScope){
	$rootScope.viewanimate="gogogo";
	$scope.test=[1,2,3,4,5];
}])
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