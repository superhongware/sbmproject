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

.factory('loginSubmit', ['$http','$state','SBMJSONP','SBMPOST','myCookie',function($http,$state,SBMJSONP,SBMPOST,myCookie){

	return function loginSubmit(){

		var jsonpapi=SBMJSONP("userLogin",{
			orgName:'softbanana',
			userName:'admin',
			password:'admin'
		});

		console.log(jsonpapi);
		console.log(postapi);

		
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
}])

/** 
	JSONP接口通用方法
	SBMJSONP使用方法如下
	var api=jsonpURL("userLogin",{
		orgName:'softbanana',
		userName:'admin',
		password:'admin'
	});

	$http.jsonp(api.url,api.data)
	.success(function(data){
		...
	})
	.error(function(status,response){
		...
	});
*/
.factory('SBMJSONP', ['jsonpURL','systemdata',function(jsonpURL,systemdata){
	return function SBMAPI(action,data){
		var urldata=systemdata(data);
		var url="http://jira.hongware.cn:8084/openApi/dyncSoftBanana/app/"+action;
		return {url:jsonpURL(url,urldata)};
	};
}])

/** 
	POST接口通用方法
	SBMPOST使用方法如下
	var api=SBMPOST("userLogin",{
		orgName:'softbanana',
		userName:'admin',
		password:'admin'
	});

	$http.post(api.url,api.data)
	.success(function(data){
		...
	})
	.error(function(status,response){
		...
	});
*/
.factory('SBMPOST', ['postURL','systemdata',function(postURL,systemdata){
	return function SBMAPI(action,data){
		var urldata=systemdata(data);
			//服务器端不接收json格式的数据，必须拼接成类似a=1&b=2&c=3格式
			urldata=postURL(urldata);
		var url="http://jira.hongware.cn:8084/openApi/dyncSoftBanana/app/"+action;
		return {url:url,data:urldata};
	};
}])

/** 
	接口方法
	拼接jsonp的url
*/
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

/** 
	接口方法
	拼接post的data
*/
.factory('postURL', function(){
	return function postURL(obj){
		var data='';
		for (var i in obj) {
			data+=i+"="+obj[i]+"&";
		}
		return data.substr(0,data.length-1);
	};
})

/** 
	接口方法
	生成 系统级数据
	再跟 提交数据 拼接起来
*/
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






