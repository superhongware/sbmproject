angular.module('starter.services', [])
.factory('myCookie',function(){
	return {
		add:function(name,value,expiresHours){
			var cookieString=name+"="+escape(value); 
			if(expiresHours>0){ 
				var date=new Date(); 
				date.setTime(date.getTime+expiresHours*3600*1000); 
				cookieString=cookieString+"; expires="+date.toGMTString(); 
			} 
			document.cookie=cookieString; 
		},
		get:function(name){
			var strCookie=document.cookie; 
			var arrCookie=strCookie.split("; "); 
			for(var i=0;i<arrCookie.length;i++){ 
				var arr=arrCookie[i].split("="); 
				if(arr[0]==name)return arr[1]; 
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
.factory('systemdata', function(){
	var result={
		nick:"softbanana",
		name:"softbanana",
		method:method
	};

	return result;
});
