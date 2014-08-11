Evidences = new Meteor.Collection('evidences');

Meteor.methods({
	nextEvidence: function(options) {
		
		var evidences = Evidences.find(options.query, options.attrs);
		
		var out = evidences.map(function(evidence, index, cursor) {
         	
		    		evidence._rank = index;
					
		  			return evidence;
       			});
		
		
		
		return out;
	},
    evidence: function(evidenceAttributes) {
        var user = Meteor.user();
        var post = Posts.findOne(evidenceAttributes.postId);
        //ensure the user is logged in
        if (!user)
            throw new Meteor.Error(401, "You need to login to add evidences");

        if(!evidenceAttributes.body)
            throw new Meteor.Error(402, "Please write some content");

        if(!post)
            throw new Meteor.Error(422, "You must add evidence on an existing Challenge");

        evidence = _.extend(_.pick(evidenceAttributes, 'postId', 'body'), {
            userId: user._id,
            author: user.username,
            submitted: new Date().getTime(),
            upvoters: [],
            downvoters: [],
            votes: 0
        });

        //update the post with the number of comments
        Posts.update(evidence.postId, {$inc: {evidencesCount: 1}});

        //create the comment, save the id
        evidence._id = Evidences.insert(evidence);

        //create a notification, informing the user that there's been a comment
        createevidenceNotification(evidence);

        return evidence._id;
    },
    
    upvoteEvidence: function(evidenceId) {
        var user = Meteor.user();
        //ensure the user is logger in
        if (!user)
            throw new Meteor.Error(401, "You need to login to upvote");

	
	// to be fixed

        Evidences.update({
            _id: evidenceId,
            upvoters: {$ne: user._id}
        }, {
            //adds an item to an array property as long as it doesn't already exist
            $addToSet: {upvoters: user._id},
            //increments an integer field
            $inc: {votes: 1}
        });
    },

    downvoteEvidence: function(evidenceId) {
        var user = Meteor.user();
        //ensure the user is logger in
        if (!user)
            throw new Meteor.Error(401, "You need to login to downvote");

        Evidences.update({
            _id: evidenceId,
            downvoters: {$ne: user._id}
        }, {
            //adds an item to an array property as long as it doesn't already exist
            $addToSet: {downvoters: user._id},
            //increments an integer field
            $inc: {votes: -1}
        });
    }
});
