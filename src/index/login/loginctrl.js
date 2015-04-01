/**
 * loginmodule Module
 *
 * 登录注册功能
 */
var loginmodule = angular.module('loginmodule', ['ionic', 'starter.services', 'starter.directives']);
loginmodule.controller('LoginCtrl', ['$scope', 'loginSubmit', function($scope, loginSubmit) {
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
.controller('sign_upCtrl', ['$scope', '$state', '$ionicPopup', "$http", "SBMJSONP", function($scope, $state, $ionicPopup, $http, SBMJSONP) {
	// $rootScope.viewanimate="goback";
	$scope.yourdata = {
		orgName: "",
		userName: "",
		password: "",
		phone: "",
		email: ""
	};
	$scope.sign_up = function() {
		$scope.yourdata.method = "softbanana.app.user.regist";
		var api = SBMJSONP("registUser", $scope.yourdata);
		console.log(api);
		$http.jsonp(api.url)
			.success(function(data) {
				console.log(data);

				if(data.isSuccess){
					$ionicPopup.show({
						title: "注册成功",
						template: "注册消息已发送到邮箱，请妥善保管！",
						buttons: [{
							text: "我知道了",
							type: "button-energized",
						}]
					});
				}
				
			})
			.error(function(status, response) {
				console.log("连接失败");

			});

	};

}]);