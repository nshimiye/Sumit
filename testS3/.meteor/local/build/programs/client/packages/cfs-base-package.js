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
var Deps = Package.deps.Deps;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;

/* Package-scope variables */
var FS, _Utility;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/cfs-base-package/base-common.js                                                                          //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// Exported namespace                                                                                                // 1
FS = {};                                                                                                             // 2
                                                                                                                     // 3
// namespace for adapters; XXX should this be added by cfs-storage-adapter pkg instead?                              // 4
FS.Store = {                                                                                                         // 5
  GridFS: function () {                                                                                              // 6
    throw new Error('To use FS.Store.GridFS, you must add the "cfs-gridfs" package.');                               // 7
  },                                                                                                                 // 8
  FileSystem: function () {                                                                                          // 9
    throw new Error('To use FS.Store.FileSystem, you must add the "cfs-filesystem" package.');                       // 10
  },                                                                                                                 // 11
  S3: function () {                                                                                                  // 12
    throw new Error('To use FS.Store.S3, you must add the "cfs-s3" package.');                                       // 13
  }                                                                                                                  // 14
};                                                                                                                   // 15
                                                                                                                     // 16
// namespace for access points                                                                                       // 17
FS.AccessPoint = {};                                                                                                 // 18
                                                                                                                     // 19
// namespace for utillities                                                                                          // 20
FS.Utility = {};                                                                                                     // 21
                                                                                                                     // 22
// A general place for any package to store global config settings                                                   // 23
FS.config = {};                                                                                                      // 24
                                                                                                                     // 25
// An internal collection reference                                                                                  // 26
FS._collections = {};                                                                                                // 27
                                                                                                                     // 28
// Test scope                                                                                                        // 29
_Utility = {};                                                                                                       // 30
                                                                                                                     // 31
// #############################################################################                                     // 32
//                                                                                                                   // 33
// HELPERS                                                                                                           // 34
//                                                                                                                   // 35
// #############################################################################                                     // 36
                                                                                                                     // 37
/** @method _Utility.defaultZero                                                                                     // 38
 * @private                                                                                                          // 39
  * @param {Any} val Returns number or 0 if value is a falsy                                                         // 40
  */                                                                                                                 // 41
_Utility.defaultZero = function(val) {                                                                               // 42
  return +(val || 0);                                                                                                // 43
};                                                                                                                   // 44
                                                                                                                     // 45
/**                                                                                                                  // 46
 * @method FS.Utility.cloneFileRecord                                                                                // 47
 * @public                                                                                                           // 48
 * @param {FS.File|FS.Collection filerecord} rec                                                                     // 49
 * @param {Object} [options]                                                                                         // 50
 * @param {Boolean} [options.full=false] Set `true` to prevent certain properties from being omitted from the clone. // 51
 * @returns {Object} Cloned filerecord                                                                               // 52
 *                                                                                                                   // 53
 * Makes a shallow clone of `rec`, filtering out some properties that might be present if                            // 54
 * it's an FS.File instance, but which we never want to be part of the stored                                        // 55
 * filerecord.                                                                                                       // 56
 *                                                                                                                   // 57
 * This is a blacklist clone rather than a whitelist because we want the user to be able                             // 58
 * to specify whatever additional properties they wish.                                                              // 59
 *                                                                                                                   // 60
 * In general, we expect the following whitelist properties used by the internal and                                 // 61
 * external APIs:                                                                                                    // 62
 *                                                                                                                   // 63
 * _id, name, size, type, chunkCount, chunkSize, chunkSum, copies, createdAt, updatedAt, uploadedAt                  // 64
 *                                                                                                                   // 65
 * Those properties, and any additional properties added by the user, should be present                              // 66
 * in the returned object, which is suitable for inserting into the backing collection or                            // 67
 * extending an FS.File instance.                                                                                    // 68
 *                                                                                                                   // 69
 */                                                                                                                  // 70
