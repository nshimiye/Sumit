Template.splash_header.events({

"click .login_btn" : function(e){
	e.preventDefault();
	
	$(".login_here").animate(
		{height: "toggle"},
		1000
	);
	
}

});
