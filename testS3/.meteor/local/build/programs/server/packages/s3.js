(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;

/* Package-scope variables */
var Knox, S3;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/s3/s3server.js                                                                            //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
Knox = Npm.require("knox");                                                                           // 1
var Future = Npm.require('fibers/future');                                                            // 2
                                                                                                      // 3
var knox;                                                                                             // 4
S3 = {};                                                                                              // 5
S3.config = {directory:"/"};                                                                          // 6
                                                                                                      // 7
Meteor.startup(function(){                                                                            // 8
	knox = Knox.createClient(S3.config);                                                                 // 9
});                                                                                                   // 10
                                                                                                      // 11
Meteor.methods({                                                                                      // 12
	S3upload:function(file,context,callback){                                                            // 13
		var future = new Future();                                                                          // 14
                                                                                                      // 15
		var extension = (file.name).match(/\.[0-9a-z]{1,5}$/i);                                             // 16
		file.name = Meteor.uuid()+extension;                                                                // 17
    var path = ( S3.config.directory === undefined || S3.config.directory === null) ? file.name : S3.config.directory+file.name;
                                                                                                      // 19
		var buffer = new Buffer(file.data);                                                                 // 20
                                                                                                      // 21
		knox.putBuffer(buffer,path,{"Content-Type":file.type,"Content-Length":buffer.length},function(e,r){ // 22
			if(!e){                                                                                            // 23
				future.return(path);                                                                              // 24
			} else {                                                                                           // 25
				console.log(e);                                                                                   // 26
			}                                                                                                  // 27
		});                                                                                                 // 28
                                                                                                      // 29
		if(future.wait() && callback){                                                                      // 30
			var url = knox.http(future.wait());                                                                // 31
			Meteor.call(callback,url,context);                                                                 // 32
			return url;                                                                                        // 33
		}                                                                                                   // 34
	},                                                                                                   // 35
	S3delete:function(path, callback){                                                                   // 36
		knox.deleteFile(path, function(e,r) {                                                               // 37
			if(e){                                                                                             // 38
				console.log(e);                                                                                   // 39
			}	else if(callback){                                                                               // 40
				Meteor.call(callback);                                                                            // 41
			}                                                                                                  // 42
		});                                                                                                 // 43
	}                                                                                                    // 44
});                                                                                                   // 45
                                                                                                      // 46
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.s3 = {
  Knox: Knox,
  S3: S3
};

})();