FS.Utility.cloneFileRecord = function(rec, options) {                                                                // 71
  options = options || {};                                                                                           // 72
  var result = {};                                                                                                   // 73
  // We use this method for two purposes. If using it to clone one FS.File into another, then                        // 74
  // we want a full clone. But if using it to get a filerecord object for inserting into the                         // 75
  // internal collection, then there are certain properties we want to omit so that they aren't                      // 76
  // stored in the collection.                                                                                       // 77
  var omit = options.full ? [] : ['collectionName', 'collection', 'data', 'createdByTransform'];                     // 78
  for (var prop in rec) {                                                                                            // 79
    if (rec.hasOwnProperty(prop) && !_.contains(omit, prop)) {                                                       // 80
      result[prop] = rec[prop];                                                                                      // 81
    }                                                                                                                // 82
  }                                                                                                                  // 83
  return result;                                                                                                     // 84
};                                                                                                                   // 85
                                                                                                                     // 86
/**                                                                                                                  // 87
 * @method FS.Utility.defaultCallback                                                                                // 88
 * @public                                                                                                           // 89
 * @param {Error} [err]                                                                                              // 90
 * @returns {undefined}                                                                                              // 91
 *                                                                                                                   // 92
 * Can be used as a default callback for client methods that need a callback.                                        // 93
 * Simply throws the provided error if there is one.                                                                 // 94
 */                                                                                                                  // 95
FS.Utility.defaultCallback = function defaultCallback(err) {                                                         // 96
  if (err) {                                                                                                         // 97
    // Show gentle error if Meteor error                                                                             // 98
    if (err instanceof Meteor.Error) {                                                                               // 99
      console.error(err.message);                                                                                    // 100
    } else {                                                                                                         // 101
      // Normal error, just throw error                                                                              // 102
      throw err;                                                                                                     // 103
    }                                                                                                                // 104
                                                                                                                     // 105
  }                                                                                                                  // 106
};                                                                                                                   // 107
                                                                                                                     // 108
/**                                                                                                                  // 109
 * @method FS.Utility.defaultCallback                                                                                // 110
 * @public                                                                                                           // 111
 * @param {Function} [f] A callback function, if you have one. Can be undefined or null.                             // 112
 * @param {Meteor.Error | Error | String} [err] Error or error message (string)                                      // 113
 * @returns {Any} the callback result if any                                                                         // 114
 *                                                                                                                   // 115
 * Handle Error, creates an Error instance with the given text. If callback is                                       // 116
 * a function, passes the error to that function. Otherwise throws it. Useful                                        // 117
 * for dealing with errors in methods that optionally accept a callback.                                             // 118
 */                                                                                                                  // 119
FS.Utility.handleError = function(f, err, result) {                                                                  // 120
  // Set callback                                                                                                    // 121
  var callback = (typeof f === 'function')? f : FS.Utility.defaultCallback;                                          // 122
  // Set the err                                                                                                     // 123
  var error = (err === ''+err)? new Error(err) : err;                                                                // 124
  // callback                                                                                                        // 125
  return callback(error, result);                                                                                    // 126
}                                                                                                                    // 127
                                                                                                                     // 128
/**                                                                                                                  // 129
 * @method FS.Utility.noop                                                                                           // 130
 * @public                                                                                                           // 131
 * Use this to hand a no operation / empty function                                                                  // 132
 */                                                                                                                  // 133
FS.Utility.noop = function() {};                                                                                     // 134
                                                                                                                     // 135
/**                                                                                                                  // 136
 * @method validateAction                                                                                            // 137
 * @private                                                                                                          // 138
 * @param {Object} validators - The validators object to use, with `deny` and `allow` properties.                    // 139
 * @param {FS.File} fileObj - Mounted or mountable file object to be passed to validators.                           // 140
 * @param {String} userId - The ID of the user who is attempting the action.                                         // 141
 * @returns {undefined}                                                                                              // 142
 *                                                                                                                   // 143
 * Throws a "400-Bad Request" Meteor error if the file is not mounted or                                             // 144
 * a "400-Access denied" Meteor error if the action is not allowed.                                                  // 145
 */                                                                                                                  // 146
