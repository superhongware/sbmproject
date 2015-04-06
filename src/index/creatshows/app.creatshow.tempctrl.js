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
	if(!$rootScope.editShowData){
		console.log(["创建$rootScope.editShowData"]);
		$rootScope.showId="";
		$rootScope.editShowData={
			showId:"",
			currentpage:0,
			mainData:"",
			dddd:""
		};
	}
	var showdata=$rootScope.editShowData;

	//翻页按钮
	$scope.goprev = function() {
		// console.log($rootScope.editShowData.currentpage);
		var pageid=showdata.currentpage-1;
			pageid=pageid>0?pageid:0;
		var params={
			showId:showdata.showId,
			pageId:pageid,
			pageTemp:showdata.mainData.pages[pageid].templatePageId
		};
		$state.go("editpages.editer",params);
	};

	$scope.gonext = function() {
		console.log(showdata.mainData);
		var pageid=showdata.currentpage+1;
			pageid=pageid<showdata.mainData.pages.length?pageid:showdata.mainData.pages.length;
		var params={
			showId:showdata.showId,
			pageId:pageid,
			pageTemp:showdata.mainData.pages[pageid].templatePageId
		};
		$state.go("editpages.editer",params);
	};

	// console.log(["aa",$rootScope.editShowData]);

	
	$rootScope.$watch("editShowData",function() {
		// body...
		if(!$rootScope.editShowData.mainData&&$rootScope.editShowData.showId!==$rootScope.editShowData.mainData.showId){
			$rootScope.editShowData.showId=$stateParams.showId;
			console.log("更新宝贝秀数据");
			
			//获取宝贝秀数据
			$http.get("testdata/productshow.json")
			.success(function(data){
				console.log(data);
				$rootScope.editShowData.mainData=data;
			})
			.error(function(){
				alert("获取失败");
			});
		}
	});




}])
.controller('editerCtrl', ['$scope','$rootScope','$http','$ionicLoading','$stateParams','changepagesize',function($scope,$rootScope,$http,$ionicLoading,$stateParams,changepagesize){

	changepagesize();

	$rootScope.editShowData.ddd="cccc";

	console.log("editerCtrl");
	// console.log(["bb",$rootScope.editShowData]);

	$rootScope.editShowData.showId=$stateParams.showId;
	$rootScope.editShowData.currentpage=parseInt($stateParams.pageId);

	// console.log(["cc",$rootScope.editShowData]);
	// console.log($rootScope.editShowData.currentpage);


}])
.directive('normalEditPage', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'templates/index/creatshows/pages/normaleditpage.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
		}
	};
})

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
