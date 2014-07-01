Template.comment.helpers({
    submittedText: function() {
       	var date = new Date(this.submitted);
    	console.log("vote =====>", this);
    	var d=date.getDate();
    	var m=date.getMonth()+1;
    	var y=date.getFullYear();
    	
        return m + " - " + d + " - " + y;
    },
    up: function(){
    var userId = Meteor.userId();
        if (userId && _.include(this.upvoters, userId)) {
        	
            return true;
        } else{
        	
        	return false;
        }
    },
    down: function(){
    	var userId = Meteor.userId();
        if (userId && _.include(this.downvoters, userId)) {
        	
            return true;
        }else{
        
        	return false;
        } 
        
    },
	// we will have to edit this function
    upvotedClass: function() {
        var userId = Meteor.userId();
        if (userId && !_.include(this.upvoters, userId) && !_.include(this.downvoters, userId)) {
            return 'upvotable';
        } else {
            return 'disabled';
        }
    },
	downvotedClass: function() {
        var userId = Meteor.userId();
        if (userId && !_.include(this.downvoters, userId) && !_.include(this.upvoters, userId)) {
            return 'downvotable';
        } else {
            return 'disabled';
        }
    },
});


Template.comment.events({
    'click .upvotable': function(e) {
        e.preventDefault();
        console.log("e =====>", e);
        Meteor.call('upvoteComment', this._id);
    },
    'click .downvotable': function(e) {
        e.preventDefault();
        Meteor.call('downvoteComment', this._id);
    },
})

