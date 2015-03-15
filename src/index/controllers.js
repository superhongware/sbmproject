angular.module('starter.controllers', [])
.controller('mainviewCtrl', ['$scope','$state','myCookie','hrefGo', '$ionicLoading',function($scope,$state,myCookie,hrefGo,$ionicLoading){

	// $scope.$on('$stateChangeStart',function(evt, toState, toParams, fromState, fromParams) {
	// 	// console.log(toState.controller);
	// 	$scope.navbarhide=toState.controller!=="indexCtrl"?false:true;
	// });
	$scope.hrefGo=hrefGo;
	//首页隐藏top-nav-bar
	// $scope.$on('$stateChangeStart',function(evt, toState, toParams, fromState, fromParams) {
	// 	// console.log(toState.controller);
	// 	$scope.navbarhide=toState.controller!=="indexCtrl"?false:true;
	// 	$scope.sncybtnhide=toState.controller==="productsCtrl"?false:true;

	// });

	$scope.show= function(){
		$ionicLoading.show({
			template:"loading...",
			duration:2000
		});
	};
	$scope.hide=function(){
		$ionicLoading.hide();
	};

}])

//首页
.controller('indexCtrl', ['$scope','loginCheck',function($scope,loginCheck){
	// userName
	// console.log(myCookie.get("userId"));
	//$ionicHistory  清全部数据
  // .fromTemplate() method
	loginCheck();


}])
//我的订单
.controller('ordersCtrl', ['$scope','$ionicPopover','loginCheck',function($scope,$ionicPopover,loginCheck){


	var template = '<ion-popover-view><ion-content><ion-list><ion-item>未付款</ion-item><ion-item>已打印</ion-item><ion-item>未已发货</ion-item></ion-list> </ion-content></ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });

  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.openPopover = function($event) {
  	console.log("aa")
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
  	console.log("$destroy");
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
  	console.log("popover.hidden");

    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
  	console.log("popover.removed");

    // Execute action
  });


}])
//我的宝贝
.controller('productsCtrl', ['$scope','$ionicBackdrop', '$timeout','$http','$ionicLoading',function($scope,$ionicBackdrop,$timeout,$http,$ionicLoading){
	
	$scope.action = function() {
		$ionicBackdrop.retain();
		$timeout(function() {
			$ionicBackdrop.release();
		}, 1000);
	};
	$scope.products=[1,2,3];

	$scope.show= function(){
		$ionicLoading.show({
			template:"loading...",
			duration:2000
		});
	};
	$scope.doRefresh = function() {

		$http.get('/testdata/products.json')

		.success(function(newItems) {
			console.log(newItems);
			$scope.products = newItems;
		})

		.finally(function() {
			// Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	// console.log(0);
}])

.controller('contentCtrl',['$scope','$ionicSideMenuDelegate',function($scope,$ionicSideMenuDelegate){
	$scope.toggleLeft=function(){
		$ionicSideMenuDelegate.toggleLeft();
	};
	$scope.toggleLeft();
}])


//登录页
.controller('LoginCtrl', ['$scope','$rootScope','$state','myCookie',function($scope,$rootScope,$state,myCookie){
	// $rootScope.viewanimate="gogogo";
	$scope.login=function(){
		myCookie.add('shopname','shopname',0);
		$state.go("home");
	console.log(1);
	};

}])


//注册页
.controller('sign_upCtrl', ['$scope','$rootScope','$state',"$http",'$ionicPopup',function($scope,$rootScope,$state,$http,$ionicPopup){
	// $rootScope.viewanimate="goback";
	$scope.sign_up=function(){
		$ionicPopup.show({
			title:"注册成功",
			template:"注册消息已发送到邮箱，请妥善保管！",
			buttons:[{
				text:"我知道了",
				type:"button-energized",
				onTap:function(e){
					$state.go("shops");
				}
			}]
		});
	};

	$scope.sign_upForm={
		
	};
}]);