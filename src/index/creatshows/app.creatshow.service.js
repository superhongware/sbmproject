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
		};

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

;