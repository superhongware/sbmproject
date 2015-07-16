/**
 * loginmodule Module
 *
 * 登录注册功能
 */
var loginmodule = angular.module('loginmodule', ['ionic', 'starter.services', 'starter.directives']);
loginmodule.controller('LoginCtrl', ['$scope', '$rootScope', '$http','$ionicLoading','loginSubmit', 'myCookie', 'base64', '$state','SBMJSONP',
 function($scope, $rootScope,$http,$ionicLoading, loginSubmit, myCookie, base64, $state,SBMJSONP) {
	// $rootScope.viewanimate="gogogo";
	// $scope.urldata=loginSubmit();
	$scope.logindata = {
		orgName: "",
		userName: "",
		password: "",
	};
	
	// $scope.logindata = {
	// 	orgName: "",
	// 	userName: "",
	// 	password: "",
	// };

	var searchshopdata={
		orgName:$rootScope.orgName,
		status:0,
		pageSize:50,
		method:'softbanana.app.shop.search'
	}
	var api=SBMJSONP('searchShop',searchshopdata)
	$http.jsonp(api.url).success(function(data){
		console.log(['商店详情',data])
	})


	$scope.loginSubmit = function(data){
		if($scope.logindata.orgName===""){
			$(".error-tip").eq(0).children(".rect").text("商家名称不允许为空");
			$(".error-tip").eq(0).show();
		}
		if($scope.logindata.userName===""){
			$(".error-tip").eq(1).children(".rect").text("用户名不允许为空");
			$(".error-tip").eq(1).show();
		}
		if($scope.logindata.password===""){
			$(".error-tip").eq(2).children(".rect").text("密码不允许为空");
			$(".error-tip").eq(2).show();
		}
		$ionicLoading.show({
			template:"正在登陆,请稍后..."
		})
		loginSubmit(data,function(msg){
			$ionicLoading.hide();
			myCookie.add("orgName",base64.encode(data.orgName),720);
			myCookie.add("userName",base64.encode(data.userName),720);

			$rootScope.orgName=data.orgName;
			$rootScope.userName=data.userName;
			$rootScope.orgCode=msg.user.orgCode;
			// console.log(["$rootScope.orgName",$rootScope.orgName]);
			// console.log(["$rootScope.orgCode",$rootScope.orgCode]);
			// console.log(["myCookie.get orgName",base64.decode(myCookie.get('orgName'))]);
			// console.log(["myCookie.get userName",base64.decode(myCookie.get('userName'))]);


			$state.go("home");
			console.log(["success",msg]);

		},function(msg){
			$ionicLoading.hide();
			if(msg == "对应的商家不存在"){
				$(".error-tip").eq(0).children(".rect").text(msg);
				$(".error-tip").eq(0).show();
			}else if(msg == "用户名不存在"){
				$(".error-tip").eq(1).children(".rect").text(msg);
				$(".error-tip").eq(1).show();
			}else if(msg == "密码错误"){
				$(".error-tip").eq(2).children(".rect").text(msg);
				$(".error-tip").eq(2).show();
			}
			console.log(["erroe",msg]);
		});
	};



	$scope.hidetip = function(){
	
		$(".error-tip").hide();
	};
}])

