// Fixture data
if (Posts.find().count() === 0) {
    var now = new Date().getTime();

    //create three users
    var tomId = Meteor.users.insert({
        profile: { name: 'Tom Coleman' }
    });
    var tom = Meteor.users.findOne(tomId);

    var sachaId = Meteor.users.insert({
        profile: { name: 'Sacha Greif'}
    });
    var sacha = Meteor.users.findOne(sachaId);

    var nielsId = Meteor.users.insert({
        profile: { name: 'Niels Bantilan' }
    });
    var niels = Meteor.users.findOne(nielsId)

    var telescopeId = Posts.insert({
        title: 'Introducing Telescope',
        userId: sacha._id,
        author: sacha.profile.name,
        url: 'http://sachagreif.com/introducing-telescope/',
        submitted: now - 7 * 3600 * 1000,
        commentsCount: 2,
        upvoters: [], votes: 0
    });

    Comments.insert({
        postId: telescopeId,
        userId: tom._id,
        author: tom.profile.name,
        submitted: now - 5 * 3600 * 1000,
        body: 'Interesting project Sacha, can I get involved?'
    });

    Comments.insert({
        postId: telescopeId,
        userId: sacha._id,
        author: sacha.profile.name,
        submitted: now - 5 * 3600 * 1000,
        body: 'You sure can Tom!'
    });

    Comments.insert({
        postId: telescopeId,
        userId: niels._id,
        author: niels.profile.name,
        submitted: now - 4 * 3600 * 1000,
        body: 'How about me! I want to contribute!'
    });

    Posts.insert({
        title: 'Meteor',
        userId: tom._id,
        author: tom.profile.name,
        url: 'http://meteor.com',
        submitted: now - 10 * 3600 * 1000,
        commentsCount: 0,
        upvoters: [], votes: 0
    });

    Posts.insert({
        title: 'The Meteor Book',
        userId: tom._id,
        author: tom.profile.name,
        url: 'http://themeteorbook.com',
        submitted: now - 12 * 3600 * 1000,
        commentsCount: 0,
        upvoters: [], votes: 0
    });

    for (var i = 0; i < 10; i++) {
        Posts.insert({
            title: 'Test post #' + i,
            author: sacha.profile.name,
            userId: sacha._id,
            url: 'http://google.com/?g=test-' + i,
            submitted: now - i * 3600 * 1000,
            commentsCount: 0,
            upvoters: [], votes: 0
        });
    }
    
    
    
    var marsId = Meteor.users.insert({
        profile: { name: 'Marcellin Nshimiyimana' }
    });
    var mars = Meteor.users.findOne(marsId);
    
     var postId = Posts.insert({
        title: 'Difficulties of improving crop yields due to prohibitive land use policies',
        userId: mars._id,
        author: mars.profile.name,
        url: 'http://nshimiye.com',
        submitted: now - 7 * 3600 * 1000,
        commentsCount: 0,
        upvoters: [], votes: 54321
    });
    
     var postId = Posts.insert({
        title: 'Low adoption rate of sexual health behaviors because of gaps in communication and local involvement',
        userId: mars._id,
        author: mars.profile.name,
        url: 'http://nshimiye.com',
        submitted: now - 7 * 3600 * 1000,
        commentsCount: 0,
        upvoters: [], votes: 1256
    });


 var postId = Posts.insert({
        title: 'Limited and unreliable bednet distribution channels in malaria prevention programs',
        userId: mars._id,
        author: mars.profile.name,
        url: 'http://nshimiye.com',
        submitted: now - 7 * 3600 * 1000,
        commentsCount: 0,
        upvoters: [], votes: 1233
    });
    
    
     var postId = Posts.insert({
        title: 'Reduce potency of vaccines due to logical factors that prevent proper cold chain maintenance',
        userId: mars._id,
        author: mars.profile.name,
        url: 'http://nshimiye.com',
        submitted: now - 7 * 3600 * 1000,
        commentsCount: 0,
        upvoters: [], votes: 230
    });

 for (var i = 0; i < 10; i++) {
    var cid = Comments.insert({
        postId: postId,
        userId: sacha._id,
        author: sacha.profile.name,
        submitted: now - 5 * 3600 * 1000,
        body: 'Interesting project ---, can I get involved? counting ' + i
    });

    Posts.update(postId, {$inc: {commentsCount: 1}});
    
   }
}
