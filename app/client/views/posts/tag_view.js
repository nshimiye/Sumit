var tags = {
	sortby : [{sid: "u", orderingKey: "Popular", tagRoute: "/best"}, {sid: "n", orderingKey: "New", tagRoute: "/new"}, 
		{sid: "o", orderingKey: "Old", tagRoute: "/old"}, 
		{sid: "c", orderingKey: "Controversial", tagRoute: "/votes1to1"}],
		
	ccIssues : [ {ccissue: "Logistics"}, { ccissue: "Physical Infrastructure"}, 
					{ ccissue: "Communications"}, { ccissue: "Social Context"},
					 { ccissue: "Politics"}, { ccissue: "Legislation"}, { ccissue: "Human Resources"}],
	
	themeGroups : [{themeGroup: "Macroeconomics, Population Dynamics, and Planetary Boundaries"},
	 				{themeGroup: "Reducing Poverty and Building Peace in Fragile Regions"},
	 				{themeGroup: "Social Inclusion"},{themeGroup: "Childhood Development"}, 
	 				{themeGroup: "Health for All"}, {themeGroup: "Decarbonization"}, {themeGroup: "Sustainable Agriculture"}]
	};
Template.tagView.helpers({
    orderingKeys: function() {
    
    	// temporary fix here
    	// allw us to display title in "postlist" and then title-message in the postPage
    	var rt = Router.current({}).route.name
         	console.log(rt.toString());
         	
       	//===================================
       	
       	if(typeof(tags.sortby[0].active) === "undefined")
      		tags.sortby[0].active = true; // add "active" attribute to new tag by defualt
      		
       	return tags.sortby;
    },
    ccIssues : function(){
    	
    	
    	var ctr = Categories.findOne({nid: "cci"});
    	var ts = Tags.find({categoryId: ctr._id});

    	return ts;
    },
    themeGroups : function(){
    	
    	var ctr = Categories.findOne({nid: "tg"});
    	var ts = Tags.find({categoryId: ctr._id});

    	return ts;
    }
});

Template.tagView.events({
	'click .sortby' : function (evt){
		
		var tagSID = evt.target.classList[1]; //we have 2 classes, so the 2 is the tag sid
		
		for(var i in tags.sortby){

			//evt.target.setAttribute("class", evt.target.className + " active");
			if(tags.sortby[i].sid.toString() === tagSID.toString()){
				tags.sortby[i].active = true;
			}else{
				tags.sortby[i].active = false;
			}
	
		}
		
	}
});

