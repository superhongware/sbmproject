SBMPS.factory('p_s',['p_s_temp', function(p_s_temp) {
	function p_s() {
		this.startX = 0;
		this.startY = 0;
		this.startT = 0;
		this.currpage = 0;
		this.prevpage = null;
		this.nextpage = 1;
		//翻页方向
		this.direction = 0;
		//翻页样式
		this.pagemovetype = 1;
		this.spwidth = $(window).width();
		this.spheight = $(window).height();
		this.pagesize = 0;
		this.pagemoving = 0;

	}

	p_s.prototype.CreatDomtree = function(data) {
		console.log('p_s.prototype.CreatDomtree');
		console.log(data);
		$("title")[0].innerText=data.detailTitle;
		$(".pagemainbtn").before("<img class='shareimg' src="+data.detailImage+">");
		//设置页面数量
		this.pagesize = data.pages.length - 1;
		for (var i = 0; i < data.pages.length; i++) { //正排序
			// for (var i =data.pages.length-1; i >=0 ; i--) {//反排序

			//创建ps_page
			var pagedata = data.pages[i];

			var pageclass = "tmp" + pagedata.templatePageId;

			var ps_page = $("<div></div>")
				.addClass("beforestart ps_page " + pageclass);

			$("body").append(ps_page);

			//创建ps_img
			if (pagedata.detailPageImage.length > 0) {

				for (var m = 0; m < pagedata.detailPageImage.length; m++) {

					var imgurl = pagedata.detailPageImage[m].img;


					if (imgurl instanceof Array) {
						var divImgWarp = $("<div></div>").addClass("divImgWarp divImgWarp" + m);
						for (var k = 0; k < imgurl.length; k++) {
							var img = $('<div></div>')
							.addClass("ps_img_s ps_img_s" + k)
							.css({
								"background-image": "url(" + imgurl[k] + ")"
							});
							divImgWarp.append(img);
						}
						$(ps_page).append(divImgWarp);

					} else {
						var imgclass = "ps_img" + (m + 1);
						var ps_img = $("<div></div>")
							.addClass("ps_img " + imgclass)
							.css({
								"background-image": "url(" + imgurl + ")",
								// "background-position":imgdata.translateX+"px "+imgdata.translateY+"px",
							});
						$(ps_page).append(ps_img);
					}

				}
			}

			//创建ps_text
			if (pagedata.detailPageText.length > 0) {

				for (var t = 0; t < pagedata.detailPageText.length; t++) {

					var contentdata = pagedata.detailPageText[t].txt;


					var ps_text = $("<div></div>")
						.addClass("ps_text ps_text" + (t + 1))
						.html(contentdata);

					$(ps_page).append(ps_text);

				}
			}

			$(ps_page).append("<psan class='tapuptip'></span>");

		}

	};

	p_s.prototype.init_animation = function() {
		
		//位置初始化
		this.pagemovemode("pageinit");

		//绑定touch控制
		this.touchbind();

		//开始
		this.showstart();

		//第一页内部动画
		this.pageinneract();

	};

	p_s.prototype.touchbind = function() {
		var _ = this;

		$("body").on("touchstart", function(e) {
			if (_.pagemoving  === 1) {
				return;
			}else if(_.pagemoving === 2){
				//pagemoving=2 说明动画结束 初始化pagemoving
				_.pagemoving = 0;
			}
			_.startX = e.targetTouches[0].clientX;
			_.startY = e.targetTouches[0].clientY;
			_.startT = e.timeStamp;

			//.pagemainbtn z-index 特殊处理
			$(".pagemainbtn").css({"z-index":"1"});

		}).on("touchmove", function(e) {
			e.preventDefault();
			if (_.pagemoving) return;
			
			_.moveX = e.targetTouches[0].clientX;
			_.moveY = e.targetTouches[0].clientY;
			_.moveT = e.timeStamp;

			//翻页操作
			_.pagemovemode("pagemove");

		}).on("touchend", function(e) {
			e.preventDefault();

			if (_.pagemoving === 1) {
				return;
			}else if(_.pagemoving === 2){
				//pagemoving=2 说明动画刚结束  此次touch作废
				_.pagemoving = 0;
				return;
			}else{
				_.pagemoving = 1;
			}

			_.endX = e.changedTouches[0].clientX;
			_.endY = e.changedTouches[0].clientY;
			_.endT = e.timeStamp;

			//页面清算
			_.pageclearing();
		});
	};

	p_s.prototype.showstart = function() {
		//全屏图片自适应
		var _ = this;
		if ((_.spwidth / _.spheight) > 0.635) {
			$(".ps_page").addClass("rotation");
		}
		$(".beforestart").removeClass("beforestart");

	};

	//页面清算
	p_s.prototype.pageclearing = function() {
		var action = this.animatemodeclass();
		action = action.animateclearing();
		//清算完运行动画调整页面顺序
		this.pagemovemode(action);
	};

	p_s.prototype.animatemodeclass = function() {
		var _ = this;
		var animatemode,action;
		switch (_.pagemovetype) {
			case 1:
				//上下翻
				 animatemode = {
					unit: _.spheight,
					d: _.moveY - _.startY,
					animatemode: function(index, movenum, time, z) {
						$(".ps_page").eq(index).css({
							"-webkit-transform": "translateY(" + movenum + "px)",
							"-webkit-transition": time + "s",
							"z-index": z
						});
					},
					animateclearing: function() {
						if (_.endY - _.startY > 40 && _.currpage > 0) {
							_.pageIndexRefresh(-1);
							// _.currpage--;

							action = "pagechange";
						} else if (_.endY - _.startY < -40 && _.currpage < _.pagesize) {
							_.pageIndexRefresh(+1);
							// _.currpage++;
							action = "pagechange";
						} else {
							action = "pagenochange";
						}
						return action;
					}
				};
				break;
			case 2:
				//左右翻
				 animatemode = {
					unit: _.spwidth,
					d: _.moveX - _.startX,
					animatemode: function(index, movenum, time, z) {
						$(".ps_page").eq(index).css({
							"-webkit-transform": "translateX(" + movenum + "px)",
							"-webkit-transition": time + "s",
							"z-index": z
						});
					},
					animateclearing: function() {
						if (_.endX - _.startX > 40 && _.currpage > 0) {
							_.pageIndexRefresh(-1);
							action = "pagechange";
						} else if (_.endX - _.startX < -40 && _.currpage < _.pagesize) {
							_.pageIndexRefresh(+1);
							action = "pagechange";
						} else {
							action = "pagenochange";
						}
						return action;
					}
				};

				break;
			default:
				break;
		}

		return animatemode;
	};

	p_s.prototype.pageIndexRefresh = function(direction) {
		this.direction = direction;
		this.currpage = this.currpage + direction;
		this.prevpage = this.currpage - 1;
		this.nextpage = this.currpage + 1;
	};

	// p_s.prototype.pagemove={
	// 	var _ = this,
	// 		animatemode = _.animatemodeclass(),
	// 		d = animatemode.d,
	// 		unit = animatemode.unit;
	// 		animatemode = animatemode.animatemode;

	// 	if(_.currpage !== 0){
	// 		animatemode(prev, d - unit, 0, 1);
	// 	}

	// 	animatemode(curr, 0, 0, 0);

	// 	//最后一页 禁止向下翻 
	// 	if(curr !== _.pagesize){
	// 		animatemode(next, d + unit, 0, 1);
	// 	}
	// }


	p_s.prototype.pagemovemode = function(action) {
		var _ = this,
			animatemode = _.animatemodeclass(),
			curr = _.currpage,
			prev = _.currpage - 1,
			next = _.currpage + 1,
			d = animatemode.d,
			unit = animatemode.unit;
		animatemode = animatemode.animatemode;

		switch (action) {
			case "pagemove":
				//拖动的时页面变化
				// console.log("pagemove pagemoving:" + _.pagemoving)
					//第一页 禁止向上翻 
				if(curr !== 0){
					animatemode(prev, d - unit, 0, 1);
				}

				animatemode(curr, 0, 0, 0);

				//最后一页 禁止向下翻 
				if(curr !== _.pagesize){
					animatemode(next, d + unit, 0, 1);
				}

				break;
			case "pageinit":
				//页面初始化

				$(".ps_page").each(function(index) {
					if (index < curr) {

						animatemode(index, -unit, 0, 1);

					} else if (index > curr) {

						animatemode(index, unit, 0, 1);

					} else {

						animatemode(index, 0, 0, 0);
					}

				});
				break;
			case "pagenochange":
				//拖动结束  页面动画
				//防止第一页 向上翻 会出现最后一张翻到最前的动画
				if(curr !== 0){
					animatemode(prev, -unit, 0.2, 1);
				}

				animatemode(curr, 0, 0.2, 0);

				animatemode(next, unit, 0.2, 1);

				_.pagemoving = 0;
				break;
			case "pagechange":
				$(".ps_page").eq(curr).on("webkitTransitionEnd", function() {
					$(".ps_page").eq(curr).off("webkitTransitionEnd");
					//若pagemoving=0,动画进行中touchmove的话动画结束后touchmove&touchend会继续
					_.pagemoving = 2;

					//翻页动画完成 终止上一页动画并清除 动画结束后样式
					if (_.direction===1) {
						_.clearAnimateClass(_.prevpage);
					}else{
						_.clearAnimateClass(_.nextpage);
					}
					//
					_.pageinneract();
				});
				animatemode(curr, 0, 0.5, 1);
				break;
			default:
				break;

		}
	};

	p_s.prototype.clearAnimateClass = function(pagenum) {
		$(".ps_page").eq(pagenum).children().each(function() {
			var classnames = this.className.match(/psanimate\w*/g);
			for (var i in classnames) {
				$(this).removeClass(classnames[i]);
			}
		});
		//清除.pagemainbtn的动画
		var classnames = $(".pagemainbtn")[0].className.match(/psanimate\w*/g);
		for (var i in classnames) {
			$(".pagemainbtn").removeClass(classnames[i]);
		}
	};



	p_s.prototype.pageinneract = function() {
		//.pagemainbtn z-index 特殊处理
		$(".pagemainbtn").css({"z-index":"2"});
		var _=this,
		currpage=$(".ps_page").eq(_.currpage);
		p_s_temp(currpage);
		// console.log(page)
	};

	return new p_s();
}]);








