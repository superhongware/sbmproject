
starterctrl.controller('ordersCtrl', ['$scope', '$ionicPopover','$http', function ($scope, $ionicPopover,$http) {


    console.log($http);

    var template = '<ion-popover-view><ion-content><ion-list><ion-item>ddd</ion-item><ion-item>顶顶顶</ion-item><ion-item>顶顶顶</ion-item></ion-list> </ion-content></ion-popover-view>';

    $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
    });

    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });


    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        console.log("$destroy");
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
        console.log("popover.hidden");

        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
        console.log("popover.removed");

        // Execute action
    });


}]);