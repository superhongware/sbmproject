/**
 * products Module
 *
 * 我的宝贝功能模块
 */
var productsmodule = angular.module('productsmodule', ['ionic', 'starter.services', 'starter.directives']);
productsmodule.controller('productsCtrl', [
'$scope', '$ionicLoading', '$rootScope', '$state','$ionicScrollDelegate', 'productComm', 'getDataComm', 'loginCheck','TBAPI','showedition',
function($scope, $ionicLoading, $rootScope, $state,$ionicScrollDelegate, productComm, getDataComm,loginCheck,TBAPI,showedition) {

	//隐藏淘宝标题栏
	TBAPI.hideTitle();


// console.log(loginCheck);

	var pageData = {},
		pageFunc = {};

	//是否有宝贝数据
	$scope.thereisnoproduct="";


// alert(sessionStorage.getItem('productListPageViewState'))
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
		pageViewState: JSON.parse(sessionStorage.getItem('productListPageViewState')) //{currShop,currStatus}
	};

	$scope.showediticon=function(index){
		showedition(index);
	};

	// $scope.goandseead=function(){
	// 	alert(0);
	// };
	// alert(JSON.stringify(pageData.pageViewState));
			// debugger;

	pageFunc.init = function() {
		// if (pageData.orgName && typeof(pageData.orgName) != 'undefined') {

			console.log(['pageData.pageViewState',pageData.pageViewState]);
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
				
			//如果是淘小铺版本,直接加载数据，不用加载店铺的其他数据了
			if ($rootScope.istaobao) {
				pageData.currShop={
					plat:  $rootScope.plat,
					shopName: $rootScope.shopName
				};
				pageFunc.loadData();
				return;
			}


			getDataComm.loadShopList(function(data) {
				console.log(['店铺数据1',data]);

				if (data && data.length > 0) {
					for(var a in data){
						var b = data[a].plat;
						data[a].img = getDataComm.platObj[b].imgSrc;
					}
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
			}, function(data) {
				console.log(['店铺数据',data]);
			});
		// } else {
		// 	$state.go("home");
		// }
	};

	pageFunc.setCurrPageViewState = function(currShop, currStatus) {
		pageData.pageViewState.currShop = currShop;
		pageData.pageViewState.currStatus = currStatus;
		//更新上下架状态
		pageData.currStatus = currStatus;
		//更新上下架按钮样式
		pageData.isOnsaleStatus = currStatus == 'onsale';

		sessionStorage.setItem('productListPageViewState', JSON.stringify(pageData.pageViewState));
	};

	pageFunc.loadDataComplete = function() {
		$ionicLoading.hide();
		$scope.$broadcast('scroll.refreshComplete');
		$scope.$broadcast('scroll.infiniteScrollComplete');
		pageData.isPostBack = true;
      
		setTimeout(function(){
			
			if($rootScope.zmyscrollTop&&$rootScope.zmyscrollTop>0){
				
				$ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0,$rootScope.zmyscrollTop);$rootScope.zmyscrollTop=0
			}
			else{
				$rootScope.zmyscrollTop=0
			}
			
			
		})


		
		
		
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
			if(pageData.shopList[i].id === item.id){
				pageData.shopList[i].checked = true;
				pageData.currShop=pageData.shopList[i];
			}else{
				pageData.shopList[i].checked=false;
			}
		}
		//设置 当前上下架状态 跟 当前门店
		pageFunc.setCurrPageViewState(
			pageData.currShop,
			// pageData.pageViewState.currStatus === null ? 'onsale' : pageData.pageViewState.currStatus
			'onsale'

		);
		console.log(["设置店铺",pageData.currShop])
	};


	/**
	 * [refreshServer 刷新远程数据]
	 * @return {[type]}
	 */
	pageFunc.refreshServer = function() {
		// alert(0)
		if(!pageData.currShop){
			$ionicLoading.show({
				template: "没有店铺，无法同步",
				duration:2000,
			});
			return;
		}

		$ionicLoading.show({
			template: "正在同步..."
		});

		productComm.refreshServer({
			shopName: pageData.currShop.shopName,
			plat: pageData.currShop.plat,
		}, function(data) {
			$ionicLoading.hide();
			// console.log();
			console.log(['refreshServer',data]);
		}, function(data) {
			pageFunc.loadDataComplete();
			console.log('数据查询连接失败');
		});
			// alert(1)

		setTimeout(function() {
			// alert(0)
			pageFunc.loadDataComplete();
		}, 3000);

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
				template: "正在加载...",
				duration:2000
			});

		}


		console.log(['pageData',pageData])

		var option = {
			shopName: pageData.currShop.shopName,
			status: pageData.currStatus,
			action: pageData.direction,
			pageNo: pageData.lastId,
			pageSize: pageData.pageSize,
			plat: pageData.currShop.plat
		};

		console.log(['pageFunc.loadData option',option]);
		// console.log(option);


		productComm.loadProductData(option, function(data) {

 
			// alert(JSON.stringify(data))
			console.log(['productComm.loadProductData',data]);

			pageFunc.loadDataComplete();
           
			if (data.length === 0 && pageData.direction === 'up') {
               
				//第一次就没数据提示没有上架中的宝贝  让用户同步宝贝
				if($scope.thereisnoproduct===""){
					$scope.thereisnoproduct=true;
					 $(".noproduct-bg").show()

				}
				pageData.isHaveMoreData = false;
				return;
			}else{
				//有数据  不提示同步宝贝
				$scope.thereisnoproduct=false;
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
		$rootScope.zmyscrollTop = $ionicScrollDelegate.getScrollPosition().top;
		
		localStorage.setItem('currSelectProduct', JSON.stringify(currSelectProduct));
		$state.go("productDetail");
	};

	$scope.pageData = pageData;
	$scope.pageFunc = pageFunc;

	loginCheck();
	pageFunc.init();

}]);






