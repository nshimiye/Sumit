Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() { 
        return [Meteor.subscribe('notifications'),
        		Meteor.subscribe('categories'),
        		Meteor.subscribe('tags'),
        ]; 
    }
});

//splash
SplashController = RouteController.extend({
	template: 'splash',
});

ProfileController = RouteController.extend({
	template: 'userProfile',
    waitOn: function() {
        return [
        	Meteor.subscribe('posts'),
        	Meteor.subscribe('comments')
        ];
    },
    posts: function() {
    	var user = Meteor.user()
        return Posts.find({userId: user._id});
    },
    comments: function() {
    	var user = Meteor.user();
        return Comments.find({userId: user._id});
    },
    totalPoints: function() {
    	var user = Meteor.user();
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
    		user: Meteor.user(),
    		comments: this.comments(),
            posts: this.posts(),
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
    posts: function() {
        return Posts.find({}, this.findOptions());
    },
    data: function() {
        var hasMore = this.posts().count() === this.limit();
        var nextPath = this.route.path({postsLimit: this.limit() + this.increment});
        return {
            posts: this.posts(),
            nextPath: hasMore ? this.nextPath() : null
        };
    }
});

NewPostsListController = PostsListController.extend({
    sort: {submitted: -1, _id: -1},
    nextPath: function() {
        return Router.routes.newPosts.path({postsLimit: this.limit() + this.increment})
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
    
    //from J Walters
    this.route('userProfile', {
        path: '/user',
        controller: ProfileController
    });

});

var requireLogin = function(pause) {
    if (! Meteor.user()) {
        if (Meteor.loggingIn())
            this.render(this.loadingTemplate);
        else
            this.render('accessDenied');

        this.stop();
    }
}

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
Router.onBeforeAction(function() { Errors.clearSeen(); });
