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
		'/ps.html?templateview=1 frameborder="0"></iframe>');
console.log(0);
	// $scope.iframesrc=location.origin+"/ps.html?orgname=work&detailid=987883&templateview=1";
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
			console.log(msg);

		});
	};

}])


.controller('viewshowCtrl',[
'$scope','$rootScope','$stateParams','$state','$ionicLoading','$state','creatShow','creatpsurl',
function($scope,$rootScope,$stateParams,$state,$ionicLoading,$state,creatShow,creatpsurl){
	

	console.log(['lllll',creatpsurl($rootScope.orgName,$stateParams.showId,"0","0")])
	var showurl=creatpsurl($rootScope.orgName,$stateParams.showId,"0","0")
	$(".viewtemplate").append('<iframe class="viewbox" src='+showurl+'&templateview=2 frameborder="0"></iframe>');

	// $(".viewtemplate").append('<iframe class="viewbox" src="'+location.origin+
	// 	'/ps.html?orgname='+$rootScope.orgName+
	// 	'&detailid='+$stateParams.showId+
	// 	'&templateview=2" frameborder="0"></iframe>');

	// $scope.iframesrc=location.origin+"/ps.html?orgname="+$rootScope.orgName+"&detailid="+$stateParams.showId+"&templateview=1";

	console.log($scope.iframesrc);
	$scope.viewbtnneam="分享";
	$scope.viewneam="宝贝秀预览";




	$scope.viewbtn=function(){
		// $ionicLoading.show({
		// 	template:"跳转页面中",
		// 	duration:2000
		// });
		// $ionicLoading.hide();
		$state.go('share',{
			showId:$stateParams.showId
		})
	};


}])




;