creatshowmodule
.controller('remoteimgCtrl',[
'$rootScope','$scope','$state','$ionicHistory','getremoteimgcat', '$ionicPopover','SBMJSONP','$http','saveShow',
function($rootScope,$scope,$state,$ionicHistory,getremoteimgcat,$ionicPopover,SBMJSONP,$http,saveShow){
	$scope.remoteimgcat=[];
	$scope.remoteimg={};
	$scope.goback=function(){
		$ionicHistorsy.goBack();
	};
	$scope.refreshimg=function(){

	};
	getremoteimgcat(function(data){
		console.log(["图片分类",data]);
		$scope.remoteimgcat=data.pictureCategorys;
		// $scope.$apply();
	});

  




//获取分类的图片
    $scope.loadPicsByStatusFilter=function(categoryid){
    	var categorydata={
				orgName:$rootScope.orgName,
				shopName:$rootScope.editShowData.mainData.shopName,
				plat:$rootScope.editShowData.mainData.plat,
				pictureCategoryId:categoryid,
				method:"softbanana.app.picture.category.search"
			};

		var api=SBMJSONP("searchPictureCategory",categorydata);
		$http.jsonp(api.url)
		.success(function(data){
			console.log(["获取空间图片成功",data]);
			$scope.pics=data.pictureCategorys[0].pictures;
			if(data.isSuccess){
				for (var i = 0; i <data.pictureCategorys[0].pictures.length; i++) {
					if(categorydata.plat === "TAOBAO"){
						$scope.pics[i].URL2 = data.pictureCategorys[0].pictures[i].URL+"_100x100.jpg";
					}
					else if(categorydata.plat === "TMALL"){
						$scope.pics[i].URL2 = data.pictureCategorys[0].pictures[i].URL+"_100x100.jpg";
					}
					else if(categorydata.plat === "JINGD"){
						var arr=[];
						arr = data.pictureCategorys[0].pictures[i].URL.split('/');
						arr[3]='n4';
						arr = arr.join('/');
						$scope.pics[i].URL2 = arr;
					}
					// else if(categorydata.plat === "PAIPAI"){
					// 	$scope.pics[i].URL2 = data.pictureCategorys[0].pictures[i].URL+".100x100.jpg";
					// }
					// else if(categorydata.plat === "KDT"){
					// 	$scope.pics[i].URL2 = data.pictureCategorys[0].pictures[i].URL+"!100x100.jpg";
					// }
					else{
						$scope.pics[i].URL2 = data.pictureCategorys[0].pictures[i].URL;
					}
					
				}
			}
			console.log($scope.pics);
		})
		.error(function(data){
			console.log(["获取空间图片失败",data]);
		});
		$scope.popover.hide();
    };

    $scope.uppic = function(picurl){
    	$rootScope.picurl = picurl;


    	//app.creatshow/creatctrl.pageadd.js  31行左右有相同代码
		//此处保存只为了  修复添加页面后小页面无法拖动bug 重新加载showdata后小页面就可以拖动
		//半夜三更的我真找不到是什么原因导致的  实在解决不了才出此对策
		//你看到这个  如果想优化下，非常欢迎!!!
		saveShow($rootScope.editShowData.mainData,function(data){
			$rootScope.editShowData.mainData=undefined;
			// $ionicLoading.hide();
			history.go(-1);
			// $state.go("editpages.editer",{
			// 	showId:$rootScope.pic_showId,
			// 	pageId:$rootScope.pic_pageId,
			// 	pageTemp:$rootScope.pic_pageTemp
			// 		});
		},function(){

		});

   //  	$state.go("editpages.editer",{
			// 	showId:$rootScope.pic_showId,
			// 	pageId:$rootScope.pic_pageId,
			// 	pageTemp:$rootScope.pic_pageTemp
			// });
    	
    };
// ui-sref="viewtemplate({templateId:pic_templteId,productId:pic_productId,productPlat:pic_productPlat})"


    $ionicPopover.fromTemplateUrl('templates/index/creatshows/popoverPic.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });


    $scope.openPopover = function($event) {
   		 $scope.popover.show($event);
 	};

}])
;









