
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

var myTransformWriteFunction = function(fileObj, readStream, writeStream){
	var rs = readStream.pipe(writeStream);
	  console.log("You pressed the error button", rs.toString());
	  
	  	var meteor_root = __meteor_bootstrap__;
				console.log(__meteor_bootstrap__.serverDir);
}

var myTransformReadFunction = function(){

}

var imageStore = new FS.Store.FileSystem("images", {
  path: "./app_files/images", //optional, default is "/cfs/files" path within app container
  transformWrite: myTransformWriteFunction, //optional
  transformRead: myTransformReadFunction, //optional
  maxTries: 1 //optional, default 5
});

var Images = new FS.Collection("images", {
  stores: [imageStore]
});

 Meteor.methods({
 
 	
 	getImages: function(options){
 	
 	
 	
 	var workingdir = __meteor_bootstrap__.serverDir;
 	
 		 var allimages = Images.find(options.q, options.attrs); 
        var mapper = allimages.map(
				function(item, id){
				
				var default_img = "df.png";
					if(item.copies){
					default_img = {"url" : workingdir+"app_files/images/"+item.copies.images.key};
				}
					return default_img;
				}
			);

 		return mapper;
 	}
 
 
 });



}
