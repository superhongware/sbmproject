SBMPS.factory('p_s_temp', ['p_s_anination', function(p_s_anination) {
	var p_s_temp = function(page,callback) {
		var temp = parseInt(page[0].className.match(/tmp\w*\s?/)[0].replace(/tmp/,''));

// alert(temp)
		//底部向上滑动小提示出现  参数规格购买出现
		function allpageanimate(){
			p_s_anination(page,".tapuptip","psanimateTapUpTip");

			callback();
		}
		switch(temp){
			case 1:
				p_s_anination(page, ".ps_img1", "psanimate2", function() {
					p_s_anination(page, ".ps_img2", "psanimate15");
					p_s_anination(page, ".ps_text1", "psanimate2");
					
					allpageanimate();
				});
				break;
			case 2:

				p_s_anination(page, ".ps_text1", "psanimate18");
				p_s_anination(page, ".ps_text2", "psanimate18", function() {
					p_s_anination(page, ".ps_text3", "psanimate2");

					allpageanimate();

				});
				break;
			case 3:
				p_s_anination(page, ".ps_text1", "psanimate8_1", function() {
					p_s_anination(page, ".ps_text2", "psanimate8_1");
					
					allpageanimate();
				});
				break;
			case 4:
				p_s_anination(page, ".ps_text1", "psanimateFadeInDown", function() {
					p_s_anination(page, ".ps_text2", "psanimateFadeInDown");
					
					allpageanimate();
				});
				break;
			case 5:
				p_s_anination(page, ".ps_img1", "psanimateFadeInDown_f", function() {
					p_s_anination(page, ".ps_img2", "psanimateFadeInLeft_f",function(){
						p_s_anination(page, ".ps_img3", "psanimateFadeInRight_f",function(){
							p_s_anination(page, ".ps_text1", "psanimateFadeInDown");
							p_s_anination(page, ".ps_text2", "psanimateFadeInDown_1");
							
							allpageanimate();
						});
					});
				});
				break;
			case 6:
				p_s_anination(page, ".ps_text1", "psanimateFadeInDown", function() {
					p_s_anination(page, ".ps_text2", "psanimateFadeInDown");
					
					allpageanimate();
				});
				break;
			case 7:
				p_s_anination(page, ".ps_img1", "psanimateFadeInLeft_f", function() {
					p_s_anination(page, ".ps_img2", "psanimateFadeInRight_f",function(){
						p_s_anination(page, ".ps_img3", "psanimateFadeInLeft_f");
						allpageanimate();
					});
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