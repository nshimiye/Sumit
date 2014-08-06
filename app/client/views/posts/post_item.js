var POST_HEIGHT = 80;
var Positions = new Meteor.Collection(null);
Template.postItem.helpers({
    ownPost: function() {
        return this.userId == Meteor.userId();
    },
    waitOn : function(){
    	allPOSTS.push(this._id);
    	
    },
    domain: function() {
        var a = document.createElement('a');
        a.href = this.url;
        return a.hostname;
    },
    postOpen : function(){
    	
    	return Session.get(this._id+"Open");
    },
    spostid : function(){
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
        if (userId && !_.include(this.upvoters, userId)) {
            return 'upvotable';
        } else {
            return 'disabled';
        }
    },
	downvotedClass: function() {
        var userId = Meteor.userId();
        if (userId && !_.include(this.downvoters, userId) ) {
            return 'downvotable';
        } else {
            return 'disabled';
        }
    },
    attributes: function() {
        var post = _.extend({}, Positions.findOne({postId: this._id}), this);
        var newPosition = post._rank * POST_HEIGHT;
        var attributes = {};
        if (_.isUndefined(post.position)) {
            attributes.class = 'post invisible';
        } else {
            var delta = post.position - newPosition;
            attributes.style = "top: " + delta + "px";
            if (delta === 0)
                attributes.class = "post animate"
        }
        Meteor.setTimeout(function() {
            Positions.upsert({postId: post._id}, {$set: {position: newPosition}})
        });
        return attributes;
    },
    
    cciTagnames: function(){
    	var ctr = Categories.findOne({nid: "cci"});

    	var tns = "";
    	
    	if(this.tags)
    	this.tags.forEach(function(id){ //we get tag id's here
    		var tag = Tags.findOne({_id: id});

    		if(tag.categoryId === ctr._id)
    			tns +=  tag.tagname+", ";
    		
    	});

    	return tns;

    },
     tgTagnames: function(){
    	var ctr = Categories.findOne({nid: "tg"});
    	
    	var tns = "";
    	
    	if(this.tags)
    	this.tags.forEach(function(id){ //we get tag id's here
    		var tag = Tags.findOne({_id: id});
    		
    		if(tag.categoryId === ctr._id)
    			tns +=  tag.tagname+", ";
    		
    	});

    	return tns;
    }

});

Template.postItem.events({
    'click .upvotable': function(e) {
        e.preventDefault();
        Meteor.call('upvote', this._id);
    },
    'click .downvotable': function(e) {
        e.preventDefault();
        Meteor.call('downvote', this._id);
    },
    
    
    "click .evidence" : function(e) {
        
        Session.set("evident", true); //evident = true
        Session.set("innovate", false);
           		var user = Meteor.user();
   		console.log("posts--", PostsFS.find({userId: user._id}).count());
    },
    "click .innovation" : function(e) {
        
        Session.set("innovate", true);//innovate = true
        Session.set("evident", false);
        
           		console.log("data-id", $(e.target).attr("data-id"));
   		console.log("data-id", $(e.target));
       
    },
     "click .comment" : function(e) {
        //e.preventDefault(); 
        Session.set("innovate", false);//innovate = true
        Session.set("evident", false);
    },
    
   "click .collapseit" : function(e){
   
   		//console.log("data-id", $(e.target).attr("data-id"));
   		//console.log("data-id", $(e.target));
   		if(Session.get(this._id+"Open")){
   			Session.set(this._id+"Open", false);
   			return true;
   		}
   
    	if($(e.target).attr("data-id") === this._id){
    		
				for(var i=0 ; i < allPOSTS.length; i++){
					var item = allPOSTS[i];
					console.log(item);
					Session.set(item+"Open", false);
				}
				
    		Session.set(this._id+"Open", true);
    		//$('#Post'+this._id).collapse({parent: "#accordion_post", toggle: true});
    	}
},
 
    	
    
});
