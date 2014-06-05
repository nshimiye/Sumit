//Adds posts key and postsData value and
//passing that object to the helperList function
Template.postsList.helpers({
    postsWithRank: function() {
        this.posts.rewind();
        return this.posts.map(function(post, index, cursor) {
            post._rank = index;
            return post;
        });
    }
});