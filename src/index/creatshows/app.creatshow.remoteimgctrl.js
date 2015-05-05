creatshowmodule
.controller('remoteimgCtrl',[
'$rootScope','$scope','$state','$ionicHistory','getremoteimgcat', '$ionicPopover','SBMJSONP','$http',
function($rootScope,$scope,$state,$ionicHistory,getremoteimgcat,$ionicPopover,SBMJSONP,$http){

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
    	$state.go("editpages.editer",{
				showId:$rootScope.pic_showId,
				pageId:$rootScope.pic_pageId,
				pageTemp:$rootScope.pic_pageTemp
			});
    	
    };
// ui-sref="viewtemplate({templateId:pic_templteId,productId:pic_productId,productPlat:pic_productPlat})"


    $ionicPopover.fromTemplateUrl('pageTplorderStatusfilterPopover', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

}])