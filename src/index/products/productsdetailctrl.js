

productsmodule.controller('productDetailCtrl', [
'$rootScope', '$scope', '$http', '$state', '$stateParams', '$ionicLoading', 'productComm','$ionicSlideBoxDelegate','creatShow','SBMJSONP', 
function($rootScope, $scope, $http, $state, $stateParams, $ionicLoading, productComm,$ionicSlideBoxDelegate,creatShow,SBMJSONP) {

	var pageFunc = {},
		pageData = {};
	// alert(localStorage.getItem('currSelectProduct'))
	pageData = {
		currSelectOrder: JSON.parse(localStorage.getItem('currSelectProduct')),
		orderDetail: {},
		isPageShow:false
	};

	console.log(pageData);

	/**
	 * [init 模块入口]
	 * @return {[type]} [description]
	 */
	pageFunc.init = function() {
		if (pageData.currSelectOrder) {
			pageFunc.loadProductDetail();
		} else {
			$state.go('orders');
		}
	};

	/**
	 * [loadProductDetail 加载产品详情]
	 * @return {[type]} [description]
	 */
	pageFunc.loadProductDetail = function() {
		$ionicLoading.show({
			template: "正在加载..."
		});

		productComm.loadProductDetail({
			orgName: pageData.currSelectOrder.orgName,
			numIid: pageData.currSelectOrder.numIid,//'36042861282'
			plat: pageData.currSelectOrder.plat
		},function(data){
			$ionicLoading.hide();
			console.log(['loadProductDetail',data]);
			//页面视图数据展现处理
			pageData.orderDetail = data;
			pageData.orderDetail.picArr = pageData.orderDetail.picUrl.split(',');
			// $ionicSlideBoxDelegate.$getByHandle('productImgBox').update();
			pageData.isPageShow = true;

			setTimeout(function(){
				$("#sliders").touchSlider({
					animatetime:300,
					automatic:!0,
					timeinterval:4e3,
					sliderpoint:!0,
					sliderpointwidth:8,
					sliderpointcolor:"#fa9d00"
				});
			},200);


		},function(msg){
			$ionicLoading.hide();
			console.log(msg);
		});

	};
	/**
	 * [slideHasChanged description]
	 * @param  {[type]} $index [description]
	 * @return {[type]}        [description]
	 */
	pageFunc.slideHasChanged = function($index) {
		console.log("$index: " + $index);
	};

	

		//删除
	$scope.dele = function(detailid){
		$scope.deldata = {
			orgName:$rootScope.orgName,
			detailId:detailid
		};
		$scope.deldata.method = "softbanana.app.detail.delete";
		var api = SBMJSONP("deleteDetail",$scope.deldata);
		$http.jsonp(api.url)
			.success(function(data){
				if(data.isSuccess){
					console.log(data);
					for(var i in pageData.orderDetail.appDetailCounts){
						if(pageData.orderDetail.appDetailCounts[i].detailId == $scope.deldata.detailId){
							pageData.orderDetail.appDetailCounts.splice(i,1);
						}
					}
				}else{
					console.log(data.map.errorMsg);
				}
			})
			.error(function(status,response){
				console.log("连接失败");
			});

	};

	$scope.edit = function(detailId){
		$scope.detaildata = {
			orgName:$rootScope.orgName,
			detailId:detailId
		};
		$scope.detaildata.method = "softbanana.app.detail.search";
		var api = SBMJSONP("searchDetail",$scope.detaildata);
		$http.jsonp(api.url)
			.success(function(data){
				if(data.isSuccess){
					$state.go("editpages.editer",{
						showId:detailId,
						pageId:0,
						pageTemp:data.pages[0].templatePageId
					});
				}else{
					console.log(data.map.errorMsg);
				}
			})
			.error(function(status,response){
				console.log("连接失败");
			});

	};

	$scope.pageData = pageData;
	pageFunc.init();

}])

;



