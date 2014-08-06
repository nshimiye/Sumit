var thispath = null;
Template.home_signup.helpers({
	regLogin: function(){
		var pathArray = window.location.pathname.split( "/" );
		var path = pathArray[1];
		console.log("-----------------------------------------------", path);
		thispath = path;
		return (path === "signin") || (path === "signup"); /*set to true if we not on the front page*/
	}
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
        	$(".serror").html("Password is at least 6 characters long");
        	return false;
        }
        
         if(password.trim() !== password_conf.trim()){
          console.log(" ===== in valid ---- in valid ===== ");
        	$(".serror").html("Password do not match");
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
            
            $(".serror").html(err.reason || "Please make sure your input is correct" );
          } else {
            // Success. Account has been created and the user
            // has logged in successfully.
           
            $(".login_here").css({display: "none"});
            if(thispath === "signup"){
            	Router.go('userProfile', {user: Meteor.user()});
            }

          }

        });

      return false;
	},
     
     "click .signin_caller" : function(e){
			e.preventDefault();
		console.log("==================", thispath);
		
		if(thispath === "signup" || (thispath === "signin")){
			Router.go('signInPage', {});
		}
		
		Session.set("show_signin", true);
	
	} ,
     
     "click .signout_caller" : function(e){
			e.preventDefault();
		
		Meteor.logout(function(){
			//update ui
			console.log("==========signout========");
			var pathArray = window.location.pathname.split( "/" );
			var path = pathArray[1];
			if(path === "user"){
				Router.go('signInPage', {});
			}else{
				
				$(".login_here").css(
					{display: "none"}
				);
			
			}
			
		})
		//delete all user information and then sign out
	} 

});
