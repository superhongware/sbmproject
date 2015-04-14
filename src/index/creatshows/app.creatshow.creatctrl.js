/**
 * creatshowmodule Module
 *
 * 创建宝贝秀功能
 */
var creatshowmodule = angular.module('creatshowmodule', ['ionic', 'starter.services', 'starter.directives']);

creatshowmodule.controller('checktemplateCtrl', ['$scope','$stateParams','$ionicLoading','$state','getTemplate','creatShow', function($scope,$stateParams,$ionicLoading,$state,getTemplate,creatShow){
	
	//假设取到的模板信息
	$scope.templateId=1;

	// getTemplate(function(data){
	// 	console.log(data);
	// })

	//根据模板创建宝贝秀
	$scope.creatShow=function(templateId){

		$ionicLoading.show({
			template:"创建中,请稍等...",
		});

		var creatdata={
			templateId:templateId,
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

.controller('viewtemplateCtrl', ['$scope', function($scope){
	


}])

;