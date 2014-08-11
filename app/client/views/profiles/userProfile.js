//need to subscribe to all of collections probably
Template.userProfile.helpers({
	rendered: function(){
		
		Session.set("show_signin", true);
		Session.set("isProfile", true);
		Session.set("openProjects", true);
	},
	profileImage: function(){
		return Session.get("pimage");
	},

	checkLogin : function(){
		var user = Meteor.user();
		if(!user){
			Router.go('signInPage', {});	
		}
		
		console.log("postsFS::::",FS);
		
		if(this.postsFS.count() > 0){
			var mapper = this.postsFS.map(
				function(i){
					console.log("postsFS:::name:",i);
					return i;
				}
			);
			var fileObj = mapper[0];
			console.log("postsFS:::out:",fileObj.copies);
			Session.set("pimage", "../../upload/postsFS/"+ fileObj.copies.posts.key);
		
		}else{
		
			//to be fixed though --this is set only if there is no profile image uploaded
			Session.set("pimage", "images/pholder.png");
		}
		
		
	},

  renderMe : function(){
    var user = Meteor.user();
    console.log("ddd",user);
    if(!user){
      Router.go('signInPage', {});  
    }

  },

  focusAreas: function() {
  	var user = Meteor.user();
   var fa = user.profile.focusAreas;
  	console.log(fa);
  	//if(!fa)
  		//return "no focus areas set for "+ user.profile.name;
    //return fa;
  
    return "Task-shifting • ICT for development • Agricultural Inputs • Obesity • Food Systems • Complex Systems Modelling • Technology • mHealth • Social Entrepreneurship • CSR";
    
    
  },
  name: function() {
  	var user = Meteor.user();
    return user.profile.name;
  },
  website: function() {
  	var user = Meteor.user();
  	var web = user.profile.website;
  	console.log(web);
  	if(!web)
  		return "no website for "+ user.profile.name;
    return web;
  },
  totalPoints: function() {
    return 9999;
  },
  primaryRole: function() {
    return "Open Innovator";
  },
  level: function() { //what is this
    return 99;
  },
  home: function() {
  var user = Meteor.user();
     	var h = user.profile.home;
  	console.log(h);
  	if(!h)
  		return "no home set for "+ user.profile.name;
    return h;
  },
  currentLoc: function() {
  	var user = Meteor.user();
    var cl = user.profile.currentLocation;
  	console.log(cl);
  	if(!cl)
  		return "no location set for "+ user.profile.name;
    return cl;
  },
  nationality: function() {
  	var user = Meteor.user();
   	var nt = user.profile.nationality;
  	console.log(nt);
  	if(!nt)
  		return "no nationality set for "+ user.profile.name;
    return nt;
  },
  affiliations: function() {
 	var user = Meteor.user();
    
    var afl = user.profile.affiliations;
  	console.log(afl);
  	if(!afl)
  		return "no affiliations set for "+ user.profile.name;
    return afl;
    
    
  },
  socialMedia: function() {
    return;
  },
  bio: function() {
  var user = Meteor.user();
    var b = user.profile.affiliations;
  	console.log(b);
  	if(!b)
  		return "no biography set for yet";
    return b;
  },
  	plist: function() {
		return Session.get("plist");
    },
  	evd: function() {
		return Session.get("evd");
    },
    cms: function() {
		return Session.get("cms");
    },
    allcomments: function() {
		return Session.get("allcomments");
    },
    allevidence: function() {
		return Session.get("allevidence");
    },
  problemsPostedGlobal: function() {
		return Session.get("problemsPostedGlobal");
    },
  commentsPostedGlobal: function() {

  	
    return this.comments.count();
  },
  pointsEarnedGlobal: function() { //need more info ???????????????
    return this.points;
  },
  papersIndexed: function() {
    return 999;
  },
  papersAnnotated: function() {
    return 999;
  },
  papersUploaded: function() {
    return 999;
  },
  pointsEarnedLit: function() {
    return 999;
  },
  problemsPostedOpen: function() { //define difference between global and open

    return this.posts.count();
    
    
    
  },
  commentsPostedOpen: function() {

    return this.comments.count();
  },
  pointsEarnedOpen: function() {
    return this.points;
  },
  contributions: function() { //what is this for sure
    return [
    
    		{name: "Concept Note 1", points: 1211}, 
    		{name: "Comment 1", points: 911}, 
    		{name: "Comment 2", points: 751}, 
    		{name: "Concept Note 1", points: 1211}, 
    		{name: "Comment 1", points: 911}, 
    		{name: "Comment 2", points: 751}, 
    		{name: "Concept Note 1", points: 1211}, 
    		{name: "Comment 1", points: 911}, 
    		{name: "Comment 2", points: 751}, 
    		{name: "Concept Note 1", points: 1211}, 
    		{name: "Comment 1", points: 911}, 
    		{name: "Comment 2", points: 751}, 
    		{name: "Comment 2", points: 751}
    		
    		];
  }
}); 




