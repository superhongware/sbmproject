/**
 * products Module
 *
 * 我的宝贝功能模块
 */
var productsmodule = angular.module('productsmodule', ['ionic', 'starter.services', 'starter.directives']);
productsmodule.controller('productsCtrl', ['$scope', '$ionicLoading', '$rootScope', '$state', 'productComm', 'getDataComm', function($scope, $ionicLoading, $rootScope, $state, productComm, getDataComm) {


	var pageData = {},
		pageFunc = {};



	/**
	 * [pageData 模块数据]
	 * @type {Object}
	 */
	pageData = {
		lastId: '',
		pageSize: 10,
		direction: '', //up next
		orgName: $rootScope.orgName,
		productList: [],
		shopList: [], //店铺数据
		currStatus: 'onsale',
		isOnsaleStatus: true,
		currShop: null,
		isHaveMoreData: false,
		isPostBack: false,
		pageViewState: JSON.parse(localStorage.getItem('productListPageViewState')) //{currShop,currStatus}
	};


	pageFunc.init = function() {
		if (pageData.orgName && typeof(pageData.orgName) != 'undefined') {
			console.log('pageData.pageViewState');
			console.log(pageData.pageViewState);
			if (pageData.pageViewState) {
				pageData.currShop = pageData.pageViewState.currShop;
				pageData.currStatus = pageData.pageViewState.currStatus;

				pageData.isOnsaleStatus = pageData.currStatus == 'onsale';
			} else {
				pageData.pageViewState = {
					currShop: {},
					currStatus: 'onsale'
				};
			}

			getDataComm.loadShopList(function(data) {
				if (data && data.length > 0) {
					pageData.shopList = data;
					if (pageData.currShop === null) {
						pageData.currShop = pageData.shopList[0];
					}else{
						pageFunc.setSelectShop(pageData.currShop);
					}
					pageFunc.loadData();
				} else {
					//alert('');
				}
			}, function() {
				console.log('数据查询连接失败');
			});
		} else {
			$state.go("login");
		}
	};

	pageFunc.setCurrPageViewState = function(currShop, currStatus) {
		pageData.pageViewState.currShop = currShop;
		pageData.pageViewState.currStatus = currStatus;
		localStorage.setItem('productListPageViewState', JSON.stringify(pageData.pageViewState));
	};

	pageFunc.loadDataComplete = function() {
		$ionicLoading.hide();
		$scope.$broadcast('scroll.refreshComplete');
		$scope.$broadcast('scroll.infiniteScrollComplete');
		pageData.isPostBack = true;
	};


	/**
	 * [loadDataByShop 店铺切换加载数据]
	 * @param  {[type]} item [当前选择的店铺对象]
	 * @return {[type]}      [description]
	 */
	pageFunc.loadDataByShop = function(item) {
		console.log('loadDataByShop');

		pageFunc.setSelectShop(item);

		pageData.lastId = '';
		pageData.direction = '';

		pageFunc.loadData(true);

	};

	pageFunc.setSelectShop = function(item){
		for (var i in pageData.shopList) {
			pageData.shopList[i].checked = pageData.shopList[i].id === item.id;
		}
		pageData.currShop = item;
		pageFunc.setCurrPageViewState(
			pageData.currShop,
			pageData.pageViewState.currStatus === null ? 'onsale' : pageData.pageViewState.currStatus
		);
	};


	/**
	 * [refreshServer 刷新远程数据]
	 * @return {[type]}
	 */
	pageFunc.refreshServer = function() {
		console.log('refreshServer');
		$ionicLoading.show({
			template: "正在同步..."
		});

		productComm.refreshServer({
			shopName: pageData.currShop.shopName,
			plat: pageData.currShop.plat,
		}, function(data) {
			console.log('refreshServer');
			console.log(data);
			setTimeout(function() {
				pageFunc.loadDataComplete();
			}, 3000);
		}, function(data) {
			pageFunc.loadDataComplete();
			console.log('数据查询连接失败');
		});

	};


	/**
	 * [refreshproductList 下拉刷新最新数据]
	 * @return {[type]}
	 */
	pageFunc.refreshproductList = function() {
		console.log('refreshproductList');
		pageData.direction = 'next';
		if (pageData.productList.length > 0) {
			pageData.lastId = pageData.productList[0].id;
		}
		pageFunc.loadData();
	};

	/**
	 * [loadMoreData 上拉加载更多历史数据]
	 * @return {[type]} [description]
	 */
	pageFunc.loadMoreData = function() {

		console.log('loadMoreData');
		pageData.direction = 'up';
		if (pageData.productList.length > 0) {
			pageData.lastId = pageData.productList[pageData.productList.length - 1].id;
		}
		pageFunc.loadData();

	};

	/**
	 * [loadDataByStatus 根据状态筛选产品]
	 * @param  {[type]} status [状态：onsale、instock]
	 * @return {[type]}        [description]
	 */
	pageFunc.loadDataByStatus = function(status) {
		pageData.lastId = '';
		pageData.direction = '';
		pageData.currStatus = status;
		pageData.isOnsaleStatus = status == 'onsale';
		pageFunc.setCurrPageViewState(
			pageData.pageViewState.currShop === null ? pageData.shopList[0] : pageData.pageViewState.currShop,
			pageData.currStatus
		);
		pageFunc.loadData(true);
	};

	/**
	 * [loadData 加载产品数据]
	 * @param  {Boolean} isClearCurrData [是否清除当前视图数据]
	 * @return {[type]}                  [description]
	 */
	pageFunc.loadData = function(isClearCurrData) {

		if (pageData.direction != 'up') {
			$ionicLoading.show({
				template: "正在加载..."
			});
		}

		var option = {
			shopName: pageData.currShop.shopName,
			status: pageData.currStatus,
			action: pageData.direction,
			pageNo: pageData.lastId,
			pageSize: pageData.pageSize,
			plat: pageData.currShop.plat
		};
		console.log('pageFunc.loadData option');
		console.log(option);

		productComm.loadProductData(option, function(data) {

			pageFunc.loadDataComplete();

			if (data.length === 0 && pageData.direction === 'up') {
				pageData.isHaveMoreData = false;
				return;
			}

			if (isClearCurrData) {
				pageData.productList = [];
			}
			if (pageData.direction === 'up') { //moredata
				pageData.productList = pageData.productList.concat(data);
			} else {
				pageData.productList = data.concat(pageData.productList);
			}

			if (pageData.isPostBack && (pageData.direction === 'up' || pageData.direction === '') && data.length > 0) {
				pageData.isHaveMoreData = true;
			}

			pageData.isPostBack = true;

			console.log('pageData.productList');
			console.log(pageData.productList);

		}, function(status, response, msg) {
			pageFunc.loadDataComplete();
			console.log('数据查询连接失败');
		});

	};

	pageFunc.showDetail = function(item) {
		var currSelectProduct = {
			orgName: pageData.orgName,
			numIid: item.numIid,
			plat: item.plat
		};
		localStorage.setItem('currSelectProduct', JSON.stringify(currSelectProduct));
		$state.go("productDetail");
	};

	$scope.pageData = pageData;
	$scope.pageFunc = pageFunc;

	pageFunc.init();

}]);



