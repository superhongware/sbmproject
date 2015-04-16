/**
 * creatshowmodule Module
 *
 * 创建宝贝秀功能
 */
var creatshowmodule = angular.module('creatshowmodule', ['ionic', 'starter.services', 'starter.directives']);

creatshowmodule.controller('checktemplateCtrl', ['$scope','$stateParams','$ionicLoading','$state','getTemplate','creatShow', function($scope,$stateParams,$ionicLoading,$state,getTemplate,creatShow){
	
	//假设取到的模板信息

	// getTemplate(function(data){
	// 	console.log(data);
	// })

	$scope.templateId=1;
	$scope.productId=$stateParams.productId;
	$scope.productPlat=$stateParams.productPlat;



}])

.controller('viewtemplateCtrl',['$scope','$stateParams','$ionicLoading','$state','creatShow', function($scope,$stateParams,$ionicLoading,$state,creatShow){
	
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


}])


;