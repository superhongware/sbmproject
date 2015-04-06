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

			if(data){
				//创建成功跳转到编辑页
				$state.go("editpages.editer",{
					showId:data.showId,
					pageId:0,
					pageTemp:data.firstPageTemp
				});
			}else{
				//创建失败出提示
				alert("创建失败，再试一次");
			}

		},function(){

			alert("连接服务器失败，查看网络问题");

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

			// numIid: "44494150855"
			// picUrl: "http://img04.taobaocdn.com/bao/uploaded/i4/TB1Y1OHHpXXXXbKapXXXXXXXXXX_!!0-item_pic.jpg"
			// postFee: "0.00"
			// price: "199.00"
			// salesProperty: null
			// shopName: "宏巍软件"
			// status: "onsale"
			// title: "订单测试"

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
					tempdata.detailUrl = productdata.detailUrl;
					tempdata.plat = creatshowdata.productPlat;
					
					//第三步 保存宝贝秀
					saveShow(tempdata,function(data){
						data.firstPageTemp=tempdata.pages[0].templatePageId;
						callback(data);

					},function(status, response){

						errorcallback(status, response);

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
.factory('saveShow', ['$rootScope','$http','SBMPOST','productComm',function($rootScope,$http,SBMPOST,productComm){
	return function saveShow(saveshowdata,callback,errorcallback){

			var showdata={
				orgName:$rootScope.orgName,
				detailId:"",
				method:"softbanana.app.detail.saveOrUpdate"
			};


			var api=SBMPOST("saveOrUpdateDetail",showdata);

			var postdata={
					system:api.data,
					detailData:saveshowdata
				};
			
			callback({showId:"3456"});
			console.log("这里要完善保存宝贝秀的代码");
			return;
			// $http.post(api.url,postdata)
			// .success(function(data){
			// 	console.log(["保存宝贝秀-保存后数据",data]);
			// })
			// .error(function(status, response){
			// });

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