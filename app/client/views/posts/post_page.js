Template.postPage.helpers({
    comments: function() {
        return Comments.find({postId: this._id});
    }
});

Template.postPage.events({

	'click .loginTrigger': function(e){
		e.preventDefault();
		
	 	$("#login-dropdown-list").addClass("open");
	 	console.log("tetst action");
		return false;
	}
});