Template.userProfile.events({
/**
 * open file manager
 */
"click .cprofile" : function(e){
	e.preventDefault();
	$(".ifile").trigger("click");
	
},

"change .ifile" : function(e){
	e.preventDefault();
	
	 	$.each(e.currentTarget.files, function(i, file){
     		console.log(file.name);
     		
     		
     				var user = Meteor.user();
		var newFile = new FS.File(file);
      newFile.userId = user._id;

			var idd = PostsFS.insert(newFile, function (err, fileObj) {
			 
			 	console.log("post -- uploading ...", fileObj);
        		console.log("post -- error ...", err);
        		if(!err){
        			//we set a image updator session
        			Session.set("pimage", fileObj.data);
        		}
        			
			 
			 });
     		
     	
     	});
	
},



//user profile data control --- for posts
"click .myposts" : function(){

Session.set("evd", false);
Session.set("cms", false);
Session.set("plist", true);
Session.set("postsWithRank", []);
Session.set("loading", true);
		 mainOptions = {};
		mainOptions.query = { userId: Meteor.userId()};
		mainOptions.attrs = {limit : 10};
   			Meteor.call('nextPosts', mainOptions , function(error, allposts) {
   			
   			
   			
   				if(error){
   			//display error
   			console.log(error);
   			}else{
   				console.log(allposts);

       			Session.set("postsWithRank", allposts);
       			
   			}
   			Session.set("loading", false);
   			
   			});
},
"click .myupvotes" : function(){
Session.set("evd", false);
Session.set("cms", false);
Session.set("plist", true);
Session.set("postsWithRank", []);
Session.set("loading", true);
		 mainOptions = {};
		mainOptions.query = {upvoters : { $all: [Meteor.userId()] }};
		mainOptions.attrs = {limit : 10};
   			Meteor.call('nextPosts', mainOptions , function(error, allposts) {
   			
   			
   			
   				if(error){
   			//display error
   			console.log(error);
   			}else{
   				console.log(allposts);

       			Session.set("postsWithRank", allposts);
       			
   			}
   			Session.set("loading", false);
   			
   			});


// 

},
"click .mydownvotes" : function(){
Session.set("evd", false);
Session.set("cms", false);
Session.set("plist", true);
Session.set("postsWithRank",[]);
Session.set("loading", true);
 mainOptions = {};
		mainOptions.query = {downvoters : { $all: [Meteor.userId()] }};
		mainOptions.attrs = {limit : 10};
   			Meteor.call('nextPosts', mainOptions , function(error, allposts) {
   			
   			
   			
   				if(error){
   			//display error
   			console.log(error);
   			}else{
   				console.log(allposts);

       			Session.set("postsWithRank", allposts);
       			
   			}
   			Session.set("loading", false);
   			
   			});


	
},
"click .subscription" : function(){ //{subscribers: {$all : [user._id] }}

Session.set("evd", false);
Session.set("cms", false);
Session.set("plist", true);
Session.set("postsWithRank",[]);
Session.set("loading", true);
 mainOptions = {};
		mainOptions.query = {subscribers : { $all: [Meteor.userId()] }};
		mainOptions.attrs = {limit : 10};
   			Meteor.call('nextPosts', mainOptions , function(error, allposts) {
   			
   			
   			
   			if(error){
   				//display error
   				console.log(error);
   			}else{
   				console.log(allposts);
       			Session.set("postsWithRank", allposts);
       			
   			}
   				Session.set("loading", false);
   			
   			});

},

//user profile data control --- for posts
"click .myevidence" : function(){


Session.set("evd", true);
Session.set("cms", false);
Session.set("plist", false);
	
	Session.set("allevidence",[]);
Session.set("loading", true);
 mainOptions = {};
		mainOptions.query = { userId: Meteor.userId()};
		mainOptions.attrs = {limit : 10};
   			Meteor.call('nextEvidence', mainOptions , function(error, allcms) {
   			
   			
   			
   				if(error){
   			//display error
   			console.log(error);
   			}else{
   				console.log(allcms);

       			Session.set("allevidence", allcms);
       			
   			}
   			Session.set("loading", false);
   			
   			});
	
	
},
"click .mycomments" : function(){
Session.set("evd", false);

Session.set("plist", false);
Session.set("cms", true);

Session.set("allcomments",[]);
Session.set("loading", true);
 mainOptions = {};
		mainOptions.query = { userId: Meteor.userId()};
		mainOptions.attrs = {limit : 10};
   			Meteor.call('nextComments', mainOptions , function(error, allcms) {
   			
   			
   			
   				if(error){
   			//display error
   			console.log(error);
   			}else{
   				console.log(allcms);

       			Session.set("allcomments", allcms);
       			
   			}
   			Session.set("loading", false);
   			
   			});


}




});
