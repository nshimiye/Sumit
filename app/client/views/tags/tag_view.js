
var tags = {
	sortby : [{sid: "u", orderingKey: "Popular", tagRoute: "/best"}, {sid: "n", orderingKey: "New", tagRoute: "/new"}, 
		{sid: "o", orderingKey: "Old", tagRoute: "/old"}, 
		{sid: "c", orderingKey: "Controversial", tagRoute: "/votes1to1"}]
	};
var allTs = null;
Template.tagView.helpers({

	waitOn: function() { 
        Meteor.subscribe('posts', {sort: {submitted: 1}})
        
    },

    orderingKeys: function() {
    
    	// temporary fix here
    	// allw us to display title in "postlist" and then title-message in the postPage
    	var rt = Router.current({}).route.name
         	console.log(rt.toString());
         	
       	//===================================
       	
       	if(typeof(tags.sortby[0].active) === "undefined")
      		tags.sortby[0].active = true; // add "active" attribute to new tag by defualt
      		
       	return tags.sortby;
    },
    ccIssues : function(){
    	
    	var ctr = Categories.findOne({nid: "cci"});
    	var ts = Tags.find({categoryId: ctr._id});

    	return ts;
    },
    themeGroups : function(){
    	
    	var ctr = Categories.findOne({nid: "tg"});
    	var ts = Tags.find({categoryId: ctr._id});

    	return ts;
    },
    others : function(){
    	
    	var ctr = Categories.findOne({nid: "other"});
    	var ts = Tags.find({categoryId: ctr._id});

    	return ts;
    }
});

Template.tagView.events({
	'click .sortby' : function (evt){
		
		var tagSID = evt.target.classList[1]; //we have 2 classes, so the 2 is the tag sid
		
		for(var i in tags.sortby){

			//evt.target.setAttribute("class", evt.target.className + " active");
			if(tags.sortby[i].sid.toString() === tagSID.toString()){
				tags.sortby[i].active = true;
			}else{
				tags.sortby[i].active = false;
			}
	
		}
		
	},

	'click .tag-list': function(e){
		e.preventDefault();
		var tagId = $(e.target).attr("data-id");
		
		if(!tagId)
			return false;
	
	if(!allTs)
		allTs = new Array();
	

		
		var fw = ($(e.target).css("font-weight") === "bold")? "normal" : "bold";
		var fs = ($(e.target).css("font-size") === "16px")? "13px" : "16px" ;
		
		$(e.target).css({
			"font-weight": fw,
			"font-size": fs
		});
	
	var selected = ($(e.target).css("font-size") === "16px")? true : false;
	
	if(selected){
	 	//push element tag id
	 	allTs.push(tagId);
	}else{
		//slice element
		allTs.splice(allTs.indexOf(tagId), 1);
	}
	
	
	var ap = Posts.find({});
		console.log("tagging--", allTs);
		
		
		var allPosts = Posts.find({ tags: { $in: allTs  } } );
		console.log("tagging", allPosts.count());
		
		if(allPosts.count() === 0){
			
			allPosts = Posts.find({});
			
        }   
             console.log("taggingsssfsd", allPosts.count());
       //this.posts.rewind();
       var ps = allPosts.map(function(post, index, cursor) {
          post._rank = index;
         console.log(index);
           return post;
       });
       	ps.splice(ps.indexOf(undefined), ps.length);
		console.log(ps);
		
		Session.set("postsWithRank", ps);
		return false;
	}
		
});




