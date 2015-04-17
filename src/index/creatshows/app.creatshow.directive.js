creatshowmodule
.directive('onFinishRenderFilters',["$timeout", function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
}])

.directive('pageEditor',['$rootScope','$state','$animate',function($rootScope,$state,$animate){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'templates/index/creatshows/pageeditor.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			console.log($rootScope);
			// console.log(["aa",$rootScope.editShowData]);
			$scope.editpages=0;
			// var pagelistboxhold=ionic.onGesture("hold",function(){
			// 	console.log("pagelistboxhold");
			// 	$scope.editpages=1;
			// 	$scope.$apply();
			// },$('.pagelistbox')[0])
			

			var holdtouchlist=[];
			//小页页面DOME渲染完成够出发
			$rootScope.$on("ngRepeatFinished",function() {
				var pages=$rootScope.editShowData.mainData.pages;
				console.log("小页页面DOME渲染完成");
				$('.pageitem').each(function(){
					holdtouchlist.push(
						ionic.onGesture("hold",function(){
							console.log("pagelistboxhold");
							$scope.editpages=1;
							$scope.$apply();
						},this));
				});
			});

			$scope.pageitemclick=function(index){
				if($scope.editpages){
					$scope.editpages=0;
					return;
				}
				$state.go("editpages.editer",{
					showId:$rootScope.editShowData.showId,
					pageId:index,
					pageTemp:$rootScope.editShowData.mainData.pages[index].templatePageId
				});
			};

			//删除页面
			$scope.deletethispage=function(index){
				var pages=$rootScope.editShowData.mainData.pages;
				console.log($animate);
				$(".pageitem").eq(index).on("webkitTransitionEnd", function() {
					$(".pageitem").eq(index).off("webkitTransitionEnd");
					$rootScope.$emit("showdatachanged");
				});

				pages.splice(index,1);
			};

			//小页面位置控制
			$scope.pageitemposition=function(index){
				return {"left":index*71+"px"};
			};


		}
	};
}])

.directive('normalEditContent', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'templates/index/creatshows/pages/normaleditcontent.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
		}
	};
})
;