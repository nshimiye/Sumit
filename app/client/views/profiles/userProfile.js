//need to subscribe to all of collections probably
Template.userProfile.helpers({
	rendered: function(){
		
		Session.set("oprojects", false);
		Session.set("notuserpage", false);
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
  problemsPostedGlobal: function() {
    return this.posts.count();
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
	
}

});
