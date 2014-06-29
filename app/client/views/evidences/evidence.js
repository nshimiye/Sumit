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
    canUpvote: function() {
        var userId = Meteor.userId();
        if (userId && _.include(this.upvoters, userId)) {
            return false;
        } else {
 
            return true;
        }
    },
});
