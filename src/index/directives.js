/**
* starter.directive Module
*
* Description
*/
angular.module('starter.directives',[])
.directive("sbmPage",function(){
	return{
		restrict:'E',
		templateUrl:function(elem,attr){
			return 'templates/index/pages/page'+attr.pagenum+'.html';
		}
	};
})
;