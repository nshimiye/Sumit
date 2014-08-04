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
var HTTP = Package['http-methods'].HTTP;

/* Package-scope variables */
var _publishHTTP;

(function () {

///////////////////////////////////////////////////////////////////////////
//                                                                       //
// packages/http-publish/http.publish.client.api.js                      //
//                                                                       //
///////////////////////////////////////////////////////////////////////////
                                                                         //
// Client-side is not implemented                                        // 1
HTTP.publish = function() {                                              // 2
  throw new Error('HTTP.publish not implemented on client-side');        // 3
};                                                                       // 4
                                                                         // 5
HTTP.publishFormats = function() {                                       // 6
  throw new Error('HTTP.publishFormats not implemented on client-side'); // 7
};                                                                       // 8
                                                                         // 9
HTTP.unpublish = function() {                                            // 10
  throw new Error('HTTP.unpublish not implemented on client-side');      // 11
};                                                                       // 12
                                                                         // 13
///////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['http-publish'] = {
  _publishHTTP: _publishHTTP
};

})();

//# sourceMappingURL=37b76c0de8a812e04bd2c5fa1019ba41718103d0.map
