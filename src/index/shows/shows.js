var showsmodule = angular.module('showsmodule', ['ionic', 'starter.services', 'starter.directives']);
showsmodule.controller('showsCtrl', [
'$rootScope', '$scope', '$http', '$state', '$stateParams', '$ionicLoading','$ionicListDelegate', 'productComm','$ionicSlideBoxDelegate','creatShow','SBMJSONP', 'TBAPI','showedition','$ionicPopup',
function($rootScope, $scope, $http, $state, $stateParams, $ionicLoading, $ionicListDelegate,productComm,$ionicSlideBoxDelegate,creatShow,SBMJSONP,TBAPI,showedition,$ionicPopup) {

	//隐藏淘宝标题栏
	TBAPI.hideTitle();
//获取宝贝秀列表
	$scope.showsListData = [];
				
	//是否有宝贝秀数据
	$scope.thereisnoshow="";

	var pageFunc = {},
		pageData = {};
	/**
	* [pageData 模块数据]
	* @type {Object}
	*/
	pageData = {
		orgName: $rootScope.orgName,
		pageSize: 10,
		lastId: 0,
		direction: '', //up next
		isPostBack: false,
		isHaveMoreData : false,
		shopName:$rootScope.istaobao?$rootScope.shopName:""
	};
	function loadData(option){
		$scope.showsList = {
			orgName: option.orgName,
			pageNo: option.lastId,
			pageSize: option.pageSize,
			action: option.direction,
			isHaveMoreData: option.isHaveMoreData,
			isPostBack:option.isPostBack,
			shopName:option.shopName,
			method : "softbanana.app.detail.list"
		};
		var api = SBMJSONP("listDetail",$scope.showsList);


		$http.jsonp(api.url)
			.success(function(data){



				//第一次没有数据  提示用户去添加新宝贝秀
				if(($scope.thereisnoshow===""||$scope.thereisnoshow===true)&&data.details.length<=0){
					$scope.thereisnoshow=true;
				}else{
					$scope.thereisnoshow=false;
				}
				console.log(["宝贝秀数据",data,$scope.thereisnoshow]);

				loadDataComplete();
				for(var i =0;i<data.details.length;i++){
					if(data.details[i].llCount === ""){
						data.details[i].llCount = 0;
					}
					if(data.details[i].ddCount === ""){
						data.details[i].ddCount = 0;
					}
					if(data.details[i].zfCount === ""){
						data.details[i].zfCount = 0;
					}
					data.details[i].postDate = data.details[i].postDate.substr(0,10);
				}

				$scope.showsListData = $scope.showsListData.concat(data.details);

				pageData.isHaveMoreData = true;
				if (data.details.length === 0 && pageData.direction === 'up') {
					pageData.isHaveMoreData = false;
					return;
				}

				if (pageData.isPostBack && (pageData.direction === 'up' || pageData.direction === '') && data.details.length > 0) {
					pageData.isHaveMoreData = true;
				}
				pageData.isPostBack = true;
				$scope.$broadcast('scroll.infiniteScrollComplete');

		    console.log(["$getByHandle",$ionicListDelegate.$getByHandle()]);


			})
			.error(function(status,response){
				console.log(status);
				loadDataComplete();
			});
	}

	loadData(pageData);

	function loadDataComplete() {
		$ionicLoading.hide();
		$scope.$broadcast('scroll.refreshComplete');
		$scope.$broadcast('scroll.infiniteScrollComplete');
		pageData.isPostBack = true;
	}


	$scope.loadMoreData = function(){
		pageData.direction = 'up';
		if ($scope.showsListData.length > 0) {
			pageData.lastId = $scope.showsListData[$scope.showsListData.length - 1].detailId;
		}
		loadData(pageData);
	};

	$scope.refresh = function() {
		pageData.direction = 'next';
		if ($scope.showsListData.length > 0) {
			pageData.lastId = $scope.showsListData[0].detailId;
		}
		loadData(pageData);
	};

	//删除
	$scope.dele = function(detailid){
				var myPopup = $ionicPopup.show({
					template: '删除后已经分享过的详情将作废，无法浏览，您确定要删除吗？',
					// title: '提示',
					buttons: [{
						text: '取消'
					}, {
						text: '<b>确定</b>',
						type: 'button-energized',
						onTap: function(e) {
							$scope.delshow(detailid);
						}
					}]
				});
			};

	$scope.delshow = function(detailid){
		$scope.deldata = {
			orgName:$rootScope.orgName,
			detailId:detailid
		};
		$scope.deldata.method = "softbanana.app.detail.delete";
		var api = SBMJSONP("deleteDetail",$scope.deldata);
		$http.jsonp(api.url)
			.success(function(data){
				if(data.isSuccess){
					console.log(data);
					for(var i in $scope.showsListData){
						if($scope.showsListData[i].detailId == $scope.deldata.detailId){
							$scope.showsListData.splice(i,1);
						}
					}
				}else{
					console.log(data.map.errorMsg);
				}
			})
			.error(function(status,response){
				console.log("连接失败");
			});

	};

	$scope.edit = function(detailId){
		$scope.detaildata = {
			orgName:$rootScope.orgName,
			detailId:detailId
		};

		$scope.detaildata.method = "softbanana.app.detail.search";
		var api = SBMJSONP("searchDetail",$scope.detaildata);
		$http.jsonp(api.url)
			.success(function(data){
				if(data.isSuccess){
					$rootScope.editz=true;
					$state.go("editpages.editer",{
						showId:detailId,
						pageId:0,
						pageTemp:data.pages[0].templatePageId
					});
				}else{
					console.log(data.map.errorMsg);
				}
			})
			.error(function(status,response){
				console.log("连接失败");
			});

	};

	$scope.showediticon=function(index){
		showedition(index);
	};

	$scope.pageData = pageData;

}])



