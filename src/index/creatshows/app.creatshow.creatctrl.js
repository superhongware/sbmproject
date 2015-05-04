/**
 * creatshowmodule Module
 *
 * 创建宝贝秀功能
 */
var creatshowmodule = angular.module('creatshowmodule', ['ionic', 'starter.services', 'starter.directives']);

creatshowmodule.controller('checktemplateCtrl', ['$rootScope','$scope','$stateParams','$ionicLoading','$state','getTemplate','creatShow', function($rootScope,$scope,$stateParams,$ionicLoading,$state,getTemplate,creatShow){
	
	//假设取到的模板信息

	// getTemplate(function(data){
	// 	console.log(data);
	// })
    //点击保存以后要重新加载服务器数据，否则用改变后的缓存,此处为退出
    $rootScope.SaveChange = undefined;
	$scope.templateId=1;
	$scope.productId=$stateParams.productId;
	$scope.productPlat=$stateParams.productPlat;



}])

.controller('viewtemplateCtrl',['$scope','$rootScope','$stateParams','$ionicLoading','$state','creatShow', function($scope,$rootScope,$stateParams,$ionicLoading,$state,creatShow){
	

	$(".viewtemplate").append('<iframe class="viewbox" src='+location.origin+
		'/ps.html?orgname='+$rootScope.orgName+
		'&detailid=987883&templateview=1" frameborder="0"></iframe>');
console.log(0);
	$scope.iframesrc=location.origin+"/ps.html?orgname=work&detailid=987883&templateview=1";
	$scope.viewbtnneam="应用";
	$scope.viewneam="模板预览";

	//根据模板创建宝贝秀
	$scope.viewbtn=function(){
		$ionicLoading.show({
			template:"创建中,请稍等...",
		});

		var creatdata={
			templateId:$stateParams.templateId,
			productId:$stateParams.productId,//宝贝ID
			productPlat:$stateParams.productPlat,//所属平台
		};
		creatShow(creatdata,function(data){

			//隐藏“创建中,请稍等...”
			$ionicLoading.hide();

			//创建成功跳转到编辑页
			$state.go("editpages.editer",{
				showId:data.detailId,
				pageId:0,
				pageTemp:data.firstPageTemp
			});

		},function(msg){

			alert(msg);

		});
	};

}])


.controller('viewshowCtrl',['$scope','$rootScope','$stateParams','$ionicLoading','$state','creatShow', function($scope,$rootScope,$stateParams,$ionicLoading,$state,creatShow){
	
	$(".viewtemplate").append('<iframe class="viewbox" src='+location.origin+
		'/ps.html?orgname='+$rootScope.orgName+
		'&detailid='+$stateParams.showId+
		'&templateview=1" frameborder="0"></iframe>');

	$scope.iframesrc=location.origin+"/ps.html?orgname="+$rootScope.orgName+"&detailid="+$stateParams.showId+"&templateview=1";

	console.log($scope.iframesrc);
	$scope.viewbtnneam="分享";
	$scope.viewneam="宝贝秀预览";

	$scope.viewbtn=function(){
		$ionicLoading.show({
			template:"跳转页面中",
			duration:2000
		});
		// $ionicLoading.hide();
	};


}])

.controller('shareCtrl',['$http','$scope','$rootScope','$stateParams','$ionicLoading','$state','creatShow','SBMJSONP',function($http,$scope,$rootScope,$stateParams,$ionicLoading,$state,creatShow,SBMJSONP){
	 $scope.shareInfo = {
    	orgName:$rootScope.orgName,
		detailId:$stateParams.showId
	};
	$scope.shareInfo.method = "softbanana.app.detail.search";
	var api = SBMJSONP("searchDetail",$scope.shareInfo);

	$http.jsonp(api.url)
		.success(function(data){
			console.log(data);	
			$scope.shareData = data;
		})
		.error(function(status,response){
			console.log("连接失败");
		});

	$scope.istaobao=$rootScope.istaobao
	console.log($rootScope.istaobao);

// $scope.showjuhua=-1;
// $scope.sharetosomewhere=function(){
// 	// Tida.toast("Hello World!");
// 	if($scope.showjuhua===1){
// 		Tida.hideLoading();
// 		// Tida.hideTitle();
// 	}else{
// 		// Tida.showTitle();
// 		Tida.showLoading("加载中...");
// 	}
// 	$scope.showjuhua=-$scope.showjuhua;
// }
//     Tida.ready({
//         interactId:"", // 互动实列ID type string 若无抽奖模块，此参数无须传入。给错误的实例ID会走错误流程
//         module: ['draw','sensor','buy','device','social','widget'] // 应用所需要的模块。默认加载所有模块。支持的模块有draw:抽奖;sensor:传感器;buy:交易;device:基础设备接口 social:社交相关 widget:客户端UI
//     }, function(){
	
//         console.log(Tida);
//         Tida.doAuth(function(data){
//             if(data.finish){
//                 alert("授权成功")
//             // 授权成功 可以顺利调用需要授权的接口了
//             }else {
//             // 未能成功授权
//             }
//         });
//         Tida.share({
//             title:"分享的标题", // 分享标题 在来往和微信好友中有标题显示
//             content: "分享内容", //分享的内容
//             url: "http://192.168.1.213/sbmproject/ps.html?orgname=work&detailid=987984&productid=44296753642&plat=TAOBAO", // 跳转地址，分享的内容跳转的url
//             image:"http://192.168.1.213/sbmproject/img/shareimg.jpg", // 图片地址,客户端可能需要根据url下载图片再分享
//             wxIsAvailable: 1, // 是否添加微信通道。为真时添加微信入口。仅手淘支持 取值为真或假
//             shareType: 1, // 为1时只能分享到通讯录。仅手淘支持
//             wxImage: 1, // 天猫IOS客户端分享到微信/微信朋友圈的图片有限制，这里默认自动转为200x200的。若不是正方形图片且需要自己传递该图片,并遵循天猫客户端图片的限制规则（不要过大 阿里的CDN上的）
//         }, function(data){
//         // data.errorCode 为0时分享成功
//         });

//     });








}])


;