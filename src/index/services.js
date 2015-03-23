angular.module('starter.services', ["service.encryption"])

.factory('myCookie',function(){
	return {
		add:function(name,value,expiresHours){
			var cookieString=name+"="+escape(value); 
			if(expiresHours>0){ 
				var date=new Date(); 
				date.setTime(date.getTime()+expiresHours*3600*1000); 
				cookieString=cookieString+"; expires="+date.toGMTString(); 
			} 
			document.cookie=cookieString; 
		},
		get:function(name){
			var strCookie=document.cookie; 
			var arrCookie=strCookie.split("; "); 
			for(var i=0;i<arrCookie.length;i++){ 
				var arr=arrCookie[i].split("="); 
				if(arr[0]==name)return unescape(arr[1]); 
			} 
			return ""; 
		},
		delete:function(name){
			var date=new Date(); 
			date.setTime(date.getTime()-10000); 
			document.cookie=name+"=v; expires="+date.toGMTString(); 
		}
	};
})


.factory('loginCheck',['$state','myCookie',function($state,myCookie){
	return function(){
		if(!myCookie.get("shopname")){
			$state.go("login");
		}
	};
}])


.factory('hrefGo', function(){
	return function (href){
		location.href=href;
	};
})

.factory('loginSubmit', ['$http','$state','jsonpURL','spelldata','systemdata', 'myCookie',function($http,$state,jsonpURL,spelldata,systemdata,myCookie){

	return function loginSubmit(){

		//拼接上system数据
		var urldata=systemdata({
			orgName:'softbanana',
			userName:'admin',
			password:'admin',
		});

		console.log(urldata);

		//post数据拼接
		console.log(spelldata(urldata));

// http://api.softbanana.com/openApi/dyncSoftBanana/app/loginUser
		var url="http://192.168.51.173:8089/openApi/dyncSoftBanana/app/userLogin";
		var lasturl=jsonpURL(url,urldata);

		console.log("1:"+lasturl);


		$http.jsonp(lasturl)
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

		// myCookie.add("shopname","shopname",72);
		// $state.go("home");

		// $http.post(url,spelldata(urldata))

		// .success(function(data){
		// 	console.log("success");
		// 	console.log(data);
		// })
		// .error(function(error,status,headers){
		// 	console.log("error");
		// 	console.log(error);
		// 	console.log(status);
		// 	console.log(headers);
		// });

	};
}])

.factory('jsonpURL', function(){
	return function jsonpURL(url,obj){
		url+="?";
		for (var i in obj) {
			// console.log(i+":"+obj[i]);
			url+=i+"="+obj[i]+"&";
		}
		return url+"callBack=JSON_CALLBACK";
	};
})

.factory('spelldata', function(){
	return function spelldata(obj){
		var data='';
		for (var i in obj) {
			data+=i+"="+obj[i]+"&";
		}
		return data.substr(0,data.length-1);
	};
})

.factory('systemdata', ['hex_md5','base64', function(hex_md5,base64){
	return function(obj){
		obj= (typeof obj === "object")?obj:{};
		var time=new Date();
		var urldata={
			nick : 'softbanana',
			name : 'softbanana',
			method : 'softbanana.app.user.login',
			timestamp : parseInt(time.getTime()/1000).toString(),
			format : 'json',
		};
		var tempStr = base64.encode(urldata.nick)+ base64.encode(urldata.method) + base64.encode(urldata.timestamp) + base64.encode(urldata.name) + base64.encode(urldata.format);
		urldata.sign=hex_md5(tempStr);
		return $.extend(urldata,obj);
	};
}]);






