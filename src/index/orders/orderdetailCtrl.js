starterctrl.controller('orderdetailCtrl', ['$scope', '$http', '$state', 'SBMJSONP', '$ionicLoading', 'orderComm', function($scope, $http, $state, SBMJSONP, $ionicLoading, orderComm) {

	//测试数据
	var test = {
		orgName: '123',
		shopName: '789',
		tid: '10111',
		plat: '121212',
		getShop: function() {
			return this.orgName + this.shopName;
		}
	};
	console.log(test.getShop());
	test.orgName = 'sss';
	console.log(test.getShop());
	localStorage.setItem('currSelectOrder', JSON.stringify(test));

	var pageFunc = {},
		pageData = {};

	pageData = {
		currSelectOrder: JSON.parse(localStorage.getItem('currSelectOrder')),
		orderDetail: {}
	};

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

		var api = SBMJSONP("searchTradeDetail", {
			method: 'softbanana.app.trade.detail.search',
			orgName: pageData.currSelectOrder.orgName,
			shopName: pageData.currSelectOrder.shopName,
			tid: pageData.currSelectOrder.tid,
			plat: pageData.currSelectOrder.plat
		});

		$http.jsonp(api.url)
			.success(function(data) {
				$ionicLoading.hide();
				if (data.isSuccess) {
					pageData.orderDetail = data.trade;
					pageData.orderDetail.statusName = orderComm.func.getStatusName(pageData.orderDetail.status);
					
					if (!pageData.orderDetail.buyerMessage) 
						pageData.orderDetail.buyerMessage = '无';
					
				}
			})
			.error(function(status, response) {
				$ionicLoading.hide();
				console.log('数据查询连接失败');
			});
	};

	$scope.pageData = pageData;
	pageFunc.init();

}]);