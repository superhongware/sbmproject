/**
 * creatshowmodule Module
 *
 * 创建宝贝秀功能
 */
var creatshowmodule = angular.module('creatshowmodule', ['ionic', 'starter.services', 'starter.directives']);

creatshowmodule.controller('checkproductCtrl', ['$scope', '$ionicLoading', '$rootScope', '$state', 'productComm', 'getDataComm', function($scope, $ionicLoading, $rootScope, $state, productComm, getDataComm) {

		$rootScope.orgName="work";

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


}])
.controller('checktemplateCtrl', ['$scope','$stateParams', function($scope,$stateParams){
	


	//宝贝ID
	$scope.productId=$stateParams.productId;
	$scope.templateId=1;

	//根据模板创建宝贝秀
	$scope.creatShow=function(templateId){
		$http.get("testdata/template.json")
		.success(function(){

		})
		.error(function(){
			alert("获取数据失败");
		})
	};


}])

.factory('creatShow', ['$rootScope','$http','SBMJSONP',function($rootScope,$http,SBMJSONP){
	return function creatShow(templateId,callback,errorcallback){
		var showdata = {
			orgName: $rootScope.orgName,
			action:"",//向上（up）或者向下（next）查询
			pageNo:"",//自增长ID
			pageSize:10,//条数
			method:"softbanana.app.template.list"
		};
	};
}])

.factory('getTemplate', ['$rootScope','$http','SBMJSONP',function($rootScope,$http,SBMJSONP){
	return function creatShow(callback,errorcallback){
		//获取模板列表
		var templatesdata = {
			orgName: $rootScope.orgName,
			action:"",//向上（up）或者向下（next）查询
			pageNo:"",//自增长ID
			pageSize:10,//条数
			method:"softbanana.app.template.list"
		};
		var api = SBMJSONP("listTemplate",templatesdata);
		$http.jsonp(api.url)
			.success(function(data) {
				callback(data)
			})
			.error(function(status, response) {
				errorcallback(status, response);
			});
	};
}])
;