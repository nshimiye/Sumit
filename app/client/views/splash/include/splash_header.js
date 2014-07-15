Template.splash_header.helpers({
	rendered: function(){
		
		Session.set("show_signin", true);
	},
	show_signin: function(){
		return Session.get("show_signin");
	}
})

Template.splash_header.events({


"click .login_btn" : function(e){
	e.preventDefault();
	
	$(".login_here").animate(
		{height: "toggle"},
		1000
	);
	
},

"click .signup_caller" : function(e){
	e.preventDefault();
	console.log("==================");
	Session.set("show_signin", false);
	
}

});
