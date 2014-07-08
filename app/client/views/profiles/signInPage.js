

Template.signInPage.helpers({


	regLogin: function(){
		var pathArray = window.location.pathname.split( "/" );
		var path = pathArray[1];
		console.log("-----------------------------------------------", path);
		return path !== "splash" && (path !== ""); /*Or whatever this will be*/
	}
});

Template.signInPage.events({

"click .cancel_login" : function(e){
	e.preventDefault();
	
	$(".login_here").animate(
		{height: "toggle"},
		1000
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
            $(".serror").html("Oops! problem occured, check your input");
          } else {
            // Success. Account has been created and the user
            // has logged in successfully.
            Router.go('userProfile', {user: Meteor.user()});
          }
          
      });
         return false; 
      }
  });
