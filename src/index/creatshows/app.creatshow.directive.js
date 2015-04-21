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

.directive('onFinishTempImg',["$timeout", function ($timeout) {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			if (scope.$last === true) {
				$timeout(function() {
					scope.$emit('tempImgngRepeatFinished');
				});
			}
		}
	};
}])

.directive('pageEditor',[
	'$rootScope','$state','$animate',"$timeout",'$ionicLoading','$ionicScrollDelegate',
	function($rootScope,$state,$animate,$timeout,$ionicLoading,$ionicScrollDelegate){
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
			
			var movebar=$ionicScrollDelegate.$getByHandle('smallpages');

			//小页面进入编辑状态
			$scope.editpages=0;
			var pagelistboxhold=ionic.onGesture("hold",function(){
				console.log("pagelistboxhold");
				$scope.editpages=1;
				$scope.$apply();
			},$('.pagelistbox')[0]);
			


			var holdtouchlist=[];
			var dragtouchlist=[];
			//小页页面DOME渲染完成够出发
			$scope.$on("ngRepeatFinished",function() {

				var pages=$rootScope.editShowData.mainData.pages;
				console.log("小页页面DOME渲染完成");


				// console.log(movebar.getScrollPosition());
				// console.log($ionicScrollDelegate.getScrollPosition());
				// console.log(movebar);
				// console.log($ionicScrollDelegate);
				// console.log([$ionicScrollDelegate.getScrollView()]);
				console.log([movebar.getScrollView()]);




				movebar.freezeScroll(true);
				movebar.freezeScroll(false);

				// $('.pageitem').each(function(){
				// 	holdtouchlist.push(
				// 		ionic.onGesture("hold",function(){
				// 			console.log("pagelistboxhold");
				// 			$scope.editpages=1;
				// 			$scope.$apply();
				// 		},this));
				// });
				$('.pageitem').each(function(index){
					var thispage=$(this);

					ionic.onGesture("drag",function(e){
							// console.log("drag");
						if($scope.editpages){		
							if(thispage.hasClass('dragpages')){
								

								
								movebar.freezeScroll(true);

								thispage.css({
									// "position":"relative",
									"z-index":"99",
									"-webkit-transform":"translate3d("+e.gesture.deltaX+"px,"+e.gesture.deltaY+"px,0px)"
								});
								console.log(thispage[0].offsetLeft);
							//拖动加个延时，否则左右拖动  页面就被选中拖起来了
							}else if(typeof dragtouchlist[index] ==="undefined" || !dragtouchlist[index][0]){
								dragtouchlist[index]=[];
								dragtouchlist[index][0]=true;
								dragtouchlist[index][1]=setTimeout(function(){
									console.log(["drag-setTimeout"]);
									thispage.addClass('dragpages');
								},500);
							}
						}
					},this);

					ionic.onGesture("dragend",function(e){
						console.log("dragend");
						if(dragtouchlist[index]&&dragtouchlist[index][0]){
							dragtouchlist[index][0]=false;
							clearTimeout(dragtouchlist[index][1]);
							

							if(thispage.hasClass("dragpages")){
								
								var pages=$rootScope.editShowData.mainData.pages;
								
								dragpage=pages[thispage.index()];
								// pages.splice(thispage.index(),1);
								// pages.splice(1,0,dragpage);

								$rootScope.$apply();

								movebar.freezeScroll(false);

								thispage.removeClass('dragpages').css({
									"z-index":"initial",
									"-webkit-transform":"translate3d("+0+"px,"+0+"px,0px)"
								});
							}
						}
					},this);
				});
			});

			//当前页面
			var turnpageindex=$rootScope.editShowData.currentpage;
			$scope.pageitemclick=function(index){
				if($scope.editpages){
					$scope.editpages=0;
					return;
				}
				turnpageindex=index;
				//调用保存图片功能  pagetempht1Ctrl中有方法
				$scope.$broadcast('saveShowImg');
			};
			//scope删除 取消事件侦听
			$scope.$on('$destroy', function() {
				saveShowImgOver();
			});
			//图片保存完成 跳转页面
			//图片保存在编辑页面中  所以此处添加侦听事件
			var saveShowImgOver=$scope.$on("saveShowImgOver",function(){
				console.log("保存图片完成,这是回调函数");
				if(turnpageindex!==$rootScope.editShowData.currentpage){
					$state.go("editpages.editer",{
						showId:$rootScope.editShowData.showId,
						pageId:turnpageindex,
						pageTemp:$rootScope.editShowData.mainData.pages[turnpageindex].templatePageId
					});
				}
			});



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