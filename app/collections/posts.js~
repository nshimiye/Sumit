Posts = new Meteor.Collection('posts');
PostsFS = new FS.Collection("posts", {
  stores: [new FS.Store.FileSystem("posts", {path: "~/uploads"})]
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
            //increments an integer field
            $inc: {votes: 1}
        });
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
            //increments an integer field
            $inc: {votes: -1}
        });
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
