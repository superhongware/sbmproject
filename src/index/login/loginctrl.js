/**
* loginmodule Module
*
* 登录注册功能
*/
var loginmodule=angular.module('loginmodule', ['ionic','starter.services','starter.directives']);
loginmodule.controller('LoginCtrl', ['$scope', '$state', '$http', 'SBMJSONP', 'loginSubmit', function($scope, $state, $http, SBMJSONP, loginSubmit) {
	// $rootScope.viewanimate="gogogo";
	// $scope.urldata=loginSubmit();

	$scope.logindata = {
		orgName: "softbanana",
		userName: "admin",
		password: "admin",
	};

	$scope.loginSubmit = function() {
		$scope.logindata.method = "softbanana.app.user.login";
		var api = SBMJSONP("userLogin",$scope.logindata);
		// console.dir(api);
		$http.jsonp(api.url)
			.success(function(data) {
				console.log("连接成功");
				console.log(data);
			})
			.error(function(status, response) {
				console.log("连接失败");
				console.log(status);
				console.log(response);
			});
	};

}])

//注册页
.controller('sign_upCtrl', ['$scope', '$rootScope', '$state', '$ionicPopup', function($scope, $rootScope, $state, $ionicPopup) {
	// $rootScope.viewanimate="goback";
	$scope.sign_up = function() {
		$ionicPopup.show({
			title: "注册成功",
			template: "注册消息已发送到邮箱，请妥善保管！",
			buttons: [{
				text: "我知道了",
				type: "button-energized",
				onTap: function(e) {
					$state.go("shops");
				}
			}]
		});
	};

	$scope.sign_upForm = {

	};
}]);