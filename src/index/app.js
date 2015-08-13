/**
* starter Module
*
* Description
*/
angular.module('starter', 
	['ionic',
	'loginmodule',
	"creatshowmodule",
	'productsmodule',
	'settingmodule',
	'showsmodule',
	'starter.controllers',
	'starter.services',
	'starter.directives'])
.run(['$ionicPlatform','$rootScope','myCookie','loginCheck', function($ionicPlatform,$rootScope,myCookie,loginCheck){
	$rootScope.viewanimate = "gogogo";

	loginCheck();

	//用户第一次打开跳到preview页面  预览宝贝秀功能  但是进入授权成功页不跳preview页面
	if (!$rootScope.istaobao && myCookie.get("preview") !== "preview1" && !location.hash.match("#/sq")) {
		myCookie.add("preview", "preview1", 2160);
		location.href = location.origin + "/preview.html";
		return;
	} else {
		myCookie.add("preview", "preview1", 2160);
	};

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
	$ionicConfigProvider.views.maxCache(0);
	$ionicConfigProvider.views.forwardCache(false);
	$ionicConfigProvider.templates.maxPrefetch(0);

	$stateProvider
	.state('login',{
		url:'/login',
		templateUrl:'templates/index/login/login.html?v=0.0.1',
		controller:'LoginCtrl'
	})
	.state('sign_up', {
		url: "/sign_up",
		templateUrl: "templates/index/login/sign_up.html?v=0.0.1",
		controller:'sign_upCtrl'
	})
	.state('getmypw', {
		url: "/getmypw",
		templateUrl: "templates/index/login/getmypw.html",
		controller:'getmypwCtrl'
	})
	//淘小铺授权
	.state('taoxiaopu', {
		url: "/taoxiaopu",
		templateUrl: "templates/index/login/taoxiaopu.html",
		controller:'taoxiaopuCtrl'

	})
	.state('home', {
		url: "/home",
		templateUrl: "templates/index/home.html",
		controller:'indexCtrl'
	})

	.state('shops', {
		url: "/shops",
		templateUrl: "templates/index/shops.html",
		controller:'shopsCtrl'
	})
	//授权页面
	.state('viewshop', {
		url: "/viewshop/:url",
		templateUrl: "templates/index/creatshows/viewtemplate.html",
		controller:'viewshopCtrl'
	})
	.state('shouquanhelp', {
		url: "/shouquanhelp",
		templateUrl: "templates/index/setting/shouquanhelp.html",
	})

	//我的宝贝
	.state('products', {
		url: "/products",
		templateUrl: "templates/index/products/products.html",
		controller:'productsCtrl'
	})
	.state('productDetail', {
		url: "/productDetail",
		templateUrl: "templates/index/products/productDetail.html",
		controller:'productDetailCtrl'
	})
	.state('shows', {
		url: "/shows",
		templateUrl: "templates/index/shows/shows.html",
		controller:'showsCtrl'
	})
	.state('liuliang', {
		url: "/liuliang/:showId",
		templateUrl: "templates/index/shows/liuliang.html",
		controller:'liuliangCtrl'
	})

	//我的订单
	.state('orders', {
		url: "/orders",
		templateUrl: "templates/index/orders/orders.html",
		controller:"ordersCtrl"
	})
	.state('orderdetail', {
		url: "/orderdetail",
		templateUrl: "templates/index/orders/orderdetail.html",
		controller:"orderdetailCtrl"
	})

	//设置
	.state('setting', {
		url: "/setting",
		templateUrl: "templates/index/setting/setting.html",
		controller:"settingCtrl"
	})
	.state('set-shopmanage', {
		url: "/set-shopmanage",
		templateUrl: "templates/index/setting/set-shopmanage.html",
		controller:"shopManage"
	})
	.state('set-remind', {
		url: "/set-remind",
		templateUrl: "templates/index/setting/set-remind.html"
	})
	.state('set-feedback', {
		url: "/set-feedback",
		templateUrl: "templates/index/setting/set-feedback.html",
		controller:"feedBack"
	})
	.state('set-aboutus', {
		url: "/set-aboutus",
		templateUrl: "templates/index/setting/set-aboutus.html"
	})
	.state('set-password', {
		url: "/set-password",
		templateUrl: "templates/index/setting/set-password.html",
		controller:"setPassword"
	})
	.state('set-expired', {
		url: "/set-expired",
		templateUrl: "templates/index/setting/set-expired.html",
		controller:"shopManage"
	})
	.state('sqsuccess', {
		url: "/sqsuccess",
		templateUrl: "templates/index/setting/sqsuccess.html",
		controller:'sqsuccessCtrl'
	})
	.state('sqerror', {
		url: "/sqerror",
		templateUrl: "templates/index/setting/sqerror.html",
		controller:"sqsuccessCtrl"
	})
	.state('sqago', {
		url: "/sqago",
		templateUrl: "templates/index/setting/sqago.html",
		controller:'sqsuccessCtrl'
	})
	//帮助页面
	.state('set-help', {
		url: "/set-help",
		templateUrl: "templates/index/setting/set-help.html",
		// controller:'helpCtrl'
	})

	/*------------新建宝贝秀-----------*/
	//选择宝贝
	.state('checkproduct', {
		url: "/checkproduct",
		templateUrl: "templates/index/creatshows/checkproduct.html",
		controller:'productsCtrl'
	})
	//选择模板
	.state('checktemplate', {
		url: "/checktemplate/:productId/:productPlat",
		templateUrl: "templates/index/creatshows/checktemplate.html",
		controller:'checktemplateCtrl'
	})
	//模板预览
	.state('viewtemplate', {
		url: "/viewtemplate/:templateId/:productId/:productPlat",
		templateUrl: "templates/index/creatshows/viewtemplate.html",
		controller:'viewtemplateCtrl'
	})



	//编辑页
	.state('editpages', {
		url: "/editpages",
		templateUrl: "templates/index/creatshows/editpages.html",
		controller:'editpagesCtrl',
		// abstract: true
	})
	//页面编辑模块
	.state('editpages.editer', {
		url: "/editer/:showId/:pageId/:pageTemp",
		// templateUrl: "templates/index/creatshows/pages/page1.html",
		templateUrl:function(params){
			return "templates/index/creatshows/pages/page"+params.pageTemp+".html";
		},
		controller:'editerCtrl'
	})

	
	//选图片空间的图片
	.state('remoteimg', {
		url: "/remoteimg",
		templateUrl: "templates/index/creatshows/remoteimg.html",
		controller:'remoteimgCtrl'
	})
	.state('popoverPic', {
		url: "/popoverPic",
		templateUrl: "templates/index/creatshows/popoverPic.html",
		controller:'remoteimgCtrl'
	})
	//添加页面
	.state('addpage', {
		url: "/addpage/:showId/:pageId",
		templateUrl: "templates/index/creatshows/addpage.html",
		controller:'addpagesCtrl',
		// abstract: true
	})
	//宝贝秀预览
	.state('viewshow', {
		url: "/viewshow/:showId",
		templateUrl: "templates/index/creatshows/viewtemplate.html",
		controller:'viewshowCtrl'
	})
	//宝贝分享
	.state('share', {
		url: "/share/:showId",
		templateUrl: "templates/index/creatshows/share.html",
		controller:'shareCtrl'
	})
	.state('sharehelp', {
		url: "/sharehelp",
		templateUrl: "templates/index/creatshows/sharehelp.html",
		controller:'sharehelpCtrl'
	})
	/*------------新建宝贝秀  end-----------*/




	.state('appadone', {
		url: "/appadone",
		templateUrl: "templates/index/appad/appadone.html",
		controller:'appadoneCtrl'
	})
	//sidebar测试  正式上线删除
	.state('testpage',{
		url:"/testpage",
		templateUrl:"templates/index/testpage.html",
		controller:"maintestCtrl"
	});

	$urlRouterProvider.otherwise('/home');
	// $urlRouterProvider.otherwise('/login');
//http://codepen.io/ahsx/pen/mDcEd
}]);
