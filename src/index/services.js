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

/** 
	JSONP接口通用方法
	SBMJSONP使用方法如下
	$scope.yourdata = {
		orgName: "softbanana",
		userName: "admin",
		password: "admin",
	};
	$scope.yourdata.method = "softbanana.app.user.login";
	var api = SBMJSONP("userLogin",$scope.yourdata);
	$http.jsonp(api.url)
		.success(function(data) {
			alert("连接成功");
			...
		})
		.error(function(status, response) {
			alert("连接失败");
			...
		});
*/
.factory('SBMJSONP', ['jsonpURL','systemdata',function(jsonpURL,systemdata){
	return function SBMJSONP(url,data){
		var lastdata=systemdata(data);
		var lasturl="http://jira.hongware.cn:8084/openApi/dyncSoftBanana/app/"+url;
		return {url:jsonpURL(lasturl,lastdata)};
	};
}])

/** 
	POST接口通用方法
	SBMPOST使用方法如下
	$scope.yourdata = {
		orgName: "softbanana",
		userName: "admin",
		password: "admin",
	};
	$scope.yourdata.method = "softbanana.app.user.login";
	var api = SBMJSONP("userLogin",$scope.yourdata);
	$http.post(api.url,api.data)
		.success(function(data) {
			alert("连接成功");
			...
		})
		.error(function(status, response) {
			alert("连接失败");
			...
		});
*/
.factory('SBMPOST', ['postURL','systemdata',function(postURL,systemdata){
	return function SBMPOST(url,data){
		var lastdata=systemdata(data);
			//服务器端不接收json格式的数据，必须拼接成类似a=1&b=2&c=3格式
			lastdata=postURL(lastdata);
		var lasturl="http://jira.hongware.cn:8084/openApi/dyncSoftBanana/app/"+url;
		return {url:lasturl,data:lastdata};
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
		if(typeof obj.method === "undefined"){
			throw "SBMJSONP或SBMPOST的data参数里没有method,赶紧查下接口文档";
		}
		obj= (typeof obj === "object")?obj:{};
		var time=new Date();
		var urldata={
			nick : 'softbanana',
			name : 'softbanana',
			timestamp : parseInt(time.getTime()/1000).toString(),
			format : 'json',
		};
		var tempStr = base64.encode(urldata.nick)+ base64.encode(obj.method) + base64.encode(urldata.timestamp) + base64.encode(urldata.name) + base64.encode(urldata.format);
		urldata.sign=hex_md5(tempStr);
		return $.extend(urldata,obj);
	};
}]);






