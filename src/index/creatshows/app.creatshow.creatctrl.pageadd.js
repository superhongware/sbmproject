creatshowmodule
.controller('addpagesCtrl', [
	'$scope','$rootScope','$http','$stateParams','$state',"$ionicLoading", 'saveShow',
	function($scope,$rootScope,$http,$stateParams,$state,$ionicLoading,saveShow){
	
	$http.get('testdata/pagetemplate.json')
	.success(function(data){
		console.log(["模板数据",data]);
		$scope.tempdata=data;
	})
	.error(function(){
		console.log("网络有问题,没有获取模板数据");
		alert("网络有问题,没有获取模板数据");
	});


	$scope.addpage=function(index){
		$ionicLoading.show({
			template:"正在保存,请稍等...",
		});
		console.log($rootScope.editShowData.mainData.pages);
		var pages=$rootScope.editShowData.mainData.pages;
		var addpage=$scope.tempdata.pages[index].pagedata;
		var pageposition=parseInt($stateParams.pageId)+1;

		// console.log($stateParams.pageId)
		
		pages.splice(pageposition,0,addpage);
		
    	//app.creatshow.remoteimgctrl.js 81行左右有相同代码
		//此处保存只为了  修复添加页面后小页面无法拖动bug 重新加载showdata后小页面就可以拖动
		//半夜三更的我真找不到是什么原因导致的  实在解决不了才出此对策
		//你看到这个  如果想优化下，非常欢迎!!!
		saveShow($rootScope.editShowData.mainData,function(data){
			$rootScope.editShowData.mainData=undefined;
			$ionicLoading.hide();
			$state.go("editpages.editer",{
						showId:$rootScope.editShowData.showId,
						pageId:pageposition,
						pageTemp:$scope.tempdata.pages[index].pagedata.templatePageId
						// $rootScope.editShowData.mainData.pages[pageposition].templatePageId
					});
		},function(){

		});
		
	};

}]);