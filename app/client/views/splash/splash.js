var posts = null;
Template.splash.helpers({
	init: function(){
		posts = this.posts;
		postsFS = this.postsFS;
	},
 	rendered : function(){
 	
 		Session.set("oprojects", false);
 	
 		$("#fullpage").fullpage({
            	menu: '#menufl',
            	anchors: ['shome', 'svision', 'smission'],
            	sectionsColor: ['#f3f3f3', '#f3f3f3', '#f3f3f3'],
            	autoScrolling: false
            });
	
	        //slide to sinup page -- uses  fullpage library function
            $(".signup").click(function (){
            	$.fn.fullpage.moveSlideRight();
            });

            // slide down to next main page
            $(".s_down").click(function (){
            	$.fn.fullpage.moveSectionDown();
            });


            //getting dimension of main holder/wrapper
            var W = $(".fp-tableCell").outerWidth();
            var H = $(".fp-tableCell").outerHeight();

            // positioning the vision elements
            //video here
            var  w = $(".vision_explain").outerWidth();
            var  h = $(".vision_explain").outerHeight();
            console.log("W", W);
            var x = (W/2) - (w/2);
            $(".vision_explain").css({
            top: 0,
            left: x+"px",
            height: h+"px"
            });

            // player_btn
            w = $(".player_btn").outerWidth();
            h = $(".player_btn").outerHeight();
            console.log("W", W);
            var y = (H/2) - (h/2);
            x = (W/2) - (w/2);
            $(".player_btn").css({
            top: y+"px",
            left: x+"px"
            });

            // motto
            w = $(".motto").outerWidth();
            y += 4*y/5; 
            console.log("W", W);
            x = (W/2) - (w/2);
            $(".motto").css({
            top: y+"px",
            left: x+"px"
            });


            //positioning the mission div

            w = $(".mission_holder").outerWidth();
            h = $(".mission_holder").outerHeight();
            console.log("W", W);
            y = (H/2) - (h/2);
            x = (W/2) - (w/2);
            $(".mission_holder").css({
            top: y+"px",
            left: x+"px"
            });

			w = $(".s_down").outerWidth();
			x = (W/2) - (w/2);
			y = H-40;
 			$(".s_down").css({
            top: y+"px",
            left: x+"px"
            });

            // positioning 


		
			//playing video here

            $(".player_btn").mouseover(function(){
            $(this).attr({src: "assets/img/splayer_hover.png"});
            });
            $(".player_btn").mouseout(function(){
            $(this).attr({src: "assets/img/splayer.png"});
            });

            $(".player_btn").click(function(){
            //here we load the video and play it
            // before we have to get rid of replacement stuff though -- motto, sglobe ...
            $(this).hide();
            // ....
            });

			$(".svision_btn").click(function(){
	
				$.fn.fullpage.moveTo(2, 0);
			 });
			 
			 $(".smission_btn").click(function(){
	
				$.fn.fullpage.moveTo(3, 0);
			 });
			 
			 $(".shome_btn").click(function(){
	
				$.fn.fullpage.moveTo(1, 0);
			 });
	
	}
});




//============================