FS.Utility.validateAction = function validateAction(validators, fileObj, userId) {                                   // 147
  var denyValidators = validators.deny;                                                                              // 148
  var allowValidators = validators.allow;                                                                            // 149
                                                                                                                     // 150
  // If insecure package is used and there are no validators defined,                                                // 151
  // allow the action.                                                                                               // 152
  if (typeof Package === 'object'                                                                                    // 153
          && Package.insecure                                                                                        // 154
          && denyValidators.length + allowValidators.length === 0) {                                                 // 155
    return;                                                                                                          // 156
  }                                                                                                                  // 157
                                                                                                                     // 158
  // Validators should receive a fileObj that is mounted                                                             // 159
  if (!fileObj.isMounted()) {                                                                                        // 160
    throw new Meteor.Error(400, "Bad Request");                                                                      // 161
  }                                                                                                                  // 162
                                                                                                                     // 163
  // Validators should receive a fileObj that is fully populated                                                     // 164
  fileObj.getFileRecord();                                                                                           // 165
                                                                                                                     // 166
  // Any deny returns true means denied.                                                                             // 167
  if (_.any(denyValidators, function(validator) {                                                                    // 168
    return validator(userId, fileObj);                                                                               // 169
  })) {                                                                                                              // 170
    throw new Meteor.Error(403, "Access denied");                                                                    // 171
  }                                                                                                                  // 172
  // Any allow returns true means proceed. Throw error if they all fail.                                             // 173
  if (_.all(allowValidators, function(validator) {                                                                   // 174
    return !validator(userId, fileObj);                                                                              // 175
  })) {                                                                                                              // 176
    throw new Meteor.Error(403, "Access denied");                                                                    // 177
  }                                                                                                                  // 178
};                                                                                                                   // 179
                                                                                                                     // 180
/**                                                                                                                  // 181
 * @method FS.Utility.getFileName                                                                                    // 182
 * @private                                                                                                          // 183
 * @param {String} name - A filename, filepath, or URL                                                               // 184
 * @returns {String} The filename without the URL, filepath, or query string                                         // 185
 */                                                                                                                  // 186
FS.Utility.getFileName = function utilGetFileName(name) {                                                            // 187
  // in case it's a URL, strip off potential query string                                                            // 188
  // should have no effect on filepath                                                                               // 189
  name = name.split('?')[0];                                                                                         // 190
  // strip off beginning path or url                                                                                 // 191
  var lastSlash = name.lastIndexOf('/');                                                                             // 192
  if (lastSlash !== -1) {                                                                                            // 193
    name = name.slice(lastSlash + 1);                                                                                // 194
  }                                                                                                                  // 195
  return name;                                                                                                       // 196
};                                                                                                                   // 197
                                                                                                                     // 198
/**                                                                                                                  // 199
 * @method FS.Utility.getFileExtension                                                                               // 200
 * @public                                                                                                           // 201
 * @param {String} name - A filename, filepath, or URL that may or may not have an extension.                        // 202
 * @returns {String} The extension or an empty string if no extension found.                                         // 203
 */                                                                                                                  // 204
FS.Utility.getFileExtension = function utilGetFileExtension(name) {                                                  // 205
  name = FS.Utility.getFileName(name);                                                                               // 206
  // Seekout the last '.' if found                                                                                   // 207
  var found = name.lastIndexOf('.');                                                                                 // 208
  // Return the extension if found else ''                                                                           // 209
  // If found is -1, we return '' because there is no extension                                                      // 210
  // If found is 0, we return '' because it's a hidden file                                                          // 211
  return (found > 0 ? name.slice(found + 1).toLowerCase() : '');                                                     // 212
};                                                                                                                   // 213
                                                                                                                     // 214
