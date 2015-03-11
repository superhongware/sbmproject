angular.module('starter.controllers', [])
.controller('mainviewCtrl', ['$scope', function($scope){
}])
.controller('LoginCtrl', ['$scope','$rootScope', function($scope,$rootScope){
	$rootScope.viewanimate="gogogo";
	$scope.test=[1,2,3,4,5];
}])
.controller('sign_upCtrl', ['$scope','$rootScope', function($scope,$rootScope){
	$rootScope.viewanimate="goback";
	$scope.sign_upForm={
		
	};
}]);