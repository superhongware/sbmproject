/**
 * SBMPS Module
 *
 * Description
 */

// var SBMPS = angular.module('SBMPS', ['ui.router', 'starter.services','ngTouch']);
var SBMPS = angular.module('SBMPS', ['ionic','starter.services']);

SBMPS.controller('spCtrl', [
'$scope', '$http', 'getRequest', 'getRequest2','SBMJSONP', 'p_s', 'productComm',
function($scope, $http, getRequest, getRequest2,SBMJSONP, p_s,productComm) {

console.log(wx);




//微信分享
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
				alert("分享成功");
			},
			cancel: function() {
				alert("取消分享");
			}
		});
	});

	$scope.showdata="";
	$scope.shownoshowdata=false;
	$scope.showmainbox = false;



	console.log(["asdasdasd",getRequest("templateview")]);
	if(getRequest("templateview")==="1"){

		$http.get("testdata/template1.json")
		.success(function(data){
			$scope.showdata = data;
			$scope.$broadcast("showdataready");
		})
		.error(function(msg){
			console.log(msg);
		});

	}else{
		//获取宝贝秀数据
		var getdata = {
			orgName: getRequest2("orgname"),
			detailId: getRequest2("detailid"),
			method: "softbanana.app.detail.search"
		};
		var api = SBMJSONP("searchDetail", getdata);
		$http.jsonp(api.url)
			.success(function(data) {

				console.log(data);
				//宝贝秀删除后不执行后面代码
				if(!data.isSuccess){
					thereisnoshow();
					return;
				}

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

				if(!userAgentInfo.match("MicroMessenger") && url.match("taobao.com") && flag){
					url=url.replace("http","taobao");
					location.href=url;
				}else if(userAgentInfo.match("MicroMessenger")){
					//微信分享内容
					$scope.weixinsharedata.title=data.detailTitle;
					$scope.weixinsharedata.desc=data.detailDesc;
					$scope.weixinsharedata.imgUrl=data.detailImage;
				}



				$scope.showdata = data;
				// p_s.CreatDomtree(data);
				$scope.$broadcast("showdataready");
			})
			.error(function(){

				thereisnoshow();

			});
	}


	function thereisnoshow(){
				$scope.showmainbox = true;
				$scope.shownoshowdata=true;
				//没有宝贝秀数据 获取宝贝数据 跳转到宝贝页
				console.log(["dasdadasdadad",getRequest2("plat")])
				productComm.loadProductDetail({
					orgName: getRequest2("orgname"),
					numIid: getRequest2("productid"),
					plat: getRequest2("plat")
				},function(data){
					console.log(['baobeishuju',data]);
					$scope.gotoproduct=function(){
						var url=data.detailUrl
						if(url.match("taobao.com")){
							url=url.replace("http","taobao");
						}
						location.href = url;
					}
				},function(){
					alert("请检查网络是否问题");
				});
	}


	$scope.$on("showdataready",function(){
		setTimeout(function(){
			p_s.init_animation();
		},100);
	});


	$scope.hidePagemaStanda=function(){
		$(".pagema_standa_show").removeClass("pagema_standa_show");
		$(".centerround").removeClass("current");
	};





}])

.controller('spCtrlpre', ['$scope', '$http', 'getRequest', 'SBMJSONP', 'p_s',  function($scope, $http, getRequest, SBMJSONP, p_s) {

		setTimeout(function(){
			p_s.init_animation();
		},100);

}])



//三个点
.directive('threePoints',[
'$http','threePointData','getRequest2','SBMJSONP','debase64url',
function($http, threePointData, getRequest2, SBMJSONP,debase64url) {
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
				if (navigator.userAgent.match("MicroMessenger") && url.match("taobao.com")) {
					$(".screenforbiden").show();
				} else if(url!==""){
					url=url.replace("http","taobao");
					location.href = url;
				}
			};
			$scope.buywx=function(){
				var getdata = {
						orgName: getRequest2("orgname"),
						numIid: getRequest2("productid"),
						plat:getRequest2("plat"),
						method: "softbanana.app.item.detail.search"
				};
				var api = SBMJSONP("searchItemDetail", getdata);
				$http.jsonp(api.url)
					.success(function(data) {
						//宝贝秀删除后不执行后面代码
						if(!data.isSuccess){
							$scope.showmainbox = true;
							$scope.shownoshowdata=true;
							return; 

						}
						$scope.showdata = data;
						var Url = data.item.detailUrl;
						if (navigator.userAgent.match("MicroMessenger") && Url.match("taobao.com")) {
							$(".screenforbiden").show();
						} else if(Url!==""){
							if(Url.match("taobao.com")){
								Url=Url.replace("http","taobao");
							}
							location.href = Url;
						}
						// p_s.CreatDomtree(data);
						$scope.$broadcast("showdataready");
					})
					.error(function(){
						$scope.showmainbox = true;
						$scope.shownoshowdata=true;
					});
				
				// if (navigator.userAgent.match("MicroMessenger") && url.match("taobao.com")) {
				// 	$(".screenforbiden").show();
				// } else if(url!==""){
				// 	location.href = url;
				// }
			};


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
