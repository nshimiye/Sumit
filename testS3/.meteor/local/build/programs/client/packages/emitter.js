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
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;

/* Package-scope variables */
var EventEmitter;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/emitter/emitter.client.js                                //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
EventEmitter = function() {                                          // 1
                                                                     // 2
  // Check that the user uses "new" keyword for api consistency      // 3
  if (!(this instanceof EventEmitter))                               // 4
    throw new Error('EventEmitter missing "new" keyword');           // 5
                                                                     // 6
  // Use the jQuery api                                              // 7
  var eventEmitter = $({});                                          // 8
                                                                     // 9
  // Limit scope by wrapping on and emit                             // 10
  var api = {                                                        // 11
    on: function eventEmitter_on(eventName, callback) {              // 12
      return eventEmitter.on(eventName, function() {                 // 13
        var args = Array.prototype.slice.call(arguments);            // 14
        var evt = args.shift();                                      // 15
        callback.apply(evt, args);                                   // 16
      });                                                            // 17
    },                                                               // 18
    once: function eventEmitter_one(eventName, callback) {           // 19
      return eventEmitter.one(eventName, function() {                // 20
        var args = Array.prototype.slice.call(arguments);            // 21
        var evt = args.shift();                                      // 22
        callback.apply(evt, args);                                   // 23
      });                                                            // 24
    },                                                               // 25
    emit: function eventEmitter_emit() {                             // 26
      var args = Array.prototype.slice.call(arguments);              // 27
      var eventName = args.shift();                                  // 28
      return eventEmitter.triggerHandler(eventName, args);           // 29
    },                                                               // 30
    off: function eventEmitter_off() {                               // 31
      return eventEmitter.off.apply(eventEmitter, arguments);        // 32
    },                                                               // 33
  };                                                                 // 34
                                                                     // 35
  // Add api helpers                                                 // 36
  api.addListener = api.on;                                          // 37
  api.removeListener = api.off;                                      // 38
  api.removeAllListeners = api.off;                                  // 39
                                                                     // 40
  // Add jquery like helpers                                         // 41
  api.one = api.once;                                                // 42
  api.trigger = api.emit;                                            // 43
                                                                     // 44
  return api;                                                        // 45
};                                                                   // 46
                                                                     // 47
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.emitter = {
  EventEmitter: EventEmitter
};

})();

//# sourceMappingURL=f225616e5880daafeee12b37444d64ef1b9052e3.map
