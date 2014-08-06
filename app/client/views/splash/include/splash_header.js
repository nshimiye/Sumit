Template.splash_header.helpers({
	rendered: function(){
		
		Session.set("show_signin", true);
		Session.set("oprojects", false);
		Session.set("notuserpage", true);
		
		//make sure the login_area is closed
		$(".login_here").css(
				{display: "none"}
			);
		
	},
	activeRouteClass: function(/* route names */) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();

        var active = _.any(args, function(name) {
            return Router.current() && Router.current().route.name === name
        });

        return active && 'active';
    },
	notuserpage: function(){
		return Session.get("notuserpage");
	},
	show_signin: function(){
		return Session.get("show_signin");
	},
	oprojects: function(){
		return Session.get("oprojects");
	},
	userInfo: function(){
		var user = Meteor.user();	
	
		console.log("yes yes here ...", user);
	
		return user.profile.name;
	},
})

Template.splash_header.events({


"click .login_btn" : function(e){
	e.preventDefault();
	var pathArray = window.location.pathname.split( "/" );
	var path = pathArray[1];
	if(path !== "signin" && path !== "signup"){
		$(".login_here").animate(
			{height: "toggle"},
			0
		);
	}
},
"click .new_post" : function(e){
		e.preventDefault();
		console.log("yes yes here ...");
		//
		
		//if(!Session.get("show_post_form")){ prevent new Post btn from closing the form
			
		 	$( "#for_psubmit" ).animate({
    			height: "toggle"
  			}, 500, function() {
    		// Animation complete.
    			Session.set("show_post_form", true);	
  			});
	//}
	}

});
