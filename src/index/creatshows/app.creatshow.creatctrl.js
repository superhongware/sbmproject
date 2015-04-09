/**
 * creatshowmodule Module
 *
 * 创建宝贝秀功能
 */
var creatshowmodule = angular.module('creatshowmodule', ['ionic', 'starter.services', 'starter.directives']);

creatshowmodule.controller('checktemplateCtrl', ['$scope','$stateParams','$ionicLoading','$state','getTemplate','creatShow', function($scope,$stateParams,$ionicLoading,$state,getTemplate,creatShow){
	
	//假设取到的模板信息
	$scope.templateId=1;

	// getTemplate(function(data){
	// 	console.log(data);
	// })

	//根据模板创建宝贝秀
	$scope.creatShow=function(templateId){

		$ionicLoading.show({
			template:"创建中,请稍等...",
		});

		var creatdata={
			templateId:templateId,
			productId:$stateParams.productId,//宝贝ID
			productPlat:$stateParams.productPlat,//所属平台
		};

		creatShow(creatdata,function(data){

			//隐藏“创建中,请稍等...”
			$ionicLoading.hide();

			//创建成功跳转到编辑页
			$state.go("editpages.editer",{
				showId:data.detailId,
				pageId:0,
				pageTemp:data.firstPageTemp
			});

		},function(msg){

			alert(msg);

		});
	};

}])




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

			// var pages=tempdata.pages;		  //模板page数
			// var baobeiImgCount=productimgs.length; //宝贝总图片数
			// var usedBaobeiImg=0;			  //宝贝已用掉的图片数,刚好可以定位第一个未使用的图片index
			// var restBaobeiImg=productimgs.length;  //宝贝剩余的未用掉的图片数
			// var pageImgCount=0;				  //模板page总图片数
			// for(var i=0;i<pages.length;i++){
			// 	var singlePageCount=pages[i].detailPageImage.length;	//单个page的图片数
			// 	if(restBaobeiImg<singlePageCount){		//剩余图片<当前page图片数量
			// 		for(var m=0;m<restBaobeiImg;m++){
			// 			pages[i].detailPageImage[m].img=productimgs[usedBaobeiImg];	
			// 			usedBaobeiImg++;
			// 		}
			// 	}else{	//剩余图片>当前page图片数量
			// 		for(var j=0;j<singlePageCount;j++){
			// 			pages[i].detailPageImage[j].img=productimgs[usedBaobeiImg];	
			// 			usedBaobeiImg++;
			// 		}
			// 	}
			// 	restBaobeiImg=baobeiImgCount-usedBaobeiImg;		//得到当前剩余的宝贝图片数量,遍历下一个page
			// }

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
			var api=SBMJSONP("saveOrUpdateDetail",showdata);
			api.url+=("&detailData="+encodeURIComponent(JSON.stringify(saveshowdata)));
			$http.jsonp(api.url)
			// var api=SBMPOST("saveOrUpdateDetail",showdata);
			// api.data+=("&detailData="+encodeURIComponent(JSON.stringify(saveshowdata)));
			// $http.post(api.url,api.data)

			.success(function(data){
				console.log(["保存宝贝秀-保存后数据",data]);
				if(data.isSuccess){
					callback(data);
				}else{
					errorcallback(data.map.errorMsg);
				}
			})
			.error(function(status, response){

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