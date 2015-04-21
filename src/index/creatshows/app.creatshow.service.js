creatshowmodule.factory('changepagesize', function(){
	return function changepagesize(){
		var pageempty=parseInt($(window).height()-110-44),
			pageheight=parseInt(pageempty*0.9),
			pagewidth=parseInt(pageheight*0.635),
			pagtop=44+parseInt((pageempty-pageheight)/2);

		$(".editplace").css({
			"height":pageheight,
			"width":pagewidth,
			"top":pagtop
		});

	};
})
.factory('setShowImg', ['$rootScope','$http','SBMJSONP','SBMPOST', function($rootScope,$http,SBMJSONP,SBMPOST){

	return function setShowImg(cvssize,callback){
		document.getElementById('fileImg').click();

		var cvs=document.getElementById('maincanvas');
		var ctx=cvs.getContext("2d");

		var position={
			startpoint:[0,0],
			point:[0,0],
			scale:[1,1],
			rotation:[0,0],
			img:""
		};

		cvs.width=cvssize[0];
		cvs.height=cvssize[1];
		$(".checkimgbox").show();

		$(".leftbtn").click(function(){
			$(".checkimgbox").hide();
		});

		$(".rightbtn").click(function(){
			var senddata={
					orgName:$rootScope.orgName,
					method:"softbanana.app.image.upload",
					imageData:encodeURIComponent(compress(position.img,50))
				};

			// 此处使用POST
			// var api=SBMJSONP("uploadImage/uploadFile",senddata);
			// $http.jsonp(api.url)
			var api=SBMPOST("uploadImage/uploadFile",senddata);
			$http.post(api.url,api.data)
			
			.success(function(data){
				console.log(["图片上传成功",data]);
				$(".checkimgbox").hide();
				callback(data.image.imageUrl);
			})
			.error(function(data){
				console.log(["图片上传失败",data]);
			});
		});


		$(cvs).on("touchstart",function(e){
			position.startpoint[0] = position.point[0];
			position.startpoint[1] = position.point[1];
			position.startpoint[1] = position.point[1];
			position.startpoint[1] = position.point[1];
			position.scale[1]=position.scale[0];
			position.rotation[1]=position.rotation[0];
		});

		ionic.onGesture("transform",touchmove,cvs);
		ionic.onGesture("drag",touchmove2,cvs);

		// $scope.setimg=function(){
		// 	console.log(cvs.toDataURL("image/jpeg", 60/100));
		// }
		function touchmove(e){
			// console.log(1);
			position.point[0]=e.gesture.deltaX+position.startpoint[0];
			position.point[1]=e.gesture.deltaY+position.startpoint[1];
			position.scale[0]=e.gesture.scale*position.scale[1];
			position.rotation[0]=position.rotation[1]+(Math.PI/360*e.gesture.rotation);
			drawimg(position.img);
		}
		function touchmove2(e){
			// console.log(2);
			position.point[0]=e.gesture.deltaX+position.startpoint[0];
			position.point[1]=e.gesture.deltaY+position.startpoint[1];
			position.scale[0]=e.gesture.scale*position.scale[1];
			position.rotation[0]=position.rotation[1]+(Math.PI/360*e.gesture.rotation);
			drawimg(position.img);
		}

		function drawimg(imgobj){
			ctx.clearRect(0,0,cvs.width,cvs.height);
			ctx.save();
			ctx.translate(position.point[0],position.point[1]);
			ctx.rotate(position.rotation[0]);
			ctx.scale(position.scale[0],position.scale[0]);
			ctx.drawImage(imgobj,position.point[0],position.point[1]);
			ctx.restore();

		}

		document.getElementById('fileImg').addEventListener('change', handleFileSelect, false);
			// var eventdata=e.gesture;
			// var htmldata="";
			// for(a in eventdata){
			// 	htmldata+=(a+":"+eventdata[a]+"<br/>");
			// }
			// document.body.innerHTML=htmldata;


		function handleFileSelect (evt) {
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

				position.img=img;
				drawimg(position.img);

				// console.log(compress(img,100));
				// var api=SBMJSONP("uploadImage/uploadFile",{
				// 	orgName:$rootScope.orgName,
				// 	method:"softbanana.app.image.upload",
				// 	imageData:encodeURIComponent(compress(img,50))
				// });

				// $http.jsonp(api.url)
				// .success(function(data){
				// 	console.log(["图片上传成功",data]);
				// 	callback(data.image.imageUrl);
				// })
				// .error(function(data){
				// 	console.log(["图片上传失败",data]);
				// });
			};
		}

		function compress(source_img_obj,quality,output_format){
			var mime_type = "image/jpeg";
			if(output_format!==undefined && output_format=="png"){
				mime_type = "image/png";
			}
			var cvs = document.createElement('canvas');
			cvs.width = source_img_obj.naturalWidth;
			cvs.height = source_img_obj.naturalHeight;
			var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0);
			var newImageData = cvs.toDataURL(mime_type, quality/100);
			return newImageData;
		}

	};

}])


