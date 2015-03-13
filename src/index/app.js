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
.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider) {
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
	.state('sbmview', {
		url: "/sbmview",
		abstract: true,
		templateUrl: "templates/sbmview/sbmview.html"
	})
	.state('sbmview.index', {
		url: "/index",
		templateUrl: "templates/sbmview/sbm-index.html",
		controller:'indexCtrl'
	})
	.state('sbmview.shops', {
		url: "/shops",
		templateUrl: "templates/sbmview/sbm-shops.html"
	})
	.state('sbmview.details', {
		url: "/details",
		templateUrl: "templates/sbmview/sbm-details.html"
	})
	.state('sbmview.orders', {
		url: "/orders",
		templateUrl: "templates/sbmview/sbm-orders.html"
	})
	.state('sbmview.products', {
		url: "/products",
		templateUrl: "templates/sbmview/sbm-products.html",
		controller:'productsCtrl'
	})
	.state('sbmview.setting', {
		url: "/setting",
		templateUrl: "templates/sbmview/sbm-setting.html"
	})
	.state('sbmview.checkproduct', {
		url: "/checkproduct",
		templateUrl: "templates/sbmview/creatdetails/checkproduct.html",
		controller:'productsCtrl'
	});


	$urlRouterProvider.otherwise('/sbmview/authorization');
	$urlRouterProvider.otherwise('/sbmview/index');
	// $urlRouterProvider.otherwise('/login');
//http://codepen.io/ahsx/pen/mDcEd
}]);
