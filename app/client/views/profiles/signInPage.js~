
var thispath = null;
Template.signInPage.helpers({


	regLogin: function(){
		var pathArray = window.location.pathname.split( "/" );
		var path = pathArray[1];
		thispath = path;
		console.log("-----------------------------------------------", path);
		return path === "signin" || (path === "signup"); /*Or whatever this will be*/
	}
});

Template.signInPage.events({

"click .cancel_login" : function(e){
	e.preventDefault();
	
	$(".login_here").animate(
		{height: "toggle"},
		500
	);
	
},

    'submit #login-form' : function(e){
      e.preventDefault();
      var email = $(e.target).find('[name=semail]').val()
        , password = $(e.target).find('[name=spassword]').val();
        // Trim and validate your fields here.... 

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Meteor.loginWithPassword(email, password, function(err){
        if (err) {
            // Inform the user that account creation failed
            console.log("failed",err);
            
            var msg = "Please provide all required input"; 
            
            if(err.error !== 400)
            	msg = err.reason;
            
            $(".serror").html(msg || "Please make sure your input is correct" );
          } else {
            // Success. Account has been created and the user
            // has logged in successfully.
            $(".login_here").css({display: "none"});
            if(thispath === "signin"){
            	Router.go('userProfile', {user: Meteor.user()});
            }
            
          }
          
      });
         return false; 
      },
     
     "click .signup_caller" : function(e){
			e.preventDefault();
		console.log("==================");
		if(thispath === "signin"){
			Router.go('home_signup', {});
		}
		
		Session.set("show_signin", false);
	
		},
     
     "click .signout_caller" : function(e){
		e.preventDefault();
		var pathArray = window.location.pathname.split( "/" );
		var path = pathArray[1];
		Meteor.logout(function(){
			//update ui
			console.log("==========signout========");
			console.log("==========signout========");

			$(".login_here").css(
				{display: "none"}
			);
			if(path === "user"){

				Router.go('signInPage', {});
			}
			
			
		});
		
	} 
      
      
  });
