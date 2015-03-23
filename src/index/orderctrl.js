
starterctrl.controller('ordersCtrl', ['$scope', '$ionicPopover','$http','$ionicLoading', function ($scope, $ionicPopover,$http,$ionicLoading) {

    $scope.shopList = [
        {
            name:'上海百货'
        },
        {
            name:'南宁百货'
        }
    ];

    $scope.show = function(){

        $ionicLoading.show({
            template:"正在加载..."
        });

        console.log(tesat);

        setTimeout(function(){
            $ionicLoading.hide();
        },2000);

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