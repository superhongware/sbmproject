/**
* starter Module
*
* Description
*/
angular.module('starter', ['ionic','starter.controllers', 'starter.services'])
.run(['$ionicPlatform','$rootScope', function($ionicPlatform,$rootScope){
	$rootScope.viewanimate="gogogo";
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}])
.config(['$stateProvider','$urlRouterProvider','$ionicConfigProvider',function($stateProvider,$urlRouterProvider,$ionicConfigProvider) {
	// $ionicConfigProvider.backButton.text("返回");
	$ionicConfigProvider.views.maxCache(1);
	$ionicConfigProvider.views.forwardCache(false);
	$ionicConfigProvider.templates.maxPrefetch(0);

	$stateProvider
	.state('login',{
		url:'/login',
		templateUrl:'templates/index/login.html',
		controller:'LoginCtrl'
	})
	.state('sign_up', {
		url: "/sign_up",
		templateUrl: "templates/index/sign_up.html",
		controller:'sign_upCtrl'
	})
	.state('home', {
		url: "/home",
		templateUrl: "templates/index/home.html",
		controller:'indexCtrl'
	})
	.state('shops', {
		url: "/shops",
		templateUrl: "templates/index/shops.html"
	})
	.state('details', {
		url: "/details",
		templateUrl: "templates/index/details.html"
	})
	.state('orders', {
		url: "/orders",
		templateUrl: "templates/index/orders.html",
		controller:"ordersCtrl"
	})
	.state('products', {
		url: "/products",
		templateUrl: "templates/index/products.html",
		controller:'productsCtrl'
	})
	.state('setting', {
		url: "/setting",
		templateUrl: "templates/index/setting.html"
	})
	.state('set-shopmanage', {
		url: "/set-shopmanage",
		templateUrl: "templates/index/setting/set-shopmanage.html"
	})
	.state('set-remind', {
		url: "/set-remind",
		templateUrl: "templates/index/setting/set-remind.html"
	})
	.state('set-feedback', {
		url: "/set-feedback",
		templateUrl: "templates/index/setting/set-feedback.html"
	})
	.state('set-aboutus', {
		url: "/set-aboutus",
		templateUrl: "templates/index/setting/set-aboutus.html"
	})
	//sidebar测试  正式上线删除
	.state('sidebartest',{
		url:"/sidebartest",
		templateUrl:"templates/index/sidebartest.html"
	})
	.state('checkproduct', {
		url: "/checkproduct",
		templateUrl: "templates/index/creatdetails/checkproduct.html",
		controller:'productsCtrl'
	});

	$urlRouterProvider.otherwise('/home');
	// $urlRouterProvider.otherwise('/login');
//http://codepen.io/ahsx/pen/mDcEd
}]);
