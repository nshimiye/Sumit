Template.evidence.helpers({
    submittedText: function() {
    
    	var date = new Date(this.submitted);
    	
    	var d=date.getDate();
    	var m=date.getMonth()+1;
    	var y=date.getFullYear();
    	
        return m + " - " + d + " - " + y;
    },
    evdID : function(){
    
    	return this._id;
    
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

Template.evidence.events({
    'click .upvotable': function(e) {
        e.preventDefault();
        Meteor.call('upvoteEvidence', this._id);
    },
    'click .downvotable': function(e) {
        e.preventDefault();
        Meteor.call('downvoteEvidence', this._id);
    },
})

//get tags of this evidence
Template.mytags.helpers({

	mts : function(){
	
		return [
		{tag: "Vaccination"},{tag: " Cold Chain"},{tag: " Transportation "},
		{tag: " Technology"},
		{tag: "Logistics "},{tag: "Health "},{tag: " HIV/AIDS "},{tag: "Viruses"}


		];
	
	}

});
