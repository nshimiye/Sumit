Meteor.publish('posts', function(options){
    return Posts.find({}, options)
});

Meteor.publish('userPosts', function(options){

console.log(this.userId);

    return Posts.find({userId: this.userId}, options);
});

Meteor.publish('userComments', function(options){
var nn = Comments.find({userId: this.userId}, options);
console.log(nn.count());
    return nn;
});

Meteor.publish('cfs.posts.filerecord', function(options){
    return PostsFS.find({}, options)
});

Meteor.publish('singlePost', function(id) {
    return id && Posts.find(id);
});

Meteor.publish('comments', function(postId){
    return Comments.find({postId: postId});
});
Meteor.publish('evidences', function(postId){
    return Evidences.find({postId: postId});
});

Meteor.publish('notifications', function() {
    return Notifications.find({userId: this.userId});
});

Meteor.publish('categories', function() {
    return Categories.find({});
});

Meteor.publish('tags', function() {
    return Tags.find({});
});

//Sidebar - Advanced Publications
