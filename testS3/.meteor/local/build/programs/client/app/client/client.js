(function(){Images = new FS.Collection("images", {
  stores: [new FS.Store.S3("images",{bucket:"sumit_okr"})],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});

Meteor.subscribe("images");

Template.main.imagesCollection = function () {
  return Images;
};

Template.main.images = function () {
 
   return Images.find();
   
};

Template.main.events({
"click .in" : function(){

},
"change .myInputClass" : function(e){
	//e.preventDefault();
	
	var file1 = null;
	$.each(e.currentTarget.files, function(i,item){
		console.log(item);
		file1 = item;
	});
	
	var a = Images.insert(file1, function(out){
		console.log("client:", out);
	});
}



});



})();
