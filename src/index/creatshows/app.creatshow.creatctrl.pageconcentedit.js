creatshowmodule

//整编辑页—图片文字编辑区模板1
.controller('pagetempht1Ctrl',[
	'$scope','$rootScope','$state','$stateParams','$ionicLoading','$ionicActionSheet',"setShowImg",'drawShowImg','compressShowImg','sendShowImg','saveShow','checklocalimg',
	function($scope,$rootScope,$state,$stateParams,$ionicLoading,$ionicActionSheet,setShowImg,drawShowImg,compressShowImg,sendShowImg,saveShow,checklocalimg){


	console.log("pagetempht1Ctrl");

	$scope.imgviewinfo=[];

	$scope.showdata=$rootScope.editShowData;

	$scope.$on('$destroy', function() {
		tempImgngRepeatFinished();
		saveShowImg();
	});

	//初始化页面
	var tempImgngRepeatFinished=$scope.$on("tempImgngRepeatFinished",function(){

		//图片空间选择图片
		if($rootScope.picurl!==undefined){
			var i = parseInt($rootScope.Index)+1;
			var imgbox=$(".ps_img"+ i);
			    imgbox.find(".innerimg").attr("src",$rootScope.picurl).show();
			    //点击保存以后要重新加载服务器数据，否则用改变后的缓存,此处为改变缓存
			    $rootScope.editShowData.mainData.pages[$rootScope.pic_pageId].detailPageImage[$rootScope.Index].img = $rootScope.picurl;
			    $rootScope.picurl=undefined;
		}


		$(".editplace").find(".ps_img").each(function(index){

			var thispsimg=$(this);
			var thisimgdata=$scope.imgviewinfo[index];
			// console.log($scope.imgviewinfo[index]);
			thisimgdata.startpoint=[0,0];
			thisimgdata.point=[0,0];
			thisimgdata.scale=[1,1];

			//每个ps_img的范围数据[x0,y0,x1,y1] 相对于ui-view.editplace的位置 数据为左上顶点与右下顶点
			thisimgdata.imgboxposition=[this.offsetLeft,this.offsetTop,this.offsetLeft+this.offsetWidth,this.offsetTop+this.offsetHeight];
			// thisimgdata.dragstart=
			ionic.onGesture("dragstart",dragstart,this);
			// thisimgdata.drag=
			ionic.onGesture("drag",dragmove,this);
			// thisimgdata.dragend=
			ionic.onGesture("release",release,this);
			// thisimgdata.transformstart=
			ionic.onGesture("transformstart",dragstart,this);
			// thisimgdata.transform=
			ionic.onGesture("transform",dragmove,this);

			//是否支持图片互相换位
			var changimage=0;
			var picnum=$(".editplace").find(".ps_img").length;
			if(picnum>1){
				// thisimgdata.hold=
				ionic.onGesture("hold",holdimg,this);
				console.log(["一共有的图片数",picnum]);
			}
			function holdimg(e){
				//拖动图片换位触发时点的位置,是相对于ui-view.editplace的位置
				thisimgdata.holdpoint=[e.gesture.center.pageX-$(".editplace")[0].offsetLeft,e.gesture.center.pageY-$(".editplace")[0].offsetTop];
				console.log(thisimgdata.holdpoint);
				changimage=1;
				$(this).css({
					"border":"2px solid #fe9900"
				});
			}


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
				if(!changimage){
					if(e.type==="drag"){
						thisimgdata.point[0]=parseInt(e.gesture.deltaX)+thisimgdata.startpoint[0];
						thisimgdata.point[1]=parseInt(e.gesture.deltaY)+thisimgdata.startpoint[1];
					}else if(!changimage){
						thisimgdata.scale[0]=e.gesture.scale*thisimgdata.scale[1];
					}
					$(this).find(".innerimg").css({
						"-webkit-transform":"translate3d("+thisimgdata.point[0]+"px,"+thisimgdata.point[1]+"px,0px) scale("+thisimgdata.scale[0]+")"
					});
				}else{

				}
				// var cvs=drawShowImg(thisimgdata);
				// compressShowImg(cvs,80);
			}

			function release(e){
				if(changimage){
					console.log(thisimgdata.holdpoint[0]+e.gesture.deltaX,thisimgdata.holdpoint[1]+e.gesture.deltaY);
					var x=thisimgdata.holdpoint[0]+e.gesture.deltaX,
						y=thisimgdata.holdpoint[1]+e.gesture.deltaY;
					changimage=0;

					var imageindex="";

					console.log(thispsimg);

					thispsimg.css({
						"border":"none"
					});
					
					for (var i = 0; i < $scope.imgviewinfo.length; i++) {
						if(isinthisbox(x,y,$scope.imgviewinfo[i].imgboxposition)){
							imageindex=i;
						}
					}

					//图片换位了 对换位置
					if(thispsimg.index()!==imageindex){

						var img1=thispsimg.find("img");
						var img2=$(".editplace").find(".ps_img").eq(imageindex).find("img");
						var img1src=img1.attr("src");
						img1.attr("src",img2.attr("src"));
						img2.attr("src",img1src);

						//压缩图片是取的这边的数据canvas
						$scope.imgviewinfo[thispsimg.index()].changed=1;
						$scope.imgviewinfo[thispsimg.index()].img=img1[0];

						$scope.imgviewinfo[imageindex].changed=1;
						$scope.imgviewinfo[imageindex].img=img2[0];

					}


					console.log(["换换换",thispsimg.index(),imageindex]);
				}
			}

			function isinthisbox(x,y,box){
				if(x>box[0]&&x<box[2]&&y>box[1]&&y<box[3]){

					return true;
				}else{
					return false;
				}

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

		//图片上传
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




}])

;