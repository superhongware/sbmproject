angular.module("starter",["ionic","starter.controllers","starter.services","starter.directives"]).run(["$ionicPlatform","$rootScope",function(e,t){t.viewanimate="gogogo",e.ready(function(){window.cordova&&window.cordova.plugins.Keyboard&&cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),window.StatusBar&&StatusBar.styleDefault()})}]).config(["$stateProvider","$urlRouterProvider","$ionicConfigProvider",function(e,t,l){l.views.maxCache(0),l.views.forwardCache(!1),l.templates.maxPrefetch(0),e.state("login",{url:"/login",templateUrl:"templates/index/login.html",controller:"LoginCtrl"}).state("sign_up",{url:"/sign_up",templateUrl:"templates/index/sign_up.html",controller:"sign_upCtrl"}).state("home",{url:"/home",templateUrl:"templates/index/home.html",controller:"indexCtrl"}).state("shops",{url:"/shops",templateUrl:"templates/index/shops.html"}).state("details",{url:"/details",templateUrl:"templates/index/details.html"}).state("orders",{url:"/orders",templateUrl:"templates/index/orders.html",controller:"ordersCtrl"}).state("products",{url:"/products",templateUrl:"templates/index/products.html",controller:"productsCtrl"}).state("setting",{url:"/setting",templateUrl:"templates/index/setting.html"}).state("set-shopmanage",{url:"/set-shopmanage",templateUrl:"templates/index/setting/set-shopmanage.html"}).state("set-remind",{url:"/set-remind",templateUrl:"templates/index/setting/set-remind.html"}).state("set-feedback",{url:"/set-feedback",templateUrl:"templates/index/setting/set-feedback.html"}).state("set-aboutus",{url:"/set-aboutus",templateUrl:"templates/index/setting/set-aboutus.html"}).state("checkproduct",{url:"/checkproduct",templateUrl:"templates/index/creatdetails/checkproduct.html",controller:"productsCtrl"}).state("checktemplate",{url:"/checktemplate",templateUrl:"templates/index/creatdetails/checktemplate.html",controller:"productsCtrl"}).state("editpages",{url:"/editpages",templateUrl:"templates/index/creatdetails/editpages.html",controller:"editpagesCtrl"}).state("editpages.editer",{url:"/editer/:pageId/:pageTemp",templateUrl:function(e){return"templates/index/pages/page"+e.pageTemp+".html"}}).state("sidebartest",{url:"/sidebartest",templateUrl:"templates/index/sidebartest.html"}),t.otherwise("/home")}]);
var starterctrl=angular.module("starter.controllers",[]);starterctrl.controller("mainviewCtrl",["$scope","$ionicLoading","myCookie","loginCheck",function(o,e,t,n){n(),o.show=function(){e.show({template:"loading...",duration:2e3})},o.hide=function(){e.hide()}}]).controller("indexCtrl",["$scope","loginCheck",function(o,e){e()}]).controller("ordersCtrl",["$scope","$ionicPopover",function(o,e){var t="<ion-popover-view><ion-content><ion-list><ion-item>未付款</ion-item><ion-item>已打印</ion-item><ion-item>未已发货</ion-item></ion-list> </ion-content></ion-popover-view>";o.popover=e.fromTemplate(t,{scope:o}),e.fromTemplateUrl("my-popover.html",{scope:o}).then(function(e){o.popover=e}),o.openPopover=function(e){o.popover.show(e)},o.closePopover=function(){o.popover.hide()},o.$on("$destroy",function(){console.log("$destroy"),o.popover.remove()}),o.$on("popover.hidden",function(){console.log("popover.hidden")}),o.$on("popover.removed",function(){console.log("popover.removed")})}]).controller("productsCtrl",["$scope","$ionicBackdrop","$timeout","$http","$ionicLoading",function(o,e,t,n,i){o.action=function(){e.retain(),t(function(){e.release()},1e3)},o.products=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33],o.show=function(){i.show({template:"loading...",duration:2e3})},o.doRefresh=function(){n.get("/testdata/products.json").success(function(e){console.log(e),o.products=e})["finally"](function(){o.$broadcast("scroll.refreshComplete")})}}]).controller("contentCtrl",["$scope","$ionicSideMenuDelegate",function(o,e){o.toggleLeft=function(){e.toggleLeft()},o.toggleLeft()}]).controller("editpagesCtrl",["$scope","$ionicLoading",function(o,e){o.show=function(){e.show({template:"正在保存...",duration:2e3})},o.showdata={page:1}}]).controller("pagetemp1Ctrl",["$scope","$state",function(o,e){console.log(e),console.log("pagetemp1")}]).controller("pagetemp2Ctrl",["$scope","$state",function(){console.log("pagetemp2")}]).controller("LoginCtrl",["$scope","$state","loginSubmit",function(o,e,t){o.loginSubmit=t}]).controller("sign_upCtrl",["$scope","$rootScope","$state","$ionicPopup",function(o,e,t,n){o.sign_up=function(){n.show({title:"注册成功",template:"注册消息已发送到邮箱，请妥善保管！",buttons:[{text:"我知道了",type:"button-energized",onTap:function(){t.go("shops")}}]})},o.sign_upForm={}}]);
angular.module("starter.directives",[]).directive("sbmPage",function(){return{restrict:"E",templateUrl:function(e,t){return"templates/index/pages/page"+t.pagenum+".html"}}});
starterctrl.controller("ordersCtrl",["$scope","$ionicPopover","$http",function(o,e,n){console.log(n);var i="<ion-popover-view><ion-content><ion-list><ion-item>ddd</ion-item><ion-item>顶顶顶</ion-item><ion-item>顶顶顶</ion-item></ion-list> </ion-content></ion-popover-view>";o.popover=e.fromTemplate(i,{scope:o}),e.fromTemplateUrl("my-popover.html",{scope:o}).then(function(e){o.popover=e}),o.openPopover=function(e){o.popover.show(e)},o.closePopover=function(){o.popover.hide()},o.$on("$destroy",function(){console.log("$destroy"),o.popover.remove()}),o.$on("popover.hidden",function(){console.log("popover.hidden")}),o.$on("popover.removed",function(){console.log("popover.removed")})}]);
angular.module("service.encryption",[]).factory("hex_md5",function(){function r(r){return i(t(u(r),r.length*C))}function t(r,t){r[t>>5]|=128<<t%32,r[(t+64>>>9<<4)+14]=t;for(var n=1732584193,h=-271733879,u=-1732584194,i=271733878,d=0;d<r.length;d+=16){var C=n,g=h,A=u,S=i;n=e(n,h,u,i,r[d+0],7,-680876936),i=e(i,n,h,u,r[d+1],12,-389564586),u=e(u,i,n,h,r[d+2],17,606105819),h=e(h,u,i,n,r[d+3],22,-1044525330),n=e(n,h,u,i,r[d+4],7,-176418897),i=e(i,n,h,u,r[d+5],12,1200080426),u=e(u,i,n,h,r[d+6],17,-1473231341),h=e(h,u,i,n,r[d+7],22,-45705983),n=e(n,h,u,i,r[d+8],7,1770035416),i=e(i,n,h,u,r[d+9],12,-1958414417),u=e(u,i,n,h,r[d+10],17,-42063),h=e(h,u,i,n,r[d+11],22,-1990404162),n=e(n,h,u,i,r[d+12],7,1804603682),i=e(i,n,h,u,r[d+13],12,-40341101),u=e(u,i,n,h,r[d+14],17,-1502002290),h=e(h,u,i,n,r[d+15],22,1236535329),n=o(n,h,u,i,r[d+1],5,-165796510),i=o(i,n,h,u,r[d+6],9,-1069501632),u=o(u,i,n,h,r[d+11],14,643717713),h=o(h,u,i,n,r[d+0],20,-373897302),n=o(n,h,u,i,r[d+5],5,-701558691),i=o(i,n,h,u,r[d+10],9,38016083),u=o(u,i,n,h,r[d+15],14,-660478335),h=o(h,u,i,n,r[d+4],20,-405537848),n=o(n,h,u,i,r[d+9],5,568446438),i=o(i,n,h,u,r[d+14],9,-1019803690),u=o(u,i,n,h,r[d+3],14,-187363961),h=o(h,u,i,n,r[d+8],20,1163531501),n=o(n,h,u,i,r[d+13],5,-1444681467),i=o(i,n,h,u,r[d+2],9,-51403784),u=o(u,i,n,h,r[d+7],14,1735328473),h=o(h,u,i,n,r[d+12],20,-1926607734),n=a(n,h,u,i,r[d+5],4,-378558),i=a(i,n,h,u,r[d+8],11,-2022574463),u=a(u,i,n,h,r[d+11],16,1839030562),h=a(h,u,i,n,r[d+14],23,-35309556),n=a(n,h,u,i,r[d+1],4,-1530992060),i=a(i,n,h,u,r[d+4],11,1272893353),u=a(u,i,n,h,r[d+7],16,-155497632),h=a(h,u,i,n,r[d+10],23,-1094730640),n=a(n,h,u,i,r[d+13],4,681279174),i=a(i,n,h,u,r[d+0],11,-358537222),u=a(u,i,n,h,r[d+3],16,-722521979),h=a(h,u,i,n,r[d+6],23,76029189),n=a(n,h,u,i,r[d+9],4,-640364487),i=a(i,n,h,u,r[d+12],11,-421815835),u=a(u,i,n,h,r[d+15],16,530742520),h=a(h,u,i,n,r[d+2],23,-995338651),n=c(n,h,u,i,r[d+0],6,-198630844),i=c(i,n,h,u,r[d+7],10,1126891415),u=c(u,i,n,h,r[d+14],15,-1416354905),h=c(h,u,i,n,r[d+5],21,-57434055),n=c(n,h,u,i,r[d+12],6,1700485571),i=c(i,n,h,u,r[d+3],10,-1894986606),u=c(u,i,n,h,r[d+10],15,-1051523),h=c(h,u,i,n,r[d+1],21,-2054922799),n=c(n,h,u,i,r[d+8],6,1873313359),i=c(i,n,h,u,r[d+15],10,-30611744),u=c(u,i,n,h,r[d+6],15,-1560198380),h=c(h,u,i,n,r[d+13],21,1309151649),n=c(n,h,u,i,r[d+4],6,-145523070),i=c(i,n,h,u,r[d+11],10,-1120210379),u=c(u,i,n,h,r[d+2],15,718787259),h=c(h,u,i,n,r[d+9],21,-343485551),n=f(n,C),h=f(h,g),u=f(u,A),i=f(i,S)}return Array(n,h,u,i)}function n(r,t,n,e,o,a){return f(h(f(f(t,r),f(e,a)),o),n)}function e(r,t,e,o,a,c,f){return n(t&e|~t&o,r,t,a,c,f)}function o(r,t,e,o,a,c,f){return n(t&o|e&~o,r,t,a,c,f)}function a(r,t,e,o,a,c,f){return n(t^e^o,r,t,a,c,f)}function c(r,t,e,o,a,c,f){return n(e^(t|~o),r,t,a,c,f)}function f(r,t){var n=(65535&r)+(65535&t),e=(r>>16)+(t>>16)+(n>>16);return e<<16|65535&n}function h(r,t){return r<<t|r>>>32-t}function u(r){for(var t=Array(),n=(1<<C)-1,e=0;e<r.length*C;e+=C)t[e>>5]|=(r.charCodeAt(e/C)&n)<<e%32;return t}function i(r){for(var t=d?"0123456789ABCDEF":"0123456789abcdef",n="",e=0;e<4*r.length;e++)n+=t.charAt(r[e>>2]>>e%4*8+4&15)+t.charAt(r[e>>2]>>e%4*8&15);return n}var d=0,C=8;return r}).factory("base64",function(){function r(){_keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",this.encode=function(r){var t,n,e,o,a,c,f,h="",u=0;for(r=_utf8_encode(r);u<r.length;)t=r.charCodeAt(u++),n=r.charCodeAt(u++),e=r.charCodeAt(u++),o=t>>2,a=(3&t)<<4|n>>4,c=(15&n)<<2|e>>6,f=63&e,isNaN(n)?c=f=64:isNaN(e)&&(f=64),h=h+_keyStr.charAt(o)+_keyStr.charAt(a)+_keyStr.charAt(c)+_keyStr.charAt(f);return h},this.decode=function(r){var t,n,e,o,a,c,f,h="",u=0;for(r=r.replace(/[^A-Za-z0-9\+\/\=]/g,"");u<r.length;)o=_keyStr.indexOf(r.charAt(u++)),a=_keyStr.indexOf(r.charAt(u++)),c=_keyStr.indexOf(r.charAt(u++)),f=_keyStr.indexOf(r.charAt(u++)),t=o<<2|a>>4,n=(15&a)<<4|c>>2,e=(3&c)<<6|f,h+=String.fromCharCode(t),64!=c&&(h+=String.fromCharCode(n)),64!=f&&(h+=String.fromCharCode(e));return h=_utf8_decode(h)},_utf8_encode=function(r){r=r.replace(/\r\n/g,"\n");for(var t="",n=0;n<r.length;n++){var e=r.charCodeAt(n);128>e?t+=String.fromCharCode(e):e>127&&2048>e?(t+=String.fromCharCode(e>>6|192),t+=String.fromCharCode(63&e|128)):(t+=String.fromCharCode(e>>12|224),t+=String.fromCharCode(e>>6&63|128),t+=String.fromCharCode(63&e|128))}return t},_utf8_decode=function(r){for(var t="",n=0,e=0,o=0;n<r.length;)e=r.charCodeAt(n),128>e?(t+=String.fromCharCode(e),n++):e>191&&224>e?(o=r.charCodeAt(n+1),t+=String.fromCharCode((31&e)<<6|63&o),n+=2):(o=r.charCodeAt(n+1),c3=r.charCodeAt(n+2),t+=String.fromCharCode((15&e)<<12|(63&o)<<6|63&c3),n+=3);return t}}return new r});
angular.module("starter.services",["service.encryption"]).factory("myCookie",function(){return{add:function(e,n,t){var o=e+"="+escape(n);if(t>0){var a=new Date;a.setTime(a.getTime()+3600*t*1e3),o=o+"; expires="+a.toGMTString()}document.cookie=o},get:function(e){for(var n=document.cookie,t=n.split("; "),o=0;o<t.length;o++){var a=t[o].split("=");if(a[0]==e)return unescape(a[1])}return""},"delete":function(e){var n=new Date;n.setTime(n.getTime()-1e4),document.cookie=e+"=v; expires="+n.toGMTString()}}}).factory("loginCheck",["$state","myCookie",function(e,n){return function(){n.get("shopname")||e.go("login")}}]).factory("hrefGo",function(){return function(e){location.href=e}}).factory("loginSubmit",["$http","$state","jsonpURL","spelldata","systemdata","myCookie",function(e,n,t,o,a,r){return function(){var e={orgName:"softbanana",userName:"admin",password:"admin"};e=a(e),console.log(e);var o="http://192.168.51.173:8089/openApi/dyncSoftBanana/app/userLogin",i=t(o,e);console.log(i),r.add("shopname","shopname",72),n.go("home")}}]).factory("jsonpURL",function(){return function(e,n){e+="?";for(var t in n)e+=t+"="+n[t]+"&";return e+"callBack=JSON_CALLBACK"}}).factory("spelldata",function(){return function(e){var n="";for(var t in e)n+=t+"="+e[t]+"&";return n.substr(0,n.length-1)}}).factory("systemdata",["hex_md5","base64",function(e,n){return function(t){t="object"==typeof t?t:{};var o=new Date,a={nick:"softbanana",name:"softbanana",method:"softbanana.app.user.login",timestamp:parseInt(o.getTime()/1e3).toString(),format:"json"},r=n.encode(a.nick)+n.encode(a.method)+n.encode(a.timestamp)+n.encode(a.name)+n.encode(a.format);return a.sign=e(r),$.extend(a,t)}}]);