starterctrl.controller('orderdetailCtrl', ['$scope', '$http', '$state', 'SBMJSONP', '$ionicLoading', 'orderComm', function($scope, $http, $state, SBMJSONP, $ionicLoading, orderComm) {
	
	var pageFunc = {},
		pageData = {};

	pageData = {
		currSelectOrder: JSON.parse(localStorage.getItem('currSelectOrder')),
		orderDetail: {},
		isPageShow:false
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
					pageData.orderDetail.statusName = orderComm.getStatusName(pageData.orderDetail.status);

					if (!pageData.orderDetail.buyerMessage) 
						pageData.orderDetail.buyerMessage = '无';
					
					pageData.orderDetail.totalAmount = parseFloat(pageData.orderDetail.totalAmount);
					pageData.orderDetail.postFee = parseFloat(pageData.orderDetail.postFee);

					if (pageData.orderDetail.paymentType == 'ONLINE_PAYMENT') {//ONLINE_PAYMENT
						pageData.orderDetail.paymentType = '在线支付';
					}
					if (pageData.orderDetail.paymentType == 'COD') {
						pageData.orderDetail.paymentType = '货到付款';
					}

					pageData.orderDetail.orderDate = new Date(pageData.orderDetail.orderDate).getTime();

					pageData.isPageShow = true;
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