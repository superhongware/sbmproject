SBMPS.factory('threePointData', ['$http', 'SBMJSONP','getRequest', function($http, SBMJSONP,getRequest) {
	return function threePointData(callback,errorcallback) {
		var getdata = {
			orgName: getRequest("orgname"),
			detailId: getRequest("detailid"),
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