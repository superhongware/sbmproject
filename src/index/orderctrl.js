starterctrl.controller('ordersCtrl', ['$scope', '$ionicPopover', '$http', '$ionicLoading', function($scope, $ionicPopover, $http, $ionicLoading) {

    $scope.shopList = [{
        name: '上海百货'
    }, {
        name: '南宁百货'
    }];

    $scope.orderList = [{

    }];

    $scope.refreshServer = function() {

        $ionicLoading.show({
            template: "正在同步123..."
        });

        setTimeout(function() {
            $ionicLoading.hide();
        }, 2000);

    };


    $scope.refreshOrderList = function() {
        console.log('Refreshing!');
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000);

    };


    var template = '<ion-popover-view><ion-content><ion-list><ion-item>未付款</ion-item><ion-item>已打印</ion-item><ion-item>未已发货</ion-item></ion-list> </ion-content></ion-popover-view>';

    $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
    });


    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
        console.log('popover.hidden');
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
        console.log('popover.removed');
    });

    $scope.orderFilterShowEvent = function() {
        console.log('orderFilterShowEvent');
    };


    // $scope.doRefresh = function () {
    //     console.log(123123);
    //     return true;
    // };

    // $scope.openPopover = function ($event) {
    //     $scope.popover.show($event);
    // };
    // $scope.closePopover = function () {
    //     $scope.popover.hide();
    // };
    // //Cleanup the popover when we're done with it!
    // $scope.$on('$destroy', function () {
    //     console.log("$destroy");
    //     $scope.popover.remove();
    // });
    // // Execute action on hide popover
    // $scope.$on('popover.hidden', function () {
    //     console.log("popover.hidden");

    //     // Execute action
    // });
    // // Execute action on remove popover
    // $scope.$on('popover.removed', function () {
    //     console.log("popover.removed");

    //     // Execute action
    // });


}]);