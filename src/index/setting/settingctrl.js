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

		if(($scope.setdata.newPassword!=$scope.setdata.newPassword1)&&($scope.setdata.newPassword!=="")){
			$(".error-tip").eq(2).show();
			return;
		}
		$scope.setdata.method = "softbanana.app.password.update";
		var api = SBMJSONP("updatePassword",$scope.setdata);
		$http.jsonp(api.url)
			.success(function(data){
				if(data.isSuccess){
				}else{
					console.log(data.map.errorMsg);
					if(data.map.errorMsg === "旧密码不允许为空"){
						$(".error-tip").eq(0).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(0).show();
					}else if(data.map.errorMsg === "密码错误"){
						$(".error-tip").eq(0).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(0).show();
					}else if(data.map.errorMsg === "密码修改失败"){
						$(".error-tip").eq(2).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(2).show();
					}else if(data.map.errorMsg === "新密码不允许为空"){
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

}])

//商户管理
.controller('shopManage', ['$rootScope', '$scope', '$state', '$http', 'SBMJSONP', 'getDataComm', '$ionicPopup', function($rootScope, $scope, $state, $http, SBMJSONP, getDataComm, $ionicPopup){
		$scope.orgdatas = {
			orgName: $rootScope.orgName,
			pageNo: 1,
			pageSize: 50
		};
		$scope.orgdatas.method = "softbanana.app.shop.search";
		var api = SBMJSONP("searchShop",$scope.orgdatas);
		// $scope.datacomm = getDataComm;
		$http.jsonp(api.url)
			.success(function(data){
				console.log(0);
				console.log(data);
				$scope.shopList = data;
				for (var i in $scope.shopList.shops){
					var iplat = $scope.shopList.shops[i].plat;
					$scope.shopList.shops[i].imgsrc = getDataComm.platObj[iplat].imgSrc;
				}
			})
			.error(function(status,response){
				console.log("连接失败");
			});

			$scope.del = function(shopplat,shopname){
				var myPopup = $ionicPopup.show({
					template: '删除店铺将无法获取宝贝、订单也无法分享店铺中的宝贝详情，您确定要删除吗？',
					// title: '提示',
					buttons: [{
						text: '取消'
					}, {
						text: '<b>确定</b>',
						type: 'button-energized',
						onTap: function(e) {
							$scope.delshop(shopplat,shopname);
						}
					}]
				});
			};

			$scope.goon = function(shopplat,shopname){
				if(shopplat=="TAOBAO"){
					location.href = "http://fuwu.taobao.com/ser/detail.htm?spm=a1z13.1113643.1113643.15.0AwLbu&service_code=FW_GOODS-1933759&tracelog=search&scm=&ppath=&labels=&qq-pf-to=pcqq.c2c";
				}else if(shopplat=="JINGD"){
					location.href = "http://fw.jd.com/94404.html";
				}else if(shopplat=="PAIPAI"){
					location.href = "http://fuwu.paipai.com/appstore/ui/my/app/appdetail.xhtml?appId=331404&PTAG=40012.5.1&LOGINTAG=1";
				}
			};
			$scope.delshop = function(shopplat,shopname){
				$scope.delshopinfo = {
					orgName:$rootScope.orgName,
					plat:shopplat,
					shopName:shopname
				};
				$scope.delshopinfo.method = "softbanana.app.shop.delete";
				var api = SBMJSONP("deleteShop",$scope.delshopinfo);
				$http.jsonp(api.url)
					.success(function(data){
					})
					.error(function(status,response){
						console.log("连接失败");
					});
			};
}])

//用户反馈
.controller('feedBack', ['$rootScope', '$scope', '$state', '$http', 'SBMJSONP', 'getDataComm', '$ionicPopup', function($rootScope, $scope, $state, $http, SBMJSONP, getDataComm, $ionicPopup){
		$scope.feeddata = {
				orgName: $rootScope.orgName,
				terminalInfo: navigator.userAgent,
				text: ""
			};
		$scope.feedback = function(){
			$scope.feeddata.method = "softbanana.app.feedback.save";
			var api = SBMJSONP("saveFeedBack",$scope.feeddata);
			$http.jsonp(api.url)
				.success(function(data){
					$ionicPopup.show({
						template: "已收录，感谢您的反馈。",
						buttons: [{
							text: "确定",
							type: "button-energized",
						}]
					});
				})
				.error(function(status,response){
					console.log("连接失败");
				});
			};
}]);
