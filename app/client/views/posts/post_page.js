
Template.postPage.helpers({
    comments: function() {
    console.log(Comments.find({postId: this._id}).count());
        return Comments.find({postId: this._id});
    },
    spostid : function(){
    	return this._id;
    
    },
    waitOn : function(){
    	allPOSTS.push(this._id);
    	Meteor.subscribe('comments', this._id)
    }
});

Template.postPage.events({

	'click .loginTrigger': function(e){
		e.preventDefault();
		
	 	$("#login-dropdown-list").addClass("open");
	 	
		return false;
	},
	
	
	'click .inPost1' : function(e){
	
	//close all posts
	$.each(allPOSTS, function(i, item){
		Session.set(item, false);
	});
	Session.set(this._id+"Open", true);
	var psd = this._id;console.log(psd);
	
	
	}
});