/**                                                                                                                  // 215
 * @method FS.Utility.setFileExtension                                                                               // 216
 * @public                                                                                                           // 217
 * @param {String} name - A filename that may or may not already have an extension.                                  // 218
 * @param {String} ext - An extension without leading period, which you want to be the new extension on `name`.      // 219
 * @returns {String} The filename with changed extension.                                                            // 220
 */                                                                                                                  // 221
FS.Utility.setFileExtension = function utilSetFileExtension(name, ext) {                                             // 222
  if (!name || !name.length) {                                                                                       // 223
    return name;                                                                                                     // 224
  }                                                                                                                  // 225
  var currentExt = FS.Utility.getFileExtension(name);                                                                // 226
  if (currentExt.length) {                                                                                           // 227
    name = name.slice(0, currentExt.length * -1) + ext;                                                              // 228
  } else {                                                                                                           // 229
    name = name + '.' + ext;                                                                                         // 230
  }                                                                                                                  // 231
  return name;                                                                                                       // 232
};                                                                                                                   // 233
                                                                                                                     // 234
/*                                                                                                                   // 235
 * Borrowed these from http package                                                                                  // 236
 */                                                                                                                  // 237
FS.Utility.encodeParams = function encodeParams(params) {                                                            // 238
  var buf = [];                                                                                                      // 239
  _.each(params, function(value, key) {                                                                              // 240
    if (buf.length)                                                                                                  // 241
      buf.push('&');                                                                                                 // 242
    buf.push(FS.Utility.encodeString(key), '=', FS.Utility.encodeString(value));                                     // 243
  });                                                                                                                // 244
  return buf.join('').replace(/%20/g, '+');                                                                          // 245
};                                                                                                                   // 246
                                                                                                                     // 247
FS.Utility.encodeString = function encodeString(str) {                                                               // 248
  return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");                                   // 249
};                                                                                                                   // 250
                                                                                                                     // 251
/*                                                                                                                   // 252
 * btoa and atob shims for client and server                                                                         // 253
 */                                                                                                                  // 254
                                                                                                                     // 255
FS.Utility._btoa = function _fsUtility_btoa(str) {                                                                   // 256
  var buffer;                                                                                                        // 257
                                                                                                                     // 258
  if (str instanceof Buffer) {                                                                                       // 259
    buffer = str;                                                                                                    // 260
  } else {                                                                                                           // 261
    buffer = new Buffer(str.toString(), 'binary');                                                                   // 262
  }                                                                                                                  // 263
                                                                                                                     // 264
  return buffer.toString('base64');                                                                                  // 265
};                                                                                                                   // 266
                                                                                                                     // 267
FS.Utility.btoa = function fsUtility_btoa(str) {                                                                     // 268
  if (typeof btoa === 'function') {                                                                                  // 269
    // Client                                                                                                        // 270
    return btoa(str);                                                                                                // 271
  } else if (typeof Buffer !== 'undefined') {                                                                        // 272
    // Server                                                                                                        // 273
    return FS.Utility._btoa(str);                                                                                    // 274
  } else {                                                                                                           // 275
    throw new Error('FS.Utility.btoa: Cannot base64 encode on your system');                                         // 276
  }                                                                                                                  // 277
};                                                                                                                   // 278
                                                                                                                     // 279
FS.Utility._atob = function _fsUtility_atob(str) {                                                                   // 280
  return new Buffer(str, 'base64').toString('binary');                                                               // 281
};                                                                                                                   // 282
                                                                                                                     // 283
