loginmodule.factory('loginSubmit', ['$http','$state','$ionicPopup','SBMJSONP','myCookie','base64',function($http,$state,$ionicPopup,SBMJSONP,myCookie,base64){

	return function loginSubmit(logindata){

		logindata.method = "softbanana.app.user.login";
		var api = SBMJSONP("userLogin",logindata);
		// console.dir(api);
		$http.jsonp(api.url)


			.success(function(data) {
				console.log(data);
				if(data.isSuccess){
					myCookie.add("orgName",base64.encode(logindata.orgName),720);
					$state.go("home");
				}else{

					// var mypopup=$ionicPopup.show({
					// 	title: "登录失败",
					// 	template: data.map.errorMsg,//对应的商家不存在  用户名不存在 密码错误
					// 	buttons: [{
					// 		text: "卧槽,又出错!",
					// 		type: "button-energized",
					// 		// onTap: function(e) {
					// 		// 	e.preventDefault();
					// 		// }
					// 	}]
					// });
					// mypopup.then(function(res){
					// 	console.log(res);
					// })
					if(data.map.errorMsg == "对应的商家不存在"){
						$(".error-tip").eq(0).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(0).show();
					}else if(data.map.errorMsg == "商家名称不允许为空"){
						$(".error-tip").eq(0).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(0).show();
					}else if(data.map.errorMsg == "用户名不允许为空"){
						$(".error-tip").eq(1).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(1).show();
					}else if(data.map.errorMsg == "用户名不存在"){
						$(".error-tip").eq(1).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(1).show();
					}else if(data.map.errorMsg == "密码不允许为空"){
						$(".error-tip").eq(2).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(2).show();
					}else if(data.map.errorMsg == "密码错误"){
						$(".error-tip").eq(2).children(".rect").text(data.map.errorMsg);
						$(".error-tip").eq(2).show();
					}
				}
			})

			.error(function(status, response) {
				// console.log("连接失败");
				console.log(status);
				console.log(response);
				var mypopup=$ionicPopup.show({
					title: "登录出错",
					template: "可能您的网络出问题了",
					buttons: [{
						text: "好的吧",
						type: "button-energized",
					}]
				});
			});
	};
}]);
