starterctrl.controller('ordersCtrl', ['$scope', '$ionicPopover', '$http', '$ionicLoading', function($scope, $ionicPopover, $http, $ionicLoading) {

    $scope.moduleOption = {

    };

    $scope.shopList = [{
		name: '上海百货',
        value: '上海百货',
        checked:1,
    }, {
        name: '南宁百货',
        value: '南宁百货',
        checked:0,

    }, {
        name: '世贸商城',
        value: '世贸商城',
        checked:0,

    }];

    $scope.orderList = [{
        picUrl: 'http://zhaoyanblog.com/wp-content/uploads/2014/03/20140319215736751.png',
        title: '小西装',
        status: 'PAID',
        totalAmount: '233',
        orderCount: '100',
        shopName: '上海百货',
        plat: '天猫' //平台类型
    }];

    $scope.orderStatusList = [{
        name: '未付款',
        status: 'NON_PAYMENT'
    }, {
        name: '已付款',
        status: 'PAID'
    }, {
        name: '已打印',
        status: 'PRINTED'
    }, {
        name: '已发货',
        status: 'DELIVERED'
    }, {
        name: '已取消',
        status: 'CANCELED'
    }, {
        name: '已完成',
        status: 'COMPLETED'
    }];

    $scope.showOrderStatusList = function() {
        var arr = [];
        for (var i = 0; i < $scope.orderStatusList.length; i++) {
            if ($scope.currOrderStatusName != $scope.orderStatusList[i].name) {
                arr.push($scope.orderStatusList[i]);
            }
        }
        return arr;
    };

    $scope.pageData = {
        currShop:$scope.shopList[0]
    };

    // $scope.pageFunc = {
    //     getShopListSelectClass:function(item){
    //         var result = '';
    //         if (item.name == $scope.pageData.currShop.name) {
    //             result = 'selectItem';
    //         }
    //         return result;
    //     }
    // };

    $scope.currOrderStatusName = $scope.orderStatusList[0].name;

    /**
     * [refreshServer 刷新远程数据]
     * @return {[type]}
     */
    $scope.refreshServer = function() {

        $ionicLoading.show({
            template: "正在同步..."
        });

        setTimeout(function() {
            $ionicLoading.hide();
        }, 2000);

    };


    /**
     * [refreshOrderList 上拉刷新]
     * @return {[type]}
     */
    $scope.refreshOrderList = function() {

        console.log('Refreshing!');


        for (var i = 0; i < 5; i++) {
            $scope.orderList.push({
                picUrl: 'http://zhaoyanblog.com/wp-content/uploads/2014/03/20140319215736751.png',
                title: '小西装',
                status: 'PAID',
                totalAmount: '233',
                orderCount: '100',
                shopName: '上海百货',
                plat: '天猫' //平台类型
            });
        }


        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000);

    };


    $scope.loadMoreData = function() {
        console.log('loadMoreData');

        for (var i = 0; i < 5; i++) {
            $scope.orderList.push({
                picUrl: 'http://zhaoyanblog.com/wp-content/uploads/2014/03/20140319215736751.png',
                title: '小西装',
                status: 'PAID',
                totalAmount: '233',
                orderCount: '100',
                shopName: '上海百货',
                plat: '天猫' //平台类型
            });
        }

        $scope.$broadcast('scroll.infiniteScrollComplete');

    };

    $scope.loadDataByStatusFilter = function(item) {
        $scope.currOrderStatusName = item.name;
        $scope.popover.hide();

        $ionicLoading.show({
            template: "正在加载..."
        });

        setTimeout(function() {
            $ionicLoading.hide();
        }, 1000);
    };

    $scope.loadDataByShop = function(item) {
        $ionicLoading.show({
            template: "正在加载..."
        });

        console.log(item.value);
        //控制样式变化
        for (var i in $scope.shopList) {
        	var checked = $scope.shopList[i].value===item.value;
        	$scope.shopList[i].checked=checked;
        }

        $scope.pageData.currShop = item;

        setTimeout(function() {
            $ionicLoading.hide();
        }, 1000);
    };

    $ionicPopover.fromTemplateUrl('/templates/index/orders/orderStatusfilterPopover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });


    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMoreData();
    });


    // $scope.openPopover = function($event) {
    //     $scope.popover.show($event);
    // };
    // $scope.closePopover = function() {
    //     $scope.popover.hide();
    // };
    // //Cleanup the popover when we're done with it!
    // $scope.$on('$destroy', function() {
    //     $scope.popover.remove();
    // });
    // // Execute action on hide popover
    // $scope.$on('popover.hidden', function() {
    //     console.log('popover.hidden');
    // });
    // // Execute action on remove popover
    // $scope.$on('popover.removed', function() {
    //     console.log('popover.removed');
    // });

}]);