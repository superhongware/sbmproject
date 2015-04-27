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
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'templates/index/creatshows/pageeditor.html',
		// replace: true,
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
			
			var viewwidth=$(window).width();

			var holdtouchlist=[];
			var dragtouchlist=[];
			var dragdata=[];

			//小页页面DOME渲染完成够出发
			$scope.$on("ngRepeatFinished",function() {

				var pages=$rootScope.editShowData.mainData.pages;
				console.log("小页页面DOME渲染完成");

				$('.pageitem').each(function(index){
					var thispage=$(this);

					ionic.onGesture("dragstart",function(e){
						var scrollposition=movebar.getScrollPosition();
						dragdata[index]={};
						dragdata[index].dnum=thispage[0].offsetLeft-scrollposition.left;//小页面当前在页面中位置
						dragdata[index].moveindex="";//小页面被移动到的位置
					},this);

					//小页面被拖动时干的事情
					ionic.onGesture("drag",function(e){
							// console.log("drag");
						//开启编辑模式后(看起来是这样的:开始抖动,右上角带个小叉叉),能拖动,能删除
						if($scope.editpages){
							//长按拖动页面才会被移动,不然是左右拖动
							if(thispage.hasClass('dragpages')){
								
								//禁止滚动条
								movebar.freezeScroll(true);
								// console.dir(thispage);


								var scrollposition=movebar.getScrollPosition(),
									boxleft=scrollposition.left,//当前滚动条位置数据(滚动条指的是包裹着小页面的div)
									itemwidth=71,//小页面宽度
									ganyinqu=20,//小页面拖到两端 滚动条开始移动 的感应距离
									itemleft=thispage[0].offsetLeft,//小页面在滚动条内的位置
									moveleft=e.gesture.deltaX,//小页面在页面上被拖动的距离
									moveindex=Math.round((moveleft-4+dragdata[index].dnum+boxleft)/itemwidth),//当前小页面被移动到哪一页的位置
									pageleft=dragdata[index].dnum+moveleft;//小页面被拖动后的位置

								dragdata[index].moveindex=moveindex;

								console.log(["moveindex",dragdata[index].moveindex]);

								if(pageleft<ganyinqu&&boxleft>=0){

									movebar.scrollTo(boxleft-1,scrollposition.top);

								}else if(pageleft>(viewwidth-itemwidth-ganyinqu)&&boxleft<=($('.pageitem').length*itemwidth-viewwidth)){
			
									movebar.scrollTo(boxleft+1,scrollposition.top);
		
								}

								thispage.css({
									// "position":"relative",
									"z-index":"99",
									"-webkit-transform":"translate3d("+(moveleft+dragdata[index].dnum-itemleft+boxleft)+"px,"+e.gesture.deltaY+"px,0px)"
								});

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

					//小页面拖动结束后 更新数据
					ionic.onGesture("dragend",function(e){
						console.log("dragend");
						if(dragtouchlist[index]&&dragtouchlist[index][0]){
							dragtouchlist[index][0]=false;
							clearTimeout(dragtouchlist[index][1]);
							
							if(thispage.hasClass("dragpages")){
								
								var pages=$rootScope.editShowData.mainData.pages;
								
								//移动页面位置变化就改变数据位置
								if(dragdata[index].moveindex&&dragdata[index].moveindex!==thispage.index()){
									console.log("move");
									dragdata[index].moveindex=dragdata[index].moveindex<=0?0:dragdata[index].moveindex;
									dragdata[index].moveindex=dragdata[index].moveindex>=$('.pageitem').length?$('.pageitem').length-1:dragdata[index].moveindex;

									dragpage=pages[thispage.index()];
									pages.splice(thispage.index(),1);
									var resideindex=thispage.index()>dragdata[index].moveindex?dragdata[index].moveindex:dragdata[index].moveindex-1;
									pages.splice(dragdata[index].moveindex,0,dragpage);
								}

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
				console.log("点击");
				if($scope.editpages){
					$scope.editpages=0;
					return;
				}
				turnpageindex=index;
				//调用保存图片功能  pagetempht1Ctrl中有方法
				$scope.$broadcast('saveShowImg');
				//点击保存以后要重新加载服务器数据，否则用改变后的缓存
				$rootScope.SaveChange = true;
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
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'templates/index/creatshows/pages/normaleditcontent.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
		}
	};
})
;