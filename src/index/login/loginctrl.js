/**
* loginmodule Module
*
* 登录注册功能
*/
var loginmodule=angular.module('loginmodule', ['ionic','starter.services','starter.directives']);
loginmodule.controller('LoginCtrl', ['$scope','loginSubmit', function($scope,loginSubmit) {
	// $rootScope.viewanimate="gogogo";
	// $scope.urldata=loginSubmit();
	$scope.logindata = {
		orgName: "work",
		userName: "admin",
		password: "admin",
	};
	$scope.loginSubmit = loginSubmit;

}])

//注册页
.controller('sign_upCtrl', ['$scope', '$state', '$ionicPopup', function($scope, $state, $ionicPopup) {
	// $rootScope.viewanimate="goback";
	$scope.sign_up = function() {
		$ionicPopup.show({
			title: "注册成功",
			template: "注册消息已发送到邮箱，请妥善保管！",
			buttons: [{
				text: "我知道了",
				type: "button-energized",
			}]
		});
	};


}]);