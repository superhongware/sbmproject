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
			.success(function(data){
				if(!data.isSuccess){
					alert("获取数据失败");
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



.controller('pagetempht1Ctrl',['$scope','$rootScope','$state',"$http","setShowImg",function($scope,$rootScope,$state,$http,setShowImg){


	console.log("pagetempht1Ctrl");

	$scope.imgviewinfo=[];

	$scope.setimg=function(index){
		
		console.log(index);

		checklocalimg(function(img){
			// console.log(img);
			var thisimgdata=$scope.imgviewinfo[index];
			var imgbox=$(".ps_img"+(index+1));
			
			if(typeof thisimgdata.img==="undefined"){
				console.log(["初始化图片数据"]);
				//初始化图片属性		
				thisimgdata.startpoint=[0,0];
				thisimgdata.point=[0,0];
				thisimgdata.scale=[1,1];
				// thisimgdata.scale=[0.4,0.4];
				thisimgdata.point=[0,0];
				thisimgdata.dragstart=ionic.onGesture("dragstart",dragstart,imgbox[0]);
				thisimgdata.drag=ionic.onGesture("drag",dragmove,imgbox[0]);
				thisimgdata.drag=ionic.onGesture("transformstart",dragstart,imgbox[0]);
				thisimgdata.drag=ionic.onGesture("transform",dragmove,imgbox[0]);

			}
			thisimgdata.img=img;
			// thisimgdata.scale=[]
			// ionic.onGesture("transform",moveimg,imgbox[0]);
			imgbox.find(".innerimg").attr("src",$scope.imgviewinfo[index].img.src).show();


			function dragstart(e){
				console.log(e);
				if(e.type==="dragstart"){
					thisimgdata.startpoint[0] = thisimgdata.point[0];
					thisimgdata.startpoint[1] = thisimgdata.point[1];
				}else{
					thisimgdata.scale[1]=thisimgdata.scale[0];
				}
				// thisimgdata.rotation[1]=thisimgdata.rotation[0];
			}

			function dragmove(e){
				// console.log(e)
				if(e.type==="drag"){				
					thisimgdata.point[0]=parseInt(e.gesture.deltaX)+thisimgdata.startpoint[0];
					thisimgdata.point[1]=parseInt(e.gesture.deltaY)+thisimgdata.startpoint[1];
				}else{
					thisimgdata.scale[0]=e.gesture.scale*thisimgdata.scale[1];
				}
				imgbox.find(".innerimg").css({
					"-webkit-transform":"translate3d("+thisimgdata.point[0]+"px,"+thisimgdata.point[1]+"px,0px) scale("+thisimgdata.scale[0]+")"
				});
				drawimg(thisimgdata.img);
			}
			function drawimg(imgobj){
				var cvs=document.getElementById('imgcanvas');
				var ctx=cvs.getContext("2d");
				//宽度以全屏640为基准 计算出图片压缩后尺寸
				var finalwidthscal=640/imgbox.parent(".ps_page")[0].clientWidth;
				cvs.width=imgbox[0].clientWidth*finalwidthscal;
				cvs.height=imgbox[0].clientHeight*finalwidthscal;
				
				//清除画布 准备绘图
				ctx.clearRect(0,0,cvs.width,cvs.height);
				ctx.save();
				
				//把原图缩放 平铺canvas
				var scale=cvs.width/imgobj.width;
				ctx.scale(scale,scale);

				//根据用户缩放比例，位移尺寸绘图  图片缩放原点为图片中心
				var translatex=thisimgdata.point[0]*finalwidthscal/scale+imgobj.width/2;
				var translatey=thisimgdata.point[1]*finalwidthscal/scale+imgobj.height/2;
				ctx.translate(translatex,translatey);
				ctx.scale(thisimgdata.scale[0],thisimgdata.scale[0]);
				ctx.translate(-imgobj.width/2,-imgobj.height/2);
				ctx.drawImage(imgobj,0,0);
				ctx.restore();
				// console.log(translatex,-translatex/thisimgdata.scale[0],"--",translatey,-translatey/thisimgdata.scale[0]);
			}

		});
	};



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
