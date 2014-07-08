Template.layout.helpers({
  pageTitle: function() { return Session.get('pageTitle'); },
    notOnIntro: function() { var pathArray = window.location.pathname.split( "/" );
		var path = pathArray[1];
		console.log("-----------------------------------------------", path);
		return path !== "splash" && (path !== ""); /*Or whatever this will be*/
	}
});
