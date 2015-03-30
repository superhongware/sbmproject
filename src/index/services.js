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

.factory('dateFormat', function() {
	/**
	 * [时间格式化]
	 * @param  {[type]} date   [格式化的时间对象]
	 * @param  {[type]} format [格式]
	 * @return {[type]}        [description]
	 */
	return function(date,format) {
		var o = {
			"M+": date.getMonth() + 1, //month 
			"d+": date.getDate(), //day 
			"h+": date.getHours(), //hour 
			"m+": date.getMinutes(), //minute 
			"s+": date.getSeconds(), //second 
			"q+": Math.floor((date.getMonth() + 3) / 3), //quarter 
			"S": date.getMilliseconds() //millisecond 
		};
		
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}

		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	};
})


.factory('loginCheck',['$state','myCookie','base64',function($state,myCookie,base64){
	return function(){
		if(!myCookie.get("orgName")){
			$state.go("login");
			return;
		}else{
			return base64.decode(myCookie.get("orgName"));
		}
	};
}])


.factory('hrefGo', function(){
	return function (href){
		location.href=href;
	};
})

/**
 * [订单通用模块]
 */
.factory('orderComm', function() {

	var orderStatusList = [{
		name: '已付款',
		status: 'PAID'
	}, {
		name: '未付款',
		status: 'NON_PAYMENT'
	}, {
		name: '已打印',
		status: 'PRINTED'
	}, {
		name: '已发货',
		status: 'DELIVERED'
	}, {
		name: '已取消',
		status: 'CANCELED'
	}, {
		name: '已完成',
		status: 'COMPLETED'
	}, {
		name: '全部',
		status: ''
	}];

	var orderComm = {
		commData: {
			orderStatusList: orderStatusList
		},
		func: {
			getStatusName: function(status) {
				var result = '';
				for (var i = 0; i < orderStatusList.length; i++) {
					if (status == orderStatusList[i].status) {
						result = orderStatusList[i].name;
						break;
					}
				}

				return result;
			}
		}
	};

	return orderComm;
})

/**
 * [产品通用模块]
 */
.factory('productComm', function() {

	var statusList = [{
			name: '上架中',
			status: 'onsale'
		}, {
			name: '已下架',
			status: 'instock'
		},
	];

	var productComm = {
		commData: {
			statusList: statusList
		},
		func: {
			getStatusName: function(status) {
				var result = '';
				for (var i = 0; i < statusList.length; i++) {
					if (status == statusList[i].status) {
						result = statusList[i].name;
						break;
					}
				}

				return result;
			}
		}
	};

	return productComm;
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






