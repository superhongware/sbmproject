/**
 * settingmodule Module
 *
 * 设置功能模块
 */
var settingmodule = angular.module('settingmodule', ['ionic', 'starter.services', 'starter.directives']);
settingmodule.controller('settingCtrl', ['$scope', '$ionicPopup', 'myCookie', 'loginCheck',function($scope, $ionicPopup, myCookie, loginCheck) {

	$scope.logout = function() {
		var myPopup = $ionicPopup.show({
			template: '你确定要退出？',
			title: '提示',
			buttons: [{
				text: '取消'
			}, {
				text: '<b>确定</b>',
				type: 'button-energized',
				onTap: function(e) {
					myCookie.delete("orgName");
					loginCheck();
				}
			}]
		});
	};

}])
//设置密码
.controller('setPassword', ['$rootScope', '$scope', '$state', '$http', 'SBMJSONP', function($rootScope, $scope, $state, $http, SBMJSONP){
	$scope.setdata = {
		orgName:$rootScope.orgName,
		userName:$rootScope.userName,
		oldPassword:"",
		newPassword:""
	};
	$scope.setPw = function(){
		if($scope.setdata.newPassword!=$scope.setdata.newPassword1){
			$(".error-tip").eq(2).show();
		}
		$scope.setdata.method = "softbanana.app.password.update";
		var api = SBMJSONP("updatePassword",$scope.setdata);
		$http.jsonp(api.url)
			.success(function(data){
				if(data.isSuccess){
				}else{
					console.log(data.map.errorMsg);
					if(data.map.errorMsg == "旧密码不允许为空"){
						$(".error-tip").eq(0).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(0).show();
					}else if(data.map.errorMsg == "密码错误"){
						$(".error-tip").eq(0).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(0).show();
					}else if(data.map.errorMsg == "密码修改失败"){
						$(".error-tip").eq(2).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(2).show();
					}else if(data.map.errorMsg == "新密码不允许为空"){
						$(".error-tip").eq(1).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(1).show();
					}
				}
			})
			.error(function(status,response){
				console.log("连接失败");
			});

	};
	$scope.hidetip = function(){
		$(".error-tip").hide();
	};

}]);

//商户管理
// .controller('shopManage', ['$rootScope', '$scope', '$state', '$http', 'SBMJSONP', function($rootScope, $scope, $state, $http, SBMJSONP){
// 		$scope.orgdatas = {
// 			orgName:$rootScope.orgName
// 		};
// 		$scope.orgdatas.method = "softbanana.app.shop.search";
// 		var api = SBMJSONP("searchShop",$scope.shopedata);
// 		alert(123)
// 		$http.jsonp(api.url)
// 			.success(function(data){
// 				console.log(data);
// 			})
// 			.error(function(status,response){
// 				console.log("连接失败");
// 			});

	

// }]);
