var starterctrl = angular.module('starter.controllers', []);

starterctrl.controller('mainviewCtrl', [
	'$scope', '$rootScope', '$log', '$ionicLoading', 'getRequest', 'loginCheck', 'showadcheck','myCookie',
	function($scope, $rootScope, $log, $ionicLoading, getRequest, loginCheck, showadcheck,myCookie) {

		// $scope.$on('$stateChangeStart',function(evt, toState, toParams, fromState, fromParams) {
		// 	// console.log(toState.controller);
		// 	$scope.navbarhide=toState.controller!=="indexCtrl"?false:true;
		// });

		//首页隐藏top-nav-bar
		// $scope.$on('$stateChangeStart',function(evt, toState, toParams, fromState, fromParams) {
		// 	// console.log(toState.controller);
		// 	$scope.navbarhide=toState.controller!=="indexCtrl"?false:true;
		// 	$scope.sncybtnhide=toState.controller==="productsCtrl"?false:true;
		// });

		loginCheck();
		showadcheck();
     

		if (typeof Tida !== "undefined") {
			Tida.ready({
				interactId: "", // 互动实列ID type string 若无抽奖模块，此参数无须传入。给错误的实例ID会走错误流程
				module: ["device", "media", "server", "social", "widget", "sensor", "share", "buy", "draw", "im"] // 应用所需要的模块。默认加载所有模块。支持的模块有draw:抽奖;sensor:传感器;buy:交易;device:基础设备接口 social:社交相关 widget:客户端UI
			}, function() {
				// alert(0);
				// Tida.openClient("taobao://h5.m.taobao.com/awp/core/detail.htm?id=45031625539&spm=2014.21758735.0.0")
				// alert(1);
				// options=

				// Tida.hideTitle();

				// Tida.doAuth(function(data){
				// 	alert(JSON.stringify(data));
				// 	if(data.finish){
				// 	// 授权成功 可以顺利调用需要授权的接口了

				// 	}else {
				// 	// 未能成功授权
				// 	}
				// });
			});
		}

		if(navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1){
			$rootScope.isios=false;
		}else{
			$rootScope.isios=true;
		}
			// $scope.show= function(){
			// 	$ionicLoading.show({
			// 		template:"loading...",
			// 		duration:2000
			// 	});
			// };
			// $scope.hide=function(){
			// 	$ionicLoading.hide();
			// };
	}
])


//首页
.controller('indexCtrl', [
	'$scope', '$rootScope', 'loginCheck', 'getRequest', '$http', '$ionicNavBarDelegate','base64', 'TBAPI', 'SBMJSONP','myCookie',
	function($scope, $rootScope, loginCheck, getRequest, $http, $ionicNavBarDelegate , base64, TBAPI, SBMJSONP,myCookie) {

		loginCheck();
		// $ionicNavBarDelegate.showBackButton(true)
		//此参数专门处理 直接进入非首页  会没有返回按钮的问题
		//需要直接出现 ‘返回’ 按钮的页面会检查这个值 如果是第一次进入 那这个值就没有  那就把页面中的返回按钮显示出来
      	if(!$rootScope.homeisindex){
      		$rootScope.homeisindex='home';
      	}

      	if (!myCookie.get("zm1")) {
			myCookie.add("zm1","1",999)
			setTimeout(function() {
				$(".zm-bgx1").addClass("zm-bg")
				$(".zm-bg,.zm-img").css({"opacity":1})
			}, 2000)
		
		}
		else{
			setTimeout(function() {
			$(".zm-bgx1,.zm-img1a,.zm-img1b").remove() 
			}, 2000)
		}
	
		//首页动画只登陆时显示一次
		$rootScope.ishow = ($rootScope.ishow === undefined) ? true : $rootScope.ishow;
		$rootScope.ishows = ($rootScope.ishows === undefined) ? true : $rootScope.ishows;
		$rootScope.iup = ($rootScope.iup === undefined) ? true : $rootScope.iup;
		$rootScope.showpic = ($rootScope.showpic === undefined) ? true : $rootScope.showpic;
		setTimeout(function() {
			$rootScope.showpic = false;
			$rootScope.ishows = false;
			$rootScope.ishow = false;
			$rootScope.iup = false;
		}, 2000);


		//该账号有没有店铺
		$scope.thereisnoshops = false;

		var getshopdata = {
			orgName: $rootScope.orgName,
			pageNo: 1,
			pageSize: 50
		};
		getshopdata.method = "softbanana.app.shop.search";
		var api = SBMJSONP("searchShop", getshopdata);
		// $scope.datacomm = getDataComm;
		$http.jsonp(api.url)
			.success(function(data) {
				console.log(0);
				console.log(['店铺', data]);
				if((data.shops&&!data.shops.length==0)||$rootScope.istaobao){
					$scope.thereisnoshops = false;
				} else {
					$scope.thereisnoshops = true;


					//有过期店铺跳到过期店铺页
					if(!$rootScope.hasgoexpired){
						$rootScope.hasgoexpired=true;
						var shopisInvalid=false;
						for(var i in data.shops){
							if(data.shops[i].isInvalid=='1'){
								shopisInvalid=true;
							}
						}

						if(shopisInvalid){
							//有店铺未授权 跳到授权页面
							$state.go("set-expired");
						}
						
					}
				}
				// $scope.shopList = data;
				// for (var i in $scope.shopList.shops){
				// 	var iplat = $scope.shopList.shops[i].plat;
				// 	$scope.shopList.shops[i].imgsrc = getDataComm.platObj[iplat].imgSrc;
				// 	$scope.shopList.shops[i].isInvalid=($scope.shopList.shops[i].isInvalid==="1");
				// }
			})

		TBAPI.showTitle();

	}
])




