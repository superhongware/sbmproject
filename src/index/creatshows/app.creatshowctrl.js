/**
 * creatshowmodule Module
 *
 * 创建宝贝秀功能
 */
var creatshowmodule = angular.module('creatshowmodule', ['ionic', 'starter.services', 'starter.directives']);

creatshowmodule.controller('checktemplateCtrl', ['$scope','$stateParams','$ionicLoading','$state','getTemplate','creatShow', function($scope,$stateParams,$ionicLoading,$state,getTemplate,creatShow){
	


	//宝贝ID
	$scope.productId=$stateParams.productId;
	$scope.templateId=1;

	//根据模板创建宝贝秀
	$scope.creatShow=function(templateId){

			$ionicLoading.show({
				template:"创建中,请稍等...",
			});

		creatShow(templateId,function(data){
			console.log(data);
			var showId=1,
				pageId=1,
				pageTemp=1;
				$ionicLoading.hide();

			$state.go("editpages.editer",{showId:showId,pageId:pageId,pageTemp:pageTemp});
		},function(){
			alert("创建失败，再试一次");
		});
	};

}])

.controller('editpagesCtrl',['$scope','$ionicLoading',function($scope,$ionicLoading){
	$scope.show= function(){
		$ionicLoading.show({
			template:"正在保存...",
			duration:2000
		});
	};
	$scope.showdata={
		page:1
	};
}])

.factory('creatShow', ['$rootScope','$http','SBMJSONP',function($rootScope,$http,SBMJSONP){
	return function creatShow(templateId,callback,errorcallback){
		var showdata = {
			orgName: $rootScope.orgName,
			action:"",//向上（up）或者向下（next）查询
			pageNo:"",//自增长ID
			pageSize:10,//条数
			method:"softbanana.app.template.list"
		};
		$http.get("testdata/template.json")
			.success(function(data) {
				callback(data);
			})
			.error(function(status, response) {
				errorcallback(status, response);
			});
	};
}])

.factory('getTemplate', ['$rootScope','$http','SBMJSONP',function($rootScope,$http,SBMJSONP){
	return function creatShow(callback,errorcallback){
		//获取模板列表
		var templatesdata = {
			orgName: $rootScope.orgName,
			action:"",//向上（up）或者向下（next）查询
			pageNo:"",//自增长ID
			pageSize:10,//条数
			method:"softbanana.app.template.list"
		};
		var api = SBMJSONP("listTemplate",templatesdata);
		$http.jsonp(api.url)
			.success(function(data) {
				callback(data);
			})
			.error(function(status, response) {
				errorcallback(status, response);
			});
	};
}])


;