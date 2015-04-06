creatshowmodule.factory('changepagesize', function(){
	return function changepagesize(){
		var pageempty=parseInt($(window).height()-110-44),
			pageheight=parseInt(pageempty*0.9),
			pagewidth=parseInt(pageheight*0.635),
			pagtop=44+parseInt((pageempty-pageheight)/2);

		$(".editplace").css({
			"height":pageheight,
			"width":pagewidth,
			"top":pagtop
		});

	};
});