var psResults = new Array();

// set initial values for our autocomplete template
//Session.set("psResults", psResults);
Session.set("psResults", []);

Template.searchAutoComplete.helpers({

    postSearchResults: function() {
    	
        return Session.get("psResults");
       //===================================
    },
    waitOn : function(){
    	Meteor.subscribe('posts', {sort: {votes: -1, submitted: -1, _id: -1}});
    }
});
var myinput = null; // this help us capture the input element
Template.searchAutoComplete.events({
	
	'submit .searchForm' :function(e){ // don't allow the form to be submitted
		e.preventDefault();
		return false;
	},
	'keyup .postSearchInput' : function(e){
		e.preventDefault();
		myinput = e;
		// clear our session entry first
		Session.set("psResults", []);

       
        // search post with this given name
       
        var term = $(e.target).val();

      psResults = [];
      if(term.trim() !== ""){
      // may cause race conditions depending on how fast the user is typing
      Posts.find({}).map(function(post, index, cursor) {
         	
            post._rank = index; //??????
            
             if(post.title){

				var regex = new RegExp(term.trim(), 'i');

             var res = post.title.toString().match(regex);
             console.log(res);
            if(res !== null){
            		psResults.push({post_id : post._id, postSearch: post.title});
            		Session.set("psResults", psResults); // this will cause the template to reload
            
            	}
            }else 
            if(post.message){
            	var resm = post.message.toString().match(regex);
            	if(resm !== null){
            		psResults.push({post_id : post._id, postSearch: post.title});
            		Session.set("psResults", psResults); // this will cause the template to reload
            
            	}
            }
            
            return true; //to make sure we are returning
        });
        	
        }
       
	},
    'click .presult': function(e) {
        //e.preventDefault();
        console.log(e.target);
        if(myinput) $(myinput.target).val("");
        Session.set("psResults", []); //clear the session entry
        
    }
    
});