.controller('appadoneCtrl', [
	'$scope', '$rootScope', 'myCookie',
	function($scope, $rootScope, myCookie) {

		myCookie.add("youhaveredad", "yeah!youhaveredad", 24);
		$rootScope.isthereshowad = "";


	}
])

//整个app的导航的controller
.controller('navbarCtrl', ['$scope', '$rootScope', '$ionicHistory', '$location', '$cacheFactory', '$ionicPopup', '$ionicScrollDelegate',
	function($scope, $rootScope, $ionicHistory, $location, $cacheFactory, $ionicPopup, $ionicScrollDelegate) {
		$scope.myGoBack = function() {
			console.log("00000");

			if ($cacheFactory.get('cacheback')) {
				$scope.$broadcast('saveShowImg');
				var cacheback = $cacheFactory.get('cacheback');
				var cachecount = cacheback.get('count') + 2;
				var c = "-" + cachecount;
				history.go(c);
				cacheback.removeAll();
				cacheback.put('url', "1");
				cacheback.put('count', 0);



			} else if ($(".addpage").length > 0 && !$rootScope.editz) {
				$scope.$broadcast('saveShowImg');
				history.go("-2")

			} else if ($rootScope.editz) {
				$scope.$broadcast('saveShowImg');
				history.go("-1")
			}else{
				history.go("-1")
			}



			//		if($location.absUrl().indexOf("editer")>0&&$rootScope.prevurl){
			//			window.location=$rootScope.prevurl;
			//		}
			//		else{
			//			
			//		}


			// $ionicHistory.goBack(-1);

		};

	}
])

.controller('contentCtrl', ['$scope', '$ionicSideMenuDelegate',
	function($scope, $ionicSideMenuDelegate) {
		$scope.toggleLeft = function() {
			$ionicSideMenuDelegate.toggleLeft();
		};
		$scope.toggleLeft();

	}
])



//测试页面
.controller('maintestCtrl', ['$scope', 'checklocalimg2',
	function($scope, checklocalimg2) {

		$scope.checklocalimg = function() {
			checklocalimg2(function(file) {

				console.log("asd");
				EXIF.getData(file, function() {
					console.log(this);
					// alert(EXIF.pretty(this));
					var imginfo = (this.exifdata && this.exifdata.Orientation) || 1;

					console.log(imginfo);

					// alert(JSON.stringify(this.exifdata))


					var reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = function(e) {

						// console.log(e.target.result);
						var img = new Image();
						img.src = e.target.result;
						// var resCanvas2=document.createElement("canvas");
						var resCanvas2 = document.querySelector("#canvas2");

						var mpImg = new MegaPixImage(img);

						mpImg.render(resCanvas2, {
							maxWidth: 100,
							maxHeight: 100,
							orientation: imginfo
						}, function() {

							var cvs = document.querySelector("#canvas");

							cvs.width = resCanvas2.width;
							cvs.height = resCanvas2.height;

							var ctx = cvs.getContext("2d");

							ctx.clearRect(0, 0, cvs.width, cvs.height);
							// ctx.save();
							// ctx.scale(1,1);
							ctx.drawImage(resCanvas2, 0, 0);
							// ctx.restore();
							console.log(resCanvas2.toDataURL("image/jpeg", 1) == cvs.toDataURL("image/jpeg", 1));
							// alert("draw")

							reader.onload = null;
							// delete resCanvas2;
						});



					};

				});



			});
		};

		// // console.log(EXIF.)
		// var image=document.querySelector("#myimage");
		// image.onload=function(){

		// 	var cvs=document.querySelector("#canvas");
		// 	var ctx=cvs.getContext("2d");
		// 	console.log(image)
		// 	// cvs.width=1000;
		// 	// cvs.height=1000;
		// 	ctx.clearRect(0,0,cvs.width,cvs.height);
		// 	ctx.save();
		// 	// ctx.scale(0.1,0.1);
		// 	ctx.drawImage(image,0,0,1300,1300,0,0,100,100);
		// 	ctx.restore();

		// }


	}
]);