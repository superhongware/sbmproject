creatshowmodule
//整编辑页—图片文字编辑区
.controller('editerCtrl', ['$scope','$rootScope','$http','$ionicLoading','$stateParams','changepagesize',function($scope,$rootScope,$http,$ionicLoading,$stateParams,changepagesize){

	changepagesize();

	$rootScope.editShowData.ddd="cccc";

	console.log("editerCtrl");
	// console.log(["bb",$rootScope.editShowData]);

	$rootScope.editShowData.showId=$stateParams.showId;
	$rootScope.editShowData.currentpage=parseInt($stateParams.pageId);
	$scope.$emit("showdatachanged");

	// console.log(["cc",$rootScope.editShowData]);
	// console.log($rootScope.editShowData.currentpage);

}])


//整编辑页—图片文字编辑区模板1
.controller('pagetempht1Ctrl',[
	'$scope','$rootScope','$state','$stateParams',"$http",'$ionicLoading','$ionicActionSheet',"setShowImg",'drawShowImg','compressShowImg','sendShowImg','saveShow',
	function($scope,$rootScope,$state,$stateParams,$http,$ionicLoading,$ionicActionSheet,setShowImg,drawShowImg,compressShowImg,sendShowImg,saveShow){


	console.log("pagetempht1Ctrl");

	$scope.imgviewinfo=[];

	$scope.showdata=$rootScope.editShowData;

	$scope.$on('$destroy', function() {
		tempImgngRepeatFinished();
		saveShowImg();
	});

	//初始化页面
	var tempImgngRepeatFinished=$scope.$on("tempImgngRepeatFinished",function(){
		if($rootScope.picurl!==undefined){
			var i = parseInt($rootScope.Index)+1;
			var imgbox=$(".ps_img"+ i);
			    imgbox.find(".innerimg").attr("src",$rootScope.picurl).show();
			    //点击保存以后要重新加载服务器数据，否则用改变后的缓存,此处为改变缓存
			    $rootScope.editShowData.mainData.pages[$rootScope.pic_pageId].detailPageImage[$rootScope.Index].img = $rootScope.picurl;
			    $rootScope.picurl=undefined;
		}
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
					$rootScope.xychange = true;
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
		if($rootScope.Index!==undefined){
			$scope.imgviewinfo[$rootScope.Index].changed=1;
			$rootScope.Index=undefined;
		}	
		for (var i = $scope.imgviewinfo.length - 1; i >= 0; i--) {
			// console.log(["$scope.imgviewinfo[i].point[0]",$scope.imgviewinfo[i].point[0]]);
			if($scope.imgviewinfo[i].changed||$scope.imgviewinfo[i].point[0]!==0||$scope.imgviewinfo[i].point[1]!==0||$rootScope.picurl!==undefined){
				sendnum.push(i);
				console.log("保存图片yayaya");
			}
		}


		if(sendnum.length>0){
			sendimg();
		}else{
			saveshowdata();

			// $ionicLoading.hide();
			// console.log("保存图片回调");
			// $scope.$emit('saveShowImgOver');
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
				
				imgnum++;
				//图片上传成功 还有图片继续传下一张 没有调用saveShowImgOver事件
				if(sendnum.length>imgnum){
					sendimg();
				}else{
					saveshowdata();
				}

			});
		}

		//保存资料
		function saveshowdata(){
				saveShow($rootScope.editShowData.mainData,
				function(data){
					console.log(["资料保存成功",data]);
					$ionicLoading.hide();
					$scope.$emit('saveShowImgOver');
				},function(data){
					console.log(["资料保存失败",data]);
				});
		}

	});


	$scope.setimg=function(index){


		// checklocalimg(function(img){
		// 	// console.log(img);
		// 	$scope.imgviewinfo[index].changed=1;
		// 	var thisimgdata=$scope.imgviewinfo[index];
		// 	var imgbox=$(".ps_img"+(index+1));

		// 	thisimgdata.img=img;
		// 	// thisimgdata.scale=[]
		// 	// ionic.onGesture("transform",moveimg,imgbox[0]);
		// 	imgbox.find(".innerimg").attr("src",$scope.imgviewinfo[index].img.src).show();
		// });
		$rootScope.Index = index;
		$rootScope.pic_showId = $stateParams.showId;
		$rootScope.pic_pageId = $stateParams.pageId;
		$rootScope.pic_pageTemp = $stateParams.pageTemp;
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
						// console.log(img);
						$scope.imgviewinfo[index].changed=1;
						var thisimgdata=$scope.imgviewinfo[index];
						var imgbox=$(".ps_img"+(index+1));

						thisimgdata.img=img;
						// thisimgdata.scale=[]
						// ionic.onGesture("transform",moveimg,imgbox[0]);
						imgbox.find(".innerimg").attr("src",$scope.imgviewinfo[index].img.src).show();
						//点击保存以后要重新加载服务器数据，否则用改变后的缓存,此处为改变缓存
						$rootScope.editShowData.mainData.pages[$rootScope.pic_pageId].detailPageImage[$rootScope.Index].img = $scope.imgviewinfo[index].img.src;
					});
				}else{
					//选择图片空间图片
					$state.go("remoteimg");

				}
				return true;
			}
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

;