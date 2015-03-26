starterctrl.controller('ordersCtrl', ['$scope', '$ionicPopover', '$http', '$ionicLoading', 'SBMJSONP', '$rootScope', '$state', function($scope, $ionicPopover, $http, $ionicLoading, SBMJSONP, $rootScope, $state) {

    $scope.pageData = {
        lastId: 1,
        pageSize: 10,
        direction: 'next', //up next
        orgName: $rootScope.orgName,
        orderStatusList: [{
            name: '已付款',
            status: 'PAID'
        }, {
            name: '未付款',
            status: 'NON_PAYMENT'
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
        }],
        orderList: [], //订单数据
        shopList: [], //店铺数据
        currOrderStatus: {
            name: '已付款',
            status: 'PAID'
        },
        currShop: null

    };

    $scope.pageFunc = {
        getShopListSelectClass:function(item){
            var result = '';
            if (item.name == $scope.pageData.currShop.name) {
                result = 'selectItem';
            }
            return result;
        }
    };

    console.log('orgName:' + $scope.pageData.orgName);

    /**
     * [loadShopList 加载店铺数据]
     * @return {[type]} [description]
     */
    $scope.loadShopList = function() {

        $ionicLoading.show({
            template: "正在加载..."
        });

        var api = SBMJSONP("searchShop", {
            method: 'softbanana.app.shop.search',
            orgName: 'work',
            pageNo: 1,
            pageSize: 50,
            action: 'next'
        });

        $http.jsonp(api.url)
            .success(function(data) {
                $ionicLoading.hide();
                if (data.isSuccess && data.shops && data.shops.length > 0) {
                    $scope.pageData.shopList = [];

                    for (var i = 0; i < data.shops.length; i++) {
                        if (data.shops[i].isInvalid) {
                            $scope.pageData.shopList.push(data.shops[i]);
                        }
                    }

                    $scope.pageData.shopList[0].checked = true;
                    $scope.pageData.currShop = $scope.pageData.shopList[0];
                    $scope.loadData();
                }
            })
            .error(function(status, response, a) {
                $ionicLoading.hide();
                console.log('数据查询连接失败');
            });
    };
    

    $scope.loadData = function() {
        var api = SBMJSONP("searchTrade", {
            method: 'softbanana.app.trade.search',
            orgName: $scope.pageData.orgName,
            shopName: $scope.pageData.currShop.shopName,
            status:$scope.pageData.currOrderStatus.status,
            action:$scope.pageData.direction,
            pageNo:$scope.pageData.lastId,
            pageSize:$scope.pageData.pageSize,
            plat:$scope.pageData.currShop.plat
        });
        $http.jsonp(api.url)
            .success(function(data) {
                console.log(data);

                if (data.isSuccess && parseInt(data.totalCount) > 0) {

                    if ($scope.pageData.direction == 'up') {
                        
                    }else{

                    }

                }

            })
            .error(function(status, response) {
                console.log('数据查询连接失败');
            });
    };

    $scope.showOrderStatusList = function() {
        var arr = [];
        for (var i = 0; i < $scope.pageData.orderStatusList.length; i++) {
            if ($scope.pageData.currOrderStatusName != $scope.pageData.orderStatusList[i].name) {
                arr.push($scope.pageData.orderStatusList[i]);
            }
        }
        return arr;
    };

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

        for (var i = 0; i < 3; i++) {
            $scope.pageData.orderList.unshift({
                picUrl: 'http://zhaoyanblog.com/wp-content/uploads/2014/03/20140319215736751.png',
                title: '小西装' + i,
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

        for (var i = 0; i < 3; i++) {
            $scope.pageData.orderList.push({
                picUrl: 'http://zhaoyanblog.com/wp-content/uploads/2014/03/20140319215736751.png',
                title: '小西装' + i,
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
        $scope.pageData.currOrderStatusName = item.name;
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

        $scope.pageData.currShop = item;

        for (var i in $scope.pageData.shopList) {
            $scope.pageData.shopList[i].checked = $scope.pageData.shopList[i].id === item.id;
        }

        setTimeout(function() {
            $ionicLoading.hide();
        }, 1000);
    };

    $ionicPopover.fromTemplateUrl('pageTplorderStatusfilterPopover', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMoreData();
    });


    var init = function() {
        if ($scope.pageData.orgName && typeof($scope.pageData.orgName) != 'undefined') {
            $scope.loadShopList();
        } else {
            $state.go("login");
        }
    };

    init();


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