creatshowmodule
//分享页
.controller('shareCtrl',
['$http','$scope','$rootScope','$stateParams','$ionicLoading','$state','sendShowImg','SBMJSONP','checklocalimg','loginCheck','drawShowImg','compressShowImg','creatpsurl','saveShow',
function($http,$scope,$rootScope,$stateParams,$ionicLoading,$state,sendShowImg,SBMJSONP,checklocalimg,loginCheck,drawShowImg,compressShowImg,creatpsurl,saveShow){

	loginCheck();

	$scope.shareurl="";

	if ($rootScope.editShowData&&$rootScope.editShowData.mainData) {

			$scope.shareData = $rootScope.editShowData.mainData;
			// setshareurl();
			$scope.shareurl=creatpsurl($rootScope.orgName,$scope.shareData.detailId,$scope.shareData.numIid,$scope.shareData.plat);

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
					$scope.shareData = data;
					// setshareurl();
			// console.log($rootScope.orgname)

					$scope.shareurl=creatpsurl($rootScope.orgName,$scope.shareData.detailId,$scope.shareData.numIid,$scope.shareData.plat);
				})
				.error(function(status,response){
					console.log("连接失败");
				});
		}


	$scope.istaobao=$rootScope.istaobao;
	console.log($rootScope.istaobao);

	function setshareurl () {
		$scope.shareurl+="orgname="+$rootScope.orgName;
		$scope.shareurl+="&detailid="+$scope.shareData.detailId;
		$scope.shareurl+="&productid="+$scope.shareData.numIid;
		$scope.shareurl+="&plat="+$scope.shareData.plat;
	}

	$scope.checkshareimg=function(){
		checklocalimg(function(img){
			console.log(img);
			$(".editimg").show();
			$(".editcheckimg").attr("src",img.src);
			editimgctrl();
		});
	};


	function editimgctrl(){
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

		thisimgdata.img=thispsimg.find("img").show()[0];
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
		}
		function setimgview(){

			thispsimg.find("img").css({
				"-webkit-transform":"translate3d("+thisimgdata.point[0]+"px,"+thisimgdata.point[1]+"px,0px) scale("+thisimgdata.scale[0]+")"
			});
			$(".backimgbox>img").css({
				"-webkit-transform":"translate3d("+thisimgdata.point[0]+"px,"+thisimgdata.point[1]+"px,0px) scale("+thisimgdata.scale[0]+")"
			});
			
		}
	}

	$scope.getthispic=function(){
		var cvs=drawShowImg($scope.shareimgdata);
		// console.log($scope.shareData);
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
	}

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
//     Tida.ready({
//         interactId:"", // 互动实列ID type string 若无抽奖模块，此参数无须传入。给错误的实例ID会走错误流程
//         module: ['draw','sensor','buy','device','social','widget'] // 应用所需要的模块。默认加载所有模块。支持的模块有draw:抽奖;sensor:传感器;buy:交易;device:基础设备接口 social:社交相关 widget:客户端UI
//     }, function(){
//         console.log(Tida);
//         Tida.doAuth(function(data){
//             if(data.finish){
//                 alert("授权成功")
//             // 授权成功 可以顺利调用需要授权的接口了
//             }else {
//             // 未能成功授权
//             }
//         });
//         Tida.share({
//             title:"分享的标题", // 分享标题 在来往和微信好友中有标题显示
//             content: "分享内容", //分享的内容
//             url: "http://192.168.1.213/sbmproject/ps.html?orgname=work&detailid=987984&productid=44296753642&plat=TAOBAO", // 跳转地址，分享的内容跳转的url
//             image:"http://192.168.1.213/sbmproject/img/shareimg.jpg", // 图片地址,客户端可能需要根据url下载图片再分享
//             wxIsAvailable: 1, // 是否添加微信通道。为真时添加微信入口。仅手淘支持 取值为真或假
//             shareType: 1, // 为1时只能分享到通讯录。仅手淘支持
//             wxImage: 1, // 天猫IOS客户端分享到微信/微信朋友圈的图片有限制，这里默认自动转为200x200的。若不是正方形图片且需要自己传递该图片,并遵循天猫客户端图片的限制规则（不要过大 阿里的CDN上的）
//         }, function(data){
//         // data.errorCode 为0时分享成功
//         });
//     });

}])

.controller('sharehelpCtrl',['$scope',function($scope){


}])

;












