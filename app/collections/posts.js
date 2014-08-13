Posts = new Meteor.Collection('posts');

var imageStore = new FS.Store.S3("posts", {
  region: "my-s3-region", //optional in most cases
  accessKeyId: "", //required if environment variables are not set
  secretAccessKey: "", //required if environment variables are not set
  bucket: "fake", //required
  directory: '/uploads/images/',
  //ACL: myValue //optional, default is 'private', but you can allow public or secure access routed through your app URL
  // The rest are generic store options supported by all storage adapters
  //transformWrite: myTransformWriteFunction, //optional
  //transformRead: myTransformReadFunction, //optional
  maxTries: 1 //optional, default 5
});


//PostsFS = new Meteor.Collection('postsa');
//FS.HTTP.setBaseUrl('~/Documents/mapps/chamb/sumitRemote/Sumit/app/public');
PostsFS = new FS.Collection("posts", {
  stores: [imageStore]
});



PostsFS.allow({
  insert: function (userId, party) {
    return true;
  },
  update:  ownsDocument,
  remove:  ownsDocument
});




//allows posts on the client
Posts.allow({
    update: ownsDocument,
    remove: ownsDocument
});

//limiting edit capability on the client
Posts.deny({
    update: function(userId, post, fieldNames) {
        //may only edit the following two fields:
        return (_.without(fieldNames, 'url', 'title').length > 0);
    }
});

Meteor.methods({

	nextPosts: function(options) {
		
		var posts = Posts.find(options.query, options.attrs);
		
		var out = posts.map(function(post, index, cursor) {
         	
		    		post._rank = index;
					
		  			return post;
       			});
		
		
		
		return out;
	},

	search_post: function(postAttributes) {
		return Posts.find();
	},

    post: function(postAttributes) {
        var user = Meteor.user(),
            postWithSameLink = Posts.findOne({url: postAttributes.url});

        //ensure the user is logged in
        if (!user)
            throw new Meteor.Error(401, "You need to login to post new stories");

        //ensure the post has a title
        if (!postAttributes.title)
            throw new Meteor.Error(422, 'Please fill in a title');

 		//ensure the post has a message
        if (!postAttributes.message)
            throw new Meteor.Error(422, 'post body is required');

        //check that there are no previous posts with the same link === dead code
        if (postAttributes.url && postWithSameLink) {
            throw new Meteor.Error(302,
                'This link has already been posted',
                postWithSameLink._id);
        }

        //pick out the whitelisted keys
        var post = _.extend(_.pick(postAttributes, 'url', 'title', 'message', 'tags', 'links','files'), {
            title: postAttributes.title,
            userId: user._id,
            author: user.username,
            affiliate: "default-sumit", //to be fixed
            submitted: new Date().getTime(),
            commentsCount: 0,
            upvoters: [],
            downvoters: [],
            votes: 0
        });

        //wait for 0.5 seconds
        if (! this.isSimulation) {
            var Future = Npm.require('fibers/future');
            var future = new Future();
            Meteor.setTimeout(function() {
                future.return();
            }, 500);
            future.wait();
        }

        var postId = Posts.insert(post);

        return postId;
    },

    upvote: function(postId) {
        var user = Meteor.user();
        //ensure the user is logger in
        if (!user)
            throw new Meteor.Error(401, "You need to login to upvote");

		// to be fixed
        Posts.update({
            _id: postId,
            upvoters: {$ne: user._id}
        }, {
            //adds an item to an array property as long as it doesn't already exist
            $addToSet: {upvoters: user._id},
            $pull: {downvoters: user._id},
            //increments an integer field
            $inc: {votes: 1}
        });
        
        return Posts.findOne({_id: postId});
    },

    downvote: function(postId) {
        var user = Meteor.user();
        //ensure the user is logger in
        if (!user)
            throw new Meteor.Error(401, "You need to login to downvote");

        Posts.update({
            _id: postId,
            downvoters: {$ne: user._id}
        }, {
            //adds an item to an array property as long as it doesn't already exist
            $addToSet: {downvoters: user._id},
            $pull: {upvoters: user._id},
            //increments an integer field
            $inc: {votes: -1}
        });
        return Posts.findOne({_id: postId});
    },
        subscribe : function(postId) {
        var user = Meteor.user();
        //ensure the user is logger in
        if (!user)
            throw new Meteor.Error(401, "You need to login to subscribe");
		var check = Posts.findOne({_id : postId, subscribers : { $all: [user._id] }});
		console.log(check);
		if(!check){ //user not subscribed
			Posts.update({
            _id: postId,
            
        },{$addToSet: {subscribers: user._id}});
		}else{//user subscribed, so we remove them
		 Posts.update({
            _id: postId,
            
        },{
        $pull: {subscribers: user._id},
        });
		}
		
       return Posts.findOne({_id: postId});
    },
    //upload files here
     postFS: function(file) {
        var user = Meteor.user();
            // postWithSameLink = Posts.findOne({url: postAttributes.url});

        //ensure the user is logged in
        if (!user)
            throw new Meteor.Error(401, "You need to login to post new stories");
            // uploading starts here
      		PostsFS.insert(file, function (err, fileObj) {
        		//Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        		console.log("uploading ...", fileObj);
        		console.log("error ...", err);
      		});
        }
});