// var cvs=drawShowImg(thisimgdata);
// compressShowImg(cvs,80);
.factory('drawShowImg', function(){
	return function drawShowImg(picdata){
		// var cvs=document.getElementById('imgcanvas');
		var cvs = document.createElement('canvas');
		var ctx=cvs.getContext("2d");
		//宽度以全屏640为基准 计算出图片压缩后尺寸
		var finalwidthscal=640/picdata.imgbox.parent(".ps_page")[0].clientWidth;
		cvs.width=picdata.imgbox[0].clientWidth*finalwidthscal;
		cvs.height=picdata.imgbox[0].clientHeight*finalwidthscal;
		
		//清除画布 准备绘图
		ctx.clearRect(0,0,cvs.width,cvs.height);
		ctx.save();
		
		//把原图缩放 平铺canvas
		var scale=cvs.width/picdata.img.naturalWidth;
		ctx.scale(scale,scale);
		//根据用户缩放比例，位移尺寸绘图  图片缩放原点为图片中心
		var translatex=picdata.point[0]*finalwidthscal/scale+picdata.img.naturalWidth/2;
		var translatey=picdata.point[1]*finalwidthscal/scale+picdata.img.naturalHeight/2;
		ctx.translate(translatex,translatey);
		ctx.scale(picdata.scale[0],picdata.scale[0]);
		ctx.translate(-picdata.img.naturalWidth/2,-picdata.img.naturalHeight/2);
		ctx.drawImage(picdata.img,0,0);
		ctx.restore();
		return cvs;

	};
})
.factory('compressShowImg', function(){
	return function compressShowImg(cvs,quality,output_format){
		var mime_type = "image/jpeg";
		if(output_format!==undefined && output_format=="png"){
			mime_type = "image/png";
		}
		
		var newImageData = cvs.toDataURL(mime_type, quality/100);
		console.log(newImageData);
		return newImageData;
	};
})

/**
 * [creatShow 创建宝贝秀]
 * @param  {[obj]} creatshowdata [参数选项{templateId、productId、productPlat}]
 * @param  {[fun]} callBack      [成功返回]
 * @param  {[fun]} errorCallBack [失败返回]
 * @return {[obj]}               [description]
 */
.factory('creatShow', ['$rootScope','$http','SBMJSONP','productComm','saveShow','setProductImg',function($rootScope,$http,SBMJSONP,productComm,saveShow,setProductImg){
	return function creatShow(creatshowdata,callback,errorcallback){
		//第一步，取宝贝信息
		productComm.loadProductDetail({
			orgName:$rootScope.orgName,
			numIid:creatshowdata.productId,
			plat:creatshowdata.productPlat
		},function(productdata){

			//创建宝贝秀-获取宝贝信息
			console.log(["创建宝贝秀-获取宝贝信息",productdata]);

			//第二步 取模板数据
			$http.get("testdata/template"+creatshowdata.templateId+".json")
				.success(function(tempdata) {
					console.log(["获取模板数据",tempdata]);

					var imgurls=productdata.picUrl.split(",");
					//填充模板数据
					tempdata.detailTitle = productdata.title + "宝贝秀";
					tempdata.detailDesc = productdata.title + "描述";
					tempdata.detailImage = "img/shareimg.jpg";
					tempdata.shopName = productdata.shopName;
					tempdata.numIid = productdata.numIid;
					tempdata.detailUrl = productdata.detailUrl;
					tempdata.plat = creatshowdata.productPlat;
					tempdata.detailId="";

					//自动导入宝贝图片
					tempdata=setProductImg(imgurls,tempdata);

					//第三步 保存宝贝秀
					saveShow(tempdata,function(data){
						data.firstPageTemp=tempdata.pages[0].templatePageId;
						callback(data);

					},function(errmesg){

						errorcallback(errmesg);

					});


				})
				.error(function(status, response) {
					errorcallback(status, response);
				});


		},function(msg,status, response){//获取宝贝信息失败
				errorcallback(status, response);

		});

	};
}])