FS.Utility.atob = function fsUtility_atob(str) {                                                                     // 284
  if (typeof atob === 'function') {                                                                                  // 285
    // Client                                                                                                        // 286
    return atob(str);                                                                                                // 287
  } else if (typeof Buffer !== 'undefined') {                                                                        // 288
    // Server                                                                                                        // 289
    return FS.Utility._atob(str);                                                                                    // 290
  } else {                                                                                                           // 291
    throw new Error('FS.Utility.atob: Cannot base64 encode on your system');                                         // 292
  }                                                                                                                  // 293
};                                                                                                                   // 294
                                                                                                                     // 295
// Api wrap for 3party libs like underscore                                                                          // 296
FS.Utility.extend = _.extend;                                                                                        // 297
                                                                                                                     // 298
FS.Utility.each = _.each;                                                                                            // 299
                                                                                                                     // 300
FS.Utility.isEmpty = _.isEmpty;                                                                                      // 301
                                                                                                                     // 302
FS.Utility.indexOf = _.indexOf;                                                                                      // 303
                                                                                                                     // 304
FS.Utility.isArray = _.isArray;                                                                                      // 305
                                                                                                                     // 306
FS.Utility.map = _.map;                                                                                              // 307
                                                                                                                     // 308
FS.Utility.once = _.once;                                                                                            // 309
                                                                                                                     // 310
FS.Utility.include = _.include;                                                                                      // 311
                                                                                                                     // 312
FS.Utility.size = _.size;                                                                                            // 313
                                                                                                                     // 314
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/cfs-base-package/base-client.js                                                                          //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
                                                                                                                     // 1
//XXX not sure this is still working properly?                                                                       // 2
FS.Utility.connectionLogin = function(connection) {                                                                  // 3
  // We check if the accounts package is installed, since we depend on                                               // 4
  // `Meteor.userId()`                                                                                               // 5
  if (typeof Accounts !== 'undefined') {                                                                             // 6
    // Monitor logout from main connection                                                                           // 7
    Meteor.startup(function() {                                                                                      // 8
      Deps.autorun(function() {                                                                                      // 9
        var userId = Meteor.userId();                                                                                // 10
        if (userId) {                                                                                                // 11
          connection.onReconnect = function() {                                                                      // 12
            var token = Accounts._storedLoginToken();                                                                // 13
            connection.apply('login', [{resume: token}], function(err, result) {                                     // 14
              !err && result && connection.setUserId(result.id);                                                     // 15
            });                                                                                                      // 16
          };                                                                                                         // 17
        } else {                                                                                                     // 18
          connection.onReconnect = null;                                                                             // 19
          connection.setUserId(null);                                                                                // 20
        }                                                                                                            // 21
      });                                                                                                            // 22
    });                                                                                                              // 23
                                                                                                                     // 24
  }                                                                                                                  // 25
};                                                                                                                   // 26
                                                                                                                     // 27
/**                                                                                                                  // 28
 * @method FS.Utility.eachFile                                                                                       // 29
 * @public                                                                                                           // 30
 * @param {Event} e - Browser event                                                                                  // 31
 * @param {Function} f - Function to run for each file found in the event.                                           // 32
 * @returns {undefined}                                                                                              // 33
 *                                                                                                                   // 34
 * Utility for iteration over files in event                                                                         // 35
 */                                                                                                                  // 36
FS.Utility.eachFile = function(e, f) {                                                                               // 37
  var evt = (e.originalEvent || e);                                                                                  // 38
                                                                                                                     // 39
  var files = evt.target.files;                                                                                      // 40
                                                                                                                     // 41
  if (!files || files.length == 0)                                                                                   // 42
    files = evt.dataTransfer.files;                                                                                  // 43
                                                                                                                     // 44
  for (var i = 0; i < files.length; i++) {                                                                           // 45
    f(files[i], i);                                                                                                  // 46
  }                                                                                                                  // 47
};                                                                                                                   // 48
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['cfs-base-package'] = {
  FS: FS,
  _Utility: _Utility
};

})();

//# sourceMappingURL=9ed23046147d6c6d280c01fd553fde520a9101db.map
