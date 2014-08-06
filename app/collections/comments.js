Comments = new Meteor.Collection('comments');

Meteor.methods({
    comment: function(commentAttributes) {
        var user = Meteor.user();
        var post = Posts.findOne(commentAttributes.postId);
        //ensure the user is logged in
        if (!user)
            throw new Meteor.Error(401, "You need to login to make comments");

        if(!commentAttributes.body)
            throw new Meteor.Error(402, "Please write some content");

        if(!post)
            throw new Meteor.Error(422, "You must comment on a Challenge");

        comment = _.extend(_.pick(commentAttributes, 'postId', 'body'), {
            userId: user._id,
            author: user.username,
            submitted: new Date().getTime(),
            upvoters: [],
            downvoters: [],
            votes: 0
        });

        //update the post with the number of comments
        Posts.update(comment.postId, {$inc: {commentsCount: 1}});

        //create the comment, save the id
        comment._id = Comments.insert(comment);

        //create a notification, informing the user that there's been a comment
        createCommentNotification(comment);

        return comment._id;
    },
    
    upvoteComment: function(commentId) {
        var user = Meteor.user();
        //ensure the user is logger in
        if (!user)
            throw new Meteor.Error(401, "You need to login to upvote");

	
	// to be fixed

        Comments.update({
            _id: commentId,
            upvoters: {$ne: user._id}
        }, {
            //adds an item to an array property as long as it doesn't already exist
            $addToSet: {upvoters: user._id},
            $pull: {downvoters: user._id},
            //increments an integer field
            $inc: {votes: 1}
        });
    },

    downvoteComment: function(commentId) {
        var user = Meteor.user();
        //ensure the user is logger in
        if (!user)
            throw new Meteor.Error(401, "You need to login to downvote");

        Comments.update({
            _id: commentId,
            downvoters: {$ne: user._id}
        }, {
            //adds an item to an array property as long as it doesn't already exist
            $addToSet: {downvoters: user._id},
            $pull: {upvoters: user._id},
            //increments an integer field
            $inc: {votes: -1}
        });
        
    }
    
    
});
