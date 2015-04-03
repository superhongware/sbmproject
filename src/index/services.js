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
			return {orgName:base64.decode(myCookie.get("orgName")),userName:base64.decode(myCookie.get("userName"))};
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

}])


/**
 * [通用数据获取逻辑方法]
 * 
 */
.factory('getDataComm', ['$http', 'SBMJSONP', '$rootScope', function($http, SBMJSONP, $rootScope) {
	var getDataComm = {};

	/**
	 * [platObj 平台数据对象]
	 * @type {Object}
	 */
	getDataComm.platObj = {
		YHD: {
			imgSrc: '/img/plat/yhd.png',
			name: '一号店'
		},
		DANGDANG: {
			imgSrc: '/img/plat/dd.png',
			name: '当当'
		},
		JINGD: {
			imgSrc: '/img/plat/jd.png',
			name: '京东'
		},
		PAIPAI: {
			imgSrc: '/img/plat/pp.png',
			name: '拍拍'
		},
		TAOBAO: {
			imgSrc: '/img/plat/tb.png',
			name: '淘宝'
		},
		TMALL: {
			imgSrc: '/img/plat/tmall.png',
			name: '天猫'
		},
		WD: {
			imgSrc: '/img/plat/wd.png',
			name: '微店'
		},
		AMAZON: {
			imgSrc: '/img/plat/amz.png',
			name: '亚马逊'
		},
		KDT: {
			imgSrc: '/img/plat/youzan.png',
			name: '有赞'
		},
	};

	/**
	 * [loadShopList 加载店铺列表]
	 * @param  {[type]} callBack      [成功返回]
	 * @param  {[type]} errorCallBack [失败返回]
	 * @return {[type]}               [description]
	 */
	getDataComm.loadShopList = function(callBack, errorCallBack) {
		console.log('getDataComm.loadShopList');

		var api = SBMJSONP("searchShop", {
			method: 'softbanana.app.shop.search',
			orgName: $rootScope.orgName,
			pageNo: 1,
			pageSize: 50,
			action: ''
		});

		$http.jsonp(api.url)
			.success(function(data) {
				if (data.isSuccess && data.shops && data.shops.length > 0) {
					var shopList = [];
					for (var i = 0; i < data.shops.length; i++) {
						if (data.shops[i].isInvalid) {
							shopList.push(data.shops[i]);
						}
					}
					shopList[0].checked = true;
					callBack(shopList);
				}
			})
			.error(function(status, response) {
				errorCallBack(status, response, '数据查询失败');
			});
	};

	return getDataComm;
}])

/**
 * [订单通用模块]
 */
