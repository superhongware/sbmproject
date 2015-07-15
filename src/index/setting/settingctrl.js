/**
 * settingmodule Module
 *
 * 设置功能模块
 */
var settingmodule = angular.module('settingmodule', ['ionic', 'starter.services', 'starter.directives']);
settingmodule.controller('settingCtrl', [
'$scope', '$ionicPopup','$state', 'myCookie', 'loginCheck','TBAPI',
function($scope, $ionicPopup,$state, myCookie, loginCheck,TBAPI) {

	//隐藏淘宝标题栏
	TBAPI.hideTitle();

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
					$state.go("login");
					// loginCheck();
				}
			}]
		});
	};

}])
//设置密码
.controller('setPassword', ['$rootScope', '$scope', '$state', '$http','$ionicLoading' ,'SBMJSONP', function($rootScope, $scope, $state, $http,$ionicLoading, SBMJSONP){
	console.log($rootScope.orgName+","+$rootScope.userName)
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
		console.log($scope.setdata)
		var api = SBMJSONP("updatePassword",$scope.setdata);
		$http.jsonp(api.url)
			.success(function(data){
				console.log(data)
				if(data.isSuccess){
                $ionicLoading.show({
			     template:"修改成功",
		         });
                setTimeout(function(){
                	 $ionicLoading.hide();
                	 $state.go("home");
                },1400)

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
						if(data.isSuccess){
							for(var i in $scope.shopList.shops){
								if($scope.shopList.shops[i].shopName == $scope.delshopinfo.shopName){
									$scope.shopList.shops.splice(i,1);
								}
							}
						}else{
							console.log(data.map.errorMsg);
						}	
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
}])

.controller('shopsCtrl', ['$rootScope', '$scope', '$state', '$http', 'SBMJSONP', 'getDataComm', '$ionicPopup', function($rootScope, $scope, $state, $http, SBMJSONP, getDataComm, $ionicPopup){
		console.log(["orgcode",$rootScope.orgCode]);
		$scope.youzan = "https://open.koudaitong.com/oauth/authorize?client_id=2c436c071a453a55&response_type=code&state=softbanana&redirect_uri=http://api.softbanana.com/openApi/kdtback/"+$rootScope.orgCode+"/kdt";
		$scope.weidian = "https://api.vdian.com/oauth2/authorize?appkey=617938&redirect_uri="+encodeURI("http://api.softbanana.com/openApi/wdback/"+$rootScope.orgCode+"/kdgw")+"&response_type=code&state=STATE";
		// $scope.taobao = "http://fuwu.taobao.com/ser/detail.htm?spm=a1z13.1113643.1113643.15.0AwLbu&service_code=FW_GOODS-1933759&tracelog=search&scm=&ppath=&labels=&qq-pf-to=pcqq.c2c";
		$scope.taobao = "http://fuwu.taobao.com/ser/detail.html?spm=a1z13.1113643.0.0.Wp7gXJ&service_code=FW_GOODS-1000049183&tracelog=search";
		
		$scope.jingdong = "http://fw.jd.com/94404.html";
		$scope.paipai = "http://fw.paipai.com/193744.html";
		//一号店
		$scope.yihaodian="http://fuwu.yhd.com/application/gotoAppDetail.do?appId=3753";
		//当当
		$scope.dangdang="http://fuwu.dangdang.com/appdetail?app_id=2100003535";
		//亚马逊
		$scope.yamaxun="";
}])

.controller('viewshopCtrl', ['$scope','$state','$stateParams',function($scope,$state,$stateParams){
	//店铺授权
	$(".viewtemplate").append('<iframe class="viewbox" src='+$stateParams.url+' frameborder="0"></iframe>');
	$scope.viewbtnneam="首页";
	$scope.viewneam="店铺授权";
	$scope.viewbtn=function(){
		$state.go('home');
	};

}])


.controller('showCtrl', ['$scope','$state', '$ionicPopup', 'myCookie', 'loginCheck',function($scope, $state, $ionicPopup, myCookie, loginCheck) {

	alert(1234);

}]);





















