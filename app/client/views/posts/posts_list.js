allPOSTS = new Array(); //make it global
increm = 10; 
//Adds posts key and postsData value and
//passing that object to the helperList function
Template.postsList.helpers({

	rendered: function(){
		
		Session.set("oprojects", true);
		var rt = Router.current({}).route.name;
		Session.set("nuserpage", rt.trim() !== "userProfile");
		
		$(window).scroll(function() {
		
			console.log();
		
   			if($(window).scrollTop() + $(window).height() == $(document).height()) {
       		var ps = this.posts.map(function(post, index, cursor) {
         	if(index > increm)
		     	return;
		    post._rank = index;
			console.log(index);
		  	return post;
       	});
       ps.splice(ps.indexOf(undefined), ps.length);
		console.log(ps);
			increm = increm*2;
			Session.set("postsWithRank", ps);
   		}
	});
		
		
	},
	nuserpage: function(){
		return Session.get("nuserpage");
	},

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
    }
});
