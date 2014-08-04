//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var Template = Package.templating.Template;
var HTML = Package.htmljs.HTML;
var Spacebars = Package['spacebars-common'].Spacebars;

(function () {

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// packages/s3/client/template.blocks.js                                   //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
                                                                           // 1
Template.__define__("S3", (function() {                                    // 2
  var self = this;                                                         // 3
  var template = this;                                                     // 4
  return UI.InTemplateScope(template, Spacebars.include(function() {       // 5
    return template.__content;                                             // 6
  }));                                                                     // 7
}));                                                                       // 8
                                                                           // 9
/////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// packages/s3/client/events.js                                            //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
Template.S3.events({                                                       // 1
	'change input[type=file]': function (e,helper) {                          // 2
		var context = this || {};                                                // 3
                                                                           // 4
		if(helper.data && _.has(helper.data,"callback")){                        // 5
			var callback = helper.data.callback;                                    // 6
		} else {                                                                 // 7
			console.log("S3 Error: Helper Block needs a callback function to run"); // 8
			return                                                                  // 9
		}                                                                        // 10
                                                                           // 11
		var files = e.currentTarget.files;                                       // 12
		_.each(files,function(file){                                             // 13
			var reader = new FileReader;                                            // 14
			var fileData = {                                                        // 15
				name:file.name,                                                        // 16
				size:file.size,                                                        // 17
				type:file.type                                                         // 18
			};                                                                      // 19
                                                                           // 20
			reader.onload = function () {                                           // 21
				fileData.data = new Uint8Array(reader.result);                         // 22
				Meteor.call("S3upload",fileData,context,callback);                     // 23
			};                                                                      // 24
                                                                           // 25
			reader.readAsArrayBuffer(file);                                         // 26
                                                                           // 27
		});                                                                      // 28
	}                                                                         // 29
});                                                                        // 30
/////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.s3 = {};

})();

//# sourceMappingURL=780405154e792b881d20aee01840b3122faa5632.map
