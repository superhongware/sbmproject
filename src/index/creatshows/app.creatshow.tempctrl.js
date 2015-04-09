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
			pageid=pageid<showdata.mainData.pages.length?pageid:showdata.mainData.pages.length;
		var params={
			showId:showdata.showId,
			pageId:pageid,
			pageTemp:showdata.mainData.pages[pageid].templatePageId
		};
		$state.go("editpages.editer",params);
	};

	// console.log(["aa",$rootScope.editShowData]);

	//获取宝贝秀数据
	$rootScope.$watch("editShowData",function() {
		// body...
			console.log($rootScope.editShowData);
		if(!$rootScope.editShowData.mainData&&$rootScope.editShowData.showId!==$rootScope.editShowData.mainData.showId){


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
				console.log(["更新宝贝秀数据结束",data]);
				$rootScope.editShowData.mainData=data;
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

	// console.log(["cc",$rootScope.editShowData]);
	// console.log($rootScope.editShowData.currentpage);

}])
.directive('normalEditPage', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'templates/index/creatshows/pages/normaleditpage.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
		}
	};
})

.controller('pagetempht1Ctrl',['$scope','$rootScope','$state',"$http","SBMJSONP",function($scope,$rootScope,$state,$http,SBMJSONP){
	// console.log($state.current);
	console.log("pagetempht1Ctrl");
	// console.log("editerCtrl");

	$scope.checkimg=function(){
		document.getElementById('fileImg').click();
	};

	document.getElementById('fileImg').addEventListener('change', handleFileSelect, false);

	function handleFileSelect (evt) {
		var file = evt.target.files[0];
		if (!file.type.match('image.*')) {
			return;
		}

		var reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onload=function(e){
			console.log(e.target.result);
			var img=new Image();
			img.src=e.target.result;

			console.log(compress(img,50));

			var api=SBMJSONP("uploadImage/uploadFile",{
				orgName:$rootScope.orgName,
				method:"softbanana.app.image.upload",
				imageData:compress(img,50)
			});

			$http.jsonp(api.url)
			.success(function(data){
				console.log(["图片上传成功",data]);
			})
			.error(function(data){
				console.log(["图片上传失败",data]);
			});
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

}])



.controller('pagetemp1Ctrl',['$scope','$state',function($scope,$state){
	// console.log($state.current);
	console.log("pagetemp1");
	// console.log("editerCtrl");

}])


.controller('pagetemp2Ctrl',['$scope','$state',function($scope,$state){
	// console.log($state);
	console.log("pagetemp2");
	// console.log("editerCtrl");
}]);
