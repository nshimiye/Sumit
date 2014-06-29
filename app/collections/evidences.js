Evidences = new Meteor.Collection('evidences');

Meteor.methods({
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
            submitted: new Date().getTime()
        });

        //update the post with the number of comments
        Posts.update(evidence.postId, {$inc: {evidencesCount: 1}});

        //create the comment, save the id
        evidence._id = evidences.insert(evidence);

        //create a notification, informing the user that there's been a comment
        createevidenceNotification(evidence);

        return evidence._id;
    }
});
