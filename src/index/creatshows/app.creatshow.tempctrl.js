creatshowmodule
.controller('editpagesCtrl',['$scope','$rootScope','$state','$http','$ionicLoading','$stateParams',function($scope,$rootScope,$state,$http,$ionicLoading,$stateParams){

	// $ionicLoading.show({
	// 	template:"正在初始化...",
	// });

	// $http.get("testdata/template.json")

	// console.log($scope.prevpage);


	// $scope.showId = parseInt($stateParams.showId);

	// var prevpage = (parseInt($stateParams.pageId) - 1);
	// $scope.prevpage = prevpage < 0 ? 0 : prevpage;

	// var nextpage = (parseInt($stateParams.pageId) + 1);
	// $scope.nextpage = nextpage > 8 ? 8 : nextpage;
	console.log("editpagesCtrl");

	//初始化editShowData
	$rootScope.editShowData={
		showId:"",
		currentpage:"",
		mainData:"",
	};

	var showdata=$rootScope.editShowData;
	//翻页按钮
	$scope.goprev = function() {
		// console.log($rootScope.editShowData.currentpage);
		var pageid=showdata.currentpage-1;
			pageid=pageid>0?pageid:0;
		var params={
			showId:showdata.showId,
			pageId:pageid,
			pageTemp:showdata.mainData.psges[pageid].templatePageId
		};
		$state.go("editpages.editer",params);
	};

	$scope.gonext = function() {
		// console.log($rootScope.editShowData.currentpage);
		var pageid=showdata.currentpage-1;
			pageid=pageid<showdata.mainData.psges.length?pageid:showdata.mainData.psges.length;
		var params={
			showId:showdata.showId,
			pageId:pageid,
			pageTemp:showdata.mainData.psges[pageid].templatePageId
		};
		$state.go("editpages.editer",params);
	};

	//加载宝贝秀数据
	$rootScope.$watch("editShowData",function(newValue,oldValue){
		console.log(newValue);
		if(newValue.showId!==oldValue.showId){
			//获取宝贝秀数据
			$rootScope.editShowData.mainData={};
		}
		// console.log($rootScope.editShowData.showId);
	});



}])
.controller('editerCtrl', ['$scope','$rootScope','$ionicLoading','$stateParams',function($scope,$rootScope,$ionicLoading,$stateParams){

	$rootScope.editShowData.showId=$stateParams.showId;
	$rootScope.editShowData.currentpage=parseInt($stateParams.pageId);



	console.log($rootScope.editShowData.currentpage);

	console.log("editerCtrl");

}])
.controller('pagetempht1Ctrl',['$scope','$state',function($scope,$state){
	// console.log($state.current);
	console.log("pagetempht1Ctrl");
	// console.log("editerCtrl");

}])

.controller('pagetemp1Ctrl',['$scope','$state',function($scope,$state){
	// console.log($state.current);
	console.log("pagetemp1");
	// console.log("editerCtrl");

}])


.controller('pagetemp2Ctrl',['$scope','$state',function($scope,$state){
	// console.log($state);
	console.log("pagetemp2");
	// console.log("editerCtrl");
}]);
