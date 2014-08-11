Template.splash_header.helpers({
	activeRouteClass: function(/* route names */) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();

        var active = _.any(args, function(name) {
            return Router.current() && Router.current().route.name === name
        });

        return active && 'active';
    },

	rendered: function(){
		
		Session.set("show_signin", true);
		Session.set("isProfile", false);
		Session.set("openProjects", false);
		
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
	isProfile: function(){
		return Session.get("isProfile");
	},
	show_signin: function(){
		return Session.get("show_signin");
	},
	openProjects: function(){
		return Session.get("openProjects");
	},
	userInfo: function(){
		var user = Meteor.user();	
		console.log("yes yes here ...", user);
		return user.profile.name;
	},

    show_submit : function(){
        return Session.get("show_post_form");
    }
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
},
"click .cancel_new_post" : function(e){
        e.preventDefault();
        console.log("yes yes here ...")
        
        if(Session.get("show_post_form")){
         $( "#for_psubmit" ).animate({
            height: "toggle"
        }, 1000, function() {
            // Animation complete.
            Session.set("show_post_form", false);
        });
        }
        
    },

});
