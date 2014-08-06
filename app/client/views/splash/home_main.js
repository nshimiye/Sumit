 Template.home_main.helpers({
 
     waitOn: function() {
        return [
        	Meteor.subscribe('posts'),
        	Meteor.subscribe('cfs.posts.filerecord')
        ];
    },
 
 
 totalParticipants: function(e){
     	var allp = Posts.find({}), allU = [];
    	var unique = 0;
    	allp.forEach(function(post){
    	console.log(post);
    		if(allU.indexOf(post.userId) < 0){
        		unique += 1;
        		allU.push(post.userId);
        	}
        });
 		allU = [];
 	return unique;
 },
 totalPosts: function(e){
 	
 	return Posts.find({}).count();

 },
 endorsedProposals: function(e){
 	return PostsFS.find({}).count();
 }
 	
 });
