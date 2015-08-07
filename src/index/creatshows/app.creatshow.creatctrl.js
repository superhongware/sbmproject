/**
 * creatshowmodule Module
 *
 * 创建宝贝秀功能
 */
var creatshowmodule = angular.module('creatshowmodule', ['ionic', 'starter.services', 'starter.directives']);

creatshowmodule.controller('checktemplateCtrl', ['$rootScope', '$scope', '$http', '$stateParams', '$ionicLoading', '$state', 'getTemplate', 'creatShow', 'myloadover', 'SBMJSONP', 'myCookie',
	function($rootScope, $scope, $http, $stateParams, $ionicLoading, $state, getTemplate, creatShow, myloadover, SBMJSONP, myCookie) {

		//假设取到的模板信息

		// getTemplate(function(data){
		// 	console.log(data);
		// })
		//点击保存以后要重新加载服务器数据，否则用改变后的缓存,此处为退出

		$rootScope.SaveChange = undefined;

		$scope.productId = $stateParams.productId;
		$scope.productPlat = $stateParams.productPlat;
		var templateslist = {
			orgName: $rootScope.orgName,
			pageSize: "50",
			method: "softbanana.app.template.list"
		};
		var api = SBMJSONP('listTemplate', templateslist);
		console.log(api.url)
		$http.jsonp(api.url).success(function(data) {
			console.log(['listTemplate', data])
			myloadover(data.templates);
			$scope.viewsarr = data.templates;
			console.log($scope.viewsarr);

			if (!myCookie.get("zm3")) {
				myCookie.add("zm3", "3", 999)
				$(".zm-bgx3").addClass("zm-bg")
				setTimeout(function() {
					doFirst()
				}, 10)



			} else {

				$(".zm-bgx3,.zm-img3a,.zm-img3b").remove()

			}


		})

		function doFirst() {

			$(".zm-img3b").appendTo($(".template").eq(0));
			$(".zm-bgx3,.zm-img3a").appendTo(".list");
			setTimeout(function() {
				$(".zm-bg,.zm-img").css({

					"opacity": 1
				})

			}, 10)
		}
 
	}
])

 
.controller('viewtemplateCtrl', ['$scope', '$rootScope', '$stateParams', '$ionicLoading', '$state', 'creatShow', 'myCookie',
	function($scope, $rootScope, $stateParams, $ionicLoading, $state, creatShow, myCookie) {


		$(".viewtemplate").append('<iframe class="viewbox" height=' + ($(window).height() - 44) + ' src=' + location.origin +
			'/ps.html?templateview=' + $stateParams.templateId + '&orgname=' + $rootScope.orgName + ' frameborder="0"></iframe>');
		url: "/checktemplate/:productId/:productPlat",


			console.log(0);
			
		if (!myCookie.get("zm4")) {
			myCookie.add("zm4", "4", 999);
			setTimeout(function() {
				$(".zm-img4a").css("right","0")
			},1000)
			setTimeout(function() {
				
				$(".zm-bgx4").addClass("zm-bg")
				$(".zm-bg,.zm-img").css({
					"opacity": 1
				})
			}, 2000)

		} else {
			setTimeout(function() {
				$(".zm-bgx4,.zm-img4a").remove()
			}, 2000)
		}
		// $scope.iframesrc=location.origin+"/ps.html?orgname=work&detailid=987883&templateview=1";
		$scope.viewbtnneam = "应用";
		$scope.viewneam = "模板预览";

		//根据模板创建宝贝秀
		$scope.viewbtn = function() {

			$ionicLoading.show({
				template: "正在提取宝贝数据到模板,请稍等...",
			});

			var creatdata = {
				templateId: $stateParams.templateId,
				productId: $stateParams.productId, //宝贝ID
				productPlat: $stateParams.productPlat, //所属平台
			};
			creatShow(creatdata, function(data) {

				//隐藏“创建中,请稍等...”
				$ionicLoading.hide();

				//创建成功跳转到编辑页
				$state.go("editpages.editer", {
					showId: data.detailId,
					pageId: 0,
					pageTemp: data.firstPageTemp
				});

			}, function(msg) {

				alert(msg);
				console.log(msg);

			});
		};

	}
])


.controller('viewshowCtrl', [
	'$scope', '$rootScope', '$stateParams', '$state', '$ionicLoading', 'creatShow', 'creatpsurl2',
	function($scope, $rootScope, $stateParams, $state, $ionicLoading, creatShow, creatpsurl2) {

		if ($rootScope.editShowData && $rootScope.editShowData.mainData) {
			$rootScope.editShowData.mainData = undefined;
		}


		console.log(['lllll', creatpsurl2($rootScope.orgName, $stateParams.showId, "0", "0")]);
		var showurl = creatpsurl2($rootScope.orgName, $stateParams.showId, "0", "0");
		showurl += '&showview=true'
		$(".viewtemplate").append('<iframe class="viewbox" height=' + ($(window).height() - 44) + ' src=' + showurl + ' frameborder="0"></iframe>');

		// $(".viewtemplate").append('<iframe class="viewbox" src="'+location.origin+
		// 	'/ps.html?orgname='+$rootScope.orgName+
		// 	'&detailid='+$stateParams.showId+
		// 	'&templateview=2" frameborder="0"></iframe>');

		// $scope.iframesrc=location.origin+"/ps.html?orgname="+$rootScope.orgName+"&detailid="+$stateParams.showId+"&templateview=1";

		console.log($scope.iframesrc);
		$scope.viewbtnneam = "分享";
		$scope.viewneam = "宝贝秀预览";




		$scope.viewbtn = function() {
			// $ionicLoading.show({
			// 	template:"跳转页面中",
			// 	duration:2000
			// });
			// $ionicLoading.hide();
			$state.go('share', {
				showId: $stateParams.showId
			});
		};


	}
])




;