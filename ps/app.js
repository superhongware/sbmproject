var SBMPS=angular.module("SBMPS",["ionic","starter.services"]);SBMPS.controller("spCtrl",["$rootScope","$scope","$http","getRequest","getRequest2","SBMJSONP","p_s","productComm","openLink",function(e,a,n,o,s,i,r,d,c){function l(e,a,t){if(e&&e.detailId){var o={count:1,orgName:s("orgname"),detailId:e.detailId,shopName:e.shopName,plat:e.plat,shareType:h(),numIid:e.numIid};switch(a){case"share":o.method="softbanana.app.share.save";var r=i("saveShare",o);n.jsonp(r.url).success(function(e){}).error(function(e){});break;case"shop":o.method="softbanana.app.newshop.save";var r=i("saveNewShop",o);n.jsonp(r.url).success(function(e){t&&t()}).error(function(e){});break;default:o.method="softbanana.app.browse.save";var r=i("saveBrowse",o);n.jsonp(r.url).success(function(e){}).error(function(e){})}}}function p(){a.showmainbox=!0,a.shownoshowdata=!0,d.loadProductDetail({orgName:s("orgname"),numIid:s("productid"),plat:s("plat")},function(e){a.gotoproduct=function(){var a=e.detailUrl;c(a)},u(e)},function(){alert("请检查网络是否问题")})}function h(){return"groupmessage"===o("from")||"singlemessage"===o("from")?"WF":"timeline"===o("from")?"WC":"weibo"===o("from")?"WB":"qq"===o("from")?"QC":"kongjian"===o("from")?"QC":"QZ"}function u(e){for(var t=navigator.userAgent,n=new Array("Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"),s=e.detailUrl,i=!1,r=0;r<n.length;r++)if(t.indexOf(n[r])>0){i=!0;break}!t.match("MicroMessenger")&&s.match("taobao.com")&&i&&"true"!==o("showview")&&!t.match("QQ")?(l(a.showdata,"shop"),s=s.replace("http","taobao"),location.href=s):t.match("MicroMessenger")&&(a.shownoshowdata||(a.weixinsharedata.title=e.detailTitle,a.weixinsharedata.desc=e.detailDesc,a.weixinsharedata.imgUrl=e.detailImage))}function g(e){function t(){s/o.length==1&&($(".loadingbox").css({opacity:"0","-webkit-transition":"0.5s ease-in"}),setTimeout(n,100))}function n(){function e(){a.loadover=!0,$(".loadingbox").hide()}$(".loadingbox")[0].addEventListener("webkitTransitionEnd",e)}for(var o=[],s=0,i=0;i<e.length;i++)for(var r=0;r<e[i].detailPageImage.length;r++)""!==e[i].detailPageImage[r].img&&o.push(e[i].detailPageImage[r].img);for(i=0;i<o.length;i++){var d=new Image;d.src=o[i],d.onload=function(){s++,$(".laodpecent>.nowpencent").css({"-webkit-transform":"translate3d(0,-"+s/o.length*100+"%,0)","-webkit-transition":"1s ease-in 0s"})}}$(".laodpecent>.nowpencent")[0].addEventListener("webkitTransitionEnd",t)}if(n.jsonp("http://hongwei.comeoncloud.net/serv/wxapi.ashx?action=getjsapiconfig&callback=JSON_CALLBACK&url="+encodeURIComponent(location.href)).success(function(e){wx.config({debug:!1,appId:e.appId,timestamp:e.timestamp,nonceStr:e.nonceStr,signature:e.signature,jsApiList:["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ"]})}),a.weixinsharedata={link:location.href,desc:"",title:"",imgUrl:""},wx.ready(function(){wx.onMenuShareAppMessage({title:a.weixinsharedata.title,desc:a.weixinsharedata.desc,link:a.weixinsharedata.link,imgUrl:a.weixinsharedata.imgUrl,success:function(){l(a.showdata,"share")},cancel:function(){}}),wx.onMenuShareTimeline({title:a.weixinsharedata.title,link:a.weixinsharedata.link,imgUrl:a.weixinsharedata.imgUrl,success:function(){l(a.showdata,"share")},cancel:function(){}})}),a.showdata="",a.shownoshowdata=!1,a.showmainbox=!1,a.loadover=!1,a.playagain=function(){r.pagemoving=1,r.currpage=-1,r.pageIndexRefresh(1),r.pagemovemode("pagechange")},a.showhelpme=function(){var e=a.showdata,t={count:1,orgName:s("orgname"),detailId:e.detailId,shopName:e.shopName,plat:e.plat,shareType:h(),method:"softbanana.app.create.show.save",numIid:e.numIid},o=i("saveCreateShow",t);n.jsonp(o.url).success(function(e){});var r={url:"#/helpme",title:"helpme"};history.pushState(r,r.title,r.url),history.go(1),$(".helpme").show()},a.closehelpme=function(){history.go(-1)},window.onpopstate=function(e){null!==e.state&&"#/helpme"===e.state.url?$(".helpme").show():$(".helpme").hide()},o("templateview")){var f={orgName:o("orgname"),method:"softbanana.app.template.detail",templateId:parseInt(o("templateview"))},w=i("detailTemplate",f);n.jsonp(w.url).success(function(e){a.showdata=e.template;for(var n=0;n<a.showdata.pages.length;n++){var o=a.showdata.pages[n].detailPageImage.split(",")||a.showdata.pages[n].detailPageImage,s=[],i=a.showdata.pages[n].detailPageText.split(">>")||a.showdata.pages[n].detailPageText,r=[];for(m in o)s.push({img:o[m]});for(t in i)r.push({txt:i[t]});a.showdata.pages[n].detailPageImage=s,a.showdata.pages[n].detailPageText=r}g(e.template.pages),a.$broadcast("showdataready")})}else{var v={orgName:s("orgname"),detailId:s("detailid"),method:"softbanana.app.detail.search"},w=i("searchDetail",v);n.jsonp(w.url).success(function(e){return e.isSuccess?(a.showdata=e,g(e.pages),l(a.showdata),u(e),void a.$broadcast("showdataready")):void p()}).error(function(){p()})}a.$on("showdataready",function(){function e(){a.loadover===!0?r.init_animation():setTimeout(e,300)}setTimeout(e,300)}),a.hidePagemaStanda=function(){$(".pagema_standa_show").removeClass("pagema_standa_show"),$(".centerround").removeClass("current")}}]).controller("spCtrlpre",["p_s",function(e){setTimeout(function(){e.init_animation()},100)}]).directive("threePoints",["$http","threePointData","getRequest2","SBMJSONP","debase64url","openLink",function(e,a,t,n,o,s){return{templateUrl:"templates/ps/threepoints.html",link:function(e,t,n,o){navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)?$(".screenforbiden").css({"background-image":"url(img/applegobuy.png)"}):(navigator.userAgent.indexOf("Android")>-1||navigator.userAgent.indexOf("Linux")>-1)&&$(".screenforbiden").css({"background-image":"url(img/azgobuy.png)"}),e.pinfo="",a(function(a){if(a.desc){e.pinfo=a.desc;var t=0;for(var n in e.pinfo.salesProperty)t++;e.pinfo.textboxstyle=function(e){return{width:100/t+"%",left:100/t*e+"%"}}}}),e.buybuybuy=function(e){s(e)},e.igetitjustgobuynow=function(){$(".screenforbiden").hide()},e.standaindex=0,e.standatopbar=function(a){e.standaindex=a},e.parma=function(e){e.preventDefault(),$(e.srcElement).parent().hasClass("current")?($(e.srcElement).parent().removeClass("current"),$(".showpagema").removeClass("pagema_standa_show")):($(e.srcElement).parent().addClass("current"),$(".showpagema").addClass("pagema_standa_show"),$("#standabtn").removeClass("current"),$(".showstanda").removeClass("pagema_standa_show"))},e.standa=function(e){$(e.srcElement).parent().hasClass("current")?($(e.srcElement).parent().removeClass("current"),$(".showstanda").removeClass("pagema_standa_show")):($(e.srcElement).parent().addClass("current"),$(".showstanda").addClass("pagema_standa_show"),$("#parmabtn").removeClass("current"),$(".showpagema").removeClass("pagema_standa_show"))}}}}]).factory("openLink",function(){return function(e){(navigator.userAgent.match("MicroMessenger")||navigator.userAgent.match("QQ"))&&e.match("taobao.com")?$(".screenforbiden").show():""!==e&&(e.match("taobao.com")&&(e=e.replace("http","taobao")),location.href=e)}});
SBMPS.factory("p_s",["p_s_temp",function(e){function a(){this.startX=0,this.startY=0,this.startT=0,this.currpage=0,this.prevpage=null,this.nextpage=1,this.direction=0,this.pagemovetype=1,this.spwidth=$(window).width(),this.spheight=$(window).height(),this.pagesize=0,this.pagemoving=0}return a.prototype.init_animation=function(){this.pagesize=$(".ps_page").length-1,this.pagemovemode("pageinit"),this.touchbind(),this.showstart(),this.pageinneract()},a.prototype.touchbind=function(){var e=this;$("#mainbox").on("touchstart",function(a){1!==e.pagemoving&&(2===e.pagemoving&&(e.pagemoving=0),e.startX=a.targetTouches[0].clientX,e.startY=a.targetTouches[0].clientY,e.startT=a.timeStamp)}).on("touchmove",function(a){a.preventDefault(),e.pagemoving||(e.moveX=a.targetTouches[0].clientX,e.moveY=a.targetTouches[0].clientY,e.moveT=a.timeStamp,e.pagemovemode("pagemove"))}).on("touchend",function(a){if(a.preventDefault(),1!==e.pagemoving){if(2===e.pagemoving)return void(e.pagemoving=0);e.pagemoving=1,e.endX=a.changedTouches[0].clientX,e.endY=a.changedTouches[0].clientY,e.endT=a.timeStamp,e.pageclearing()}})},a.prototype.showstart=function(){var e=this;e.spwidth/e.spheight>.635&&$(".ps_page").addClass("rotation"),$(".beforestart").removeClass("beforestart"),$("#mainbox").removeClass("nostart")},a.prototype.pageclearing=function(){var e=this.animatemodeclass();e=e.animateclearing(),this.pagemovemode(e)},a.prototype.animatemodeclass=function(){var e,a,t=this;switch(t.pagemovetype){case 1:e={unit:t.spheight,d:t.moveY-t.startY,animatemode:function(e,a,t,n){$(".ps_page").eq(e).css({"-webkit-transform":"translateY("+a+"px)","-webkit-transition":t+"s","z-index":n})},animateclearing:function(){var e=$(".ps_page").eq(t.currpage).attr("nodown"),n=$(".ps_page").eq(t.currpage).attr("notop");return t.endY-t.startY>40&&t.currpage>0&&!e?(t.pageIndexRefresh(-1),a="pagechange"):t.endY-t.startY<-40&&t.currpage<t.pagesize&&!n?(t.pageIndexRefresh(1),a="pagechange"):a="pagenochange",a}};break;case 2:e={unit:t.spwidth,d:t.moveX-t.startX,animatemode:function(e,a,t,n){$(".ps_page").eq(e).css({"-webkit-transform":"translateX("+a+"px)","-webkit-transition":t+"s","z-index":n})},animateclearing:function(){return t.endX-t.startX>40&&t.currpage>0?(t.pageIndexRefresh(-1),a="pagechange"):t.endX-t.startX<-40&&t.currpage<t.pagesize?(t.pageIndexRefresh(1),a="pagechange"):a="pagenochange",a}}}return e},a.prototype.pageIndexRefresh=function(e){this.direction=e,this.currpage=this.currpage+e,this.prevpage=this.currpage-1,this.nextpage=this.currpage+1},a.prototype.pagemovemode=function(e){function a(){$(".pagemainbtn").removeClass("pagemainbtnshow"),$(".pagemainbtn").on("webkitTransitionEnd",function(){$(".pagemainbtn").off("webkitTransitionEnd"),(0===t.currpage||i===t.pagesize)&&$(".pagemainbtn").addClass("pagemainbtnhide")})}var t=this,n=t.animatemodeclass(),i=t.currpage,s=t.currpage-1,p=t.currpage+1,o=n.d,r=n.unit;switch(n=n.animatemode,e){case"pagemove":$(".pagema_standa_show")[0]&&Math.abs(o)>10&&($(".pagema_standa_show").removeClass("pagema_standa_show"),$(".centerround").removeClass("current"));var g=$(".ps_page").eq(i).attr("nodown"),c=$(".ps_page").eq(i).attr("notop");0===i||c||n(s,o-r,0,1),n(i,0,0,0),i==t.pagesize&&0>o&&!g&&(this.currpage=-1),g||n(p,o+r,0,1);break;case"pageinit":$(".ps_page").each(function(e){i>e?n(e,-r,0,1):e>i?n(e,r,0,1):n(e,0,0,0)});break;case"pagenochange":0!==i&&n(s,-r,.2,1),n(i,0,.2,0),n(p,r,.2,1),t.pagemoving=0;break;case"pagechange":$(".ps_page").eq(i).on("webkitTransitionEnd",function(){$(".ps_page").eq(i).off("webkitTransitionEnd"),t.pagemoving=2,t.pagemovemode("pageinit"),t.clearAnimateClass(1===t.direction?t.prevpage:t.nextpage),t.pageinneract()}),(0===i||i===t.pagesize)&&a(),n(i,0,.5,1)}},a.prototype.clearAnimateClass=function(e){$(".ps_page").eq(e).children().each(function(){var e=this.className.match(/psanimate\w*/g);for(var a in e)$(this).removeClass(e[a])})},a.prototype.pageinneract=function(){function a(){$(".pagemainbtnshow")[0]||0===t.currpage||($(".pagemainbtn").removeClass("pagemainbtnshow").removeClass("pagemainbtnhide"),setTimeout(function(){$(".pagemainbtn").addClass(0!==t.currpage?"pagemainbtnshow":"pagemainbtnhide")},50))}$(".pagemainbtn").css({"z-index":"2"});var t=this,n=$(".ps_page").eq(t.currpage);e(n,a)},new a}]);
SBMPS.factory("threePointData",["$http","SBMJSONP","getRequest2",function(t,e,r){return function(a,n){var o={orgName:r("orgname"),detailId:r("detailid"),method:"softbanana.app.detailProperty.search"},i=e("searchDetaiProperty",o);t.jsonp(i.url).success(function(t){a(t)}).error(function(t){})}}]);
SBMPS.factory("p_s_temp",["p_s_anination","p_s_text",function(t,a){var n=function(n,p){function s(){t(n,".tapuptip","psanimateTapUpTip"),p()}var i=parseInt(n[0].className.match(/tmp\w*\s?/)[0].replace(/tmp/,""));switch(i){case 0:var _="";_=a(n,".ps_text1")?"psanimate2":"psanimateno",t(n,".ps_img1","psanimate2",function(){t(n,".ps_img2","psanimate15"),t(n,".ps_text1",_),s()});break;case 1:t(n,".ps_img1","psanimate2",function(){s()});break;case 2:var _="";_=a(n,".ps_text3")?"psanimate2":"psanimateno",t(n,".ps_text1","psanimate18"),t(n,".ps_text2","psanimate18",function(){t(n,".ps_text3",_),s()});break;case 3:var _=b="";_=a(n,".ps_text1")?"psanimate8_1":"psanimateno",b=a(n,".ps_text2")?"psanimate8_1":"psanimateno",t(n,".ps_text1",_,function(){t(n,".ps_text2",b),s()});break;case 4:var _=b="";_=a(n,".ps_text1")?"psanimateFadeInDown":"psanimateno",b=a(n,".ps_text2")?"psanimateFadeInDown":"psanimateno",t(n,".ps_text1",_,function(){t(n,".ps_text2",b),s()});break;case 5:var _=b="";_=a(n,".ps_text1")?"psanimateFadeInDown":"psanimateno",b=a(n,".ps_text2")?"psanimateFadeInDown_1":"psanimateno",t(n,".ps_img1","psanimateFadeInDown_f",function(){t(n,".ps_img2","psanimateFadeInLeft_f",function(){t(n,".ps_img3","psanimateFadeInRight_f",function(){t(n,".ps_text1",_),t(n,".ps_text2",b),s()})})});break;case 6:var _=b="";_=a(n,".ps_text1")?"psanimateFadeInDown":"psanimateno",b=a(n,".ps_text2")?"psanimateFadeInDown":"psanimateno",t(n,".ps_text1",_,function(){t(n,".ps_text2",b),s()});break;case 7:t(n,".ps_img1","psanimateFadeInLeft_f",function(){t(n,".ps_img2","psanimateFadeInRight_f",function(){t(n,".ps_img3","psanimateFadeInLeft_f"),s()})});break;case 8:t(n,".ps_btnwrap1","psanimate22"),t(n,".ps_btnwrap2","psanimate23"),t(n,".ps_btnwrap3","psanimate24",function(){t(n,".ps_btnwrap2","psanimate25",function(){t(n,".top_img","psanimateFadeInDown_f",function(){t(n,".ps_text1","psanimate8_1",function(){t(n,".ps_text2","psanimate8_1"),s()})})})});break;case 9:t(n,".ps_btnwrap1","psanimate22"),t(n,".ps_btnwrap2","psanimate23"),t(n,".ps_btnwrap3","psanimate24",function(){t(n,".ps_btnwrap3","psanimate26",function(){t(n,".ps_text1","psanimateFadeInDown",function(){t(n,".ps_text2","psanimateFadeInDown"),s()})})});break;case 10:t(n,".sharewarp","psanimate22",function(){t(n,".ps_text1","psanimateFadeInDown",function(){t(n,".ps_text2","psanimateFadeInDown"),s()})});break;case 12:var _=b=d=e="";_=a(n,".ps_text1")||a(n,".ps_text2")?"psanimateFadeInUpfix":"psanimateno",b=a(n,".ps_text3")?"psanimateFadeInUpfix":"psanimateno";var m=function(){t(n,".ps_text1","psanimateFadeInshow_f"),t(n,".ps_text2","psanimateFadeInshow_f"),t(n,".ps_text3","psanimateFadeInshow_f"),s()};d="psanimateno"==_?"":m,e="psanimateno"==b?"":m,t(n,".ps_text5",b,e),t(n,".ps_text4",_,d);break;case 13:t(n,".ps_text1","psanimateFadeInDown",function(){t(n,".ps_text2","psanimateFadeInUp_f"),s()});break;case 14:var _="";_=a(n,".ps_text1")||a(n,".ps_text2")||a(n,".ps_text3")?"psanimateFadeInLeft":"psanimateno",t(n,".ps_img2","psanimateFadeInRight",function(){t(n,".ps_text4",_,function(){t(n,".ps_text1","psanimateFadeInUp_f"),t(n,".ps_text2","psanimateFadeInUp_f"),t(n,".ps_text3","psanimateFadeInUp_f",function(){t(n,".ps_text5","psanimateFadeInDown"),s()})})});break;case 15:var _="";_=a(n,".ps_text4")||a(n,".ps_text3")?"1":"0","1"==_&&t(n,".ps_text2","psanimate18",function(){t(n,".ps_text3","psanimateFadeInUp_f"),t(n,".ps_text4","psanimateFadeInDown_f",function(){t(n,".ps_text1","psanimatelineWidth"),t(n,".ps_text5","psanimatelineWidth"),s()})});break;case 16:var _=b="";_=a(n,".ps_text1")?"psanimate8_1":"psanimateno",b=a(n,".ps_text2")||a(n,".ps_text3")?"psanimate8_1":"psanimateno";var m=function(){t(n,".ps_text1","psanimateFadeInDown_f",function(){t(n,".ps_text2","psanimateFadeInUp_f"),t(n,".ps_text3","psanimateFadeInUp_f"),s()})};t(n,".ps_text4",_,m),t(n,".ps_text5",b,m)}};return n}]).factory("p_s_anination",function(){var t=function(t,a,n,e){t.children(a).addClass(n),"psanimateno"==n?"function"==typeof e&&e():t.children(a).on("webkitAnimationEnd",function(){$(this).off("webkitAnimationEnd"),$(this).addClass(n+"end"),"function"==typeof e&&e()})};return t}).factory("p_s_text",function(){var t=function(t,a){return""==t.find(a).text()?!1:!0};return t});
angular.module("service.encryption",[]).factory("hex_md5",function(){function r(r){return i(t(u(r),r.length*C))}function t(r,t){r[t>>5]|=128<<t%32,r[(t+64>>>9<<4)+14]=t;for(var n=1732584193,h=-271733879,u=-1732584194,i=271733878,d=0;d<r.length;d+=16){var C=n,g=h,A=u,S=i;n=e(n,h,u,i,r[d+0],7,-680876936),i=e(i,n,h,u,r[d+1],12,-389564586),u=e(u,i,n,h,r[d+2],17,606105819),h=e(h,u,i,n,r[d+3],22,-1044525330),n=e(n,h,u,i,r[d+4],7,-176418897),i=e(i,n,h,u,r[d+5],12,1200080426),u=e(u,i,n,h,r[d+6],17,-1473231341),h=e(h,u,i,n,r[d+7],22,-45705983),n=e(n,h,u,i,r[d+8],7,1770035416),i=e(i,n,h,u,r[d+9],12,-1958414417),u=e(u,i,n,h,r[d+10],17,-42063),h=e(h,u,i,n,r[d+11],22,-1990404162),n=e(n,h,u,i,r[d+12],7,1804603682),i=e(i,n,h,u,r[d+13],12,-40341101),u=e(u,i,n,h,r[d+14],17,-1502002290),h=e(h,u,i,n,r[d+15],22,1236535329),n=o(n,h,u,i,r[d+1],5,-165796510),i=o(i,n,h,u,r[d+6],9,-1069501632),u=o(u,i,n,h,r[d+11],14,643717713),h=o(h,u,i,n,r[d+0],20,-373897302),n=o(n,h,u,i,r[d+5],5,-701558691),i=o(i,n,h,u,r[d+10],9,38016083),u=o(u,i,n,h,r[d+15],14,-660478335),h=o(h,u,i,n,r[d+4],20,-405537848),n=o(n,h,u,i,r[d+9],5,568446438),i=o(i,n,h,u,r[d+14],9,-1019803690),u=o(u,i,n,h,r[d+3],14,-187363961),h=o(h,u,i,n,r[d+8],20,1163531501),n=o(n,h,u,i,r[d+13],5,-1444681467),i=o(i,n,h,u,r[d+2],9,-51403784),u=o(u,i,n,h,r[d+7],14,1735328473),h=o(h,u,i,n,r[d+12],20,-1926607734),n=a(n,h,u,i,r[d+5],4,-378558),i=a(i,n,h,u,r[d+8],11,-2022574463),u=a(u,i,n,h,r[d+11],16,1839030562),h=a(h,u,i,n,r[d+14],23,-35309556),n=a(n,h,u,i,r[d+1],4,-1530992060),i=a(i,n,h,u,r[d+4],11,1272893353),u=a(u,i,n,h,r[d+7],16,-155497632),h=a(h,u,i,n,r[d+10],23,-1094730640),n=a(n,h,u,i,r[d+13],4,681279174),i=a(i,n,h,u,r[d+0],11,-358537222),u=a(u,i,n,h,r[d+3],16,-722521979),h=a(h,u,i,n,r[d+6],23,76029189),n=a(n,h,u,i,r[d+9],4,-640364487),i=a(i,n,h,u,r[d+12],11,-421815835),u=a(u,i,n,h,r[d+15],16,530742520),h=a(h,u,i,n,r[d+2],23,-995338651),n=c(n,h,u,i,r[d+0],6,-198630844),i=c(i,n,h,u,r[d+7],10,1126891415),u=c(u,i,n,h,r[d+14],15,-1416354905),h=c(h,u,i,n,r[d+5],21,-57434055),n=c(n,h,u,i,r[d+12],6,1700485571),i=c(i,n,h,u,r[d+3],10,-1894986606),u=c(u,i,n,h,r[d+10],15,-1051523),h=c(h,u,i,n,r[d+1],21,-2054922799),n=c(n,h,u,i,r[d+8],6,1873313359),i=c(i,n,h,u,r[d+15],10,-30611744),u=c(u,i,n,h,r[d+6],15,-1560198380),h=c(h,u,i,n,r[d+13],21,1309151649),n=c(n,h,u,i,r[d+4],6,-145523070),i=c(i,n,h,u,r[d+11],10,-1120210379),u=c(u,i,n,h,r[d+2],15,718787259),h=c(h,u,i,n,r[d+9],21,-343485551),n=f(n,C),h=f(h,g),u=f(u,A),i=f(i,S)}return Array(n,h,u,i)}function n(r,t,n,e,o,a){return f(h(f(f(t,r),f(e,a)),o),n)}function e(r,t,e,o,a,c,f){return n(t&e|~t&o,r,t,a,c,f)}function o(r,t,e,o,a,c,f){return n(t&o|e&~o,r,t,a,c,f)}function a(r,t,e,o,a,c,f){return n(t^e^o,r,t,a,c,f)}function c(r,t,e,o,a,c,f){return n(e^(t|~o),r,t,a,c,f)}function f(r,t){var n=(65535&r)+(65535&t),e=(r>>16)+(t>>16)+(n>>16);return e<<16|65535&n}function h(r,t){return r<<t|r>>>32-t}function u(r){for(var t=Array(),n=(1<<C)-1,e=0;e<r.length*C;e+=C)t[e>>5]|=(r.charCodeAt(e/C)&n)<<e%32;return t}function i(r){for(var t=d?"0123456789ABCDEF":"0123456789abcdef",n="",e=0;e<4*r.length;e++)n+=t.charAt(r[e>>2]>>e%4*8+4&15)+t.charAt(r[e>>2]>>e%4*8&15);return n}var d=0,C=8;return r}).factory("base64",function(){function r(){_keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",this.encode=function(r){var t,n,e,o,a,c,f,h="",u=0;for(r=_utf8_encode(r);u<r.length;)t=r.charCodeAt(u++),n=r.charCodeAt(u++),e=r.charCodeAt(u++),o=t>>2,a=(3&t)<<4|n>>4,c=(15&n)<<2|e>>6,f=63&e,isNaN(n)?c=f=64:isNaN(e)&&(f=64),h=h+_keyStr.charAt(o)+_keyStr.charAt(a)+_keyStr.charAt(c)+_keyStr.charAt(f);return h},this.decode=function(r){var t,n,e,o,a,c,f,h="",u=0;for(r=r.replace(/[^A-Za-z0-9\+\/\=]/g,"");u<r.length;)o=_keyStr.indexOf(r.charAt(u++)),a=_keyStr.indexOf(r.charAt(u++)),c=_keyStr.indexOf(r.charAt(u++)),f=_keyStr.indexOf(r.charAt(u++)),t=o<<2|a>>4,n=(15&a)<<4|c>>2,e=(3&c)<<6|f,h+=String.fromCharCode(t),64!=c&&(h+=String.fromCharCode(n)),64!=f&&(h+=String.fromCharCode(e));return h=_utf8_decode(h)},_utf8_encode=function(r){r=r.replace(/\r\n/g,"\n");for(var t="",n=0;n<r.length;n++){var e=r.charCodeAt(n);128>e?t+=String.fromCharCode(e):e>127&&2048>e?(t+=String.fromCharCode(e>>6|192),t+=String.fromCharCode(63&e|128)):(t+=String.fromCharCode(e>>12|224),t+=String.fromCharCode(e>>6&63|128),t+=String.fromCharCode(63&e|128))}return t},_utf8_decode=function(r){for(var t="",n=0,e=0,o=0;n<r.length;)e=r.charCodeAt(n),128>e?(t+=String.fromCharCode(e),n++):e>191&&224>e?(o=r.charCodeAt(n+1),t+=String.fromCharCode((31&e)<<6|63&o),n+=2):(o=r.charCodeAt(n+1),c3=r.charCodeAt(n+2),t+=String.fromCharCode((15&e)<<12|(63&o)<<6|63&c3),n+=3);return t}}return new r});
angular.module("starter.services",["service.encryption"]).factory("myCookie",function(){return{add:function(t,e,a){var n=t+"="+escape(e);if(a>0){var o=new Date;o.setTime(o.getTime()+3600*a*1e3),n=n+"; expires="+o.toGMTString()}document.cookie=n},get:function(t){for(var e=document.cookie,a=e.split("; "),n=0;n<a.length;n++){var o=a[n].split("=");if(o[0]==t)return unescape(o[1])}return""},"delete":function(t){var e=new Date;e.setTime(e.getTime()-1e4),document.cookie=t+"=v; expires="+e.toGMTString()}}}).factory("creatpsurl",["base64url",function(t){return function(e,a,n,o){var r="orgname="+e;return r+="&detailid="+a,r+="&productid="+n,r+="&plat="+o,r="http://baobeixiu.softbanana.com/ps.html?"+t(r)}}]).factory("creatpsurl2",["base64url",function(t){return function(e,a,n,o){var r="orgname="+e;return r+="&detailid="+a,r+="&productid="+n,r+="&plat="+o,r=location.origin+"/ps.html?"+t(r)}}]).factory("base64url",["base64",function(t){return function(e){return encodeURIComponent(t.encode(e))}}]).factory("debase64url",["base64",function(t){return function(e){return t.decode(decodeURIComponent(e))}}]).factory("dateFormat",function(){return function(t,e){var a={"M+":t.getMonth()+1,"d+":t.getDate(),"h+":t.getHours(),"m+":t.getMinutes(),"s+":t.getSeconds(),"q+":Math.floor((t.getMonth()+3)/3),S:t.getMilliseconds()};/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(t.getFullYear()+"").substr(4-RegExp.$1.length)));for(var n in a)new RegExp("("+n+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?a[n]:("00"+a[n]).substr((""+a[n]).length)));return e}}).factory("loginCheck",["$state","myCookie","base64","base64url","getRequest2","$rootScope","debase64url",function(t,e,a,n,o,r,i){return function(){var n=o("orgName"),i=o("shopName");r.istaobao===!0||r.orgName||(n&&i?(r.istaobao=!0,r.orgName=n,r.plat="TAOBAO",r.shopName=i):e.get("orgName")?(r.orgName=a.decode(e.get("orgName")),r.userName=a.decode(e.get("userName")),r.istaobao=!1):(r.istaobao=!1,t.go("login")))}}]).factory("hrefGo",function(){return function(t){location.href=t}}).factory("SBMJSONP",["jsonpURL","systemdata",function(t,e){return function(a,n){var o=e(n),r="http://swapi.hongware.com/openApi/dyncSoftBanana/app/"+a;return{url:t(r,o)}}}]).factory("SBMPOST",["postURL","systemdata",function(t,e){return function(a,n){var o=e(n);o=t(o);var r="http://swapi.hongware.com/openApi/dyncSoftBanana/app/"+a;return{url:r,data:o}}}]).factory("jsonpURL",function(){return function(t,e){t+="?";for(var a in e)t+=a+"="+encodeURIComponent(e[a])+"&";return t+"callBack=JSON_CALLBACK"}}).factory("postURL",function(){return function(t){var e="";for(var a in t)e+=a+"="+t[a]+"&";return e.substr(0,e.length-1)}}).factory("systemdata",["hex_md5","base64",function(t,e){return function(a){if("undefined"==typeof a.method)throw"SBMJSONP或SBMPOST的data参数里没有method,赶紧查下接口文档";a="object"==typeof a?a:{};var n=new Date,o={nick:"softbanana",name:"softbanana",timestamp:parseInt(n.getTime()/1e3).toString(),format:"json"},r=e.encode(o.nick)+e.encode(a.method)+e.encode(o.timestamp)+e.encode(o.name)+e.encode(o.format);return o.sign=t(r),$.extend(o,a)}}]).factory("getDataComm",["$http","SBMJSONP","$rootScope",function(t,e,a){var n={};return n.platObj={YHD:{imgSrc:"img/plat/yhd.png",name:"一号店"},DANGDANG:{imgSrc:"img/plat/dd.png",name:"当当"},JINGD:{imgSrc:"img/plat/jd.png",name:"京东"},PAIPAI:{imgSrc:"img/plat/pp.png",name:"拍拍"},TAOBAO:{imgSrc:"img/plat/tb.png",name:"淘宝"},TMALL:{imgSrc:"img/plat/tmall.png",name:"天猫"},WD:{imgSrc:"img/plat/wd.png",name:"微店"},AMAZON:{imgSrc:"img/plat/amz.png",name:"亚马逊"},KDT:{imgSrc:"img/plat/youzan.png",name:"有赞"}},n.loadShopList=function(n,o){var r=e("searchShop",{method:"softbanana.app.shop.search",orgName:a.orgName,pageNo:1,pageSize:50,action:""});t.jsonp(r.url).success(function(t){if(t.isSuccess&&t.shops&&t.shops.length>0){for(var e=[],a=0;a<t.shops.length;a++)t.shops[a].isInvalid&&e.push(t.shops[a]);e[0].checked=!0,n(e)}}).error(function(t,e){o(t,e,"数据查询失败")})},n}]).factory("orderComm",["$http","SBMJSONP","$rootScope",function(t,e,a){var n={};return n.orderStatusList=[{name:"已付款",status:"PAID"},{name:"未付款",status:"NON_PAYMENT"},{name:"已打印",status:"PRINTED"},{name:"已发货",status:"DELIVERED"},{name:"已取消",status:"CANCELED"},{name:"已完成",status:"COMPLETED"},{name:"全部",status:""}],n.getStatusName=function(t){for(var e="",a=0;a<n.orderStatusList.length;a++)if(t==n.orderStatusList[a].status){e=n.orderStatusList[a].name;break}return e},n}]).factory("productComm",["$http","SBMJSONP","$rootScope","getDataComm","dateFormat",function(t,e,a,n,o){var r={};return r.statusList=[{name:"上架中",status:"onsale"},{name:"已下架",status:"instock"}],r.getStatusName=function(t){for(var e="",a=0;a<statusList.length;a++)if(t==statusList[a].status){e=statusList[a].name;break}return e},r.loadProductData=function(o,r,i){var s={method:"softbanana.app.item.search",orgName:a.orgName,shopName:o.shopName,status:o.status,action:o.action,pageNo:o.pageNo,pageSize:o.pageSize,plat:o.plat},c=e("searchItem",s);t.jsonp(c.url).success(function(t){var e=[],a=0;if(t.isSuccess&&parseInt(t.totalCount)>0&&t.items&&t.items.length>0)if(t.items.sort(function(t,e){return parseInt(t.id)>parseInt(e.id)?-1:1}),"up"===o.action)for(a=0;a<t.items.length;a++)e.push(t.items[a]);else for(a=t.items.length-1;a>=0;a--)e.unshift(t.items[a]);for(a=0;a<e.length;a++)e[a].picPlatUrl=n.platObj[e[a].plat].imgSrc;r(e)}).error(function(t,e){i(t,e,"数据查询失败")})},r.loadProductDetail=function(a,n,o){var r={method:"softbanana.app.item.detail.search",orgName:a.orgName,numIid:a.numIid,plat:a.plat},i=e("searchItemDetail",r);t.jsonp(i.url).success(function(t){t.isSuccess?n(t.item):o("数据查询失败")}).error(function(t,e){o("数据查询失败",t,e)})},r.refreshServer=function(n,r,i){var s=new Date,c={method:"softbanana.app.item.list",orgName:a.orgName,shopName:n.shopName,plat:n.plat,endDate:o(s,"yyyy-MM-dd hh:mm:ss")};s.setMonth(s.getMonth()-1),c.startDate=o(s,"yyyy-MM-dd hh:mm:ss");var u=e("listItem",c);t.jsonp(u.url).success(function(t){r(t)}).error(function(t,e){i(t,e,"数据查询连接失败")})},r}]).factory("getRequest",function(){return function(t){var e=new RegExp("(^|&)"+t+"=([^&]*)(&|$)","i"),a=window.location.search.substr(1).match(e);return null!==a?unescape(a[2]):null}}).factory("getRequest2",["debase64url",function(t){return function(e){var a=new RegExp("(^|&)"+e+"=([^&]*)(&|$)","i"),n=window.location.search.substr(1),o=n.indexOf("&");-1!==o&&(n=n.substring(0,o));var r=t(n).match(a);return null!==r?unescape(r[2]):null}}]).factory("showadcheck",["$rootScope","myCookie",function(t,e){return function(){t.istaobao||e.get("youhaveredad")||(t.isthereshowad="showad")}}]).factory("TBAPI",function(){function t(){this.hideTitle=function(){"undefined"!=typeof Tida&&"undefined"!=typeof Tida.hideTitle&&Tida.hideTitle()},this.showTitle=function(){"undefined"!=typeof Tida&&"undefined"!=typeof Tida.showTitle&&Tida.showTitle()}}return new t}).factory("showedition",function(){return function(t){var e=$(".showlistitem").eq(t),a=e.find(".item-options");a.hasClass("invisible")?(a.removeClass("invisible"),e.find(".item-content").css({"-webkit-transform":" translate3d(-"+a.width()+"px, 0px, 0px)"})):(e.find(".item-content").css({"-webkit-transform":" translate3d(-0px, 0px, 0px)"}),a.addClass("invisible"))}}).factory("shouquan",["$rootScope",function(t){var e={TMALL:"http://fuwu.taobao.com/ser/detail.html?spm=a1z13.1113643.0.0.Wp7gXJ&service_code=FW_GOODS-1000049183&tracelog=search",TAOBAO:"http://fuwu.taobao.com/ser/detail.html?spm=a1z13.1113643.0.0.Wp7gXJ&service_code=FW_GOODS-1000049183&tracelog=search",KDT:"https://open.koudaitong.com/oauth/authorize?client_id=2c436c071a453a55&response_type=code&state=softbanana&redirect_uri=http://api.softbanana.com/openApi/kdtback/"+t.orgCode+"/kdt",JINGD:"http://fw.jd.com/94404.html",PAIPAI:"http://fw.paipai.com/193744.html",WD:"https://api.vdian.com/oauth2/authorize?appkey=617938&redirect_uri="+encodeURI("http://api.softbanana.com/openApi/wdback/"+t.orgCode+"/kdgw")+"&response_type=code&state=STATE",DANGDANG:"http://fuwu.dangdang.com/appdetail?app_id=2100003535",YHD:"http://fuwu.yhd.com/application/gotoAppDetail.do?appId=3753"};return e}]);