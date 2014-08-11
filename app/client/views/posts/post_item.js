var POST_HEIGHT = 80;
var Positions = new Meteor.Collection(null);

function updateVotes(userId, obj){

		Session.set(obj._id+"_up", userId && _.include(obj.upvoters, userId));
		Session.set(obj._id+"_voteNumber", obj.votes);
		if(Session.get(obj._id+"_up")){
        	
        	Session.set(obj._id+"_upvotedClass", "disabled");
        	
        	
        }else{
       	
       		Session.set(obj._id+"_upvotedClass", "upvotable");
        }
        
        Session.set(obj._id+"_down", userId && _.include(obj.downvoters, userId));
     
        if(Session.get(obj._id+"_down")){
        	
        	Session.set(obj._id+"_downvotedClass", "disabled");
        }else{
       		
       		Session.set(obj._id+"_downvotedClass", "downvotable");
        }
        
       
    	
        
}

Template.postItem.helpers({

	rendered: function(){
		
		var userId = Meteor.userId();
		var self = this.data;
		Session.set(self._id+"Open", false);
		
		// Session.set("up", userId && _.include(this.upvoters, userId));
		updateVotes(userId, self);
		
		
    		Session.set(self._id+"_sbs", userId && _.include(self.subscribers, userId));
    
		
        $(".evidence").addClass("evidence_out");
        
        var rt = Router.current({}).route.name;
        rt = rt.toString();
        console.log("rrrrrrrrrrrrrrtttttttttttttt", rt);
        var rtCondition = (rt.trim() === "postPage");
        
        if(rtCondition)
        	$(".evidence").removeClass("evidence_out");
        
        	
	},
    ownPost: function() {
        return this.userId == Meteor.userId();
    },
    domain: function() {
        var a = document.createElement('a');
        a.href = this.url;
        return a.hostname;
    },
    spostid : function(){
    	return this._id;
    
    },
    voteNumber: function(){
    return Session.get(this._id+"_voteNumber");
        
    },
    up: function(){
    return Session.get(this._id+"_up");
        
    },
    down: function(){
    	return Session.get(this._id+"_down");
    	
    },
    sbs: function(){
    
    return Session.get(this._id+"_sbs");
    
    var userId = Meteor.userId();
    	if (userId && !_.include(this.subscribers, userId)) {
    		return false;
    	}
    	return true;
    },
	// we will have to edit this function
    upvotedClass: function() {
    	return Session.get(this._id+"_upvotedClass");
        var userId = Meteor.userId();
        if (userId && !_.include(this.upvoters, userId)) {
            return 'upvotable';
        } else {
            return 'disabled';
        }
    },
	downvotedClass: function() {
	
		return Session.get(this._id+"_downvotedClass");
	
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
    },

    formatDate: function() {
        var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May',
            'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var d = new Date(this.submitted);
        console.log(this.formatMonth);
        return ( months[d.getMonth()] + '-' + d.getDay() + '-' + d.getFullYear() );
    }
});

Template.postItem.events({
    'click .upvotable': function(e) {
        e.preventDefault();
        console.log(this._id);
        var self = this;
        Meteor.call('upvote', self._id, function(error, obj){
        	if(error){
        	console.log(error);
        	}
        	
         	var userId = Meteor.userId();
        	console.log(obj);
        	updateVotes(userId, obj);

        	 console.log(Session.get("up"));
        	 
        });
       return false;
    },
    'click .downvotable': function(e) { //
        e.preventDefault();
        console.log(this._id);
        Meteor.call('downvote', this._id, function(error, obj){
        	if(error){
        	console.log(error);
        	}
        	
         	var userId = Meteor.userId();
        	console.log(obj);
        	
			updateVotes(userId, obj);
        	
        });
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
    "click .subs" : function(e) {
        //e.preventDefault(); 
         e.preventDefault();
        
         	Meteor.call('subscribe', this._id, function(error, obj){
        	if(error){
        	console.log(error);
        	}
        	
         	var userId = Meteor.userId();
        	console.log(obj);
        	
			Session.set(obj._id+"_sbs", userId && _.include(obj.subscribers, userId));
        	
        });
         
         return false;
    },
   "click .collapseit" : function(e){
   
   		var rt = Router.current({}).route.name;
        	rt = rt.toString();
        	var rtCondition = (rt.trim() === "postPage");
        
        if(rtCondition){
        	return true;
        }
 
		var pitem = $(e.target).parents(".row");
   		pitem = $(pitem).children(".aside");
   		
   		var evidenceClasses = $($(pitem).children(".evidence")[0]).attr("class");
   		
   		if(evidenceClasses.search("evidence_out") < 0){ //remove if this panel is closing
   		
   			$($(pitem).children(".evidence")).addClass("evidence_out");
   			return true;
   			
   		}
   		
   		
   		
   		
   		console.log($($(pitem).children(".evidence")[0]).attr("class")); //

   		$(".evidence").addClass("evidence_out");
   		$($(pitem).children(".evidence")).removeClass("evidence_out");

    	
},
 
    	
    
});
