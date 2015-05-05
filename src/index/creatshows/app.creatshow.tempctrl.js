creatshowmodule

//整编辑页的controller
.controller('editpagesCtrl',[
	'$scope','$rootScope','$state','$http','$ionicLoading','$ionicScrollDelegate','$stateParams','SBMJSONP','saveShow',
	function($scope,$rootScope,$state,$http,$ionicLoading,$ionicScrollDelegate,$stateParams,SBMJSONP,saveShow){


	console.log("editpagesCtrl");

	$scope.saveShow=function(){
		$ionicLoading.show({
			template:"正在保存,请稍等...",
		});
		saveShow($rootScope.editShowData.mainData,
			function(data){
				$ionicLoading.hide();
				console.log("保存成功");
				//点击保存以后要重新加载服务器数据，否则用改变后的缓存
				$rootScope.SaveChange = true;
				$state.go("share",{
					showId:$rootScope.editShowData.showId
				});
			},
			function(data){
				$ionicLoading.hide();
				console.log(["保存失败",data]);
				alert(data);
			});
	};

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

		if($rootScope.xychange === true){
				//点击保存以后要重新加载服务器数据，否则用改变后的缓存
				$rootScope.SaveChange = true;
				$scope.$broadcast('saveShowImg');
				$rootScope.xychange = undefined;
			}else{
			$state.go("editpages.editer",params);
		}
	};

	$scope.gonext = function() {
		console.log(showdata.mainData);
		var pageid=showdata.currentpage+1;
			pageid=pageid<(showdata.mainData.pages.length-1)?pageid:(showdata.mainData.pages.length-1);
		var params={
			showId:showdata.showId,
			pageId:pageid,
			pageTemp:showdata.mainData.pages[pageid].templatePageId
		};

		if($rootScope.xychange === true){
			//点击保存以后要重新加载服务器数据，否则用改变后的缓存
			$rootScope.SaveChange = true;
			$scope.$broadcast('saveShowImg');
			$rootScope.xychange = undefined;
		}else{
			$state.go("editpages.editer",params);
		}
		
	};


	// var deletescopeon;
	$scope.playthisshow=function(){
		$rootScope.$broadcast("saveShowImg");
		// if(typeof deletescopeon=="function"){
		// 	deletescopeon();
		// }
		$scope.$on("saveShowImgOver", function() {
			gohref = "/ps.html?orgname=" + $rootScope.orgName +
				"&detailid=" + $rootScope.editShowData.showId +
				"&productid=" + $rootScope.editShowData.mainData.numIid +
				"&plat=" + $rootScope.editShowData.mainData.plat;
				console.log(location.origin+gohref);
			location.href = location.origin + gohref;
		});
	};


	var addpagesaveshowdata;
	$scope.$on('$destroy', function() {
		if(typeof addpagesaveshowdata ==="function"){
			addpagesaveshowdata();
		}
	});
	$scope.addpage=function(){
		$rootScope.$broadcast("saveShowImg");
		if(typeof addpagesaveshowdata ==="function"){
			addpagesaveshowdata();
		}
		addpagesaveshowdata=$scope.$on("saveShowImgOver", function() {
			$state.go("addpage",{
				showId:$rootScope.editShowData.showId,
				pageId:$rootScope.editShowData.currentpage
			});
		});
	};

	//小页面宽度
	$scope.pagelistwidth={"width":0};

	//获取宝贝秀数据
	// $rootScope.$watch("editShowData",function() {


	$scope.$on("showdatachanged",function(){
		console.log(["showdatachanged",$rootScope.editShowData]);
		//宽度控制
		if($rootScope.editShowData.mainData && typeof $rootScope.editShowData.mainData.pages !== "undefined"){
			console.log(["改变宽度啊222！！"]);
			// cc=$rootScope.editShowData.mainData.pages;
			// $rootScope.editShowData.mainData.pages="undefined";
			// $rootScope.$apply();
			// $rootScope.editShowData.mainData.pages=cc;
			// $rootScope.$apply();

			// $scope.pagelistwidth={"width":$rootScope.editShowData.mainData.pages.length*71+"px"};
			// $scope.$emit('scroll.infiniteScrollComplete');
		}

		if(!$rootScope.editShowData.mainData||$rootScope.editShowData.showId!==$rootScope.editShowData.mainData.detailId){

			console.log("开始更新宝贝秀数据");
			var getshowdata = {
				orgName:$rootScope.orgName,
				detailId:$rootScope.editShowData.showId,
				method :"softbanana.app.detail.search"
			};

			console.log(getshowdata);

			var api = SBMJSONP("searchDetail",getshowdata);
			//获取宝贝秀数据
			$http.jsonp(api.url)
			// $http.get("testdata/template1.json")
			.success(function(data){
				if(!data.isSuccess){
					alert("获取宝贝秀数据失败");
					console.log(["获取宝贝秀数据失败"]);
					return;
				}
				console.log(["更新宝贝秀数据结束",data]);
				//点击保存以后要重新加载服务器数据，否则用改变后的缓存


				/*======================================改=改=改=改=改=改=改=改=改=改=改===================================*/

				$rootScope.editShowData.mainData=data;

				if(($rootScope.SaveChange === undefined)||($rootScope.SaveChange === true)){
					$rootScope.SaveChange = false;
				}
				
				/*======================================改=改=改=改=改=改=改=改=改=改=改===================================*/

				
				console.log(["改变宽度啊111！！"]);
				// $scope.pagelistwidth={"width":data.pages.length*71+"px"};
				//
				// $rootScope.$broadcast("showdataIsReady");

			})
			.error(function(){
				alert("更新宝贝秀数据失败");
				console.log("更新宝贝秀数据失败");
			});
		}
	});

}])








.controller('pagetemp1Ctrl',['$scope','$state',function($scope,$state){
	// console.log($state.current);
	console.log("pagetemp1");
	// console.log("editerCtrl");

}])


.controller('pagetemp5Ctrl',['$scope','$state',function($scope,$state){
	// console.log($state);
	console.log("pagetemp5");
	// console.log("editerCtrl");
}]);
