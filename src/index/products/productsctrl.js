/**
 * products Module
 *
 * 我的宝贝功能模块
 */
var productsmodule = angular.module('productsmodule', ['ionic', 'starter.services', 'starter.directives']);
productsmodule.controller('productsCtrl', ['$scope', '$ionicBackdrop', '$timeout', '$http', '$ionicLoading', '$rootScope', 'SBMJSONP', '$state', 'productComm', function($scope, $ionicBackdrop, $timeout, $http, $ionicLoading, $rootScope, SBMJSONP, $state, productComm) {


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
		currOrderStatus: productComm.commData.statusList[0],
		currShop: null,
		isHaveMoreData: false
	};


	pageFunc.init = function() {
		if (pageData.orgName && typeof(pageData.orgName) != 'undefined') {
			pageFunc.loadShopList();
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
	 * [loadShopList 加载店铺数据]
	 * @return {[type]} [description]
	 */
	pageFunc.loadShopList = function() {

		var api = SBMJSONP("searchShop", {
			method: 'softbanana.app.shop.search',
			orgName: 'work',
			pageNo: 1,
			pageSize: 50,
			action: ''
		});

		$http.jsonp(api.url)
			.success(function(data) {
				if (data.isSuccess && data.shops && data.shops.length > 0) {
					pageData.shopList = [];

					for (var i = 0; i < data.shops.length; i++) {
						if (data.shops[i].isInvalid) {
							pageData.shopList.push(data.shops[i]);
						}
					}

					pageData.shopList[0].checked = true;
					pageData.currShop = pageData.shopList[0];
					pageFunc.loadData();
				}
			})
			.error(function(status, response, a) {
				$ionicLoading.hide();
				console.log('数据查询连接失败');
			});
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

		pageData.lastId = 1;
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

		var date = new Date();

		var reqData = {
			method: 'softbanana.app.item.list',
			orgName: pageData.orgName,
			shopName: pageData.currShop.shopName,
			plat: pageData.currShop.plat,
			endDate: dateFormat(date, 'yyyy-MM-dd hh:mm:ss'),
		};

		date.setMonth(date.getMonth() - 1);
		reqData.startDate = dateFormat(date, 'yyyy-MM-dd hh:mm:ss');

		console.log('refreshServer reqData');
		console.log(reqData);

		var api = SBMJSONP("listItem", reqData);
		$http.jsonp(api.url)
			.success(function(data) {
				console.log('refreshServer');
				console.log(data);
				setTimeout(function() {
					pageFunc.loadDataComplete();
				}, 3000);
			})
			.error(function(status, response) {
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

		var reqData = {
			method: 'softbanana.app.item.search',
			orgName: pageData.orgName,
			shopName: pageData.currShop.shopName,
			status: pageData.currOrderStatus.status,
			action: pageData.direction,
			pageNo: pageData.lastId,
			pageSize: pageData.pageSize,
			plat: pageData.currShop.plat
		};
		console.log('reqData');
		console.log(reqData);
		var api = SBMJSONP("searchItem", reqData);

		$http.jsonp(api.url)
			.success(function(data) {
				console.log('loadData');
				console.log(data);
				pageFunc.loadDataComplete();

				if (isClearCurrData) {
					pageData.productList = [];
				}

				if (data.isSuccess && parseInt(data.totalCount) > 0 && data.trades && data.trades.length > 0) {

					//按id顺序排列
					data.trades.sort(function(a, b) {
						return parseInt(a.id) > parseInt(b.id) ? -1 : 1;
					});

					if (pageData.direction === 'up') { //moredata
						pageData.isHaveMoreData = true;
						for (var i = 0; i < data.trades.length; i++) {
							pageData.productList.push(data.trades[i]);
						}
					} else {
						if (pageData.direction === '') {
							pageData.isHaveMoreData = true;
						}
						for (var i = data.trades.length - 1; i >= 0; i--) {
							pageData.productList.unshift(data.trades[i]);
						}
					}

				} else {
					if (pageData.direction === 'up') {
						pageData.isHaveMoreData = false;
					}
				}

			})
			.error(function(status, response) {
				pageFunc.loadDataComplete();
				console.log('数据查询连接失败');
			});
	};


	$scope.pageData = pageData;
	$scope.pageFunc = pageFunc;

	pageFunc.init();


	$scope.action = function() {
		$ionicBackdrop.retain();
		$timeout(function() {
			$ionicBackdrop.release();
		}, 1000);
	};
	$scope.products = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33];

	$scope.show = function() {
		$ionicLoading.show({
			template: "loading...",
			duration: 2000
		});
	};
	$scope.doRefresh = function() {

		$http.get('/testdata/products.json')

		.success(function(newItems) {
			console.log(newItems);
			$scope.products = newItems;
		})

		.finally(function() {
			// Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	// console.log(0);
}]);