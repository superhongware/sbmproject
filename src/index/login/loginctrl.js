/**
 * loginmodule Module
 *
 * 登录注册功能
 */
var loginmodule = angular.module('loginmodule', ['ionic', 'starter.services', 'starter.directives']);
loginmodule.controller('LoginCtrl', ['$scope', '$rootScope', 'loginSubmit', 'myCookie', 'base64', '$state', function($scope, $rootScope, loginSubmit, myCookie, base64, $state) {
	// $rootScope.viewanimate="gogogo";
	// $scope.urldata=loginSubmit();
	$scope.logindata = {
		orgName: "banana",
		userName: "sunnycao",
		password: "admin",
	};
	
	// $scope.logindata = {
	// 	orgName: "",
	// 	userName: "",
	// 	password: "",
	// };

	$scope.loginSubmit = function(data){
		if($scope.logindata.orgName===""){
			$(".error-tip").eq(0).children(".rect").text("商家名称不允许为空");
			$(".error-tip").eq(0).show();
		}
		if($scope.logindata.userName===""){
			$(".error-tip").eq(1).children(".rect").text("用户名不允许为空");
			$(".error-tip").eq(1).show();
		}
		if($scope.logindata.password===""){
			$(".error-tip").eq(2).children(".rect").text("密码不允许为空");
			$(".error-tip").eq(2).show();
		}
		loginSubmit(data,function(msg){
			myCookie.add("orgName",base64.encode(data.orgName),720);
			myCookie.add("userName",base64.encode(data.userName),720);
			$rootScope.orgName=data.orgName;
			$rootScope.orgCode=msg.user.orgCode;
			// console.log(["$rootScope.orgName",$rootScope.orgName]);
			// console.log(["$rootScope.orgCode",$rootScope.orgCode]);
			// console.log(["myCookie.get orgName",base64.decode(myCookie.get('orgName'))]);
			// console.log(["myCookie.get userName",base64.decode(myCookie.get('userName'))]);
			$state.go("home");
			console.log(["success",msg]);

		},function(msg){
			if(msg == "对应的商家不存在"){
				$(".error-tip").eq(0).children(".rect").text(msg);
				$(".error-tip").eq(0).show();
			}else if(msg == "用户名不存在"){
				$(".error-tip").eq(1).children(".rect").text(msg);
				$(".error-tip").eq(1).show();
			}else if(msg == "密码错误"){
				$(".error-tip").eq(2).children(".rect").text(msg);
				$(".error-tip").eq(2).show();
			}
			console.log(["erroe",msg]);

		});
	};



	$scope.hidetip = function(){
		$(".error-tip").hide();
	};
}])

//注册页
.controller('sign_upCtrl', ['$scope', '$state', '$ionicPopup', "$http", "SBMJSONP", function($scope, $state, $ionicPopup, $http, SBMJSONP) {
	$scope.yourdata = {
		orgName: "",
		userName: "",
		password: "",
		phone: "",
		email: ""
	};
	$scope.sign_up = function() {
		if(($scope.yourdata.password!=="")&&($scope.yourdata.password!==$scope.yourdata.password1)){
			$(".error-tip").eq(3).show();
		}
		var reg0 =  /^1\d{10}$/;
	
		if(!reg0.test($scope.yourdata.phone)&&($scope.yourdata.phone!=="")){
			$(".error-tip").eq(4).show();
		}
		var  reg= /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
		if(!reg.test($scope.yourdata.email)&&($scope.yourdata.email!=="")){
			$(".error-tip").eq(5).show();
		}
		$scope.yourdata.method = "softbanana.app.user.regist";
		var api = SBMJSONP("registUser", $scope.yourdata);
		console.log(api);
		$http.jsonp(api.url)
			.success(function(data) {
				if(data.isSuccess){
					$ionicPopup.show({
						title: "注册成功",
						template: "注册消息已发送到邮箱，请妥善保管！",
						buttons: [{
							text: "我知道了",
							type: "button-energized",
						}]
					});
				}else{
					console.log(data.map.errorMsg);
					if(data.map.errorMsg === "商家名称不允许为空"){
						$(".error-tip").eq(0).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(0).show();
					}else if(data.map.errorMsg === "该商家名称已注册"){
						$(".error-tip").eq(0).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(0).show();
					}else if(data.map.errorMsg === "用户名不允许为空"){
						$(".error-tip").eq(1).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(1).show();
					}else if(data.map.errorMsg === "该商家名称下已注册该用户名"){
						$(".error-tip").eq(1).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(1).show();
					}else if(data.map.errorMsg === "密码不允许为空"){
						$(".error-tip").eq(2).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(2).show();
					}else if(data.map.errorMsg === "手机号不允许为空"){
						$(".error-tip").eq(4).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(4).show();
					}else if(data.map.errorMsg === "Email不允许为空"){
						$(".error-tip").eq(5).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(5).show();
					}
				}
				
			})
			.error(function(status, response) {
				console.log("连接失败");

			});

	};

	$scope.hidetip = function(){
		$(".error-tip").hide();
	};

}]);