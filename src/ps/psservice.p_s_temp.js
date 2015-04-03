SBMPS.factory('p_s_temp',['p_s_anination', function(p_s_anination){
	var p_s_temp=function(page){
		var temp=page[0].className.match(/tmp\w*\s?/)[0].replace(/tmp/,"");

		switch(temp){
			case "ht1":

				p_s_anination(page,".ps_img3","psanimate2",function(){
					p_s_anination(page,".ps_img2","psanimate15");
					p_s_anination(page,".ps_text1","psanimate2");
				});

			break;
			case "ht2":
				p_s_anination(page,".ps_text1","psanimate15");
				p_s_anination(page,".ps_text2","psanimate15",function(){
					p_s_anination(page,".ps_text3","psanimate2");
				});
			break;
			case "ht3":
				p_s_anination(page,".ps_text1","psanimate8_1",function(){
					p_s_anination(page,".ps_text2","psanimate8_1");
				});
			break;
			case "ht4":
				p_s_anination(page,".ps_text1","psanimateFadeInDown",function(){
					p_s_anination(page,".ps_text2","psanimateFadeInDown");
				});
			break;

			default:
				// console.log("1"+temp);

			break;
		}

	};
	return p_s_temp;
}])

.factory('p_s_anination', function(){
	var p_s_anination=function(page,classname,animate,callback){

				page.children(classname).addClass(animate);

				page.children(classname).on("webkitAnimationEnd",function(){

					$(this).off("webkitAnimationEnd");
					$(this).addClass(animate+"end");
					if(typeof callback === "function"){
						callback();
					}

				});

	};
	return p_s_anination;
});