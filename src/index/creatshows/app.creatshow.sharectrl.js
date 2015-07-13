creatshowmodule
//分享页
.controller('shareCtrl',
['$http','$scope','$rootScope','$stateParams','$ionicLoading','$state','$ionicActionSheet','sendShowImg','SBMJSONP','checklocalimg','loginCheck','drawShowImg','compressShowImg','creatpsurl','saveShow','checkoutbaobei',
function($http,$scope,$rootScope,$stateParams,$ionicLoading,$state,$ionicActionSheet,sendShowImg,SBMJSONP,checklocalimg,loginCheck,drawShowImg,compressShowImg,creatpsurl,saveShow,checkoutbaobei){

	loginCheck();

	$scope.shareurl="";
	//检测页面是否有宝贝秀数据，有的话直接setshowdata  没有的话先加载宝贝秀数据再setshowdata
	if ($rootScope.editShowData&&$rootScope.editShowData.mainData) {

			setshowdata($rootScope.editShowData.mainData);
			// $scope.shareData = $rootScope.editShowData.mainData;
			// // setshareurl();
			// $scope.shareurl=creatpsurl($rootScope.orgName,$scope.shareData.detailId,$scope.shareData.numIid,$scope.shareData.plat);

		}else{

			$scope.shareInfo = {
				orgName:$rootScope.orgName,
				detailId:$stateParams.showId
			};

			$scope.shareInfo.method = "softbanana.app.detail.search";

			var api = SBMJSONP("searchDetail",$scope.shareInfo);

			$http.jsonp(api.url)
				.success(function(data){
					console.log(data);
					//直接进入分享也 要把宝贝秀数据给$rootScope.editShowData.mainData  否则无法取图片空间图片
					$rootScope.editShowData={
						mainData:data
					};
					setshowdata(data);

				})
				.error(function(status,response){
					console.log("连接失败");
				});
		}


	//是否淘小铺版
	$scope.istaobao=$rootScope.istaobao;
	console.log($rootScope.istaobao);

	//图片空间选择图片
	if($rootScope.picurl!==undefined){
		console.log($rootScope.picurl)
		editimgctrl($rootScope.picurl);
		$rootScope.picurl=undefined;
	}


	function setshowdata(data){
		$scope.shareData = data;
		$scope.shareurl=creatpsurl($rootScope.orgName,$scope.shareData.detailId,$scope.shareData.numIid,$scope.shareData.plat);
		//宝贝是否下架检测
		checkoutbaobei(data.numIid,data.plat);
	}

	function setshareurl () {
		$scope.shareurl+="orgname="+$rootScope.orgName;
		$scope.shareurl+="&detailid="+$scope.shareData.detailId;
		$scope.shareurl+="&productid="+$scope.shareData.numIid;
		$scope.shareurl+="&plat="+$scope.shareData.plat;
	}

	// $scope.checkshareimg=function(){
	// 	checklocalimg(function(img){
	// 		console.log(img);
	// 		$(".editimg").show();
	// 		$(".editcheckimg").attr("src",img.src);
	// 		editimgctrl();

	// 	});
	// };



	$scope.checkshareimg=function(index){

		$ionicActionSheet.show({
			buttons: [{
				text: '本机图片'
			}, {
				text: '店铺图片空间'
			}],
			// destructiveText: 'Delete',
			titleText: '选择图片源',
			cancelText: '取消',
			cancel: function() {
				// add cancel code..
			},
			buttonClicked: function(indexl) {
				if(indexl===0){		
					checklocalimg(function(img){
						editimgctrl(img.src);
					});
				}else{
					//选择图片空间图片
					$state.go("remoteimg");

				}
				return true;
			}
		});
	};


	$scope.sharethis=function(way){

		//统计
		var form="&from=";
		if(way==='weixin'){
			form+="groupmessage";
		}else{
			form+=way;
		};

		var jsondata={
			titlle:$scope.shareData.detailTitle,
			image:$scope.shareData.detailImage,
			describe:$scope.shareData.detailDesc,
			url:$scope.shareurl+form,
			way:way
		};

		JavaScriptInterface.shareWithjson(JSON.stringify(jsondata));
	};


	function editimgctrl(imgsrc){
		$(".editimg").show();
		$(".editcheckimg").attr("src",imgsrc);
		if(!$scope.shareimgdata){
			$scope.shareimgdata={};
			// thisimgdata.dragstart=
			ionic.onGesture("dragstart",dragstart,$(".editimg")[0]);
			// thisimgdata.drag=
			ionic.onGesture("drag",dragmove,$(".editimg")[0]);
			// thisimgdata.transformstart=
			ionic.onGesture("transformstart",dragstart,$(".editimg")[0]);
			// thisimgdata.transform=
			ionic.onGesture("transform",dragmove,$(".editimg")[0]);
		}
		var thispsimg=$("#shareimgedit");
		var thisimgdata=$scope.shareimgdata;
		thisimgdata.startpoint=[0,0];
		thisimgdata.point=[0,0];
		thisimgdata.scale=[1,1];
		//更新图片位置
		setimgview();

		thisimgdata.img=thispsimg.find("img")[0];
		thisimgdata.imgbox=thispsimg;

		function dragstart(e){
			console.log("dragstart");
			if(e.type==="dragstart"){
				thisimgdata.startpoint[0] = thisimgdata.point[0];
				thisimgdata.startpoint[1] = thisimgdata.point[1];
			}else{
				thisimgdata.scale[1]=thisimgdata.scale[0];
			}
		}

		function dragmove(e){

			e.gesture.srcEvent.preventDefault();

			if(e.type==="drag"){
				thisimgdata.point[0]=parseInt(e.gesture.deltaX)+thisimgdata.startpoint[0];
				thisimgdata.point[1]=parseInt(e.gesture.deltaY)+thisimgdata.startpoint[1];
			}else{
				thisimgdata.scale[0]=e.gesture.scale*thisimgdata.scale[1];
			}
			//更新图片位置
			setimgview();
			// drawShowImg($scope.shareimgdata,$("#testcanvas")[0])

		}
		function setimgview(){

			thispsimg.find("img").css({
				"-webkit-transform":"translate3d("+thisimgdata.point[0]+"px,"+thisimgdata.point[1]+"px,0px) scale("+thisimgdata.scale[0]+")"
			});
			$(".backimgbox>img").css({
				"-webkit-transform":"translate3d("+thisimgdata.point[0]+"px,"+thisimgdata.point[1]+"px,0px) scale("+thisimgdata.scale[0]+")"
			});
			// console.log($scope.shareimgdata)
		}
	}

	$scope.getthispic=function(){
		//不会翻转图片
		console.log($scope.shareimgdata);
		var cvs=drawShowImg($scope.shareimgdata);
		// $scope.shareData={}
		// $scope.shareData.detailImage=compressShowImg(cvs,80);
		$(".editimg").hide();
		
		$ionicLoading.show({
			template:"正在保存,请稍等...",
		});
        
		//隐藏编辑区域
        
		// 上传图片dat 获取图片url
		sendShowImg(compressShowImg(cvs,80),function(imgurl){
			//更新宝贝秀分享图片的url
			$scope.shareData.detailImage=imgurl;
			console.log($scope.shareData)
			//保存宝贝秀数据
			saveShow($scope.shareData,function(data){
				console.log("分享图片保存成功");
				//隐藏提示
				$ionicLoading.hide();
			},function(){
				console.log("分享图片保存失败");
			});
		});

	};

	$scope.saveshowadata=function(){
			//保存宝贝秀数据
			saveShow($scope.shareData,function(data){
				console.log("宝贝秀数据保存成功");
				//隐藏提示
				$ionicLoading.hide();
			},function(){
				console.log("宝贝秀数据保存失败");
			});
	};

	$scope.dropthispic=function(){
		// alert(0);
		$(".editimg").hide();
	};


// $scope.showjuhua=-1;
// $scope.sharetosomewhere=function(){
// 	// Tida.toast("Hello World!");
// 	if($scope.showjuhua===1){
// 		Tida.hideLoading();
// 		// Tida.hideTitle();
// 	}else{
// 		// Tida.showTitle();
// 		Tida.showLoading("加载中...");
// 	}
// 	$scope.showjuhua=-$scope.showjuhua;
// }
	$scope.share=function(){


	        Tida.share({
	            title:"分享的标题", // 分享标题 在来往和微信好友中有标题显示
	            content: "分享内容", //分享的内容
	            url: "http://192.168.1.213/sbmproject/ps.html?orgname=work&detailid=987984&productid=44296753642&plat=TAOBAO", // 跳转地址，分享的内容跳转的url
	            image:"http://192.168.1.213/sbmproject/img/shareimg.jpg", // 图片地址,客户端可能需要根据url下载图片再分享
	            wxIsAvailable: 1, // 是否添加微信通道。为真时添加微信入口。仅手淘支持 取值为真或假
	            // shareType: 1, // 为1时只能分享到通讯录。仅手淘支持
				wxImage: 1, // 天猫IOS客户端分享到微信/微信朋友圈的图片有限制，这里默认自动转为200x200的。若不是正方形图片且需要自己传递该图片,并遵循天猫客户端图片的限制规则（不要过大 阿里的CDN上的）
				//渠道控制新增参数
				'targets' : [ 0, 1, 2, 3, 4, 5, 6, 7],//新的控制分享渠道的参数，以前的参数weixinshare等将逐渐废弃，请不要使用。参数值： 0 通讯录；1 复制；2 微博；3 微信；4 朋友圈；5 二维码；6 来往；7 旺信；
				//微信分享新增参数
				'weixinAppId' : "wxf475808481f0620a",//微信分享appId
				'weixinMsgType':"webpage",//微信分享方式：text文案分享（title必传）、image图片分享（image必传）、webpage图文分享（title、content、image、url必传）

	        }, function(data){
	        // data.errorCode 为0时分享成功
	        });
		
	}





}])

.controller('sharehelpCtrl',['$scope',function($scope){


}])

;












