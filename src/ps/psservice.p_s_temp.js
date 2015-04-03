SBMPS.factory('p_s_temp', ['p_s_anination', function(p_s_anination) {
	var p_s_temp = function(page) {
		var temp = page[0].className.match(/tmp\w*\s?/)[0].replace(/tmp/, "");

		switch (temp) {
			case "ht1":

				p_s_anination(page, ".ps_img3", "psanimate2", function() {
					p_s_anination(page, ".ps_img2", "psanimate15");
					p_s_anination(page, ".ps_text1", "psanimate2");
				});

				break;
			case "ht2":
				p_s_anination(page, ".ps_text1", "psanimate15");
				p_s_anination(page, ".ps_text2", "psanimate15", function() {
					p_s_anination(page, ".ps_text3", "psanimate2");
				});
				break;
			case "ht3":
				p_s_anination(page, ".ps_text1", "psanimate8_1", function() {
					p_s_anination(page, ".ps_text2", "psanimate8_1");
				});
				break;
			case "ht4":
				p_s_anination(page, ".ps_text1", "psanimateFadeInDown", function() {
					p_s_anination(page, ".ps_text2", "psanimateFadeInDown");
				});
				break;
			case "ht5":
				p_s_anination2(".divImgWarp0 .ps_img_s0", "psanimateFadeInDown_1", function() {
					p_s_anination2(".divImgWarp1 .ps_img_s0", "psanimateFadeInLeft", function() {
						p_s_anination2(".divImgWarp1 .ps_img_s1", "psanimateFadeInRight", function() {
							p_s_anination2(".tmpht5 .ps_text1", "psanimateFadeInDown_1", function() {
								p_s_anination2(".tmpht5 .ps_text2", "psanimateFadeInDown_1", function() {

								});
							});
						});
					});
				});

				break;
			default:
				// console.log("1"+temp);

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