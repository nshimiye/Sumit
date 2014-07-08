Template.home_signup.helpers({

});

var isValidPassword = function(val, field) {
    if (val.length >= 6) {
      return true;
    } else {
      Session.set('displayMessage', 'Error &amp; Too short.')
      return false; 
    }
}


Template.home_signup.events({

    'submit #register-form' : function(e) {
      e.preventDefault();
      var email = $(e.target).find('[name=semail]').val()
        , password = $(e.target).find('[name=spassword]').val()
        , password_conf = $(e.target).find('[name=spassword_confirm]').val()
        , fname = $(e.target).find('[name=sname]').val();

        // Trim and validate the input
        email = email.trim();
        var uname = email.split("@");
        // here we need to validate email first
        var valid = isValidPassword(password.trim());
        
        if(!valid){
        	$(".serror").html("Oops! wrong password, it has to be at least 6 characters");
        	return false;
        }
        
         if(password.trim() !== password_conf.trim()){
          console.log(" ===== in valid ---- in valid ===== ");
        	$(".serror").html("Oops! password do not match");
        	return false;
        }
        
        console.log(" ===== success ---- error ===== ", uname);
        
        
	Accounts.createUser({ 
	username : uname[0],
	email: email,
	password : password,
	profile: {
		name: fname
	}
	
	}, function(err){
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
