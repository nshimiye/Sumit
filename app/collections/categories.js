Categories = new Meteor.Collection('categories');

Meteor.methods({
    categorie: function(categorieAttributes) {
        var user = Meteor.user();
        var post = Posts.findOne(categorieAttributes.postId);
        //ensure the user is logged in
        if (!user)
            throw new Meteor.Error(401, "You need to login to make categories");

        if(!categorieAttributes.body)
            throw new Meteor.Error(402, "Please write some content");

        if(!post)
            throw new Meteor.Error(422, "You must categorie on a Challenge");

        categorie = _.extend(_.pick(categorieAttributes, 'postId', 'body'), {
            userId: user._id,
            author: user.username,
            submitted: new Date().getTime(),
            upvoters: [],
            downvoters: [],
            votes: 0
        });

        //update the post with the number of categories
        Posts.update(categorie.postId, {$inc: {categoriesCount: 1}});

        //create the categorie, save the id
        categorie._id = Categories.insert(categorie);

        //create a notification, informing the user that there's been a categorie
        createCategorieNotification(categorie);

        return categorie._id;
    },
    
 
    
    
});
