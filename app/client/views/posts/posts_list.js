allPOSTS = new Array(); //make it global
//Adds posts key and postsData value and
//passing that object to the helperList function
Template.postsList.helpers({
    postsWithRank: function() {

	// hide all innovations buttons
    for(var i=0 ; i < allPOSTS.length; i++){
				var item = allPOSTS[i];
				console.log(item);
					Session.set(item+"Open", false);
				}
				
    	// temporary fix here
    	// allw us to display title in "postlist" and then title-message in the postPage
    	var rt = Router.current({}).route.name
         	console.log(rt.toString());
        	rt = rt.toString();
        	Template.postItem.isPostPage = (rt.trim() === "postPage")? true : false;
        	Template.postItem.isPostList = (rt.trim() === "postList")? true : false;
       //===================================
        
        //this.posts.rewind();
        return this.posts.map(function(post, index, cursor) {
         	
            post._rank = index;
            //console.log(post);
            return post;
        });
    },
    show_submit : function(){
    	return Session.get("show_post_form");
    }
});
