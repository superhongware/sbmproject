creatshowmodule
.controller('editpagesCtrl',['$scope','$rootScope','$state','$http','$ionicLoading','$stateParams','SBMJSONP','saveShow',function($scope,$rootScope,$state,$http,$ionicLoading,$stateParams,SBMJSONP,saveShow){


	console.log("editpagesCtrl");

	$scope.saveShow=function(){
		$ionicLoading.show({
			template:"正在保存,请稍等...",
		});
		saveShow($rootScope.editShowData.mainData,
			function(data){
				$ionicLoading.hide();
				console.log("保存成功");
				$state.go("share",{
					showId:$rootScope.editShowData.showId
				});
			},
			function(data){
				$ionicLoading.hide();
				console.log(["保存失败",data]);
				alert(data);
			});
	};

	//初始化editShowData
	if(!$rootScope.editShowData){
		console.log(["创建$rootScope.editShowData"]);
		$rootScope.showId="";
		$rootScope.editShowData={
			showId:"",
			currentpage:0,
			mainData:"",
			dddd:""
		};
	}
	var showdata=$rootScope.editShowData;

	//翻页按钮
	$scope.goprev = function() {
		// console.log($rootScope.editShowData.currentpage);
		var pageid=showdata.currentpage-1;
			pageid=pageid>0?pageid:0;
		var params={
			showId:showdata.showId,
			pageId:pageid,
			pageTemp:showdata.mainData.pages[pageid].templatePageId
		};
		$state.go("editpages.editer",params);
	};

	$scope.gonext = function() {
		console.log(showdata.mainData);
		var pageid=showdata.currentpage+1;
			pageid=pageid<(showdata.mainData.pages.length-1)?pageid:(showdata.mainData.pages.length-1);
		var params={
			showId:showdata.showId,
			pageId:pageid,
			pageTemp:showdata.mainData.pages[pageid].templatePageId
		};
		$state.go("editpages.editer",params);
	};


	//小页面宽度
	$scope.pagelistwidth={"width":0};

	//获取宝贝秀数据
	// $rootScope.$watch("editShowData",function() {
	$rootScope.$on("showdatachanged",function(){
		console.log(["showdatachanged",$rootScope.editShowData]);
		//宽度控制
		if(typeof $rootScope.editShowData.mainData.pages !== "undefined"){
			console.log("改变宽度啊！！");
			$scope.pagelistwidth={"width":$rootScope.editShowData.mainData.pages.length*71+"px"};
		}

		if(!$rootScope.editShowData.mainData||$rootScope.editShowData.showId!==$rootScope.editShowData.mainData.detailId){

			console.log("开始更新宝贝秀数据");
			var getshowdata = {
				orgName:$rootScope.orgName,
				detailId:$rootScope.editShowData.showId,
				method :"softbanana.app.detail.search"
			};

			console.log(getshowdata);

			var api = SBMJSONP("searchDetail",getshowdata);
			//获取宝贝秀数据
			$http.jsonp(api.url)
			// $http.get("testdata/template1.json")
			.success(function(data){
				if(!data.isSuccess){
					alert("获取宝贝秀数据失败");
					console.log(["获取宝贝秀数据失败"]);
					return;
				}
				console.log(["更新宝贝秀数据结束",data]);
				$rootScope.editShowData.mainData=data;
				$scope.pagelistwidth={"width":data.pages.length*71+"px"};
				//
				// $rootScope.$broadcast("showdataIsReady");

			})
			.error(function(){
				alert("更新宝贝秀数据失败");
			});
		}
	});

}])



.controller('editerCtrl', ['$scope','$rootScope','$http','$ionicLoading','$stateParams','changepagesize',function($scope,$rootScope,$http,$ionicLoading,$stateParams,changepagesize){

	changepagesize();

	$rootScope.editShowData.ddd="cccc";

	console.log("editerCtrl");
	// console.log(["bb",$rootScope.editShowData]);

	$rootScope.editShowData.showId=$stateParams.showId;
	$rootScope.editShowData.currentpage=parseInt($stateParams.pageId);
	$rootScope.$emit("showdatachanged");

	// console.log(["cc",$rootScope.editShowData]);
	// console.log($rootScope.editShowData.currentpage);

}])



