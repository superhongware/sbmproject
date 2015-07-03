SBMPS.factory('p_s_temp', ['p_s_anination','p_s_text',function(p_s_anination,p_s_text) {
	var p_s_temp = function(page,callback) {
		var temp = parseInt(page[0].className.match(/tmp\w*\s?/)[0].replace(/tmp/,''));

// alert(temp)
		//底部向上滑动小提示出现  参数规格购买出现
		function allpageanimate(){
			p_s_anination(page,".tapuptip","psanimateTapUpTip");

			callback();
		}
		switch(temp){
			case 0:
			    var a="";
			    p_s_text(temp,".ps_text1")?a="psanimate2":a="psanimateno";
				p_s_anination(page, ".ps_img1", "psanimate2", function() {
					p_s_anination(page, ".ps_img2", "psanimate15");
					p_s_anination(page, ".ps_text1", a);
					
					allpageanimate();
				});
				break;
			case 1:
				p_s_anination(page, ".ps_img1", "psanimate2", function() {
					allpageanimate();
				});
				break;
			case 2:
		      
                var a="";
			    p_s_text(temp,".ps_text3")?a="psanimate2":a="psanimateno";
				p_s_anination(page, ".ps_text1", "psanimate18");
				p_s_anination(page, ".ps_text2", "psanimate18", function() {
					p_s_anination(page, ".ps_text3", a);

					allpageanimate();

				});
				break;
			case 3:
				
			    var a=b="";
			    p_s_text(temp,".ps_text1")?a="psanimate8_1":a="psanimateno";
			    p_s_text(temp,".ps_text2")?b="psanimate8_1":b="psanimateno";
			    console.log(a)
				p_s_anination(page, ".ps_text1", a, function() {
					p_s_anination(page, ".ps_text2", b);
					
					allpageanimate();
				});
				break;
			case 4:
			    var a=b="";
			    p_s_text(temp,".ps_text1")?a="psanimateFadeInDown":a="psanimateno";
			    p_s_text(temp,".ps_text2")?b="psanimateFadeInDown":b="psanimateno";
				p_s_anination(page, ".ps_text1", a, function() {
					p_s_anination(page, ".ps_text2", b);
					
					allpageanimate();
				});
				break;
			case 5:
			
			    var a=b="";
			    p_s_text(temp,".ps_text1")?a="psanimateFadeInDown":a="psanimateno";
			    p_s_text(temp,".ps_text2")?b="psanimateFadeInDown_1":b="psanimateno";
			  
				p_s_anination(page, ".ps_img1", "psanimateFadeInDown_f", function() {
					  console.log(6666666)
					p_s_anination(page, ".ps_img2", "psanimateFadeInLeft_f",function(){
						p_s_anination(page, ".ps_img3", "psanimateFadeInRight_f",function(){
							p_s_anination(page, ".ps_text1", a);
							p_s_anination(page, ".ps_text2", b);
							
							allpageanimate();
						});
					});
				});
				break;
			case 6:
			    var a=b="";
			    p_s_text(temp,".ps_text1")?a="psanimateFadeInDown":a="psanimateno";
			    p_s_text(temp,".ps_text2")?b="psanimateFadeInDown":b="psanimateno";
				p_s_anination(page, ".ps_text1", a, function() {
					p_s_anination(page, ".ps_text2",b);
					
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
			case 8:
				p_s_anination(page, ".ps_btnwrap1", "psanimate22");
				p_s_anination(page, ".ps_btnwrap2", "psanimate23");
				p_s_anination(page, ".ps_btnwrap3", "psanimate24",function(){
					p_s_anination(page, ".ps_btnwrap2", "psanimate25",function(){
						p_s_anination(page, ".top_img", "psanimateFadeInDown_f",function(){
							p_s_anination(page, ".ps_text1", "psanimate8_1",function(){
								p_s_anination(page, ".ps_text2", "psanimate8_1");
								allpageanimate();
							});
						});
					});
				});
				
				break;
			case 9:
				p_s_anination(page, ".ps_btnwrap1", "psanimate22");
				p_s_anination(page, ".ps_btnwrap2", "psanimate23");
				p_s_anination(page, ".ps_btnwrap3", "psanimate24",function(){
					p_s_anination(page, ".ps_btnwrap3", "psanimate26",function(){
						p_s_anination(page, ".ps_text1", "psanimateFadeInDown", function() {
							p_s_anination(page, ".ps_text2", "psanimateFadeInDown");
							allpageanimate();
						});
					});
				});
				
			break;
			case 10:
				p_s_anination(page, ".sharewarp", "psanimate22", function() {
					p_s_anination(page, ".ps_text1", "psanimateFadeInDown", function() {
						p_s_anination(page, ".ps_text2", "psanimateFadeInDown");
						allpageanimate();
					});
				});
				break;
			 case 12:
			    var a=b=d=e="";
			    p_s_text(temp,".ps_text1")||p_s_text(temp,".ps_text2")?a="psanimateFadeInUpfix":a="psanimateno";
				p_s_text(temp,".ps_text3")?b="psanimateFadeInUpfix":b="psanimateno";
			    var c=function(){
			    	p_s_anination(page, ".ps_text1", "psanimateFadeInshow_f");
					p_s_anination(page, ".ps_text2", "psanimateFadeInshow_f");
					p_s_anination(page, ".ps_text3", "psanimateFadeInshow_f");
					allpageanimate();
			    }
			    a=="psanimateno"?d="":d=c;
			    b=="psanimateno"?e="":e=c;
			    p_s_anination(page, ".ps_text5", b,e);
			 	p_s_anination(page, ".ps_text4", a,d);
			
			 break;
			 case 13:
			
			 	p_s_anination(page, ".ps_text1", "psanimateFadeInDown", function() {
				    p_s_anination(page, ".ps_text2", "psanimateFadeInUp_f");
					allpageanimate();
			
			      });
				break;
			 case 14:
			    var a="";
				p_s_text(temp,".ps_text1")||p_s_text(temp,".ps_text2")||p_s_text(temp,".ps_text3")?a="psanimateFadeInLeft":a="psanimateno";
				
			 	p_s_anination(page, ".ps_img2", "psanimateFadeInRight", function() {
			 		
				    p_s_anination(page, ".ps_text4", a,function(){
				     p_s_anination(page, ".ps_text1", "psanimateFadeInUp_f");
				     p_s_anination(page, ".ps_text2", "psanimateFadeInUp_f");
				     p_s_anination(page, ".ps_text3", "psanimateFadeInUp_f",function(){
				     	p_s_anination(page, ".ps_text5", "psanimateFadeInDown");
				     	allpageanimate();
				     });
				     
				    });
					
			
			      });
				break;	
		    case 15:
			    var a="";
				p_s_text(temp,".ps_text4")||p_s_text(temp,".ps_text3")?a="1":a="0";
				if(a=="1"){
					p_s_anination(page, ".ps_text2", "psanimate18",function(){
				     p_s_anination(page, ".ps_text3", "psanimateFadeInUp_f");
				     p_s_anination(page, ".ps_text4", "psanimateFadeInDown_f",function(){
				     	p_s_anination(page, ".ps_text1", "psanimatelineWidth");
				     	p_s_anination(page, ".ps_text5", "psanimatelineWidth")
				     	allpageanimate();
				     });
				     
				   
					
			
			      });
				} 
				break;	
				case 16:
				var a=b="";
				p_s_text(temp,".ps_text1")?a="psanimate8_1":a="psanimateno";
				p_s_text(temp,".ps_text2")||p_s_text(temp,".ps_text3")?b="psanimate8_1":b="psanimateno";
				var c=function() {
				    p_s_anination(page, ".ps_text1", "psanimateFadeInDown_f",function(){
				     p_s_anination(page, ".ps_text2", "psanimateFadeInUp_f");
				     p_s_anination(page, ".ps_text3", "psanimateFadeInUp_f");	   
				     allpageanimate();
				    });
			     };
				
			    p_s_anination(page, ".ps_text4", a,c)
			 	p_s_anination(page, ".ps_text5", b,c);
				break;	
			default:
				console.log("default"+temp);
				break;
		}

	};

	var p_s_anination2 = function(classname, animate, callback) {

		var $dom = $(classname);
		$dom.addClass(animate);
		if(animate=="psanimateno"){
			if (typeof callback === "function") {
				callback();
			}
		}
		else{
			$dom.on("webkitAnimationEnd", function() {

			var $this = $(this);
			$this.off("webkitAnimationEnd");
			$this.addClass(animate + "end");
			if (typeof callback === "function") {
				callback();
			}

		});
		}
		
	};

	return p_s_temp;
}])

.factory('p_s_anination', function() {
	var p_s_anination = function(page, classname, animate, callback) {

		page.children(classname).addClass(animate);
		
        if(animate=="psanimateno"){
			if (typeof callback === "function") {
				callback();
			}
		}
        else{

		page.children(classname).on("webkitAnimationEnd", function() {
            
			$(this).off("webkitAnimationEnd");
			$(this).addClass(animate + "end");
			if (typeof callback === "function") {
				callback();
			}

		});
		 }
	};
	return p_s_anination;
}).factory('p_s_text', function() {
	var p_s_text=function(tmp,class){
	
		if($(".tmp"+tmp).find(class).text()==""){
			return false
		}
		return true
		
	}
	return p_s_text;
});