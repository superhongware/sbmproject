/**
 * SBMPS Module
 *
 * Description
 */

// var SBMPS = angular.module('SBMPS', ['ui.router', 'starter.services','ngTouch']);
var SBMPS = angular.module('SBMPS', ['ionic','starter.services']);

SBMPS
// .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider) {

// 	$stateProvider
// 	.state('show',{
// 		url:'/show',
// 		templateUrl:'templates/ps/homepage.html',
// 		controller:'spCtrl'
// 	})
// 	.state('helpme',{
// 		url:"/helpme",
// 		templateUrl:"templates/ps/helpme.html",
// 		// controller:"maintestCtrl"
// 	});

// 	$urlRouterProvider.otherwise('/show');

// }])

.controller('spCtrl', [
'$rootScope','$scope', '$http', 'getRequest', 'getRequest2','SBMJSONP', 'p_s', 'productComm','openLink',
function($rootScope,$scope, $http, getRequest, getRequest2,SBMJSONP, p_s,productComm,openLink) {

console.log(wx);


//========================微信分享=====================================
	$http.jsonp("http://hongwei.comeoncloud.net/serv/wxapi.ashx?action=getjsapiconfig&callback=JSON_CALLBACK&url="+encodeURIComponent(location.href))
	.success(function(wxapidata){
		console.log(wxapidata);
		wx.config({
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: wxapidata.appId, // 必填，公众号的唯一标识
			timestamp: wxapidata.timestamp, // 必填，生成签名的时间戳
			nonceStr: wxapidata.nonceStr, // 必填，生成签名的随机串
			signature: wxapidata.signature, // 必填，签名，见附录1
			jsApiList: [
				"onMenuShareTimeline",
				"onMenuShareAppMessage",
				"onMenuShareQQ",
				] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
	});

	$scope.weixinsharedata={
		link:location.href,
		desc:"",
		title:"",
		imgUrl:"",
	};

	wx.ready(function () {
		wx.onMenuShareAppMessage({
			title: $scope.weixinsharedata.title, // 分享标题
			desc:$scope.weixinsharedata.desc,
			link: $scope.weixinsharedata.link, // 分享链接
			imgUrl:$scope.weixinsharedata.imgUrl , // 分享图标
			success: function() {
				// alert("分享成功");
				statistics($scope.showdata,"share");

			},
			cancel: function() {
				// alert("取消分享");
			}
		});

		wx.onMenuShareTimeline({
			title: $scope.weixinsharedata.title, // 分享标题
			link: $scope.weixinsharedata.link, // 分享链接
			imgUrl:$scope.weixinsharedata.imgUrl , // 分享图标
			success: function() {
				// alert("分享成功");
				statistics($scope.showdata,"share");
			},
			cancel: function() {
				// alert("取消分享");
			}
		});
	});
//========================微信分享======================================


	$scope.showdata="";
	$scope.shownoshowdata=false;
	$scope.showmainbox = false;
	//页面图片是否加载完成
	$scope.loadover = false;



	//=================last-page=================
	//再看一遍
	$scope.playagain=function(){
		// alert(0);
		// history.go(0);
		// alert(0);
		p_s.pagemoving=1;
		p_s.currpage = -1; 
		p_s.pageIndexRefresh(+1);
		p_s.pagemovemode("pagechange");

	};

	//我也要发宝贝秀
	$scope.showhelpme=function(){
		var state = {url:'#/helpme',title:'helpme'};
		history.pushState(state,state.title,state.url);
		history.go(1);
		$(".helpme").show();
	};
	$scope.closehelpme=function(){
		history.go(-1);
		// var state = {url:'#/',title:'closehelpme'};
		// history.pushState(state,state.title,state.url);
	};

	window.onpopstate=function(event){
		// console.log(['event',event]);
		if(event.state!==null&&event.state.url==="#/helpme"){
			$(".helpme").show();
		}else{
			$(".helpme").hide();
		}
	};
	//=================last-page=================

	


	console.log(["asdasdasd",getRequest("templateview")]);

	//模板预览
	if (getRequest("templateview")) {
		var templatesdetail = {
			orgName:  getRequest("orgname"),
			method: "softbanana.app.template.detail",
			templateId: parseInt(getRequest("templateview"))
		};
		var api = SBMJSONP('detailTemplate', templatesdetail);

		console.log(['asas,,,,',api.url])
		
		$http.jsonp(api.url).success(function(data) {
				console.log(['模板数据',data]);
				$scope.showdata = data.template;

				//处理模板数据
				for (var i = 0; i < $scope.showdata.pages.length; i++) {
					var img = $scope.showdata.pages[i].detailPageImage.split(",") || $scope.showdata.pages[i].detailPageImage;
					var returnimg=[];
					var text = $scope.showdata.pages[i].detailPageText.split(">>") || $scope.showdata.pages[i].detailPageText;
					var returntext=[];
					for(m in img){
						returnimg.push({img:img[m]})
					}
					for(t in text){
						returntext.push({txt:text[t]})
					}
					$scope.showdata.pages[i].detailPageImage = returnimg
					$scope.showdata.pages[i].detailPageText = returntext
				}

				isloadover(data.template.pages);

				console.log(['模板页面',$scope.showdata.pages])
				$scope.$broadcast("showdataready");

			})
			//		$http.get("testdata/template"+getRequest("templateview")+".json")
			//		.success(function(data){
			//			// 图片加字统计
			//			isloadover(data.pages);
			//			$scope.showdata = data;
			//			$scope.$broadcast("showdataready");
			//		})
			//		.error(function(msg){
			//			console.log(msg);
			//		});

	} else {
		//获取宝贝秀数据
		var getdata = {
			orgName: getRequest2("orgname"),
			detailId: getRequest2("detailid"),
			method: "softbanana.app.detail.search"
		};
		var api = SBMJSONP("searchDetail", getdata);
		$http.jsonp(api.url)
			.success(function(data) {


				// $scope.loadover = true;

				console.log(data);
				//宝贝秀删除后不执行后面代码
				if (!data.isSuccess) {
					thereisnoshow();
					return;
				}

				$scope.showdata = data;

				// 图片加载统计
				isloadover(data.pages);

				//浏览量计数
				statistics($scope.showdata);

				//自动打开淘宝
				autoopentaobao(data);


				// p_s.CreatDomtree(data);
				$scope.$broadcast("showdataready");
			})
			.error(function() {
				thereisnoshow();
			});
	}


	function statistics(data,datatype,callback){

		if(!data||!data.detailId){
			return;
		}

		var statisticsdata={
			count:1,
			orgName: getRequest2("orgname"),
			detailId: data.detailId,
			shopName:data.shopName,
			plat:data.plat,
			shareType:getshareType(),
			numIid:data.numIid
		};

		switch(datatype){
			case "share":
				statisticsdata.method="softbanana.app.share.save";
				var api = SBMJSONP("saveShare", statisticsdata);
				$http.jsonp(api.url)
				.success(function(data){
					console.log(["分享返回数据",data]);
				})
				.error(function(msg){
					console.log(["分享返回数据",msg]);

				});
			break;
			case "shop":
				statisticsdata.method="softbanana.app.newshop.save";
				var api = SBMJSONP("saveNewShop", statisticsdata);
				$http.jsonp(api.url)
				.success(function(data){
					console.log(["到店返回数据",data]);
					// alert(0)
					if(callback){
						callback();
					}
				})
				.error(function(msg){
					console.log(["到店返回数据",msg]);

				});
			break;
			default:
				statisticsdata.method="softbanana.app.browse.save";
				var api = SBMJSONP("saveBrowse", statisticsdata);
				$http.jsonp(api.url)
				.success(function(data){
					console.log(["浏览返回数据",data]);
				})
				.error(function(msg){
					console.log(["浏览返回数据",msg]);

				});
			break;
		}
	}

	function thereisnoshow(){
		$scope.showmainbox = true;
		$scope.shownoshowdata=true;
		//没有宝贝秀数据 获取宝贝数据 跳转到宝贝页
		console.log(["dasdadasdadad",getRequest2("plat")]);
		productComm.loadProductDetail({
			orgName: getRequest2("orgname"),
			numIid: getRequest2("productid"),
			plat: getRequest2("plat")
		},function(data){
			console.log(['baobeishuju',data]);

			$scope.gotoproduct=function(){
				var url=data.detailUrl;
				openLink(url);
			};

			autoopentaobao(data);

		},function(){
		
			alert("请检查网络是否问题");
		});
	}

	function getshareType(){

		if(getRequest("from")==="groupmessage"||getRequest("from")==="singlemessage"){
			return "WF";
		}else if(getRequest("from")==="timeline"){
			return "WC";
		}else if(getRequest("from")==="weibo"){
			return "WB";
		}else if(getRequest("from")==="qq"){
			return "QC";
		}else if(getRequest("from")==="kongjian"){
			return "QC";
		}else{
			return "QZ";
		}
		
	}

	function autoopentaobao(data){
		// alert(navigator.userAgent)
		// 自动打开淘宝跳转跳转
		var userAgentInfo = navigator.userAgent;  
		var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
		var url=data.detailUrl;
		var flag = false;  
		for (var v = 0; v < Agents.length; v++) {  
			if (userAgentInfo.indexOf(Agents[v]) > 0) { 
				flag = true;
				break; 
			}
		} 
		console.log(["flag",flag]);

		//若不在微信中 且是淘宝链接  且不是show预览（showview=true）  直接跳转淘宝
		if(!userAgentInfo.match("MicroMessenger") && url.match("taobao.com") && flag && getRequest("showview")!=="true"){
			
			//统计到店数
			statistics($scope.showdata,"shop");

			//链接跳转
			url=url.replace("http","taobao");
			location.href=url;

		}else if(userAgentInfo.match("MicroMessenger")){
			//有数据 设置微信分享数据
			if (!$scope.shownoshowdata) {
				//微信分享内容
				$scope.weixinsharedata.title=data.detailTitle;
				$scope.weixinsharedata.desc=data.detailDesc;
				$scope.weixinsharedata.imgUrl=data.detailImage;
			}

		}
	}


	$scope.$on("showdataready",function(){
		setTimeout(startanimation,300);

		function startanimation(){
			//图片是否加载完  加载完运行动画
			if($scope.loadover===true){
				p_s.init_animation();
			}else{
				setTimeout(startanimation,300);
			}		
		}
	});


	function isloadover(pages){
			var imgdata=[];
			var loadnum=0;
			
			// for (var i = 0; i < pages.length; i++) {
			// 	var simg='';
			// 	if(pages[i].detailPageImage.indexOf(",")>0){
   //                 simg=pages[i].detailPageImage.split(",");
   //                 for (var j = 0; j < simg.length; j++) {
			// 		if(simg[j]!==""){
			// 			imgdata.push(simg[j]);
			// 		}
			// 	}
			// 	}
			// 	else{
   //                imgdata.push(pages[i].detailPageImage);
			// 	}
				
			// }

			for (var i = 0; i < pages.length; i++) {
				for (var j = 0; j < pages[i].detailPageImage.length; j++) {
					if(pages[i].detailPageImage[j].img!==""){
						imgdata.push(pages[i].detailPageImage[j].img);
					}
				}
			}


            console.log(imgdata)
			for (i = 0;i<imgdata.length; i++) {
				var newimg=new Image();

				newimg.src=imgdata[i];

				newimg.onload=function(){
					loadnum++;
					$(".laodpecent>.nowpencent").css({
						"-webkit-transform":"translate3d(0,-"+loadnum/imgdata.length*100+"%,0)",
						"-webkit-transition":"1s ease-in 0s"
					});
				};
			}

			$(".laodpecent>.nowpencent")[0].addEventListener("webkitTransitionEnd",loadover);
			
			//


			function loadover(){
				console.log("loadover");

				if(loadnum/imgdata.length==1){

					$(".loadingbox").css({
						"opacity":"0",
						"-webkit-transition":"0.5s ease-in"
					});
					setTimeout(hideloadingbox,100);

				}
			}

			function hideloadingbox(){
					$(".loadingbox")[0].addEventListener("webkitTransitionEnd",loadingboxhided);
					function loadingboxhided(){
						console.log("loadingboxhided");
						$scope.loadover=true;
						$(".loadingbox").hide();
					}
			}

	}


	$scope.hidePagemaStanda=function(){
		$(".pagema_standa_show").removeClass("pagema_standa_show");
		$(".centerround").removeClass("current");
	};



}])


.controller('spCtrlpre', ['p_s',  function(p_s) {

		setTimeout(function(){
			p_s.init_animation();
		},100);

}])



//三个点
.directive('threePoints',[
'$http','threePointData','getRequest2','SBMJSONP','debase64url','openLink',
function($http, threePointData, getRequest2, SBMJSONP,debase64url,openLink) {
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'templates/ps/threepoints.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {

			//购买按钮提示 区分安卓苹果
			if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
				$(".screenforbiden").css({
					"background-image": "url(img/applegobuy.png)"
				});
			} else if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1) {
				$(".screenforbiden").css({
					"background-image": "url(img/azgobuy.png)"
				});
			}

			//三个点数据
			$scope.pinfo="";

			//三个点
			threePointData(function(data){

				console.log(["三个点数据",data]);
				if(!data.desc){
					return;
				}

				$scope.pinfo=data.desc;

				// $scope.pinfo.salesProperty={
				// 	"颜色分类":["紫罗兰","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色","褐色"],
				// 	"尺码":["大","中","小"]
				// };

				var pnum=0;
				for (var i in $scope.pinfo.salesProperty) {
					pnum++;
				}
				// $scope.pinfo.pnum={"width":(100/pnum)+"%"};
				$scope.pinfo.textboxstyle=function(index){
					return {"width":(100/pnum)+"%","left":(100/pnum)*index+"%"};
				};
				// $scope.$broadcast("pinfochange");

				// var i = 0;
				// var showpagema = "";

				// for (standa in data.desc.noSalesProperty) {
				// 	if (i < 8 && data.desc.noSalesProperty[standa].length > 0) {
				// 		i++;
				// 		showpagema += standa + ":" + data.desc.noSalesProperty[standa][0] + "<br/>";
				// 	}
				// }
				// $(".showstanda").html(showpagema);
			});


			//购买按钮点击事件
			$scope.buybuybuy=function(url){
				openLink(url);
				// if (navigator.userAgent.match("MicroMessenger") && url.match("taobao.com")) {
				// 	$(".screenforbiden").show();
				// } else if(url!==""){
				// 	url=url.replace("http","taobao");
				// 	location.href = url;
				// }
			};


			// $scope.buywx=function(){
			// 	var getdata = {
			// 			orgName: getRequest2("orgname"),
			// 			numIid: getRequest2("productid"),
			// 			plat:getRequest2("plat"),
			// 			method: "softbanana.app.item.detail.search"
			// 	};
			// 	var api = SBMJSONP("searchItemDetail", getdata);
			// 	$http.jsonp(api.url)
			// 		.success(function(data) {
			// 			//宝贝秀删除后不执行后面代码
			// 			if(!data.isSuccess){
			// 				$scope.showmainbox = true;
			// 				$scope.shownoshowdata=true;
			// 				return; 

			// 			}
			// 			$scope.showdata = data;
			// 			var url = data.item.detailUrl;

			// 			openLink(url);
			// 			// if (navigator.userAgent.match("MicroMessenger") && url.match("taobao.com")) {
			// 			// 	$(".screenforbiden").show();
			// 			// } else if(url!==""){
			// 			// 	if(url.match("taobao.com")){
			// 			// 		url=url.replace("http","taobao");
			// 			// 	}
			// 			// 	location.href = url;
			// 			// }

			// 			// p_s.CreatDomtree(data);
			// 			$scope.$broadcast("showdataready");
			// 		})
			// 		.error(function(){
			// 			$scope.showmainbox = true;
			// 			$scope.shownoshowdata=true;
			// 		});

			// 	// if (navigator.userAgent.match("MicroMessenger") && url.match("taobao.com")) {
			// 	// 	$(".screenforbiden").show();
			// 	// } else if(url!==""){
			// 	// 	location.href = url;
			// 	// }
			// };


			$scope.igetitjustgobuynow=function(){
				$(".screenforbiden").hide();
			};

			//standa 切换
			$scope.standaindex=0;
			$scope.standatopbar=function(index){
				$scope.standaindex=index;
			};


			$scope.parma=function(e){
				e.preventDefault();
				// alert(e.srcElement)
				// for(d in e){
				// 	alert(d)
				// }
				console.dir(e);
				if ($(e.srcElement).parent().hasClass("current")) {
					$(e.srcElement).parent().removeClass("current");
					$(".showpagema").removeClass("pagema_standa_show");
				} else {
					$(e.srcElement).parent().addClass("current");
					$(".showpagema").addClass("pagema_standa_show");
					$("#standabtn").removeClass("current");
					$(".showstanda").removeClass("pagema_standa_show");
				}
			};


			$scope.standa=function(e){
				if ($(e.srcElement).parent().hasClass("current")) {
					$(e.srcElement).parent().removeClass("current");
					$(".showstanda").removeClass("pagema_standa_show");
				} else {
					$(e.srcElement).parent().addClass("current");
					$(".showstanda").addClass("pagema_standa_show");
					$("#parmabtn").removeClass("current");
					$(".showpagema").removeClass("pagema_standa_show");
				}

			};



		}
	};
}])

//打开购买链接  微信不做跳转 只给提示  浏览器中打开手机淘宝
.factory('openLink',function(){
	return function openLink(url){
		if (navigator.userAgent.match("MicroMessenger") && url.match("taobao.com")) {
			$(".screenforbiden").show();
		} else if(url!==""){
			if(url.match("taobao.com")){
				url=url.replace("http","taobao");
			}
			location.href = url;
		}
	};
})
// .directive('showBox', ['$http', 'p_s', function($http, p_s) {
// 	// Runs during compile
// 	return {
// 		// name: '',
// 		// priority: 1,
// 		// terminal: true,
// 		// scope: {}, // {} = isolate, true = child, false/undefined = no change
// 		// controller: function($scope, $element, $attrs, $transclude) {},
// 		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
// 		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
// 		// template: '',
// 		templateUrl: "templates/ps/page1.html",
// 		// replace: true,
// 		// transclude: true,
// 		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
// 		link: function($scope, iElm, iAttrs, controller) {

// 			$http.get("testdata/productshow.json")
// 				.success(function(data) {
// 					$scope.show = data;
// 					$scope.show.current = 0;

// 					p_s.init_animation();

// 				});

// 		}
// 	};
// }])
;
