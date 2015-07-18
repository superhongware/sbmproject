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
.controller('setPassword', ['$rootScope', '$scope', '$state', '$http','$ionicLoading' ,'$ionicPopup','SBMJSONP', 
	function($rootScope, $scope, $state, $http,$ionicLoading, $ionicPopup,SBMJSONP){
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

			$ionicLoading.show({
				template:"正在修改请稍等..."
			});
			
			$http.jsonp(api.url)
			.success(function(data){
				console.log(data)
				$ionicLoading.hide();
				
				if(data.isSuccess){

					var loginsuccess=$ionicPopup.show({
						title: "提示信息",
						template: "密码修改成功,请重新登录",
						buttons: [{
							text: '好的',
							type: "button-energized",
						}]
					});
					loginsuccess.then(function(res){
						$state.go("login");
					})

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
.controller('shopManage', ['$rootScope', '$scope', '$state', '$http', 'SBMJSONP', 'getDataComm', '$ionicPopup','showedition','shouquan',
	function($rootScope, $scope, $state, $http, SBMJSONP, getDataComm, $ionicPopup,showedition,shouquan){
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
			console.log(['店铺',data]);
			$scope.shopList = data;
			for (var i in $scope.shopList.shops){
				var iplat = $scope.shopList.shops[i].plat;
				$scope.shopList.shops[i].imgsrc = getDataComm.platObj[iplat].imgSrc;
				$scope.shopList.shops[i].isInvalid=($scope.shopList.shops[i].isInvalid==="1");
			}
		})
		.error(function(status,response){
			console.log("连接失败");
		});


		$scope.showediticon=function(index){
			showedition(index);
		};
		

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
			$state.go("shouquanhelp")

					// $state.go("viewshop",{url:shouquan[shopplat]})

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
		var text=$(".feedbacktext").val();
		if(text.length>0){
			$scope.feeddata.method = "softbanana.app.feedback.save";
			var api = SBMJSONP("saveFeedBack",$scope.feeddata);
			$http.jsonp(api.url)
			.success(function(data){
				console.log(data)
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
		}
		else{
			$ionicPopup.show({
				template: "请输入反馈信息",
				buttons: [{
					text: "确定",
					type: "button-energized",
				}]
			});
		}
		
	};
}])

.controller('shopsCtrl', ['$rootScope', '$scope', '$state','shouquan', function($rootScope, $scope, $state,shouquan){
		//有赞
		$scope.youzan = shouquan.KDT;
		//微店
		$scope.weidian = shouquan.WD;
		//淘宝
		$scope.taobao = shouquan.TAOBAO;
		//京东
		$scope.jingdong = shouquan.JINGD;
		//拍拍
		$scope.paipai = shouquan.PAIPAI;
		//一号店
		$scope.yihaodian = shouquan.YHD;
		//当当
		$scope.dangdang = shouquan.DANGDANG;


	}])

.controller('viewshopCtrl', ['$scope','$state','$stateParams',function($scope,$state,$stateParams){
	//店铺授权
	$(".viewtemplate").append('<iframe style="overflow-x:auto;overflow-y:auto;" class="viewbox" src='+$stateParams.url+' frameborder="0"></iframe>');
	$scope.viewbtnneam="首页";
	$scope.viewneam="店铺授权";
	$scope.viewbtn=function(){
		$state.go('home');
	};

}])


.controller('showCtrl', ['$scope','$state', '$ionicPopup', 'myCookie', 'loginCheck',function($scope, $state, $ionicPopup, myCookie, loginCheck) {

	alert(1234);

}])
.controller('taoxiaopuCtrl', ['$scope', '$rootScope','$state',function($scope, $rootScope,$state) {
	$scope.gotaoxiaopu=function(){
		var url="https://oauth.taobao.com/authorize?response_type=code&client_id=23127514&redirect_uri=http://baobeixiu.play.admin.jaeapp.com/bbxShopNameIsExists&view=wap&state=app"+$rootScope.orgName
		JavaScriptInterface.openWebWith(url);
		// $state.go('viewshop',{url:url});
	}

}])
;





