.controller('pagetempht1Ctrl',['$scope','$rootScope','$state',"$http",'$ionicLoading',"setShowImg",'drawShowImg','compressShowImg','sendShowImg','saveShow',function($scope,$rootScope,$state,$http,$ionicLoading,setShowImg,drawShowImg,compressShowImg,sendShowImg,saveShow){


	console.log("pagetempht1Ctrl");

	$scope.imgviewinfo=[];

	$scope.showdata=$rootScope.editShowData;

	$scope.$on('$destroy', function() {
		tempImgngRepeatFinished();
		saveShowImg();
	});

	var tempImgngRepeatFinished=$scope.$on("tempImgngRepeatFinished",function(){
		console.log("tempImgngRepeatFinished");
		$(".editplace").find(".ps_img").each(function(index){
			var thisimgdata=$scope.imgviewinfo[index];
			// console.log($scope.imgviewinfo[index]);
			thisimgdata.startpoint=[0,0];
			thisimgdata.point=[0,0];
			thisimgdata.scale=[1,1];
			thisimgdata.dragstart=ionic.onGesture("dragstart",dragstart,this);
			thisimgdata.drag=ionic.onGesture("drag",dragmove,this);
			thisimgdata.transformstart=ionic.onGesture("transformstart",dragstart,this);
			thisimgdata.transform=ionic.onGesture("transform",dragmove,this);
			thisimgdata.img=$(this).find("img").show()[0];
			thisimgdata.imgbox=$(this);
			function dragstart(e){
				if(e.type==="dragstart"){
					thisimgdata.startpoint[0] = thisimgdata.point[0];
					thisimgdata.startpoint[1] = thisimgdata.point[1];
				}else{
					thisimgdata.scale[1]=thisimgdata.scale[0];
				}
			}
			function dragmove(e){
				if(e.type==="drag"){				
					thisimgdata.point[0]=parseInt(e.gesture.deltaX)+thisimgdata.startpoint[0];
					thisimgdata.point[1]=parseInt(e.gesture.deltaY)+thisimgdata.startpoint[1];
				}else{
					thisimgdata.scale[0]=e.gesture.scale*thisimgdata.scale[1];
				}
				$(this).find(".innerimg").css({
					"-webkit-transform":"translate3d("+thisimgdata.point[0]+"px,"+thisimgdata.point[1]+"px,0px) scale("+thisimgdata.scale[0]+")"
				});

				// var cvs=drawShowImg(thisimgdata);
				// compressShowImg(cvs,80);
			}

		});
	});

	//切换页面  左右翻页按钮  都会触发图片上传保存事件，完成后再回调翻页
	//此功能在directive跟controller中互相回调
	var saveShowImg=$scope.$on("saveShowImg",function(){
		$ionicLoading.show({
			template:"正在保存,请稍等...",
		});
		console.log(['saveShowImg-保存图片']);
		var imgnum=0,
			sendnum=[];
		for (var i = $scope.imgviewinfo.length - 1; i >= 0; i--) {
			// console.log(["$scope.imgviewinfo[i].point[0]",$scope.imgviewinfo[i].point[0]]);
			if($scope.imgviewinfo[i].point[0]!==0){
				sendnum.push(i);
				console.log("保存图片yoyoyo");
			}
		}


		if(sendnum.length>0){
			sendimg();
		}else{
			$ionicLoading.hide();
			console.log("保存图片回调");
			$scope.$emit('saveShowImgOver');
		}

		function sendimg(){
			var cvs=drawShowImg($scope.imgviewinfo[sendnum[imgnum]]);
			// $(".editplace").append(cvs);
			var imgdata=compressShowImg(cvs,80);
			sendShowImg(imgdata,function(imgsrc){
				console.log(["图片上传成功",imgsrc]);

				$rootScope.editShowData.mainData
				.pages[$scope.showdata.currentpage]
				.detailPageImage[sendnum[imgnum]]
				.img=imgsrc;
				
				saveShow($rootScope.editShowData.mainData,
				function(data){
					console.log(["资料保存成功",data]);
					imgnum++;
					//图片上传成功 还有图片继续传下一张 没有调用saveShowImgOver事件
					if(sendnum.length>imgnum){
						sendimg();
					}else{
						$ionicLoading.hide();
						$scope.$emit('saveShowImgOver');
					}
				},function(data){
					console.log(["资料保存失败",data]);
				});
			});
		}

	});


	$scope.setimg=function(index){
		console.log(index);

		checklocalimg(function(img){
			// console.log(img);
			var thisimgdata=$scope.imgviewinfo[index];
			var imgbox=$(".ps_img"+(index+1));

			thisimgdata.img=img;
			// thisimgdata.scale=[]
			// ionic.onGesture("transform",moveimg,imgbox[0]);
			imgbox.find(".innerimg").attr("src",$scope.imgviewinfo[index].img.src).show();

		});

	};

	//选择本地图片
	function checklocalimg(callback){
		document.getElementById('fileImg').addEventListener('change', handleFileSelect, false);
		document.getElementById('fileImg').click();
		function handleFileSelect (evt) {
			document.getElementById('fileImg').removeEventListener('change', handleFileSelect, false);
			var file = evt.target.files[0];
			if (!file.type.match('image.*')){
				return;
			}
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload=function(e){
				console.log(e.target.result);
				var img=new Image();
				img.src=e.target.result;
				callback(img);
			};
		}
	}

}])
.factory('sendShowImg', ['$rootScope','$http','SBMJSONP','SBMPOST',function($rootScope,$http,SBMJSONP,SBMPOST){
	return function sendShowImg(imgdata,callback){
			var senddata={
					orgName:$rootScope.orgName,
					method:"softbanana.app.image.upload",
					imageData:encodeURIComponent(imgdata)
				};

			// 此处使用POST
			// var api=SBMJSONP("uploadImage/uploadFile",senddata);
			// $http.jsonp(api.url)

			var api=SBMPOST("uploadImage/uploadFile",senddata);
			$http.post(api.url,api.data)
			.success(function(data){
				console.log(["图片上传成功",data]);
				callback(data.image.imageUrl);
			})
			.error(function(data){
				console.log(["图片上传失败",data]);
			});
	};
}])

.controller('pagetemp1Ctrl',['$scope','$state',function($scope,$state){
	// console.log($state.current);
	console.log("pagetemp1");
	// console.log("editerCtrl");

}])


.controller('pagetemp5Ctrl',['$scope','$state',function($scope,$state){
	// console.log($state);
	console.log("pagetemp5");
	// console.log("editerCtrl");
}]);
