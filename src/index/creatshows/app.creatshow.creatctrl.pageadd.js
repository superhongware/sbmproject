creatshowmodule
.controller('addpagesCtrl', ['$scope','$rootScope','$http','$stateParams','$state', function($scope,$rootScope,$http,$stateParams,$state){
	
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
		console.log($rootScope.editShowData.mainData.pages);
		var pages=$rootScope.editShowData.mainData.pages;
		var addpage=$scope.tempdata.pages[index].pagedata;

		// console.log($stateParams.pageId)
		
		pages.splice($stateParams.pageId,0,addpage);
		
		// console.log($rootScope.editShowData.mainData.pages);

		$state.go("editpages.editer",{
					showId:$rootScope.editShowData.showId,
					pageId:$stateParams.pageId,
					pageTemp:$rootScope.editShowData.mainData.pages[$stateParams.pageId].templatePageId
				});
	};

}]);