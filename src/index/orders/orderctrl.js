starterctrl.controller('ordersCtrl', ['$scope', '$ionicPopover', '$http', '$ionicLoading', 'SBMJSONP', '$rootScope', '$state', 'dateFormat', 'orderComm', 'getDataComm', function($scope, $ionicPopover, $http, $ionicLoading, SBMJSONP, $rootScope, $state, dateFormat, orderComm, getDataComm) {


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
        orderStatusList: orderComm.orderStatusList, //状态筛选列表
        orderList: [], //订单数据
        shopList: [], //店铺数据
        currOrderStatus: {
            name: '全部',
            status: ''
        },
        currShop: null,
        isHaveMoreData: false
    };

    pageFunc.init = function() {
        if (pageData.orgName && typeof(pageData.orgName) != 'undefined') {
            getDataComm.loadShopList(function(data) {
                if (data && data.length > 0) {
                    for(var a in data){
                        var b = data[a].plat;
                        data[a].img = getDataComm.platObj[b].imgSrc;
                    }
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
     * [loadData 加载订单数据]
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
            method: 'softbanana.app.trade.search',
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
        var api = SBMJSONP("searchTrade", reqData);
        $http.jsonp(api.url)
            .success(function(data) {
                console.log('loadData');
                console.log(data);
                for(var i in data.trades){
                    data.trades[i].orderDate = data.trades[i].orderDate.substr(0,10);
                }
                pageFunc.loadDataComplete();

                if (isClearCurrData) {
                    pageData.orderList = [];
                }

                if (data.isSuccess && parseInt(data.totalCount) > 0 && data.trades && data.trades.length > 0) {

                    //按id顺序排列
                    data.trades.sort(function(a, b) {
                        return parseInt(a.id) > parseInt(b.id) ? -1 : 1;
                    });

                    
                    if (pageData.direction === 'up') { //moredata
                        pageData.isHaveMoreData = true;
                        for ( i = 0; i < data.trades.length; i++) {
                            data.trades[i].statusName = orderComm.getStatusName(data.trades[i].status);
                            pageData.orderList.push(data.trades[i]);
                        }
                    } else {
                        if (pageData.direction === '') {
                            pageData.isHaveMoreData = true;
                        }
                        for ( i = data.trades.length - 1; i >= 0; i--) {
                            data.trades[i].statusName = orderComm.getStatusName(data.trades[i].status);
                            pageData.orderList.unshift(data.trades[i]);
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

    /**
     * [showOrderStatusList 显示订单状态筛选列表]
     * @return {[type]} [description]
     */
    pageFunc.showOrderStatusList = function() {
        var arr = [];
        for (var i = 0; i < pageData.orderStatusList.length; i++) {
            if (pageData.currOrderStatus.name != pageData.orderStatusList[i].name) {
                arr.push(pageData.orderStatusList[i]);
            }
        }
        return arr;
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
            method: 'softbanana.app.trade.list',
            orgName: pageData.orgName,
            shopName: pageData.currShop.shopName,
            plat: pageData.currShop.plat,
            endDate: dateFormat(date, 'yyyy-MM-dd hh:mm:ss'),
        };

        date.setMonth(date.getMonth() - 1);
        reqData.startDate = dateFormat(date, 'yyyy-MM-dd hh:mm:ss');

        console.log('refreshServer reqData');
        console.log(reqData);

        var api = SBMJSONP("listTrade", reqData);
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
     * [refreshOrderList 下拉刷新最新数据]
     * @return {[type]}
     */
    pageFunc.refreshOrderList = function() {
        console.log('refreshOrderList');
        pageData.direction = 'next';
        if (pageData.orderList.length > 0) {
            pageData.lastId = pageData.orderList[0].id;
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
        if (pageData.orderList.length > 0) {
            pageData.lastId = pageData.orderList[pageData.orderList.length - 1].id;
        }
        pageFunc.loadData();

    };

    /**
     * [loadDataByStatusFilter 状态切换加载订单数据]
     * @param  {[type]} item [当前选择的状态对象]
     * @return {[type]}      [description]
     */
    pageFunc.loadDataByStatusFilter = function(item) {
        console.log('loadDataByStatusFilter');
        pageData.currOrderStatus = item;
        $scope.popover.hide();

        pageData.lastId = 1;
        pageData.direction = '';

        pageFunc.loadData(true);

    };

    /**
     * [loadDataByShop 店铺切换加载数据]
     * @param  {[type]} item [当前选择的店铺对象]
     * @return {[type]}      [description]
     */
    pageFunc.loadDataByShop = function(item, $index) {
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
     * [showOrderDetail 展现订单详情]
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    pageFunc.showOrderDetail = function(item) {
        var currSelectOrder = {
            orgName: pageData.orgName,
            shopName: item.shopName,
            tid: item.orderNumber,
            plat: item.plat
        };
        localStorage.setItem('currSelectOrder', JSON.stringify(currSelectOrder));
        $state.go("orderdetail");
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

    $scope.pageData = pageData;
    $scope.pageFunc = pageFunc;

    pageFunc.init();

}]);