.controller('liuliangCtrl', ['$rootScope', '$scope', '$http', '$state', '$stateParams', '$ionicLoading', 'productComm','$ionicSlideBoxDelegate','creatShow','SBMJSONP', function($rootScope, $scope, $http, $state, $stateParams, $ionicLoading, productComm,$ionicSlideBoxDelegate,creatShow,SBMJSONP) {
    $scope.showsInfo = {
    	orgName:$rootScope.orgName,
		detailId:$stateParams.showId
	};
	$scope.showsInfo.method = "softbanana.app.report.search";
	var api = SBMJSONP("searchReport",$scope.showsInfo);
	$http.jsonp(api.url)
		.success(function(data){
			console.log(["流量数据",data]);
			/*模拟数据*/
			 // data.lldetail.wxFriend = 10;
			 // data.lldetail.wxFriends = 30;
			 // data.lldetail.weibo = 40;
			 // data.lldetail.qq = 50;
			 // data.lldetail.qzone = 120;

			 // data.dddetail.wxFriend = 120;
			 // data.dddetail.wxFriends = 80;
			 // data.dddetail.weibo = 50;
			 // data.dddetail.qq = 40;
			 // data.dddetail.qzone = 10;

			 // data.zfdetail.wxFriend = 50;
			 // data.zfdetail.wxFriends = 50;
			 // data.zfdetail.weibo = 60;
			 // data.zfdetail.qq = 50;
			 // data.zfdetail.qzone = 50;
           /*模拟数据*/

			$scope.showsInfoData = data;

			$scope.tabsBtn = {
		    	lldetail:false,
		    	dddetail:false,
		    	zfdetail:false,
		    	wxFriend:0,
			    wxFriends:0,
			    weibo:0,
			    qq:0,
			    qzone:0
		    };
		    function init(){
		    	$scope.tabsBtn.lldetail = true;
		    	var narray = ['wxFriend','wxFriends','weibo','qq','qzone'];
		   		var maxarray = [];
		    	var max = 0;
		    	for (var n in narray){
		    		var m =narray[n];
		    		if($scope.showsInfoData.lldetail[m]===""){
		    			$scope.showsInfoData.lldetail[m] = 0;
		    		}
		    		$scope.tabsBtn[m] = $scope.showsInfoData.lldetail[m];
		    		maxarray.push($scope.tabsBtn[m]);
		    	}

		    	max = Math.max.apply(null, maxarray);
		    	console.log(max)
		    	for(var i in maxarray){
		    		var pct=max==0?0:maxarray[i]/max*160;
		    		$(".zhu").eq(i).css("height",(pct+36));
		    		$(".tiao").eq(i).css("height",pct);
		    	}	

		    }

		    init();

		    function reset(){
		    	$scope.tabsBtn = {
			    	lldetail:false,
			    	dddetail:false,
			    	zfdetail:false,
			    	wxFriend:0,
			    	wxFriends:0,
			    	weibo:0,
			    	qq:0,
			    	qzone:0
		   		};
		    }
			
		    $scope.tabsClick = function(tab){
		    	reset();
		    	$scope.tabsBtn[tab] = true;
		    	var narray = ['wxFriend','wxFriends','weibo','qq','qzone'];
		    	var maxarray = [];
		    	var max = 0;
		    	for (var n in narray){
		    		var m =narray[n];
		    		if($scope.showsInfoData[tab][m]===""){
		    			$scope.showsInfoData[tab][m] = 0;
		    		}
		    		$scope.tabsBtn[m] = $scope.showsInfoData[tab][m];
		    		maxarray.push($scope.tabsBtn[m]);

		    	}

		    	max = Math.max.apply(null, maxarray);

		    	for(var i in maxarray){
		    		var pct=max==0?0:maxarray[i]/max*160;
		    		$(".zhu").eq(i).css("height",(pct+36));
		    		$(".tiao").eq(i).css("height",pct);

		    	}
		    	
		    };

		})
		.error(function(status,response){
			console.log("连接失败");
		});

}]);