.factory('setProductImg', function(){
	return function setProductImg(imgArr,jsonObj){

		var pages=jsonObj.pages;		  //模板page数
		var baobeiImgCount=imgArr.length; //宝贝总图片数
		var usedBaobeiImg=0;			  //宝贝已用掉的图片数,刚好可以定位第一个未使用的图片index
		for(var i=0;i<pages.length;i++){
				var singlePageCount=pages[i].detailPageImage.length;	//单个page的图片数
				for(var j=0;j<singlePageCount;j++){
					pages[i].detailPageImage[j].img=imgArr[usedBaobeiImg];	
					usedBaobeiImg++;
					if(usedBaobeiImg==baobeiImgCount){					//宝贝图片用光,需要循环使用
						usedBaobeiImg=0;	//重新计数
					}
				}
			}



		console.log(["将宝贝图片导入宝贝秀",jsonObj]);
		return jsonObj;




	};
})

/**
 * [saveShow 保存宝贝秀]
 * @param  {[obj]} saveshowdata [参数选项{宝贝秀数据}]
 * @param  {[fun]} callBack      [成功返回]
 * @param  {[fun]} errorCallBack [失败返回]
 * @return {[obj]}               [description]
 */
.factory('saveShow', ['$rootScope','$http','SBMJSONP','SBMPOST','productComm',function($rootScope,$http,SBMJSONP,SBMPOST,productComm){
	return function saveShow(saveshowdata,callback,errorcallback){
			// saveshowdata.detailUrl=saveshowdata.detailUrl.replace(/&/g,"%26");
			var showdata={
				orgName:$rootScope.orgName,
				detailId:saveshowdata.detailId,
				method:"softbanana.app.detail.saveOrUpdate"
			};

			// 此处使用POST
			// var api=SBMJSONP("saveOrUpdateDetail",showdata);
			// api.url+=("&detailData="+encodeURIComponent(JSON.stringify(saveshowdata)));
			// $http.jsonp(api.url)
			var api=SBMPOST("saveOrUpdateDetail",showdata);
			api.data+=("&detailData="+encodeURIComponent(JSON.stringify(saveshowdata)));
			$http.post(api.url,api.data)

			.success(function(data){
				console.log(["保存宝贝秀-保存后数据",data]);
				if(data.isSuccess){
					callback(data);
				}else{
					errorcallback(data.map.errorMsg);
				}
			})
			.error(function(status, response){
				console.log(["保存宝贝秀失败-网络链接有问题~",status]);
				alert("保存宝贝秀失败-网络链接有问题~");
			});

	};
}])

.factory('getTemplate', ['$rootScope','$http','SBMJSONP',function($rootScope,$http,SBMJSONP){
	return function creatShow(callback,errorcallback){
		//获取模板列表
		var templatesdata = {
			orgName: $rootScope.orgName,
			action:"",//向上（up）或者向下（next）查询
			pageNo:"",//自增长ID
			pageSize:10,//条数
			method:"softbanana.app.template.list"
		};
		var api = SBMJSONP("listTemplate",templatesdata);
		$http.jsonp(api.url)
			.success(function(data) {
				console.log(["获取模板数据",data]);
				callback(data);
			})
			.error(function(status, response) {
				errorcallback(status, response);
			});
	};
}])
;