.factory('orderComm', ['$http', 'SBMJSONP', '$rootScope', function($http, SBMJSONP, $rootScope) {

	var orderComm = {};

	/**
	 * [orderStatusList 订单状态]
	 * @type {Array}
	 */
	orderComm.orderStatusList = [{
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


	orderComm.getStatusName = function(status) {
		var result = '';
		for (var i = 0; i < orderComm.orderStatusList.length; i++) {
			if (status == orderComm.orderStatusList[i].status) {
				result = orderComm.orderStatusList[i].name;
				break;
			}
		}

		return result;
	};


	return orderComm;
}])

/**
 * [产品通用模块]
 */
.factory('productComm', ['$http', 'SBMJSONP', '$rootScope','getDataComm', function($http, SBMJSONP, $rootScope,getDataComm) {

	var productComm = {};

	/**
	 * [statusList 产品状态]
	 * @type {Array}
	 */
	productComm.statusList = [{
		name: '上架中',
		status: 'onsale'
	}, {
		name: '已下架',
		status: 'instock'
	}, ];

	/**
	 * [getStatusName 获取产品状态名称]
	 * @param  {[type]} status [状态]
	 * @return {[type]}        [description]
	 */
	productComm.getStatusName = function(status) {
		var result = '';
		for (var i = 0; i < statusList.length; i++) {
			if (status == statusList[i].status) {
				result = statusList[i].name;
				break;
			}
		}
		return result;
	};

	/**
	 * [loadProductData 加载产品数据]
	 * @param  {[type]} option        [参数选项]
	 * @param  {[type]} callBack      [成功返回]
	 * @param  {[type]} errorCallBack [失败返回]
	 * @return {[type]}               [description]
	 */
	productComm.loadProductData = function(option, callBack, errorCallBack) {

		var reqData = {
			method: 'softbanana.app.item.search',
			orgName: $rootScope.orgName,

			shopName: option.shopName,
			status: option.status,
			action: option.action,
			pageNo: option.pageNo,
			pageSize: option.pageSize,
			plat: option.plat
		};
		console.log('productComm.loadProductData reqData');
		console.log(reqData);
		
		var api = SBMJSONP("searchItem", reqData);

		$http.jsonp(api.url)
			.success(function(data) {
				console.log('productComm.loadProductData');
				console.log(data);

				var callBackData = [];

				if (data.isSuccess && parseInt(data.totalCount) > 0 && data.items && data.items.length > 0) {
					//按id顺序排列
					data.items.sort(function(a, b) {
						return parseInt(a.id) > parseInt(b.id) ? -1 : 1;
					});

					if (option.action === 'up') { //moredata
						for (var i = 0; i < data.items.length; i++) {
							callBackData.push(data.items[i]);
						}
					} else {
						for (var i = data.items.length - 1; i >= 0; i--) {
							callBackData.unshift(data.items[i]);
						}
					}
				}

				//数据处理
				for (var i = 0; i < callBackData.length; i++) {
					callBackData[i].picPlatUrl = getDataComm.platObj[callBackData[i].plat].imgSrc;
				}

				callBack(callBackData);

			})
			.error(function(status, response) {
				console.log('数据查询连接失败');
				errorCallBack(status, response, '数据查询失败');
			});
	};

	/**
	 * [loadProductDetail 加载产品详情]
	 * @param  {[type]} option        [参数选项{orgName、numIid、plat}]
	 * @param  {[type]} callBack      [成功返回]
	 * @param  {[type]} errorCallBack [失败返回]
	 * @return {[type]}               [description]
	 */
	productComm.loadProductDetail = function(option, callBack, errorCallBack){
		var reqData = {
			method: 'softbanana.app.item.detail.search',
			
			orgName: option.orgName,
			numIid: option.numIid,
			plat: option.plat
		};

		var api = SBMJSONP("searchItemDetail", reqData);
		console.log('productComm.loadProductDetail req');
		console.log(reqData);
		$http.jsonp(api.url)
			.success(function(data) {
				console.log('productComm.loadProductDetail');
				console.log(data);
				if (data.isSuccess) {
					callBack(data.item);
				}else{
					errorCallBack('数据查询失败');
				}
			})
			.error(function(status, response) {
				errorCallBack('数据查询失败',status, response);
			});
	};

	/**
	 * [refreshServer 刷新远程数据]
	 * @param  {[type]} option        [参数选项{shopName、plat}]
	 * @param  {[type]} callBack      [成功返回]
	 * @param  {[type]} errorCallBack [失败返回]
	 * @return {[type]}               [description]
	 */
	productComm.refreshServer = function(option, callBack, errorCallBack) {
		console.log('refreshServer');
		
		var date = new Date();

		var reqData = {
			method: 'softbanana.app.item.list',
			orgName: $rootScope.orgName,

			shopName: option.shopName,//店铺名称
			plat: option.plat,//平台名称

			endDate: dateFormat(date, 'yyyy-MM-dd hh:mm:ss'),
		};

		date.setMonth(date.getMonth() - 1);
		reqData.startDate = dateFormat(date, 'yyyy-MM-dd hh:mm:ss');

		console.log('refreshServer reqData');
		console.log(reqData);

		var api = SBMJSONP("listItem", reqData);
		$http.jsonp(api.url)
			.success(function(data) {
				callBack(data);
			})
			.error(function(status, response) {
				errorCallBack(status, response, '数据查询连接失败');
			});
	};

	return productComm;
}])



;






