if (Meteor.isClient) {

var Images = new FS.Collection("images", {
  stores: new FS.Store.FileSystem("images")
});

  Template.hello.greeting = function () {
    return "Welcome to test.";
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

Template.example.helpers({
	getimages: function(){
		return Session.get("myimages");
	}
});


Template.example.events({
  'change .myFileInput': function(event, template) {
    var files = event.target.files;
    console.log("You pressed the error button", files);
    for (var i = 0, ln = files.length; i < ln; i++) {
      Images.insert(files[i], function (err, fileObj) {
        //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        
         console.log("You pressed the error button", err);
        
        console.log("You pressed the success button", fileObj);
        
	
			 

    });
  }
  
  Meteor.call("getImages", {q: {}, attrs :{ limit : 10}}, function(err, objs){
	
	     console.log("You pressed the error button", err);
        
        console.log("You pressed the success button", objs);
		
		Session.set("myimages", objs);
	
	});
	
	}		
  
});



}

