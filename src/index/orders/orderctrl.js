starterctrl.controller('ordersCtrl', ['$scope', '$ionicPopover', '$http', '$ionicLoading', 'SBMJSONP', '$rootScope', '$state', 'dateFormat','orderComm', function($scope, $ionicPopover, $http, $ionicLoading, SBMJSONP, $rootScope, $state, dateFormat,orderComm) {

    /**
     * [pageData 模块数据]
     * @type {Object}
     */
    $scope.pageData = {
        lastId: 1,
        pageSize: 10,
        direction: '', //up next
        orgName: $rootScope.orgName,
        orderStatusList: orderComm.commData.orderStatusList, //状态筛选列表
        orderList: [], //订单数据
        shopList: [], //店铺数据
        currOrderStatus: {
            name: '全部',
            status: ''
        },
        currShop: null,
        isHaveMoreData: false

    };

    $scope.pageFunc = {
        loadDataComplete: function() {
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.pageData.isPostBack = true;
        }
    };

    console.log('orgName:' + $scope.pageData.orgName);

    /**
     * [loadShopList 加载店铺数据]
     * @return {[type]} [description]
     */
    $scope.loadShopList = function() {

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

    /**
     * [loadData 加载订单数据]
     * @param  {Boolean} isClearCurrData [是否清除当前视图数据]
     * @return {[type]}                  [description]
     */
    $scope.loadData = function(isClearCurrData) {

        if ($scope.pageData.direction != 'up') {
            $ionicLoading.show({
                template: "正在加载..."
            });
        }

        var reqData = {
            method: 'softbanana.app.trade.search',
            orgName: $scope.pageData.orgName,
            shopName: $scope.pageData.currShop.shopName,
            status: $scope.pageData.currOrderStatus.status,
            action: $scope.pageData.direction,
            pageNo: $scope.pageData.lastId,
            pageSize: $scope.pageData.pageSize,
            plat: $scope.pageData.currShop.plat
        };
        console.log('reqData');
        console.log(reqData);
        var api = SBMJSONP("searchTrade", reqData);
        $http.jsonp(api.url)
            .success(function(data) {
                console.log('loadData');
                console.log(data);
                $scope.pageFunc.loadDataComplete();

                if (isClearCurrData) {
                    $scope.pageData.orderList = [];
                }

                if (data.isSuccess && parseInt(data.totalCount) > 0 && data.trades && data.trades.length > 0) {

                    //按id顺序排列
                    data.trades.sort(function(a, b) {
                        return parseInt(a.id) > parseInt(b.id) ? -1 : 1;
                    });

                    if ($scope.pageData.direction === 'up') { //moredata
                        $scope.pageData.isHaveMoreData = true;
                        for (var i = 0; i < data.trades.length; i++) {
                            data.trades[i].statusName = orderComm.func.getStatusName(data.trades[i].status);
                            $scope.pageData.orderList.push(data.trades[i]);
                        }
                    } else {
                        if ($scope.pageData.direction === '') {
                            $scope.pageData.isHaveMoreData = true;
                        }
                        for (var i = data.trades.length - 1; i >= 0; i--) {
                            data.trades[i].statusName = orderComm.func.getStatusName(data.trades[i].status);
                            $scope.pageData.orderList.unshift(data.trades[i]);
                        }
                    }

                } else {
                    if ($scope.pageData.direction === 'up') {
                        $scope.pageData.isHaveMoreData = false;
                    }
                }

            })
            .error(function(status, response) {
                $scope.pageFunc.loadDataComplete();
                console.log('数据查询连接失败');
            });
    };

    /**
     * [showOrderStatusList 显示订单状态筛选列表]
     * @return {[type]} [description]
     */
    $scope.showOrderStatusList = function() {
        var arr = [];
        for (var i = 0; i < $scope.pageData.orderStatusList.length; i++) {
            if ($scope.pageData.currOrderStatus.name != $scope.pageData.orderStatusList[i].name) {
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
        console.log('refreshServer');
        $ionicLoading.show({
            template: "正在同步..."
        });

        var date = new Date();

        var reqData = {
            method: 'softbanana.app.trade.list',
            orgName: $scope.pageData.orgName,
            shopName: $scope.pageData.currShop.shopName,
            plat: $scope.pageData.currShop.plat,
            startDate: dateFormat(date,'yyyy-MM-dd hh:mm:ss'),
        };

        date.setMonth(date.getMonth()-1);
        reqData.endDate = dateFormat(date,'yyyy-MM-dd hh:mm:ss');

        console.log('refreshServer reqData');
        console.log(reqData);

        var api = SBMJSONP("listTrade", reqData);
        $http.jsonp(api.url)
            .success(function(data) {
                console.log('refreshServer');
                console.log(data);
                setTimeout(function() {
                    $scope.pageFunc.loadDataComplete();
                }, 3000);
            })
            .error(function(status, response) {
                $scope.pageFunc.loadDataComplete();
                console.log('数据查询连接失败');
            });
    };


    /**
     * [refreshOrderList 下拉刷新最新数据]
     * @return {[type]}
     */
    $scope.refreshOrderList = function() {
        console.log('refreshOrderList');
        $scope.pageData.direction = 'next';
        if ($scope.pageData.orderList.length > 0) {
            $scope.pageData.lastId = $scope.pageData.orderList[0].id;
        }
        $scope.loadData();
    };

    /**
     * [loadMoreData 上拉加载更多历史数据]
     * @return {[type]} [description]
     */
    $scope.loadMoreData = function() {

        console.log('loadMoreData');
        $scope.pageData.direction = 'up';
        if ($scope.pageData.orderList.length > 0) {
            $scope.pageData.lastId = $scope.pageData.orderList[$scope.pageData.orderList.length - 1].id;
        }
        $scope.loadData();

    };

    /**
     * [loadDataByStatusFilter 状态切换加载订单数据]
     * @param  {[type]} item [当前选择的状态对象]
     * @return {[type]}      [description]
     */
    $scope.loadDataByStatusFilter = function(item) {
        console.log('loadDataByStatusFilter');
        $scope.pageData.currOrderStatus = item;
        $scope.popover.hide();

        $scope.pageData.lastId = 1;
        $scope.pageData.direction = '';

        $scope.loadData(true);

    };

    /**
     * [loadDataByShop 店铺切换加载数据]
     * @param  {[type]} item [当前选择的店铺对象]
     * @return {[type]}      [description]
     */
    $scope.loadDataByShop = function(item) {
        console.log('loadDataByShop');
        $scope.pageData.currShop = item;

        for (var i in $scope.pageData.shopList) {
            $scope.pageData.shopList[i].checked = $scope.pageData.shopList[i].id === item.id;
        }

        $scope.pageData.lastId = 1;
        $scope.pageData.direction = '';

        $scope.loadData(true);

    };

    /**
     * 订单状态切换下拉模板
     *
     */
    $ionicPopover.fromTemplateUrl('pageTplorderStatusfilterPopover', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });


    var init = function() {
        if ($scope.pageData.orgName && typeof($scope.pageData.orgName) != 'undefined') {
            $scope.loadShopList();
        } else {
            $state.go("login");
        }
    };

    init();

}]);