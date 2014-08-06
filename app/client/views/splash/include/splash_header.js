Template.splash_header.helpers({
	rendered: function(){
		
		Session.set("show_signin", true);
		Session.set("oprojects", false);
	},
	
	    activeRouteClass: function(/* route names */) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();

        var active = _.any(args, function(name) {
            return Router.current() && Router.current().route.name === name
        });

        return active && 'active';
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
	
	$(".login_here").animate(
		{height: "toggle"},
		0
	);
	
},
"click .new_post" : function(e){
		e.preventDefault();
		console.log("yes yes here ...");
		//
		
		//if(!Session.get("show_post_form")){ prevent new Post btn from closing the form
			
		 	$( "#for_psubmit" ).animate({
    			height: "toggle"
  			}, 1000, function() {
    		// Animation complete.
    			Session.set("show_post_form", true);	
  			});
	//}
	}

});
