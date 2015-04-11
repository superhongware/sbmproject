SBMPS.factory('threePointData', ['$http', 'SBMJSONP', function($http, SBMJSONP) {
	return function threePointData(orgname,detailid) {
		var getdata = {
			orgName: orgname,
			detailId: detailid,
			method: "softbanana.app.detailProperty.search"
		};
		var api = SBMJSONP("searchDetaiProperty", getdata);
		$http.jsonp(api.url)
			.success(function(data) {
				var i = 0;
				var showpagema = "";

				for (standa in data.desc.noSalesProperty) {
					if (i < 8 && data.desc.noSalesProperty[standa].length > 0) {
						i++;
						showpagema += standa + ":" + data.desc.noSalesProperty[standa][0] + "<br/>";
					}
				}
				$(".showstanda").html(showpagema);

				console.log(data);
			})
			.error(function(data) {
				console.log(data);
			});
	};
}])



;