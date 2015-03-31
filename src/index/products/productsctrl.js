/**
 * products Module
 *
 * 我的宝贝功能模块
 */
var productsmodule = angular.module('productsmodule', ['ionic', 'starter.services', 'starter.directives']);
productsmodule.controller('productsCtrl', ['$scope','$ionicLoading', '$rootScope', '$state', 'productComm', 'getDataComm', function($scope, $ionicLoading, $rootScope,  $state, productComm, getDataComm) {


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
		currShop: null,
		isHaveMoreData: false
	};


	pageFunc.init = function() {
		if (pageData.orgName && typeof(pageData.orgName) != 'undefined') {
			getDataComm.loadShopList(function(data) {
				if (data && data.length > 0) {
					pageData.shopList = data;
					pageData.currShop = pageData.shopList[0];
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
		pageData.currShop = item;

		for (var i in pageData.shopList) {
			pageData.shopList[i].checked = pageData.shopList[i].id === item.id;
		}

		pageData.lastId = '';
		pageData.direction = '';

		pageFunc.loadData(true);

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
	pageFunc.loadDataByStatus = function(status){
		pageData.lastId = '';
		pageData.direction = '';
		pageData.currStatus = status;

		pageFunc.loadData(true);
	}

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

			if (data.length == 0 && pageData.direction === 'up') {
				pageData.isHaveMoreData = false;
				return;
			}

			if (isClearCurrData) {
				pageData.productList = [];
			}
			if (pageData.direction === 'up') { //moredata
				pageData.isHaveMoreData = true;
				pageData.productList = pageData.productList.concat(data);
			} else {
				if (pageData.direction === '') {
					pageData.isHaveMoreData = true;
				}
				pageData.productList = data.concat(pageData.productList);
			}
			console.log('pageData.productList');
			console.log(pageData.productList);

		}, function(status, response, msg) {
			pageFunc.loadDataComplete();
			console.log('数据查询连接失败');
		});

	};

	pageFunc.showDetail = function(item){
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



productsmodule.controller('productDetailCtrl', ['$scope', '$http', '$state', 'SBMJSONP', '$ionicLoading', 'orderComm', function($scope, $http, $state, SBMJSONP, $ionicLoading, orderComm) {


	var pageFunc = {},
		pageData = {};

	pageData = {
		currSelectOrder: JSON.parse(localStorage.getItem('currSelectProduct')),
		orderDetail: {}
	};

	console.log(pageData);

	/**
	 * [init 模块入口]
	 * @return {[type]} [description]
	 */
	pageFunc.init = function() {
		if (pageData.currSelectOrder) {
			pageFunc.loadOrderDetail();
		} else {
			$state.go('orders');
		}
	};

	/**
	 * [loadOrderDetail 加载订单详情]
	 * @return {[type]} [description]
	 */
	pageFunc.loadOrderDetail = function() {
		$ionicLoading.show({
			template: "正在加载..."
		});

		var reqData = {
			method: 'softbanana.app.trade.detail.search',
			orgName: pageData.currSelectOrder.orgName,
			shopName: pageData.currSelectOrder.shopName,
			tid: pageData.currSelectOrder.tid,
			plat: pageData.currSelectOrder.plat
		};

		var api = SBMJSONP("searchTradeDetail", reqData);

		console.log('loadOrderDetail');
		console.log(reqData);

		$http.jsonp(api.url)
			.success(function(data) {
				console.log(data);
				$ionicLoading.hide();
				if (data.isSuccess) {
					pageData.orderDetail = data.trade;
					pageData.orderDetail.statusName = orderComm.func.getStatusName(pageData.orderDetail.status);

					if (!pageData.orderDetail.buyerMessage)
						pageData.orderDetail.buyerMessage = '无';

					pageData.orderDetail.totalAmount = parseFloat(pageData.orderDetail.totalAmount);
					pageData.orderDetail.postFee = parseFloat(pageData.orderDetail.postFee);

					if (pageData.orderDetail.paymentType == 'ONLINE_PAYMENT') { //ONLINE_PAYMENT
						pageData.orderDetail.paymentType = '在线支付';
					}
					if (pageData.orderDetail.paymentType == 'COD') {
						pageData.orderDetail.paymentType = '货到付款';
					}

					pageData.orderDetail.orderDate = new Date(pageData.orderDetail.orderDate).getTime();

				}
			})
			.error(function(status, response) {
				$ionicLoading.hide();
				console.log('数据查询连接失败');
			});
	};

	$scope.pageData = pageData;
	//pageFunc.init();


}]);