productsmodule.controller('productDetailCtrl', ['$rootScope', '$scope', '$http', '$state', '$stateParams', '$ionicLoading', 'productComm','$ionicSlideBoxDelegate','creatShow','SBMJSONP', function($rootScope, $scope, $http, $state, $stateParams, $ionicLoading, productComm,$ionicSlideBoxDelegate,creatShow,SBMJSONP) {

	var pageFunc = {},
		pageData = {};
	// alert(localStorage.getItem('currSelectProduct'))
	pageData = {
		currSelectOrder: JSON.parse(localStorage.getItem('currSelectProduct')),
		orderDetail: {},
		isPageShow:false
	};

	console.log(pageData);

	/**
	 * [init 模块入口]
	 * @return {[type]} [description]
	 */
	pageFunc.init = function() {
		if (pageData.currSelectOrder) {
			pageFunc.loadProductDetail();
		} else {
			$state.go('orders');
		}
	};

	/**
	 * [loadProductDetail 加载产品详情]
	 * @return {[type]} [description]
	 */
	pageFunc.loadProductDetail = function() {
		$ionicLoading.show({
			template: "正在加载..."
		});

		productComm.loadProductDetail({
			orgName: pageData.currSelectOrder.orgName,
			numIid: pageData.currSelectOrder.numIid,//'36042861282'
			plat: pageData.currSelectOrder.plat
		},function(data){
			$ionicLoading.hide();
			
			//页面视图数据展现处理
			pageData.orderDetail = data;

			pageData.orderDetail.picArr = pageData.orderDetail.picUrl.split(',');

			// $ionicSlideBoxDelegate.$getByHandle('productImgBox').update();

			pageData.isPageShow = true;

			
		},function(msg){
			$ionicLoading.hide();
			console.log(msg);
		});

	};
	/**
	 * [slideHasChanged description]
	 * @param  {[type]} $index [description]
	 * @return {[type]}        [description]
	 */
	pageFunc.slideHasChanged = function($index) {
		console.log("$index: " + $index);
	};

	$scope.pageData = pageData;
	pageFunc.init();


}]);

productsmodule.controller('showsCtrl', ['$rootScope', '$scope', '$http', '$state', '$stateParams', '$ionicLoading', 'productComm','$ionicSlideBoxDelegate','creatShow','SBMJSONP', function($rootScope, $scope, $http, $state, $stateParams, $ionicLoading, productComm,$ionicSlideBoxDelegate,creatShow,SBMJSONP) {

//获取宝贝秀列表
	$scope.goodsList = {
			orgName: $rootScope.orgName,
			pageNo: 1,
			pageSize: 50
		};
	$scope.goodsList.method = "softbanana.app.detail.list";
	var api = SBMJSONP("listDetail",$scope.goodsList);
	// $scope.datacomm = getDataComm;
	$http.jsonp(api.url)
		.success(function(data){
			console.log(0);
			console.log(data);
			for(var i in data.details){
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
			$scope.goodsListData = data.details;
		})
		.error(function(status,response){
			console.log("连接失败");
		});

	//删除
	$scope.dele = function(detailid){
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
				}else{
					console.log(data.map.errorMsg);
				}
			})
			.error(function(status,response){
				console.log("连接失败");
			});

	};

}]);



productsmodule.controller('liuliangCtrl', ['$rootScope', '$scope', '$http', '$state', '$stateParams', '$ionicLoading', 'productComm','$ionicSlideBoxDelegate','creatShow','SBMJSONP', function($rootScope, $scope, $http, $state, $stateParams, $ionicLoading, productComm,$ionicSlideBoxDelegate,creatShow,SBMJSONP) {

    $scope.goodsInfo = {
    	orgName:$rootScope.orgName,
		detailId:$stateParams.showId
	};
	$scope.goodsInfo.method = "softbanana.app.report.search";
	var api = SBMJSONP("searchReport",$scope.goodsInfo);
	// $scope.datacomm = getDataComm;
	$http.jsonp(api.url)
		.success(function(data){
			console.log(data);
			$scope.goodsInfoData = data;
		})
		.error(function(status,response){
			console.log("连接失败");
		});


}]);