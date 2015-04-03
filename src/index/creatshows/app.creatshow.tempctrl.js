creatshowmodule.controller('editerCtrl', ['$scope','$rootScope','$ionicLoading','$stateParams',function($scope,$rootScope,$ionicLoading,$stateParams){

	$rootScope.editShowData={
		currentpage:parseInt($stateParams.pageId)
	};

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
