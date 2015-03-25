loginmodule.factory('loginSubmit', ['$http','$state','SBMJSONP','myCookie',function($http,$state,SBMJSONP,myCookie){

	return function loginSubmit(){

		var jsonpapi=SBMJSONP("userLogin",{
			orgName:'softbanana',
			userName:'admin',
			password:'admin'
		});

		console.log(jsonpapi);

		
		$http.jsonp(jsonpapi.url)
		.success(function(data){
			console.log("success");
			console.log(data);
		})
		.error(function(error,status,headers){
			console.log("error");
			console.log(error);
			console.log(status);
			console.log(headers);
		});


	};
}]);