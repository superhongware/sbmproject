SBMPS.factory('p_s_temp', ['p_s_anination', function(p_s_anination) {
	var p_s_temp = function(page) {
		var temp = page[0].className.match(/tmp\w*\s?/)[0].replace(/tmp/, "");

// var c="4";
// switch(c){
// 	case "4":
// 		console.log("sdasdasd");
// 	break;
// }
		function allpageanimate(){
			p_s_anination(page,".tapuptip","psanimateTapUpTip");
			// console.log()
			// if(page.index(".ps_page")!==0){
				p_s_anination($("body"),".pagemainbtn","psanimatepagemainbtn");
			// }
			
		}
		switch(temp){
			case "1":
				p_s_anination(page, ".ps_img1", "psanimate2", function() {
					p_s_anination(page, ".ps_img2", "psanimate15");
					p_s_anination(page, ".ps_text1", "psanimate2");

					
					allpageanimate();
				});
				break;
			case "2":
				p_s_anination(page, ".ps_text1", "psanimate18");
				p_s_anination(page, ".ps_text2", "psanimate18", function() {
					p_s_anination(page, ".ps_text3", "psanimate2");

					allpageanimate();

				});
				break;
			case "3":
				p_s_anination(page, ".ps_text1", "psanimate8_1", function() {
					p_s_anination(page, ".ps_text2", "psanimate8_1");
					
					allpageanimate();
				});
				break;
			case "4":
				p_s_anination(page, ".ps_text1", "psanimateFadeInDown", function() {
					p_s_anination(page, ".ps_text2", "psanimateFadeInDown");
					
					allpageanimate();
				});
				break;
			case "5":
				p_s_anination(page, ".ps_img1", "psanimateFadeInDown", function() {
					p_s_anination(page, ".ps_img2", "psanimateFadeInLeft",function(){
						p_s_anination(page, ".ps_img3", "psanimateFadeInRight",function(){
							p_s_anination(page, ".ps_text1", "psanimateFadeInDown");
							p_s_anination(page, ".ps_text2", "psanimateFadeInDown_1");
							
							allpageanimate();
						});
					});
				});
				break;
			case "6":
				p_s_anination(page, ".ps_text1", "psanimateFadeInDown", function() {
					p_s_anination(page, ".ps_text2", "psanimateFadeInDown");
					
					allpageanimate();
				});
				break;
			default:
				console.log("default"+temp);
				break;
		}

	};

	var p_s_anination2 = function(classname, animate, callback) {

		var $dom = $(classname);
		$dom.addClass(animate);
		$dom.on("webkitAnimationEnd", function() {

			var $this = $(this);
			$this.off("webkitAnimationEnd");
			$this.addClass(animate + "end");
			if (typeof callback === "function") {
				callback();
			}

		});
	};

	return p_s_temp;
}])

.factory('p_s_anination', function() {
	var p_s_anination = function(page, classname, animate, callback) {

		page.children(classname).addClass(animate);

		page.children(classname).on("webkitAnimationEnd", function() {

			$(this).off("webkitAnimationEnd");
			$(this).addClass(animate + "end");
			if (typeof callback === "function") {
				callback();
			}

		});
	};
	return p_s_anination;
});