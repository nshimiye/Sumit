
Template.postPage.helpers({
    comments: function() {
        return Comments.find({postId: this._id});
    },
    evidences: function() {
    console.log("evidence--", Evidences.find({postId: this._id}).count());
        return Evidences.find({postId: this._id});
    },
    spostid : function(){
    	return this._id;
    
    },
    isPostPage : function(){
    	// it is only userful when postPage template is caled inside another template
    	Template.postItem.isPostPage = true;
    	return true; //to be removed
    },
    innovate : function(){
    	return  Session.get("innovate");
    },
    evident : function(){
    	return  Session.get("evident");
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

