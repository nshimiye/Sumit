//Adds posts key and postsData value and
//passing that object to the helperList function
Template.postsList.helpers({
    postsWithRank: function() {
    
    	// temporary fix here
    	// allw us to display title in "postlist" and then title-message in the postPage
    	var rt = Router.current({}).route.name
         	console.log(rt.toString());
        	rt = rt.toString();
        	Template.postItem.isPostPage = (rt.trim() === "postPage")? true : false;
        	
       //===================================
        	
        this.posts.rewind();
        return this.posts.map(function(post, index, cursor) {
         	
        
            post._rank = index;
            return post;
        });
    },
});
