/**
* starter Module
*
* Description
*/
angular.module('starter', ['ionic','starter.controllers'])
// .run(['$ionicPlatform', function($ionicPlatform){
//   $ionicPlatform.ready(function() {
//     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//     // for form inputs)
//     if (window.cordova && window.cordova.plugins.Keyboard) {
//       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//     }
//     if (window.StatusBar) {
//       // org.apache.cordova.statusbar required
//       StatusBar.styleDefault();
//     }
//   });
// }])
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
	.state('shopinfo', {
		url: "/shopinfo",
		abstract: true,
		templateUrl: "templates/index/shopinfo.html"
	})
	.state('shopinfo.authorization', {
		url: "/authorization",
		// abstract: true,
		templateUrl: "templates/index/authorization.html"
	});

	// $urlRouterProvider.otherwise('/shopinfo/authorization');
	$urlRouterProvider.otherwise('/sign_up');
//http://codepen.io/ahsx/pen/mDcEd
}]);
