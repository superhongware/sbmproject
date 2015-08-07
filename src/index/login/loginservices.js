loginmodule.factory('loginSubmit', ['$rootScope','$http','$state','$ionicPopup','SBMJSONP','myCookie','base64',function($rootScope,$http,$state,$ionicPopup,SBMJSONP,myCookie,base64){


// logindata = {
// 		orgName: "work",
// 		userName: "admin",
// 		password: "admin",
// 	}
	return function loginSubmit(logindata,callback,errorcallback){

		logindata.method = "softbanana.app.user.login";
		var api = SBMJSONP("userLogin",logindata);
		// console.dir(api);
		$http.jsonp(api.url)

			.success(function(data) {
				console.log(data);
				if(data.isSuccess){

					myCookie.add("orgName",base64.encode(logindata.orgName),720);
					myCookie.add("userName",base64.encode(logindata.userName),720);
					myCookie.add("orgCode",base64.encode(data.user.orgCode),720);
					$rootScope.orgName=logindata.orgName;
					$rootScope.userName=logindata.userName;
					$rootScope.orgCode=data.user.orgCode;
					
					callback(data);
				}else{
					errorcallback(data.map.errorMsg);
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
