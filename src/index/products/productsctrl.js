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
			
			

	$scope.pageData = {
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

			//取缓存
			var pageDatasession=JSON.parse(sessionStorage.getItem("pageData"));
			if(pageDatasession){
				//有缓存 直接读缓存
				$scope.pageData=pageDatasession;
				//有缓存 回到页面之前的位置
				setTimeout(function() {
					if ($rootScope.zmyscrollTop && $rootScope.zmyscrollTop > 0) {

						$ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, $rootScope.zmyscrollTop);
						$rootScope.zmyscrollTop = 0
					} else {
						$rootScope.zmyscrollTop = 0
					}
				})

				return;
			}

			console.log(['pageData.pageViewState',$scope.pageData.pageViewState]);
			if ($scope.pageData.pageViewState) {
				$scope.pageData.currShop = $scope.pageData.pageViewState.currShop;
				$scope.pageData.currStatus = $scope.pageData.pageViewState.currStatus;

				$scope.pageData.isOnsaleStatus = $scope.pageData.currStatus == 'onsale';
			} else {
				$scope.pageData.pageViewState = {
					currShop: {},
					currStatus: 'onsale'
				};
			}
				
			//如果是淘小铺版本,直接加载数据，不用加载店铺的其他数据了
			if ($rootScope.istaobao) {
				$scope.pageData.currShop={
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
					$scope.pageData.shopList = data;
					if ($scope.pageData.currShop === null) {
						$scope.pageData.currShop = $scope.pageData.shopList[0];
					}else{
						pageFunc.setSelectShop($scope.pageData.currShop);
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
		$scope.pageData.pageViewState.currShop = currShop;
		$scope.pageData.pageViewState.currStatus = currStatus;
		//更新上下架状态
		$scope.pageData.currStatus = currStatus;
		//更新上下架按钮样式
		$scope.pageData.isOnsaleStatus = currStatus == 'onsale';

		sessionStorage.setItem('productListPageViewState', JSON.stringify($scope.pageData.pageViewState));
	};

	pageFunc.loadDataComplete = function() {
		$ionicLoading.hide();
		$scope.$broadcast('scroll.refreshComplete');
		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.pageData.isPostBack = true;		
	};


	/**
	 * [loadDataByShop 店铺切换加载数据]
	 * @param  {[type]} item [当前选择的店铺对象]
	 * @return {[type]}      [description]
	 */
	pageFunc.loadDataByShop = function(item) {
		console.log('loadDataByShop');

		pageFunc.setSelectShop(item);

		$scope.pageData.lastId = '';
		$scope.pageData.direction = '';

		pageFunc.loadData(true);


	};

	pageFunc.setSelectShop = function(item){
		for (var i in $scope.pageData.shopList) {
			if($scope.pageData.shopList[i].id === item.id){
				$scope.pageData.shopList[i].checked = true;
				$scope.pageData.currShop=$scope.pageData.shopList[i];
			}else{
				$scope.pageData.shopList[i].checked=false;
			}
		}
		//设置 当前上下架状态 跟 当前门店
		pageFunc.setCurrPageViewState(
			$scope.pageData.currShop,
			// $scope.pageData.pageViewState.currStatus === null ? 'onsale' : $scope.pageData.pageViewState.currStatus
			'onsale'

		);
		console.log(["设置店铺",$scope.pageData.currShop])
	};


	/**
	 * [refreshServer 刷新远程数据]
	 * @return {[type]}
	 */
	pageFunc.refreshServer = function() {
		// alert(0)
		if(!$scope.pageData.currShop){
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
			shopName: $scope.pageData.currShop.shopName,
			plat: $scope.pageData.currShop.plat,
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
		$scope.pageData.direction = 'next';
		if ($scope.pageData.productList.length > 0) {
			$scope.pageData.lastId = $scope.pageData.productList[0].id;
		
		}
		
		pageFunc.loadData();
	};

	/**
	 * [loadMoreData 上拉加载更多历史数据]
	 * @return {[type]} [description]
	 */
	pageFunc.loadMoreData = function() {
		console.log('loadMoreData');
		$scope.pageData.direction = 'up';
		if ($scope.pageData.productList.length > 0) {
			$scope.pageData.lastId = $scope.pageData.productList[$scope.pageData.productList.length - 1].id;
		}
		pageFunc.loadData();

	};

	/**
	 * [loadDataByStatus 根据状态筛选产品]
	 * @param  {[type]} status [状态：onsale、instock]
	 * @return {[type]}        [description]
	 */
	pageFunc.loadDataByStatus = function(status) {
		$scope.pageData.lastId = '';
		$scope.pageData.direction = '';
		$scope.pageData.currStatus = status;
		pageFunc.setCurrPageViewState(
			$scope.pageData.pageViewState.currShop === null ? $scope.pageData.shopList[0] : $scope.pageData.pageViewState.currShop,
			$scope.pageData.currStatus
		);
		pageFunc.loadData(true);
	};

	/**
	 * [loadData 加载产品数据]
	 * @param  {Boolean} isClearCurrData [是否清除当前视图数据]
	 * @return {[type]}                  [description]
	 */
	pageFunc.loadData = function(isClearCurrData) {

		if ($scope.pageData.direction != 'up') {
			$ionicLoading.show({
				template: "正在加载...",
				duration:2000
			});

		}


		console.log(['$scope.pageData',$scope.pageData])

		var option = {
			shopName: $scope.pageData.currShop.shopName,
			status: $scope.pageData.currStatus,
			action: $scope.pageData.direction,
			pageNo: $scope.pageData.lastId,
			pageSize: $scope.pageData.pageSize,
			plat: $scope.pageData.currShop.plat
		};

		console.log(['pageFunc.loadData option',option]);
		// console.log(option);


		productComm.loadProductData(option, function(data) {

 
			// alert(JSON.stringify(data))
			console.log(['productComm.loadProductData',data]);

			pageFunc.loadDataComplete();
           
			if (data.length === 0 && $scope.pageData.direction === 'up') {
               
				//第一次就没数据提示没有上架中的宝贝  让用户同步宝贝
				if($scope.thereisnoproduct===""){
					$scope.thereisnoproduct=true;
					 $(".noproduct-bg").show()

				}
				$scope.pageData.isHaveMoreData = false;
				return;
			}else{
				//有数据  不提示同步宝贝
				$scope.thereisnoproduct=false;
			}

			if (isClearCurrData) {
				$scope.pageData.productList = [];
			}
			if ($scope.pageData.direction === 'up') { //moredata
				$scope.pageData.productList = $scope.pageData.productList.concat(data);
			} else {
				$scope.pageData.productList = data.concat($scope.pageData.productList);
			}

			if ($scope.pageData.isPostBack && ($scope.pageData.direction === 'up' || $scope.pageData.direction === '') && data.length > 0) {
				$scope.pageData.isHaveMoreData = true;
			}



			$scope.pageData.isPostBack = true;

			sessionStorage.setItem("pageData",JSON.stringify($scope.pageData));


		}, function(status, response, msg) {
			pageFunc.loadDataComplete();
			console.log('数据查询连接失败');
		});

	};

	pageFunc.showDetail = function(item) {
		var currSelectProduct = {
			orgName: $scope.pageData.orgName,
			numIid: item.numIid,
			plat: item.plat
		};
		$rootScope.zmyscrollTop = $ionicScrollDelegate.getScrollPosition().top;
		
		localStorage.setItem('currSelectProduct', JSON.stringify(currSelectProduct));
		$state.go("productDetail");
	};

	$scope.pageFunc = pageFunc;

	loginCheck();
	pageFunc.init();

}]);