//注册页
.controller('sign_upCtrl', ['$rootScope','$scope', '$state', '$ionicPopup', "$http",'$ionicLoading', "SBMJSONP",'myCookie','base64',
function($rootScope,$scope, $state, $ionicPopup, $http,$ionicLoading, SBMJSONP,myCookie,base64) {
	$scope.yourdata = {
		orgName: "",
		userName: "",
		password: "",
		phone: "",
		email: "",
		channel:"app"
	};
	$scope.password={
		password:''
	};

	//取之前缓存的资料
	// var logininfo=window.sessionStorage.getItem("logininfo");
	// if(logininfo!=="null"){
	// 	$scope.yourdata=JSON.parse(logininfo);
	// }

	$scope.sign_up = function() {

		if($scope.yourdata.orgName===''){
			// alert(1)
			$(".error-tip").eq(0).children(".rect").text("请输入商家名称");
			$(".error-tip").eq(0).show();
			return;
		}

		if($scope.yourdata.userName===''){
			$(".error-tip").eq(1).children(".rect").text("请输入用户名");
			$(".error-tip").eq(1).show();
			return;
		}

        // var res1 = /^[\u4e00-\u9fa5a-z]+$/gi;
        var res1 =/^(([^\^\.<>%&',;=?$"':#@!~\]\[{}\\/`\|])*)$/;
		if($scope.yourdata.orgName===''){
			// alert(1)
			$(".error-tip").eq(0).children(".rect").text("请输入商家名称");
			$(".error-tip").eq(0).show();
			return;
		}
		else if(!res1.test($scope.yourdata.orgName)){
			$(".error-tip").eq(0).children(".rect").text("不能输入特殊字符");
			$(".error-tip").eq(0).show();
			return;
		}
          var res2 = /^[\u4e00-\u9fa5a-z]+$/gi;
         
		if($scope.yourdata.userName===''){
			$(".error-tip").eq(1).children(".rect").text("请输入用户名");
			$(".error-tip").eq(1).show();
			return;
		}
		else if(!res2.test($scope.yourdata.userName)){
			$(".error-tip").eq(1).children(".rect").text("不能输入特殊字符");

			$(".error-tip").eq(1).show();
			return;
		}

		if($scope.yourdata.password===""){

			$(".error-tip").eq(2).children(".rect").text("请输入密码");
			$(".error-tip").eq(2).show();
			return;

		}else if($scope.yourdata.password.length<6||$scope.yourdata.password.length>12){
			$(".error-tip").eq(2).children(".rect").text("密码请再6~12位之间");
			$(".error-tip").eq(2).show();
			return;
		}
		if($scope.yourdata.password!==$scope.password.password){
			$(".error-tip").eq(3).children(".rect").text("两次输入的密码不一致");
			$(".error-tip").eq(3).show();
			return;
		}
		// alert(0)

		// if($scope.yourdata.password)

		var reg0 =  /^1\d{10}$/;
		if(!reg0.test($scope.yourdata.phone)&&($scope.yourdata.phone!=="")){
			$(".error-tip").eq(4).show();
			return;
		}

		var  reg= /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		// var  reg= /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

		if(!reg.test($scope.yourdata.email)&&($scope.yourdata.email!=="")){
			$(".error-tip").eq(5).show();
			return;
		}

        


		// var restring= /^[\u4e00-\u9fa5a-z0-9_.@]+$/gi;//只能输入汉字和英文字母		
		// if(!restring.test($scope.yourdata.orgName)){
		// 	// alert(1)
		// 	$(".error-tip").eq(0).children(".rect").text("不能输入特殊字符");
		// 	$(".error-tip").eq(0).show();
		// 	return;
		// }

		// var restring2= /^[\u4e00-\u9fa5a-z0-9_.@]+$/gi;//只能输入汉字和英文字母
		// if(!restring2.test($scope.yourdata.userName)){
		// 	$(".error-tip").eq(1).children(".rect").text("不能输入特殊字符");
		// 	$(".error-tip").eq(1).show();
		// 	return;
		// }


		$scope.yourdata.method = "softbanana.app.user.regist";
		var api = SBMJSONP("registUser", $scope.yourdata);
		console.log($scope.yourdata);
		$ionicLoading.show({
			template:"正在注册信息，请稍等..."
		})
		$http.jsonp(api.url)
			.success(function(data) {
				$ionicLoading.hide();
				if(data.isSuccess){
					var siginsuccess=$ionicPopup.show({
						title: "注册成功",
						template: "注册消息已发送到邮箱，请妥善保管！",
						buttons: [{
							text: "我知道了",
							type: "button-energized",
						}]
					});
					siginsuccess.then(function(res){
						myCookie.add("orgName",base64.encode($scope.yourdata.orgName),720);
						myCookie.add("userName",base64.encode($scope.yourdata.userName),720);
						$rootScope.orgName=$scope.yourdata.orgName;
						$rootScope.userName=$scope.yourdata.userName;
						$state.go("taoxiaopu");
					})
				}else{
					console.log(data);

					$ionicPopup.show({
						title: "注册失败",
						template: data.map.errorMsg,
						buttons: [{
							text: '去改下资料',
							type: "button-energized",
						}]
					});
					// if(data.map.errorMsg === "商家名称不允许为空"){
					// 	$(".error-tip").eq(0).children(".rect").text(data.map.errorMsg);
					// 	$(".error-tip").eq(0).show();
					// }else if(data.map.errorMsg==="商家名称重复！"){
					// 	$(".error-tip").eq(0).children(".rect").text(data.map.errorMsg);
					// 	$(".error-tip").eq(0).show();
					// }else if(data.map.errorMsg === "该商家名称已注册"){
					// 	$(".error-tip").eq(0).children(".rect").text(data.map.errorMsg);
					// 	$(".error-tip").eq(0).show();
					// }else if(data.map.errorMsg === "用户名不允许为空"){
					// 	$(".error-tip").eq(1).children(".rect").text(data.map.errorMsg);
					// 	$(".error-tip").eq(1).show();
					// }else if(data.map.errorMsg === "该商家名称下已注册该用户名"){
					// 	$(".error-tip").eq(1).children(".rect").text(data.map.errorMsg);
					// 	$(".error-tip").eq(1).show();
					// }else if(data.map.errorMsg === "密码不允许为空"){
					// 	$(".error-tip").eq(2).children(".rect").text(data.map.errorMsg);
					// 	$(".error-tip").eq(2).show();
					// }else if(data.map.errorMsg === "手机号不允许为空"){
					// 	$(".error-tip").eq(4).children(".rect").text(data.map.errorMsg);
					// 	$(".error-tip").eq(4).show();
					// }else if(data.map.errorMsg === "Email不允许为空"){
					// 	$(".error-tip").eq(5).children(".rect").text(data.map.errorMsg);
					// 	$(".error-tip").eq(5).show();
					// }
				}
				
			})
			.error(function(status, response) {
				$ionicLoading.hide();
				console.log("连接失败");

			});

		//缓存之前填的资料
		// window.sessionStorage.setItem("logininfo",JSON.stringify($scope.yourdata));
	};

	$scope.hidetip = function(){
		$(".error-tip").hide();
	};

}]);