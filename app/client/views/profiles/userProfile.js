//need to subscribe to all of collections probably
Template.userProfile.helpers({

	renderMe : function(){
		var user = Meteor.user();
		console.log("ddd",user);
		if(!user){
			Router.go('signInPage', {});	
		}
		
	},
  focusAreas: function() {
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
    return 5125;
  },
  primaryRole: function() {
    return "Open Innovator";
  },
  level: function() {
    return 24;
  },
  home: function() {
    return "New York";
  },
  currentLoc: function() {
    return "New York";
  },
  nationality: function() {
    return "The Phillipines";
  },
  affiliations: function() {
    return "Mailman School of Public Health, Hip Hop Public Health, Sumit, Oberlin College Memorial Sloan Kettering Cancer Institute";
  },
  socialMedia: function() {
    return;
  },
  bio: function() {
    return "Niels is a public health data scientist who is working at the intersection of technology, human behavior, and health";
  },
  problemsPostedGlobal: function() {
    return 31;
  },
  commentsPostedGlobal: function() {
    return 145;
  },
  pointsEarnedGlobal: function() {
    return 156;
  },
  papersIndexed: function() {
    return 58;
  },
  papersAnnotated: function() {
    return 142;
  },
  papersUploaded: function() {
    return 14;
  },
  pointsEarnedLit: function() {
    return 156;
  },
  problemsPostedOpen: function() {
    return 31;
  },
  commentsPostedOpen: function() {
    return 31;
  },
  pointsEarnedOpen: function() {
    return 213;
  },
  contributions: function() {
    return [{name: "Concept Note 1", points: 1211}, {name: "Comment 1", points: 911}, {name: "Comment 2", points: 751}, {name: "Concept Note 1", points: 1211}, {name: "Comment 1", points: 911}, {name: "Comment 2", points: 751}, {name: "Concept Note 1", points: 1211}, {name: "Comment 1", points: 911}, {name: "Comment 2", points: 751}, {name: "Concept Note 1", points: 1211}, {name: "Comment 1", points: 911}, {name: "Comment 2", points: 751}, {name: "Comment 2", points: 751}];
  }
}); 
