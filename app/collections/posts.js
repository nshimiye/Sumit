Posts = new Meteor.Collection('posts');

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
    post: function(postAttributes) {
        var user = Meteor.user(),
            postWithSameLink = Posts.findOne({url: postAttributes.url});

        //ensure the user is logged in
        if (!user)
            throw new Meteor.Error(401, "You need to login to post new stories");

        //ensure the post has a title
        if (!postAttributes.title)
            throw new Meteor.Error(422, 'Please fill in a headline');

        //check that there are no previous posts with the same link
        if (postAttributes.url && postWithSameLink) {
            throw new Meteor.Error(302,
                'This link has already been posted',
                postWithSameLink._id);
        }

        //pick out the whitelisted keys
        var post = _.extend(_.pick(postAttributes, 'url', 'title', 'message'), {
            title: postAttributes.title,
            userId: user._id,
            author: user.username,
            submitted: new Date().getTime(),
            commentsCount: 0,
            upvoters: [],
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

        Posts.update({
            _id: postId,
            upvoters: {$ne: user._id}
        }, {
            //adds an item to an array property as long as it doesn't already exist
            $addToSet: {upvoters: user._id},
            //increments an integer field
            $inc: {votes: 1}
        });
    }
});