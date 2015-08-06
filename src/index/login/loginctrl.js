/**
 * loginmodule Module
 *
 * 登录注册功能
 */
 var loginmodule = angular.module('loginmodule', ['ionic', 'starter.services', 'starter.directives']);
 loginmodule.controller('LoginCtrl', ['$scope', '$rootScope', '$http','$ionicLoading','$ionicPopup','loginSubmit', 'myCookie', 'base64', '$state','SBMJSONP',
 	function($scope, $rootScope,$http,$ionicLoading,$ionicPopup, loginSubmit, myCookie, base64, $state,SBMJSONP) {
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
			return;
		}
		if($scope.logindata.userName===""){
			$(".error-tip").eq(1).children(".rect").text("用户名不允许为空");
			$(".error-tip").eq(1).show();
			return;
		}
		if($scope.logindata.password===""){
			$(".error-tip").eq(2).children(".rect").text("密码不允许为空");
			$(".error-tip").eq(2).show();
			return;
		}
		$ionicLoading.show({
			template:"正在登陆,请稍后..."
		})
		loginSubmit(data,function(msg){
			$ionicLoading.hide();

			// console.log(["$rootScope.orgName",$rootScope.orgName]);
			// console.log(["$rootScope.orgCode",$rootScope.orgCode]);
			// console.log(["myCookie.get orgName",base64.decode(myCookie.get('orgName'))]);
			// console.log(["myCookie.get userName",base64.decode(myCookie.get('userName'))]);

			loginsuccess();



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
			}else{
				$ionicPopup.show({
					title: "登录失败",
					template: msg,
					buttons: [{
						text: "再试一次",
						type: "button-energized",
					}]
				});
			}
			console.log(["erroe",msg]);
		});
	};


	function loginsuccess(){
		//检测店铺状况
		var orgdatas = {
			orgName: $rootScope.orgName,
			pageNo: 1,
			pageSize: 50
		};
		orgdatas.method = "softbanana.app.shop.search";
		var api = SBMJSONP("searchShop", orgdatas);
		$http.jsonp(api.url)
			.success(function(data) {

				console.log(['店铺', data]);
				if(data.shops.length>0){
					//有店铺
					var shopisInvalid=false;
					for(var i in data.shops){
						if(data.shops[i].isInvalid=='1'){
							shopisInvalid=true;
						}
					}

					if(shopisInvalid){
						//有店铺未授权 跳到授权页面
						$state.go("set-expired");
					}else{
						//无未授权直接进首页
						$state.go("home");
					}

				}else{
					//无店铺
					$state.go("home");
				}

			})
			.error(function(status, response) {
				console.log("连接失败");
				$state.go("home");
			});
	}

	$scope.hidetip = function(){

		$(".error-tip").hide();
	};
}])

.controller('getmypwCtrl', ['$scope','$http','$timeout','$ionicPopup','SBMJSONP', function($scope,$http,$timeout,$ionicPopup,SBMJSONP){
	
	$scope.maindata={
		phone:"",
		codetime:'',
		code1:"",//输入的验证码
		code2:"",//取得的验证码
		codeok:false,//输入验证码位数是否正确
	};



	$scope.getcodeSubmit=function(){
		if($scope.maindata.codetime>0){
			return
		}else{
			$scope.maindata.codetime=60;
			//获取验证码倒计时
			nogetcode();
		}
		console.log($scope.maindata)

		var codedata={
			phone:$scope.maindata.phone,
			method:'softbanana.app.password.sendcode'
		}
		var api = SBMJSONP("sendCode", codedata);

		$http.jsonp(api.url)
		.success(function(data){
			console.log(['验证码',data])
			if(data.code){
				$scope.maindata.code2=data.code;
			}
		})
		.error(function(data){
			console.log(['验证码失败',data])
		})
	}

	$scope.getpwSubmit=function(){
		if($scope.maindata.code2!=$scope.maindata.code1){
			$ionicPopup.show({
				title: "找回密码",
				template: "请输入正确的验证码",
				buttons: [{
					text: "好的",
					type: "button-energized",
				}]
			});
			return;
		}

		var pwdata={
			phone:$scope.maindata.phone,
			isRight:$scope.maindata.code2==$scope.maindata.code1,
			method:'softbanana.app.password.sendPsd'
		}
		var api = SBMJSONP("sendPsd",pwdata);

		$http.jsonp(api.url)
		.success(function(data){
			console.log(['取密码',data])
			if(data.isSuccess){
				var getpwsuccess=$ionicPopup.show({
					title: "找回密码",
					template: "密码已发送到您手机上",
					buttons: [{
						text: "好的",
						type: "button-energized",
					}]
				});
				getpwsuccess.then(function(){
					window.history.go(-1);
				})
			}
		})
		.error(function(data){
			console.log(['取密码失败',data])
		})
	}





	//获取验证码倒计时
	function nogetcode(){
		if($scope.maindata.codetime>0){
			$timeout(function(){
				$scope.maindata.codetime--;
				nogetcode();
			},1000)
		}else{
			$scope.maindata.codetime='';
		}
	}

}])

