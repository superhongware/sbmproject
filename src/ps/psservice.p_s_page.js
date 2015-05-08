SBMPS.factory('threePointData', ['$http', 'SBMJSONP','getRequest2', function($http, SBMJSONP,getRequest2) {
	return function threePointData(callback,errorcallback) {
		var getdata = {
			orgName: getRequest2("orgname"),
			detailId: getRequest2("detailid"),
			method: "softbanana.app.detailProperty.search"
		};
		var api = SBMJSONP("searchDetaiProperty", getdata);
		$http.jsonp(api.url)
			.success(function(data) {
				callback(data);
			})
			.error(function(data) {
				console.log("获取参数,规格失败");
			});
	};
}])



;