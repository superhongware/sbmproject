creatshowmodule

//整编辑页—图片文字编辑区
.controller('editerCtrl', ['$scope','$rootScope','$http','$ionicLoading','$stateParams','changepagesize',function($scope,$rootScope,$http,$ionicLoading,$stateParams,changepagesize){

	changepagesize();

	$rootScope.editShowData.ddd="cccc";

	console.log("editerCtrl");
	// console.log(["bb",$rootScope.editShowData]);

	$rootScope.editShowData.showId=$stateParams.showId;
	$rootScope.editShowData.currentpage=parseInt($stateParams.pageId);
	$scope.$emit("showdatachanged");

	// console.log(["cc",$rootScope.editShowData]);
	// console.log($rootScope.editShowData.currentpage);

}])


//整编辑页的controller
.controller('editpagesCtrl',[
	'$scope','$rootScope','$state','$http','$ionicLoading','$ionicScrollDelegate','$stateParams','SBMJSONP','saveShow','creatpsurl','$ionicPopup',
	function($scope,$rootScope,$state,$http,$ionicLoading,$ionicScrollDelegate,$stateParams,SBMJSONP,saveShow,creatpsurl,$ionicPopup){
	console.log("editpagesCtrl");
	// $(".back-button").hide();
	// $scope.popsave = function(){
	// 	var myPopup = $ionicPopup.show({
	// 				template: '当前模板已经修改，是否保存',
	// 				// title: '提示',
	// 				buttons: [{
	// 					text: '不保存',
	// 					onTap: function(e) {
	// 						history.go(-1);
	// 					}
	// 				}, {
	// 					text: '<b>保存</b>',
	// 					type: 'button-energized',
	// 					onTap: function(e) {
	// 						$scope.$broadcast('saveShowImg');
	// 						history.go(-1);
	// 					}
	// 				}]
	// 			});
	// };

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

		    if(pageid<0){
		    	$ionicLoading.show({
					template:"已是第一张",
				});
				pageid = 0;
		    }
		    setTimeout(function(){
        		$ionicLoading.hide();
       		},500);
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
			if(pageid>showdata.mainData.pages.length-1){
				$ionicLoading.show({
					template:"已是最后一张",
				});
				pageid = showdata.mainData.pages.length-1;
			}
			setTimeout(function(){
        		$ionicLoading.hide();
       		},500);
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
			console.log(0);
			$state.go("viewshow",{showId:$rootScope.editShowData.showId});

			// gohref=creatpsurl($rootScope.orgName,$rootScope.editShowData.showId,$rootScope.editShowData.mainData.numIid,$rootScope.editShowData.mainData.plat);

			// console.log(gohref);

			// location.href = gohref;
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

			if(showdata.mainData.pages.length>9){
					$ionicLoading.show({
						template:"最多十页",
					});
					setTimeout(function(){
		        		$ionicLoading.hide();
		       		},500);
			}else{
				$state.go("addpage",{
					showId:$rootScope.editShowData.showId,
					pageId:$rootScope.editShowData.currentpage
				});
			}
			
			
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
