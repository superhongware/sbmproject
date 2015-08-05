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

			if($scope.setdata.oldPassword===''){
				$(".error-tip").eq(0).children(".rect").text('旧密码不允许为空');
				$(".error-tip").eq(0).show();
				return;
			}

			if($scope.setdata.newPassword===""){
				$(".error-tip").eq(1).children(".rect").text('新密码不允许为空');
				$(".error-tip").eq(1).show();
				return;
			}else if($scope.setdata.newPassword.length<6 || $scope.setdata.newPassword.length>24){
				$(".error-tip").eq(1).children(".rect").text('用户密码长度在6~24之间');
				$(".error-tip").eq(1).show();
				return;
			}else if($scope.setdata.newPassword!==$scope.setdata.newPassword1){
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
					if(data.map.errorMsg === "密码错误"){
						$(".error-tip").eq(0).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(0).show();
					}else if(data.map.errorMsg === "密码修改失败"){
						$(".error-tip").eq(2).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(2).show();
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
.controller('shopManage', ['$rootScope', '$scope', '$state', '$http', 'SBMJSONP', 'getDataComm', '$ionicPopup', 'showedition', 'shouquan','shouquanClick',
function($rootScope, $scope, $state, $http, SBMJSONP, getDataComm, $ionicPopup, showedition, shouquan,shouquanClick) {
	$scope.orgdatas = {
		orgName: $rootScope.orgName,
		pageNo: 1,
		pageSize: 50
	};
	$scope.orgdatas.method = "softbanana.app.shop.search";
	var api = SBMJSONP("searchShop", $scope.orgdatas);
	// $scope.datacomm = getDataComm;
	$http.jsonp(api.url)
		.success(function(data) {
			console.log(0);
			console.log(['店铺', data]);
			$scope.shopList = data;
			for (var i in $scope.shopList.shops) {
				var iplat = $scope.shopList.shops[i].plat;
				$scope.shopList.shops[i].imgsrc = getDataComm.platObj[iplat].imgSrc;
				$scope.shopList.shops[i].isInvalid = ($scope.shopList.shops[i].isInvalid === "1");
			}
		})
		.error(function(status, response) {
			console.log("连接失败");
		});


	$scope.showediticon = function(index) {
		showedition(index);
	};


	$scope.del = function(shopplat, shopname) {
		var myPopup = $ionicPopup.show({
			template: '删除店铺将无法获取宝贝、订单也无法分享店铺中的宝贝详情，您确定要删除吗？',
			// title: '提示',
			buttons: [{
				text: '取消'
			}, {
				text: '<b>确定</b>',
				type: 'button-energized',
				onTap: function(e) {
					$scope.delshop(shopplat, shopname);
				}
			}]
		});
	};

	$scope.goon = shouquanClick;
	
	$scope.delshop = function(shopplat, shopname) {
		$scope.delshopinfo = {
			orgName: $rootScope.orgName,
			plat: shopplat,
			shopName: shopname
		};
		$scope.delshopinfo.method = "softbanana.app.shop.delete";
		var api = SBMJSONP("deleteShop", $scope.delshopinfo);
		$http.jsonp(api.url)
			.success(function(data) {
				if (data.isSuccess) {
					for (var i in $scope.shopList.shops) {
						if ($scope.shopList.shops[i].shopName == $scope.delshopinfo.shopName) {
							$scope.shopList.shops.splice(i, 1);
						}
					}
				} else {
					console.log(data.map.errorMsg);
				}
			})
			.error(function(status, response) {
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

.controller('shopsCtrl', ['$rootScope', '$scope', '$state','$ionicNavBarDelegate','shouquan','shouquanClick', function($rootScope, $scope, $state,$ionicNavBarDelegate,shouquan,shouquanClick){
		// //有赞
		// $scope.youzan = shouquan.KDT;
		// //微店
		// $scope.weidian = shouquan.WD;
		// //淘宝
		// $scope.taobao = shouquan.TAOBAO;
		// //京东
		// $scope.jingdong = shouquan.JINGD;
		// //拍拍
		// $scope.paipai = shouquan.PAIPAI;
		// //一号店
		// $scope.yihaodian = shouquan.YHD;
		// //当当
		// $scope.dangdang = shouquan.DANGDANG;


		//直接进入viewshopCtrl页  会没有返回按钮  返回shop页后  shop页的返回将不是回首页  这边加上这个让shop页的返回，回到首页  查看viewshopCtrl
		if($rootScope.homeisindex==="viewshop"){
			$ionicNavBarDelegate.showBackButton(false);
		}
		$scope.showbackbtn=!$ionicNavBarDelegate.showBackButton();
		$scope.goback=function(){
			$state.go("home");
		}

		//授权按钮点击
		$scope.shouquanclick=shouquanClick;
		// function(plat){

		// 	if (plat==='KDT'||plat==='WD'){

		// 		$state.go('viewshop',{url:shouquan[plat]});


		// 	}else if (navigator.userAgent.match("iPhone")||navigator.userAgent.match("iPod")||navigator.userAgent.match("iPad")){

		// 		// $state.go('viewshop',{url:shouquan[plat]});
		// 		try{
		// 			JavaScriptInterface.openWebWith(shouquan[plat]);
		// 		}catch(e){

		// 		};
		// 		$state.go('home');

		// 	}else{
		// 		$state.go('shouquanhelp');
		// 	}
		// }

}])

.factory('shouquanClick', ['$rootScope','$state','shouquan', function($rootScope,$state,shouquan){
	return function shouquanClick(plat){
		if (plat==='KDT'||plat==='WD'){

			$state.go('viewshop',{url:shouquan[plat]});


		}else if(plat==='TAOBAO'){
			var url="https://oauth.taobao.com/authorize?response_type=code&client_id=23127514&redirect_uri=http://baobeixiu.play.admin.jaeapp.com/bbxShopNameIsExists&view=wap&state=app"+$rootScope.orgName
			
			$state.go('viewshop',{url:url});


		}else if (navigator.userAgent.match("iPhone")||navigator.userAgent.match("iPod")||navigator.userAgent.match("iPad")){

			// $state.go('viewshop',{url:shouquan[plat]});
			try{
				JavaScriptInterface.openWebWith(shouquan[plat]);
			}catch(e){

			};
			$state.go('home');

		}else{
			$state.go('shouquanhelp');
		}
	};
}])

.controller('viewshopCtrl', ['$rootScope','$scope','$state','$stateParams','$ionicNavBarDelegate',function($rootScope,$scope,$state,$stateParams,$ionicNavBarDelegate){

	//检测返回按钮是否显示，不显示就显示回店铺页的按钮
	$scope.showbackbtn=!$ionicNavBarDelegate.showBackButton();
	//直接进入此页  会没有返回按钮  返回shop页后  shop页的返回将不是回首页  这边加上这个让shop页的返回，回到首页  查看shopsCtrl
	if(!$rootScope.homeisindex||$rootScope.homeisindex==="viewshop"){
		$rootScope.homeisindex="viewshop";
	}
	$scope.goback=function(){
		$state.go("shops");
	}

	//店铺授权
	$(".viewtemplate").append('<iframe style="overflow-x:auto;overflow-y:auto;" height='+($(window).height()-44)+' class="viewbox" src='+$stateParams.url+' frameborder="0"></iframe>');
	$scope.viewbtnneam="首页";
	$scope.viewneam="店铺授权";
	$scope.viewbtn=function(){
		$state.go('home');
	};

}])


.controller('showCtrl', ['$scope','$state', '$ionicPopup', 'myCookie', 'loginCheck',function($scope, $state, $ionicPopup, myCookie, loginCheck) {



}])
.controller('taoxiaopuCtrl', ['$scope', '$rootScope','$state','shouquan',function($scope, $rootScope,$state,shouquan) {
		var url="https://oauth.taobao.com/authorize?response_type=code&client_id=23127514&redirect_uri=http://baobeixiu.play.admin.jaeapp.com/bbxShopNameIsExists&view=wap&state=app"+$rootScope.orgName


	$scope.gotaoxiaopu=function(){
		// var url=location.origin+"/#sqsuccess";
		// JavaScriptInterface.openWebWith(url);
		$state.go('viewshop',{url:url});
	}

	$scope.gotosafaribuy=function(){
		try{
			JavaScriptInterface.openWebWith(shouquan['TAOBAO']);
		}catch(e){

		};
	}

	$scope.goback=function(){
		console.log(window.location.href.split("#")[0]+"#/viewshop/"+url)
		window.parent.location.href=window.location.href.split("#")[0]+"#/viewshop/https:%252F%252Foauth.taobao.com%252Fauthorize%3Fresponse_type=code&client_id=23127514&redirect_uri=http:%252F%252Fbaobeixiu.play.admin.jaeapp.com%252FbbxShopNameIsExists&view=wap&state=appbanana";
	}


}])
.controller('sqsuccessCtrl', ['$scope','$state', function($scope,$state){
	// $state.go("home")

	$scope.letsgohome=function(){
		window.parent.location.href=window.location.href.split("#")[0]+"#/home";
	}
}])
;




// http://localhost:3000/#/viewshop/https:%252F%252Foauth.taobao.com%252Fauthorize%3Fresponse_type=code&client_id=23127514&redirect_uri=http:%252F%252Fbaobeixiu.play.admin.jaeapp.com%252FbbxShopNameIsExists&view=wap&state=appbanana

// http://localhost:3000/#/viewshop/https%3A%2F%2Foauth.taobao.com%2Fauthorize%3Fresponse_type%3Dcode%26client_id%3D23127514%26redirect_uri%3Dhttp%3A%2F%2Fbaobeixiu.play.admin.jaeapp.com%2FbbxShopNameIsExists%26view%3Dwap%26state%3Dappbanana












