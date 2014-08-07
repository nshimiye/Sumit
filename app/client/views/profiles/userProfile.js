//need to subscribe to all of collections probably
Template.userProfile.helpers({
	rendered: function(){
		
		Session.set("oprojects", false);
		Session.set("notuserpage", false);
		Session.set("nuserpage", false);
	},
	profileImage: function(){
		return Session.get("pimage");
	},

	checkLogin : function(){
		
		if(!this.user){
			Router.go('signInPage', {});	
		}
		console.log("postsFS::::",FS);
		
		if(this.postsFS.count() > 0){
			var mapper = this.postsFS.map(function(i){
					console.log("postsFS:::name:", i );
					return i;
				});
			var fileObj = mapper[0];
			console.log("postsFS:::out:",fileObj.copies);

			
			Session.set("pimage", "../../upload/postsFS/"+ fileObj.copies.posts.key);
		
		}else{
		
			//to be fixed though --this is set only if there is no profile image uploaded
			Session.set("pimage", "images/pholder.png");
		}
		
		
	},
  focusAreas: function() {
  
   var fa = this.user.profile.focusAreas;
  	console.log(fa);
  	//if(!fa)
  		//return "no focus areas set for "+ this.user.profile.name;
    //return fa;
  
    return "Task-shifting • ICT for development • Agricultural Inputs • Obesity • Food Systems • Complex Systems Modelling • Technology • mHealth • Social Entrepreneurship • CSR";
    
    
  },
  name: function() {
  	
    return this.user.profile.name;
  },
  website: function() {
  	var web = this.user.profile.website;
  	console.log(web);
  	if(!web)
  		return "no website for "+ this.user.profile.name;
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
     	var h = this.user.profile.home;
  	console.log(h);
  	if(!h)
  		return "no home set for "+ this.user.profile.name;
    return h;
  },
  currentLoc: function() {
     	var cl = this.user.profile.currentLocation;
  	console.log(cl);
  	if(!cl)
  		return "no location set for "+ this.user.profile.name;
    return cl;
  },
  nationality: function() {
     	var nt = this.user.profile.nationality;
  	console.log(nt);
  	if(!nt)
  		return "no nationality set for "+ this.user.profile.name;
    return nt;
  },
  affiliations: function() {
 
    
    var afl = this.user.profile.affiliations;
  	console.log(afl);
  	if(!afl)
  		return "no affiliations set for "+ this.user.profile.name;
    return afl;
    
    
  },
  socialMedia: function() {
    return;
  },
  bio: function() {
    var b = this.user.profile.affiliations;
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
  problemsPostedGlobal: function() {
		return Session.get("problemsPostedGlobal");
    },
	allcomments: function() {
		return Session.get("allcomments");
    },
	allevidence: function() {
		return Session.get("allevidence");
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

var all = this.posts.map(
				function(post, index, cursor){
					console.log("postsFS:::name:",post);
					return post;
				}
			);
Session.set("evd", false);
Session.set("cms", false);
Session.set("plist", true);

	Session.set("postsWithRank", all);
},
"click .myupvotes" : function(){

var all = this.ups.map(
				function(post, index, cursor){
					console.log("postsFS:::name:",post);
					return post;
				}
			);
Session.set("evd", false);
Session.set("cms", false);
Session.set("plist", true);

	Session.set("postsWithRank", all);
},
"click .mydownvotes" : function(){

var all = this.downs.map(
				function(post, index, cursor){
					console.log("postsFS:::name:",post);
					return post;
				}
			);

Session.set("evd", false);
Session.set("cms", false);
Session.set("plist", true);
	Session.set("postsWithRank", all);
},
"click .subscription" : function(){

var all = this.subs.map(
				function(post, index, cursor){
					console.log("postsFS:::name:",post);
					return post;
				}
			);
Session.set("evd", false);
Session.set("cms", false);
Session.set("plist", true);

	Session.set("postsWithRank", all);
},

//user profile data control --- for posts
"click .myevidence" : function(){

var all = this.evidences.map(
				function(post, index, cursor){
					console.log("postsFS:::name:",post);
					return post;
				}
			);

Session.set("evd", true);
Session.set("cms", false);
Session.set("plist", false);
	Session.set("allevidence", all);
},
"click .mycomments" : function(){
console.log("posts:::name:",this.comments.count());
var all = this.comments.map(function(comment, index, cursor){
					console.log("postsFS:::name:",comment);
					return comment;
				});

Session.set("evd", false);
Session.set("cms", true);
Session.set("plist", false);
	Session.set("allcomments", all);
}



});