//注册页
.controller('sign_upCtrl', ['$rootScope','$scope', '$state', '$ionicPopup', "$http",'$ionicLoading', "SBMJSONP",'myCookie','base64','loginSubmit',
	function($rootScope,$scope, $state, $ionicPopup, $http,$ionicLoading, SBMJSONP,myCookie,base64,loginSubmit) {
		$scope.yourdata = {
			orgName: "",
			userName: "",
			password: "",
			phone: "",
			email: "xingyu.cheng@softbanana.com",
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
	// 
	$scope.orgblur=function(e){ 
		console.log(1111)
		$scope.orgexist=false;
		$scope.orgnameAr={
			method:"softbanana.app.check.orgname",
			orgName:$scope.yourdata.orgName
		}
		var api = SBMJSONP("checkOrgName", $scope.orgnameAr);
		
		$http.jsonp(api.url)
		.success(function(data) {
		console.log(data)
			if(!data.isSuccess&&data.map.errorCode=="999"){
				
				
			}else if(data.isSuccess){
				if($(".popup-container").length<=0){
					$(".error-tip").eq(0).children(".rect").text("该商家名称已注册");
					$(".error-tip").eq(0).show();
					$scope.yourdata.orgName="";
				}
			}

		})
		.error(function(status, response) {
		
			console.log("连接失败");

		});

	}

	function strToJson(str){ 
		var json = eval('(' + str + ')'); 
		return json; 
	} 
	$scope.sign_up = function() {


		if($scope.yourdata.orgName===''){
			// alert(1)
			$(".error-tip").eq(0).children(".rect").text("请输入商家名称");
			$(".error-tip").eq(0).show();
			return;
		}

		if($scope.yourdata.orgName.length>12){
			// alert(1)
			$(".error-tip").eq(0).children(".rect").text("商家名称长度不能超过12位");
			$(".error-tip").eq(0).show();
			return;
		}

		if($scope.yourdata.userName===''){
			$(".error-tip").eq(1).children(".rect").text("请输入用户名");
			$(".error-tip").eq(1).show();
			return;
		}
		if($scope.yourdata.userName.length>12){
			// alert(1)
			$(".error-tip").eq(1).children(".rect").text("用户名长度不能超过12位");
			$(".error-tip").eq(1).show();
			return;
		}

        // var res1 = /^[\u4e00-\u9fa5a-z]+$/gi;
        var res1 =/^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/;
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
		var res2 = /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/;

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

		}else if($scope.yourdata.password.length<6||$scope.yourdata.password.length>24){
			$(".error-tip").eq(2).children(".rect").text("密码请再6~24位之间");
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
			$(".error-tip").eq(4).children(".rect").text("手机号格式错误");
			$(".error-tip").eq(4).show();
		return;
		}

		var  reg= /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		// var  reg= /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

		if(!reg.test($scope.yourdata.email)&&($scope.yourdata.email!=="")){
			$(".error-tip").eq(5).children(".rect").text("邮箱格式错误");
			$(".error-tip").eq(5).show();
			return;
		}
		    if($scope.password.password==''){
			$(".error-tip").eq(3).children(".rect").text("确认密码不能为空");
			$(".error-tip").eq(3).show();
			return;
		}
         if($scope.yourdata.phone==''){
			$(".error-tip").eq(4).children(".rect").text("手机号不能为空");
			$(".error-tip").eq(4).show();
			return;
		}
             if($scope.yourdata.email==''){
			$(".error-tip").eq(5).children(".rect").text("邮箱不能为空");
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
					title: "注册提示",
					template: "恭喜你注册成功",
					buttons: [{
						text: "我知道了",
						type: "button-energized",
					}]
				});
				siginsuccess.then(function(res){
					console.log(["res",res])

					//注册成功后自动登录  获取code
					loginSubmit($scope.yourdata,function(msg){
						$state.go("shops");
					})

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