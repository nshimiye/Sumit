
Template.postPage.helpers({
	rendered: function(){
		
		Session.set("show_signin", true);
		
		Session.set("isProfile", false);
		
		Session.set("openProjects", true);
		
	},
    comments: function() {
        return Comments.find({postId: this._id});
    },
    evidences: function() {
    
    console.log("evidence--", Evidences.find({postId: this._id}).count());
    console.log("posts--", PostsFS.find().count());
    
        return Evidences.find({postId: this._id});
    },
    
    spostid : function(){
    	return this._id;
    
    },
    setPostPage : function(){
    	// it is only userful when postPage template is caled inside another template
    	Template.postItem.isPostPage = true;
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
    	if(Evidences.find({postId: this._id}).count() <= 0)
    		Session.set("noevidence", true);
    	else
    		Session.set("noevidence", false);
    	return  Session.get("evident");
    },
    
    noevidence : function(){
    	return Session.get("noevidence");
    }
});

Template.postPage.events({

	'click .loginTrigger': function(e){
		e.preventDefault();
		
	 		$(".login_here").animate(
			{height: "toggle"},
			500
		);
	 	
		return false;
	},
	
	
	'click .inPost1' : function(e){
	

	Session.set(this._id+"Open", true);
	var psd = this._id;console.log(psd);
	
	
	}
});

