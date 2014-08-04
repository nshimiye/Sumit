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
var FS = Package['cfs-base-package'].FS;
var Deps = Package.deps.Deps;
var check = Package.check.check;
var Match = Package.check.Match;
var DDP = Package.livedata.DDP;
var EJSON = Package.ejson.EJSON;
var EventEmitter = Package.emitter.EventEmitter;

/* Package-scope variables */
var _storageAdapters;

(function () {

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/cfs-storage-adapter/storageAdapter.client.js                         //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
// ############################################################################# // 1
//                                                                               // 2
// STORAGE ADAPTER                                                               // 3
//                                                                               // 4
// ############################################################################# // 5
                                                                                 // 6
_storageAdapters = {};                                                           // 7
                                                                                 // 8
FS.StorageAdapter = function(name, options, api) {                               // 9
  var self = this;                                                               // 10
                                                                                 // 11
  // Check the api                                                               // 12
  if (typeof api === 'undefined') {                                              // 13
    throw new Error('FS.StorageAdapter please define an api');                   // 14
  }                                                                              // 15
                                                                                 // 16
  // store reference for easy lookup by name                                     // 17
  if (typeof _storageAdapters[name] !== 'undefined') {                           // 18
    throw new Error('Storage name already exists: "' + name + '"');              // 19
  } else {                                                                       // 20
    _storageAdapters[name] = self;                                               // 21
  }                                                                              // 22
                                                                                 // 23
  // extend self with options and other info                                     // 24
  FS.Utility.extend(this, options || {}, {                                       // 25
    name: name                                                                   // 26
  });                                                                            // 27
                                                                                 // 28
  // XXX: TODO, add upload feature here...                                       // 29
  // we default to ddp upload but really let the SA like S3Cloud overwrite to    // 30
  // implement direct client to s3 upload                                        // 31
                                                                                 // 32
};                                                                               // 33
                                                                                 // 34
FS.StorageAdapter.prototype = new EventEmitter();                                // 35
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['cfs-storage-adapter'] = {};

})();

//# sourceMappingURL=a49b8b70c4af74ffe3a620ff073b1f511c8acc6e.map
