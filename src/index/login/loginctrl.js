
//登录页
starterctrl.controller('LoginCtrl', ['$scope','$state','loginSubmit',function($scope,$state,loginSubmit){
	// $rootScope.viewanimate="gogogo";
	// $scope.urldata=loginSubmit();
	$scope.loginSubmit=loginSubmit;
	$scope.maindata={
		dataa:1,
		datab:2,
		data3:"123"
	};
	
	console.log(0);
	// var url="http://192.168.51.173:8089/openApi/dyncSoftBanana/app/userLogin"

}])


//注册页
.controller('sign_upCtrl', ['$scope','$rootScope','$state','$ionicPopup',function($scope,$rootScope,$state,$ionicPopup){
	// $rootScope.viewanimate="goback";
	$scope.sign_up=function(){
		$ionicPopup.show({
			title:"注册成功",
			template:"注册消息已发送到邮箱，请妥善保管！",
			buttons:[{
				text:"我知道了",
				type:"button-energized",
				onTap:function(e){
					$state.go("shops");
				}
			}]
		});
	};

	$scope.sign_upForm={
		
	};
}]);