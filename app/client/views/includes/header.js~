Template.header_alt.helpers({
    activeRouteClass: function(/* route names */) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();

        var active = _.any(args, function(name) {
            return Router.current() && Router.current().route.name === name
        });

        return active && 'active';
    },
    show_submit : function(){
    	return Session.get("show_post_form");
    }
});


Template.header_alt.events({
	"click .new_post" : function(e){
		e.preventDefault();
		console.log("yes yes here ...")
		//
		
		//if(!Session.get("show_post_form")){ prevent new Post btn from closing the form
			
		 	$( "#for_psubmit" ).animate({
    			height: "toggle"
  			}, 2000, function() {
    		// Animation complete.
    		Session.set("show_post_form", true);	
  			});
	//}
	}
});
