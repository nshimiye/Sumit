allPOSTS = new Array(); //make it global -- bad practice here ---- change it
var nextCount = 10; 
mainOptions = {};
//Adds posts key and postsData value and
//passing that object to the helperList function
Template.postsList.helpers({

	rendered: function(){
	
		mainOptions = {query: {}, attrs: this.data.oldOptions};
		Session.set("loading", false);
	
	
	    	var rt = Router.current({}).route.name;
        	rt = rt.toString();
        	console.log("rrrrrrrrrrrrrrtttttttttttttt", rt);
        	var rtCondition = (rt.trim() === "userProfile");
	
			var tmp_posts = this.posts;
		if(tmp_posts === undefined)
			tmp_posts = this.data.posts;
	var self = this;
	Session.set("isProfile", rtCondition); //since we call postList template inside userProfile

		Session.set("show_signin", true);
		
		Session.set("openProjects", true);
		
		var count = self.data.oldOptions || 10;
		if(count !== 10){
			count = count.limit;
		}
		$(window).scroll(function() {
		

   			if($(window).scrollTop() + $(window).height() === $(document).height()) {
   			
   			if(count > Session.get("postsWithRank").length){
   					return false;
   			}
   			
   			
   			Session.set("loading", true);
   			count += 5;
   			mainOptions.attrs.limit = count;
   			Meteor.call('nextPosts', mainOptions, function(error, allposts) {

   			
   			if(error){
   			//display error
   				console.log(error);
   			}else{
   				console.log(allposts);
   				
   				

       			Session.set("postsWithRank", allposts);
       			
       			
   			}
   			Session.set("loading", false);
   			
   			});
   			
   		
   			
   			
       	}
       
   		
	});

	
	  	tmp_posts.rewind();
	   	console.log("=====99999999999900000000000000000================", this.data);
        var ps = tmp_posts.map(function(post, index, cursor) {
         	
            post._rank = index;
            console.log(index);
            return post;
        });
		Session.set("postsWithRank", ps);
	 
		
	},
	isLoading: function(){return Session.get("loading");},

	getPosts: function(){
	// hide all innovations buttons
    for(var i=0 ; i < allPOSTS.length; i++){
				var item = allPOSTS[i];
				console.log(item);
					Session.set(item+"Open", false);
				}
				
    	// temporary fix here
    	// allw us to display title in "postlist" and then title-message in the postPage
    	var rt = Router.current({}).route.name;
         	console.log(rt.toString());
        	rt = rt.toString();
        	Template.postItem.isPostPage = (rt.trim() === "postPage")? true : false;
        	Template.postItem.isPostList = (rt.trim() === "postList")? true : false;
        	
       //===================================
        
        //this.posts.rewind();
        var ps = this.posts.map(function(post, index, cursor) {
         	
            post._rank = index;
            console.log(index);
            return post;
        });
		Session.set("postsWithRank", ps);
	},
    postsWithRank: function() {
		return Session.get("postsWithRank");
    },
    show_submit : function(){
    	return Session.get("show_post_form");
    },	
    isProfile: function(){
		return Session.get("isProfile");
	},
});
