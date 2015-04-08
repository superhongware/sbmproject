/**
 * creatshowmodule Module
 *
 * 创建宝贝秀功能
 */
var creatshowmodule = angular.module('creatshowmodule', ['ionic', 'starter.services', 'starter.directives']);

creatshowmodule.controller('checktemplateCtrl', ['$scope','$stateParams','$ionicLoading','$state','getTemplate','creatShow', function($scope,$stateParams,$ionicLoading,$state,getTemplate,creatShow){
	
	//假设取到的模板信息
	$scope.templateId=1;

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
.factory('creatShow', ['$rootScope','$http','SBMJSONP','productComm','saveShow',function($rootScope,$http,SBMJSONP,productComm,saveShow){
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

					console.log(["创建宝贝秀-获取模板数据",tempdata]);
					//填充模板数据
					tempdata.detailTitle = productdata.title + "宝贝秀";
					tempdata.detailDesc = productdata.title + "描述";
					tempdata.detailImage = productdata.picUrl;
					tempdata.shopName = productdata.shopName;
					tempdata.numIid = productdata.numIid;
					//&符号传输过程中会出错
					tempdata.detailUrl = productdata.detailUrl;
					tempdata.plat = creatshowdata.productPlat;
					tempdata.detailId="";
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

/**
 * [saveShow 保存宝贝秀]
 * @param  {[obj]} saveshowdata [参数选项{宝贝秀数据}]
 * @param  {[fun]} callBack      [成功返回]
 * @param  {[fun]} errorCallBack [失败返回]
 * @return {[obj]}               [description]
 */
.factory('saveShow', ['$rootScope','$http','SBMJSONP','productComm',function($rootScope,$http,SBMJSONP,productComm){
	return function saveShow(saveshowdata,callback,errorcallback){
			saveshowdata.detailUrl=saveshowdata.detailUrl.replace(/&/g,"%26");
			var showdata={
				orgName:$rootScope.orgName,
				detailId:saveshowdata.detailId,
				method:"softbanana.app.detail.saveOrUpdate"
			};

			var api=SBMJSONP("saveOrUpdateDetail",showdata);

			api.url+=("&detailData="+JSON.stringify(saveshowdata));
			// callback({showId:"3456"});
			// console.log("这里要完善保存宝贝秀的代码");
			// return;
			$http.jsonp(api.url)
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
				callback(data);
			})
			.error(function(status, response) {
				errorcallback(status, response);
			});
	};
}])


;