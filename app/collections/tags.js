Tags = new Meteor.Collection('tags');

Meteor.methods({
    tag: function(tagAttributes) {
        var user = Meteor.user();
        //ensure the user is logged in
        if (!user)
            throw new Meteor.Error(401, "You need to login to make tags");

        if(!tagAttributes.tagname)
            throw new Meteor.Error(402, "Please write some content");

        tag = _.extend(_.pick(tagAttributes, 'tagname', 'categoryId'), {
            userId: user._id,
        	//author: user.profile.name,
        	submitted: new Date().getTime()
        });

        //update the post with the number of tags
        //Posts.update(tag.postId, {$inc: {tagsCount: 1}});

        //create the tag, save the id
        tag._id = Tags.insert(tag);

        return tag;
    },
    
    upvoteTag: function(tagId) {
        var user = Meteor.user();
        //ensure the user is logger in
        if (!user)
            throw new Meteor.Error(401, "You need to login to upvote");

	
	// to be fixed

        Tags.update({
            _id: tagId,
            upvoters: {$ne: user._id}
        }, {
            //adds an item to an array property as long as it doesn't already exist
            $addToSet: {upvoters: user._id},
            //increments an integer field
            $inc: {votes: 1}
        });
    },

    downvoteTag: function(tagId) {
        var user = Meteor.user();
        //ensure the user is logger in
        if (!user)
            throw new Meteor.Error(401, "You need to login to downvote");

        Tags.update({
            _id: tagId,
            downvoters: {$ne: user._id}
        }, {
            //adds an item to an array property as long as it doesn't already exist
            $addToSet: {downvoters: user._id},
            //increments an integer field
            $inc: {votes: -1}
        });
    }
     
});
