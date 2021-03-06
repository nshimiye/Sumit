Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() { 
        return [Meteor.subscribe('notifications'),
        		Meteor.subscribe('categories'),
        		Meteor.subscribe('tags')
        ]; 
    }
});

//splash
SplashController = RouteController.extend({
	template: 'splash',
});

ProfileController = RouteController.extend({
	template: 'userProfile',
	 userPosts : new Meteor.Collection('userPosts'),
    userComments : new Meteor.Collection('userComments'),
    waitOn: function() {
   
        return [
        	Meteor.subscribe('userPosts'),
        	Meteor.subscribe('userComments'),
        	Meteor.subscribe('cfs.posts.filerecord')
        ];
    },

  action: function () {
    if (this.ready()){
      this.render();
    }else{
      this.render('loading');
    }
  },
    posts: function() {
    
    	
    	console.log(this.userPosts.find({}).count());
        return this.userPosts.find({});
    },
    postsFS: function() {

        return PostsFS.find({});
    },
    
    comments: function() {
    	
    	console.log(this.userComments.find().count());
        return this.userComments.find({});
    },
    totalPoints: function() {
        var cm = this.comments();
        var pts = 0;
        cm.forEach(function(comment){
        	pts += comment.votes;
        });
        
        var ps = this.posts();
        ps.forEach(function(post){
        	pts += post.votes;
        });
        
        return pts;
    },
    data: function() {
    	return {
    		posts: this.posts(),
    		comments: this.comments(),
            postsFS: this.postsFS(),
            points: this.totalPoints()
            
        };
    },
});


//Route Controller 
PostsListController = RouteController.extend({
    template: 'postsList',
    increment: 7,
    limit: function() {
        return parseInt(this.params.postsLimit) || this.increment;
    },
    findOptions: function() {
        return {sort: this.sort, limit: this.limit()};
    },
    waitOn: function() {
        return Meteor.subscribe('posts', this.findOptions());
    },
 	posts   : function() {
    	console.log("-----------============------00000000000---==============-", Posts.find({}));
        return Posts.find({}, this.findOptions());
    },
    data: function() {
        var hasMore = this.posts().count() === this.limit();
        var nextPath = this.route.path({postsLimit: this.limit() + this.increment});
        return {
            posts: this.posts(),
            oldOptions : this.findOptions(),
            nextPath: hasMore ? this.nextPath() : null
        };
    }
});

NewPostsListController = PostsListController.extend({
    sort: {submitted: -1, _id: -1},
    nextPath: function() {
        return Router.routes.newPosts.path({postsLimit: this.limit() + this.increment});
    }
});

OldPostsListController = PostsListController.extend({
    sort: {submitted: 1, _id: 1},
    nextPath: function() {
        return Router.routes.oldPosts.path({postsLimit: this.limit() + this.increment})
    }
});

BestPostsListController = PostsListController.extend({
    sort: {votes: -1, submitted: -1, _id: -1},
    nextPath: function() {
        return Router.routes.bestPosts.path({postsLimit: this.limit() + this.increment})
    }
});

// controversial -- to be fixed??????????
ControversialListController = PostsListController.extend({
    sort: {votes: -1, submitted: -1, _id: -1},
    nextPath: function() {
        return Router.routes.ControversialPosts.path({postsLimit: this.limit() + this.increment})
    }
});

Router.map(function() {

    this.route('home', {
        path: '/',
        controller: SplashController
    });

    this.route('newPosts', {
        path: '/new/:postsLimit?',
        controller: NewPostsListController
    });
    
    this.route('oldPosts', {
        path: '/old/:postsLimit?',
        controller: OldPostsListController
    });

    this.route('ControversialPosts', {
        path: '/votes1to1/:postsLimit?',
        controller: ControversialListController
    });

    this.route('bestPosts', {
        path: '/best/:postsLimit?',
        controller: BestPostsListController
    });

    this.route('postPage', {
        path: '/posts/:_id',
        waitOn: function() {
            return [
                Meteor.subscribe('singlePost', this.params._id),
                Meteor.subscribe('comments', this.params._id),
                Meteor.subscribe('evidences', this.params._id)
            ];
        },
        data: function() { return Posts.findOne(this.params._id); }
    });

    this.route('postEdit', {
        path: '/posts/:_id/edit',
        waitOn: function() {
            return Meteor.subscribe('singlePost', this.params._id);
        },
        data: function() { return Posts.findOne(this.params._id); }
    });

    this.route('postSubmit', {
        path: '/submit',
        disableProgress: true
    });
    
    //from J Walters
    this.route('splash', {
        path: '/splash'
    });
    
    //from J Walters
    this.route('signInPage', {
        path: '/signin'
    });
        //from Mars
    this.route('home_signup', {
        path: '/signup'
    });
    
    //from J Walters
    this.route('userProfile', {
        path: '/user',
        controller: ProfileController,
        options: function() {return Meteor.user();}
    });

     this.route('fileAddWrapper', {
        path: '/fileAdd'
    });


    this.route('article', {
        path: '/article/:_id',
        data: function() {
            return this.params;
        }
    });

    this.route('notAPath', {
        path: '*'
    });

});

var requireLogin = function(pause) {

console.log("===========0000000000000-------============", Meteor.user());

    if (! Meteor.user()) {
        if (Meteor.loggingIn())
            this.render(this.loadingTemplate);
        else
            this.render('accessDenied');

        this.stop();
    }
}

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {only: 'userProfile'});
Router.onBeforeAction(function() { Errors.clearSeen(); });
