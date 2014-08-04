(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var FS = Package['cfs-base-package'].FS;
var Deps = Package.deps.Deps;
var check = Package.check.check;
var Match = Package.check.Match;
var DDP = Package.livedata.DDP;
var DDPServer = Package.livedata.DDPServer;
var MongoInternals = Package['mongo-livedata'].MongoInternals;
var HTTP = Package.http.HTTP;
var DataMan = Package['data-man'].DataMan;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cfs-file/fsFile-common.js                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
 * @method FS.File                                                                                                    // 2
 * @namespace FS.File                                                                                                 // 3
 * @public                                                                                                            // 4
 * @constructor                                                                                                       // 5
 * @param {object|FS.File|data to attach} [ref] Another FS.File instance, a filerecord, or some data to pass to attachData
 */                                                                                                                   // 7
FS.File = function(ref, createdByTransform) {                                                                         // 8
  var self = this;                                                                                                    // 9
                                                                                                                      // 10
  self.createdByTransform = !!createdByTransform;                                                                     // 11
                                                                                                                      // 12
  if (ref instanceof FS.File || isBasicObject(ref)) {                                                                 // 13
    // Extend self with filerecord related data                                                                       // 14
    FS.Utility.extend(self, FS.Utility.cloneFileRecord(ref, {full: true}));                                           // 15
  } else if (ref) {                                                                                                   // 16
    self.attachData(ref);                                                                                             // 17
  }                                                                                                                   // 18
};                                                                                                                    // 19
                                                                                                                      // 20
/**                                                                                                                   // 21
 * @method FS.File.prototype.attachData                                                                               // 22
 * @public                                                                                                            // 23
 * @param {File|Blob|Buffer|ArrayBuffer|Uint8Array|String} data The data that you want to attach to the file.         // 24
 * @param {Object} [options] Options                                                                                  // 25
 * @param {String} [options.type] The data content (MIME) type, if known.                                             // 26
 * @param {String} [options.headers] When attaching a URL, headers to be used for the GET request (currently server only)
 * @param {String} [options.auth] When attaching a URL, "username:password" to be used for the GET request (currently server only)
 * @param {Function} [callback] Callback function, callback(error). On the client, a callback is required if data is a URL.
 * @returns {FS.File} This FS.File instance.                                                                          // 30
 *                                                                                                                    // 31
 */                                                                                                                   // 32
FS.File.prototype.attachData = function fsFileAttachData(data, options, callback) {                                   // 33
  var self = this;                                                                                                    // 34
                                                                                                                      // 35
  if (!callback && typeof options === "function") {                                                                   // 36
    callback = options;                                                                                               // 37
    options = {};                                                                                                     // 38
  }                                                                                                                   // 39
  options = options || {};                                                                                            // 40
                                                                                                                      // 41
  if (!data) {                                                                                                        // 42
    throw new Error('FS.File.attachData requires a data argument with some data');                                    // 43
  }                                                                                                                   // 44
                                                                                                                      // 45
  var urlOpts;                                                                                                        // 46
                                                                                                                      // 47
  // Set any other properties we can determine from the source data                                                   // 48
  // File                                                                                                             // 49
  if (typeof File !== "undefined" && data instanceof File) {                                                          // 50
    self.name(data.name)                                                                                              // 51
    self.updatedAt(data.lastModifiedDate);                                                                            // 52
    self.size(data.size);                                                                                             // 53
    setData(data.type);                                                                                               // 54
  }                                                                                                                   // 55
  // Blob                                                                                                             // 56
  else if (typeof Blob !== "undefined" && data instanceof Blob) {                                                     // 57
    self.updatedAt(new Date);                                                                                         // 58
    self.size(data.size);                                                                                             // 59
    setData(data.type);                                                                                               // 60
  }                                                                                                                   // 61
  // URL: we need to do a HEAD request to get the type because type                                                   // 62
  // is required for filtering to work.                                                                               // 63
  else if (typeof data === "string" && (data.slice(0, 5) === "http:" || data.slice(0, 6) === "https:")) {             // 64
    urlOpts = FS.Utility.extend({}, options);                                                                         // 65
    if (urlOpts.type) {                                                                                               // 66
      delete urlOpts.type;                                                                                            // 67
    }                                                                                                                 // 68
                                                                                                                      // 69
    if (!callback) {                                                                                                  // 70
      if (Meteor.isClient) {                                                                                          // 71
        throw new Error('FS.File.attachData requires a callback when attaching a URL on the client');                 // 72
      }                                                                                                               // 73
      var result = Meteor.call('_cfs_getUrlInfo', data, urlOpts);                                                     // 74
      FS.Utility.extend(self, {original: result});                                                                    // 75
      setData(result.type);                                                                                           // 76
    } else {                                                                                                          // 77
      Meteor.call('_cfs_getUrlInfo', data, urlOpts, function (error, result) {                                        // 78
        FS.debug && console.log("URL HEAD RESULT:", result);                                                          // 79
        if (error) {                                                                                                  // 80
          callback(error);                                                                                            // 81
        } else {                                                                                                      // 82
          FS.Utility.extend(self, {original: result});                                                                // 83
          setData(result.type);                                                                                       // 84
        }                                                                                                             // 85
      });                                                                                                             // 86
    }                                                                                                                 // 87
  }                                                                                                                   // 88
  // Everything else                                                                                                  // 89
  else {                                                                                                              // 90
    setData(options.type);                                                                                            // 91
  }                                                                                                                   // 92
                                                                                                                      // 93
  // Set the data                                                                                                     // 94
  function setData(type) {                                                                                            // 95
    self.data = new DataMan(data, type, urlOpts);                                                                     // 96
                                                                                                                      // 97
    // Update the type to match what the data is                                                                      // 98
    self.type(self.data.type());                                                                                      // 99
                                                                                                                      // 100
    // Update the size to match what the data is.                                                                     // 101
    // It's always safe to call self.data.size() without supplying a callback                                         // 102
    // because it requires a callback only for URLs on the client, and we                                             // 103
    // already added size for URLs when we got the result from '_cfs_getUrlInfo' method.                              // 104
    if (!self.size()) {                                                                                               // 105
      if (callback) {                                                                                                 // 106
        self.data.size(function (error, size) {                                                                       // 107
          if (error) {                                                                                                // 108
            callback && callback(error);                                                                              // 109
          } else {                                                                                                    // 110
            self.size(size);                                                                                          // 111
            setName();                                                                                                // 112
          }                                                                                                           // 113
        });                                                                                                           // 114
      } else {                                                                                                        // 115
        self.size(self.data.size());                                                                                  // 116
        setName();                                                                                                    // 117
      }                                                                                                               // 118
    } else {                                                                                                          // 119
      setName();                                                                                                      // 120
    }                                                                                                                 // 121
  }                                                                                                                   // 122
                                                                                                                      // 123
  function setName() {                                                                                                // 124
    // See if we can extract a file name from URL or filepath                                                         // 125
    if (!self.name() && typeof data === "string") {                                                                   // 126
      // name from URL                                                                                                // 127
      if (data.slice(0, 5) === "http:" || data.slice(0, 6) === "https:") {                                            // 128
        if (FS.Utility.getFileExtension(data).length) {                                                               // 129
          // for a URL we assume the end is a filename only if it has an extension                                    // 130
          self.name(FS.Utility.getFileName(data));                                                                    // 131
        }                                                                                                             // 132
      }                                                                                                               // 133
      // name from filepath                                                                                           // 134
      else if (data.slice(0, 5) !== "data:") {                                                                        // 135
        self.name(FS.Utility.getFileName(data));                                                                      // 136
      }                                                                                                               // 137
    }                                                                                                                 // 138
                                                                                                                      // 139
    callback && callback();                                                                                           // 140
  }                                                                                                                   // 141
                                                                                                                      // 142
  return self; //allow chaining                                                                                       // 143
};                                                                                                                    // 144
                                                                                                                      // 145
/**                                                                                                                   // 146
 * @method FS.File.prototype.uploadProgress                                                                           // 147
 * @public                                                                                                            // 148
 * @returns {number} The server confirmed upload progress                                                             // 149
 */                                                                                                                   // 150
FS.File.prototype.uploadProgress = function() {                                                                       // 151
  var self = this;                                                                                                    // 152
  // Make sure our file record is updated                                                                             // 153
  self.getFileRecord();                                                                                               // 154
                                                                                                                      // 155
  // If fully uploaded, return 100                                                                                    // 156
  if (self.uploadedAt) {                                                                                              // 157
    return 100;                                                                                                       // 158
  }                                                                                                                   // 159
  // Otherwise return the confirmed progress or 0                                                                     // 160
  else {                                                                                                              // 161
    return Math.round((self.chunkCount || 0) / (self.chunkSum || 1) * 100);                                           // 162
  }                                                                                                                   // 163
};                                                                                                                    // 164
                                                                                                                      // 165
/**                                                                                                                   // 166
 * @method FS.File.prototype.controlledByDeps                                                                         // 167
 * @public                                                                                                            // 168
 * @returns {FS.Collection} Returns true if this FS.File is reactive                                                  // 169
 *                                                                                                                    // 170
 * > Note: Returns true if this FS.File object was created by a FS.Collection                                         // 171
 * > and we are in a reactive computations. What does this mean? Well it should                                       // 172
 * > mean that our fileRecord is fully updated by Meteor and we are mounted on                                        // 173
 * > a collection                                                                                                     // 174
 */                                                                                                                   // 175
FS.File.prototype.controlledByDeps = function() {                                                                     // 176
  var self = this;                                                                                                    // 177
  return self.createdByTransform && Deps.active;                                                                      // 178
};                                                                                                                    // 179
                                                                                                                      // 180
/**                                                                                                                   // 181
 * @method FS.File.prototype.getCollection                                                                            // 182
 * @public                                                                                                            // 183
 * @returns {FS.Collection} Returns attached collection or undefined if not mounted                                   // 184
 */                                                                                                                   // 185
FS.File.prototype.getCollection = function() {                                                                        // 186
  // Get the collection reference                                                                                     // 187
  var self = this;                                                                                                    // 188
                                                                                                                      // 189
  // If we already made the link then do no more                                                                      // 190
  if (self.collection) {                                                                                              // 191
    return self.collection;                                                                                           // 192
  }                                                                                                                   // 193
                                                                                                                      // 194
  // If we don't have a collectionName then there's not much to do, the file is                                       // 195
  // not mounted yet                                                                                                  // 196
  if (!self.collectionName) {                                                                                         // 197
    // Should not throw an error here - could be common that the file is not                                          // 198
    // yet mounted into a collection                                                                                  // 199
    return;                                                                                                           // 200
  }                                                                                                                   // 201
                                                                                                                      // 202
  // Link the collection to the file                                                                                  // 203
  self.collection = FS._collections[self.collectionName];                                                             // 204
                                                                                                                      // 205
  return self.collection; //possibly undefined, but that's desired behavior                                           // 206
};                                                                                                                    // 207
                                                                                                                      // 208
/**                                                                                                                   // 209
 * @method FS.File.prototype.isMounted                                                                                // 210
 * @public                                                                                                            // 211
 * @returns {FS.Collection} Returns attached collection or undefined if not mounted                                   // 212
 */                                                                                                                   // 213
FS.File.prototype.isMounted = FS.File.prototype.getCollection;                                                        // 214
                                                                                                                      // 215
/**                                                                                                                   // 216
 * @method FS.File.prototype.getFileRecord Returns the fileRecord                                                     // 217
 * @public                                                                                                            // 218
 * @returns {object} The filerecord                                                                                   // 219
 */                                                                                                                   // 220
FS.File.prototype.getFileRecord = function() {                                                                        // 221
  var self = this;                                                                                                    // 222
  // Check if this file object fileRecord is kept updated by Meteor, if so                                            // 223
  // return self                                                                                                      // 224
  if (self.controlledByDeps()) {                                                                                      // 225
    return self;                                                                                                      // 226
  }                                                                                                                   // 227
  // Go for manually updating the file record                                                                         // 228
  if (self.isMounted()) {                                                                                             // 229
    FS.debug && console.log('GET FILERECORD: ' + self._id);                                                           // 230
                                                                                                                      // 231
    // Return the fileRecord or an empty object                                                                       // 232
    var fileRecord = self.collection.files.findOne({_id: self._id}) || {};                                            // 233
    FS.Utility.extend(self, fileRecord);                                                                              // 234
    return fileRecord;                                                                                                // 235
  } else {                                                                                                            // 236
    // We return an empty object, this way users can still do `getRecord().size`                                      // 237
    // Without getting an error                                                                                       // 238
    return {};                                                                                                        // 239
  }                                                                                                                   // 240
};                                                                                                                    // 241
                                                                                                                      // 242
/**                                                                                                                   // 243
 * @method FS.File.prototype.update                                                                                   // 244
 * @public                                                                                                            // 245
 * @param {modifier} modifier                                                                                         // 246
 * @param {object} [options]                                                                                          // 247
 * @param {function} [callback]                                                                                       // 248
 *                                                                                                                    // 249
 * Updates the fileRecord.                                                                                            // 250
 */                                                                                                                   // 251
FS.File.prototype.update = function(modifier, options, callback) {                                                    // 252
  var self = this;                                                                                                    // 253
                                                                                                                      // 254
  FS.debug && console.log('UPDATE: ' + JSON.stringify(modifier));                                                     // 255
                                                                                                                      // 256
  // Make sure we have options and callback                                                                           // 257
  if (!callback && typeof options === 'function') {                                                                   // 258
    callback = options;                                                                                               // 259
    options = {};                                                                                                     // 260
  }                                                                                                                   // 261
  callback = callback || FS.Utility.defaultCallback;                                                                  // 262
                                                                                                                      // 263
  if (!self.isMounted()) {                                                                                            // 264
    callback(new Error("Cannot update a file that is not associated with a collection"));                             // 265
    return;                                                                                                           // 266
  }                                                                                                                   // 267
                                                                                                                      // 268
  // Call collection update - File record                                                                             // 269
  return self.collection.files.update({_id: self._id}, modifier, options, function(err, count) {                      // 270
    // Update the fileRecord if it was changed and on the client                                                      // 271
    // The server-side methods will pull the fileRecord if needed                                                     // 272
    if (count > 0 && Meteor.isClient)                                                                                 // 273
      self.getFileRecord();                                                                                           // 274
    // Call callback                                                                                                  // 275
    callback(err, count);                                                                                             // 276
  });                                                                                                                 // 277
};                                                                                                                    // 278
                                                                                                                      // 279
/**                                                                                                                   // 280
 * @method FS.File.prototype._saveChanges                                                                             // 281
 * @private                                                                                                           // 282
 * @param {String} [what] "_original" to save original info, or a store name to save info for that store, or saves everything
 *                                                                                                                    // 284
 * Updates the fileRecord from values currently set on the FS.File instance.                                          // 285
 */                                                                                                                   // 286
FS.File.prototype._saveChanges = function(what) {                                                                     // 287
  var self = this;                                                                                                    // 288
                                                                                                                      // 289
  if (!self.isMounted()) {                                                                                            // 290
    return;                                                                                                           // 291
  }                                                                                                                   // 292
                                                                                                                      // 293
  FS.debug && console.log("FS.File._saveChanges:", what || "all")                                                     // 294
                                                                                                                      // 295
  var mod = {$set: {}};                                                                                               // 296
  if (what === "_original") {                                                                                         // 297
    mod.$set.original = self.original;                                                                                // 298
  } else if (typeof what === "string") {                                                                              // 299
    var info = self.copies[what];                                                                                     // 300
    if (info) {                                                                                                       // 301
      mod.$set["copies." + what] = info;                                                                              // 302
    }                                                                                                                 // 303
  } else {                                                                                                            // 304
    mod.$set.original = self.original;                                                                                // 305
    mod.$set.copies = self.copies;                                                                                    // 306
  }                                                                                                                   // 307
                                                                                                                      // 308
  self.update(mod);                                                                                                   // 309
};                                                                                                                    // 310
                                                                                                                      // 311
/**                                                                                                                   // 312
 * @method FS.File.prototype.remove                                                                                   // 313
 * @public                                                                                                            // 314
 * @param {Function} [callback]                                                                                       // 315
 * @returns {number} Count                                                                                            // 316
 *                                                                                                                    // 317
 * Remove the current file from its FS.Collection                                                                     // 318
 */                                                                                                                   // 319
FS.File.prototype.remove = function(callback) {                                                                       // 320
  var self = this;                                                                                                    // 321
                                                                                                                      // 322
  FS.debug && console.log('REMOVE: ' + self._id);                                                                     // 323
                                                                                                                      // 324
  callback = callback || FS.Utility.defaultCallback;                                                                  // 325
                                                                                                                      // 326
  if (!self.isMounted()) {                                                                                            // 327
    callback(new Error("Cannot remove a file that is not associated with a collection"));                             // 328
    return;                                                                                                           // 329
  }                                                                                                                   // 330
                                                                                                                      // 331
  return self.collection.files.remove({_id: self._id}, function(err, res) {                                           // 332
    if (!err) {                                                                                                       // 333
      delete self._id;                                                                                                // 334
      delete self.collection;                                                                                         // 335
      delete self.collectionName;                                                                                     // 336
    }                                                                                                                 // 337
    callback(err, res);                                                                                               // 338
  });                                                                                                                 // 339
};                                                                                                                    // 340
                                                                                                                      // 341
/**                                                                                                                   // 342
 * @method FS.File.prototype.moveTo                                                                                   // 343
 * @param {FS.Collection} targetCollection                                                                            // 344
 * @private // Marked private until implemented                                                                       // 345
 * @todo Needs to be implemented                                                                                      // 346
 *                                                                                                                    // 347
 * Move the file from current collection to another collection                                                        // 348
 *                                                                                                                    // 349
 * > Note: Not yet implemented                                                                                        // 350
 */                                                                                                                   // 351
                                                                                                                      // 352
/**                                                                                                                   // 353
 * @method FS.File.prototype.getExtension Returns the lowercase file extension                                        // 354
 * @public                                                                                                            // 355
 * @deprecated Use the `extension` getter/setter method instead.                                                      // 356
 * @param {Object} [options]                                                                                          // 357
 * @param {String} [options.store] - Store name. Default is the original extension.                                   // 358
 * @returns {string} The extension eg.: `jpg` or if not found then an empty string ''                                 // 359
 */                                                                                                                   // 360
FS.File.prototype.getExtension = function(options) {                                                                  // 361
  var self = this;                                                                                                    // 362
  return self.extension(options);                                                                                     // 363
};                                                                                                                    // 364
                                                                                                                      // 365
function checkContentType(fsFile, storeName, startOfType) {                                                           // 366
  var type;                                                                                                           // 367
  if (storeName && fsFile.hasStored(storeName)) {                                                                     // 368
    type = fsFile.type({store: storeName});                                                                           // 369
  } else {                                                                                                            // 370
    type = fsFile.type();                                                                                             // 371
  }                                                                                                                   // 372
  if (typeof type === "string") {                                                                                     // 373
    return type.indexOf(startOfType) === 0;                                                                           // 374
  }                                                                                                                   // 375
  return false;                                                                                                       // 376
}                                                                                                                     // 377
                                                                                                                      // 378
/**                                                                                                                   // 379
 * @method FS.File.prototype.isImage Is it an image file?                                                             // 380
 * @public                                                                                                            // 381
 * @param {object} [options]                                                                                          // 382
 * @param {string} [options.store] The store we're interested in                                                      // 383
 *                                                                                                                    // 384
 * Returns true if the copy of this file in the specified store has an image                                          // 385
 * content type. If the file object is unmounted or doesn't have a copy for                                           // 386
 * the specified store, or if you don't specify a store, this method checks                                           // 387
 * the content type of the original file.                                                                             // 388
 */                                                                                                                   // 389
FS.File.prototype.isImage = function(options) {                                                                       // 390
  return checkContentType(this, (options || {}).store, 'image/');                                                     // 391
};                                                                                                                    // 392
                                                                                                                      // 393
/**                                                                                                                   // 394
 * @method FS.File.prototype.isVideo Is it a video file?                                                              // 395
 * @public                                                                                                            // 396
 * @param {object} [options]                                                                                          // 397
 * @param {string} [options.store] The store we're interested in                                                      // 398
 *                                                                                                                    // 399
 * Returns true if the copy of this file in the specified store has a video                                           // 400
 * content type. If the file object is unmounted or doesn't have a copy for                                           // 401
 * the specified store, or if you don't specify a store, this method checks                                           // 402
 * the content type of the original file.                                                                             // 403
 */                                                                                                                   // 404
FS.File.prototype.isVideo = function(options) {                                                                       // 405
  return checkContentType(this, (options || {}).store, 'video/');                                                     // 406
};                                                                                                                    // 407
                                                                                                                      // 408
/**                                                                                                                   // 409
 * @method FS.File.prototype.isAudio Is it an audio file?                                                             // 410
 * @public                                                                                                            // 411
 * @param {object} [options]                                                                                          // 412
 * @param {string} [options.store] The store we're interested in                                                      // 413
 *                                                                                                                    // 414
 * Returns true if the copy of this file in the specified store has an audio                                          // 415
 * content type. If the file object is unmounted or doesn't have a copy for                                           // 416
 * the specified store, or if you don't specify a store, this method checks                                           // 417
 * the content type of the original file.                                                                             // 418
 */                                                                                                                   // 419
FS.File.prototype.isAudio = function(options) {                                                                       // 420
  return checkContentType(this, (options || {}).store, 'audio/');                                                     // 421
};                                                                                                                    // 422
                                                                                                                      // 423
/**                                                                                                                   // 424
 * @method FS.File.prototype.formattedSize                                                                            // 425
 * @public                                                                                                            // 426
 * @param  {Object} options                                                                                           // 427
 * @param  {String} [options.store=none,display original file size] Which file do you want to get the size of?        // 428
 * @param  {String} [options.formatString='0.00 b'] The `numeral` format string to use.                               // 429
 * @return {String} The file size formatted as a human readable string and reactively updated.                        // 430
 *                                                                                                                    // 431
 * * You must add the `numeral` package to your app before you can use this method.                                   // 432
 * * If info is not found or a size can't be determined, it will show 0.                                              // 433
 */                                                                                                                   // 434
FS.File.prototype.formattedSize = function fsFileFormattedSize(options) {                                             // 435
  var self = this;                                                                                                    // 436
                                                                                                                      // 437
  if (typeof numeral !== "function")                                                                                  // 438
    throw new Error("You must add the numeral package if you call FS.File.formattedSize");                            // 439
                                                                                                                      // 440
  options = options || {};                                                                                            // 441
  options = options.hash || options;                                                                                  // 442
                                                                                                                      // 443
  var size = self.size(options) || 0;                                                                                 // 444
  return numeral(size).format(options.formatString || '0.00 b');                                                      // 445
};                                                                                                                    // 446
                                                                                                                      // 447
/**                                                                                                                   // 448
 * @method FS.File.prototype.isUploaded Is this file completely uploaded?                                             // 449
 * @public                                                                                                            // 450
 * @returns {boolean} True if the number of uploaded bytes is equal to the file size.                                 // 451
 */                                                                                                                   // 452
FS.File.prototype.isUploaded = function() {                                                                           // 453
  var self = this;                                                                                                    // 454
                                                                                                                      // 455
  // Make sure we use the updated file record                                                                         // 456
  self.getFileRecord();                                                                                               // 457
                                                                                                                      // 458
  return !!self.uploadedAt;                                                                                           // 459
};                                                                                                                    // 460
                                                                                                                      // 461
/**                                                                                                                   // 462
 * @method FS.File.prototype.hasStored                                                                                // 463
 * @public                                                                                                            // 464
 * @param {string} storeName Name of the store                                                                        // 465
 * @param {boolean} [optimistic=false] In case that the file record is not found, read below                          // 466
 * @returns {boolean} Is a version of this file stored in the given store?                                            // 467
 *                                                                                                                    // 468
 * > Note: If the file is not published to the client or simply not found:                                            // 469
 * this method cannot know for sure if it exists or not. The `optimistic`                                             // 470
 * param is the boolean value to return. Are we `optimistic` that the copy                                            // 471
 * could exist. This is the case in `FS.File.url` we are optimistic that the                                          // 472
 * copy supplied by the user exists.                                                                                  // 473
 */                                                                                                                   // 474
FS.File.prototype.hasStored = function(storeName, optimistic) {                                                       // 475
  var self = this;                                                                                                    // 476
  // Make sure we use the updated file record                                                                         // 477
  self.getFileRecord();                                                                                               // 478
  // If we havent the published data then                                                                             // 479
  if (FS.Utility.isEmpty(self.copies)) {                                                                              // 480
    return !!optimistic;                                                                                              // 481
  }                                                                                                                   // 482
  if (typeof storeName === "string") {                                                                                // 483
    // Return true only if the `key` property is present, which is not set until                                      // 484
    // storage is complete.                                                                                           // 485
    return !!(self.copies && self.copies[storeName] && self.copies[storeName].key);                                   // 486
  }                                                                                                                   // 487
  return false;                                                                                                       // 488
};                                                                                                                    // 489
                                                                                                                      // 490
// Backwards compatibility                                                                                            // 491
FS.File.prototype.hasCopy = FS.File.prototype.hasStored;                                                              // 492
                                                                                                                      // 493
/**                                                                                                                   // 494
 * @method FS.File.prototype.getCopyInfo                                                                              // 495
 * @public                                                                                                            // 496
 * @deprecated Use individual methods with `store` option instead.                                                    // 497
 * @param {string} storeName Name of the store for which to get copy info.                                            // 498
 * @returns {Object} The file details, e.g., name, size, key, etc., specific to the copy saved in this store.         // 499
 */                                                                                                                   // 500
FS.File.prototype.getCopyInfo = function(storeName) {                                                                 // 501
  var self = this;                                                                                                    // 502
  // Make sure we use the updated file record                                                                         // 503
  self.getFileRecord();                                                                                               // 504
  return (self.copies && self.copies[storeName]) || null;                                                             // 505
};                                                                                                                    // 506
                                                                                                                      // 507
/**                                                                                                                   // 508
 * @method FS.File.prototype._getInfo                                                                                 // 509
 * @private                                                                                                           // 510
 * @param {String} [storeName] Name of the store for which to get file info. Omit for original file details.          // 511
 * @param {Object} [options]                                                                                          // 512
 * @param {Boolean} [options.updateFileRecordFirst=false] Update this instance with data from the DB first?           // 513
 * @returns {Object} The file details, e.g., name, size, key, etc. If not found, returns an empty object.             // 514
 */                                                                                                                   // 515
FS.File.prototype._getInfo = function(storeName, options) {                                                           // 516
  var self = this;                                                                                                    // 517
  options = options || {};                                                                                            // 518
                                                                                                                      // 519
  if (options.updateFileRecordFirst) {                                                                                // 520
    // Make sure we use the updated file record                                                                       // 521
    self.getFileRecord();                                                                                             // 522
  }                                                                                                                   // 523
                                                                                                                      // 524
  if (storeName) {                                                                                                    // 525
    return (self.copies && self.copies[storeName]) || {};                                                             // 526
  } else {                                                                                                            // 527
    return self.original || {};                                                                                       // 528
  }                                                                                                                   // 529
};                                                                                                                    // 530
                                                                                                                      // 531
/**                                                                                                                   // 532
 * @method FS.File.prototype._setInfo                                                                                 // 533
 * @private                                                                                                           // 534
 * @param {String} storeName - Name of the store for which to set file info. Non-string will set original file details.
 * @param {String} property - Property to set                                                                         // 536
 * @param {String} value - New value for property                                                                     // 537
 * @param {Boolean} save - Should the new value be saved to the DB, too, or just set in the FS.File properties?       // 538
 * @returns {undefined}                                                                                               // 539
 */                                                                                                                   // 540
FS.File.prototype._setInfo = function(storeName, property, value, save) {                                             // 541
  var self = this;                                                                                                    // 542
  if (typeof storeName === "string") {                                                                                // 543
    self.copies = self.copies || {};                                                                                  // 544
    self.copies[storeName] = self.copies[storeName] || {};                                                            // 545
    self.copies[storeName][property] = value;                                                                         // 546
    save && self._saveChanges(storeName);                                                                             // 547
  } else {                                                                                                            // 548
    self.original = self.original || {};                                                                              // 549
    self.original[property] = value;                                                                                  // 550
    save && self._saveChanges("_original");                                                                           // 551
  }                                                                                                                   // 552
};                                                                                                                    // 553
                                                                                                                      // 554
/**                                                                                                                   // 555
 * @method FS.File.prototype.name                                                                                     // 556
 * @public                                                                                                            // 557
 * @param {String|null} [value] - If setting the name, specify the new name as the first argument. Otherwise the options argument should be first.
 * @param {Object} [options]                                                                                          // 559
 * @param {Object} [options.store=none,original] - Get or set the name of the version of the file that was saved in this store. Default is the original file name.
 * @param {Boolean} [options.updateFileRecordFirst=false] Update this instance with data from the DB first? Applies to getter usage only.
 * @param {Boolean} [options.save=true] Save change to database? Applies to setter usage only.                        // 562
 * @returns {String|undefined} If setting, returns `undefined`. If getting, returns the file name.                    // 563
 */                                                                                                                   // 564
FS.File.prototype.name = function(value, options) {                                                                   // 565
  var self = this;                                                                                                    // 566
                                                                                                                      // 567
  if (!options && ((typeof value === "object" && value !== null) || typeof value === "undefined")) {                  // 568
    // GET                                                                                                            // 569
    options = value || {};                                                                                            // 570
    options = options.hash || options; // allow use as UI helper                                                      // 571
    return self._getInfo(options.store, options).name;                                                                // 572
  } else {                                                                                                            // 573
    // SET                                                                                                            // 574
    options = options || {};                                                                                          // 575
    return self._setInfo(options.store, 'name', value, typeof options.save === "boolean" ? options.save : true);      // 576
  }                                                                                                                   // 577
};                                                                                                                    // 578
                                                                                                                      // 579
/**                                                                                                                   // 580
 * @method FS.File.prototype.extension                                                                                // 581
 * @public                                                                                                            // 582
 * @param {String|null} [value] - If setting the extension, specify the new extension (without period) as the first argument. Otherwise the options argument should be first.
 * @param {Object} [options]                                                                                          // 584
 * @param {Object} [options.store=none,original] - Get or set the extension of the version of the file that was saved in this store. Default is the original file extension.
 * @param {Boolean} [options.updateFileRecordFirst=false] Update this instance with data from the DB first? Applies to getter usage only.
 * @param {Boolean} [options.save=true] Save change to database? Applies to setter usage only.                        // 587
 * @returns {String|undefined} If setting, returns `undefined`. If getting, returns the file extension or an empty string if there isn't one.
 */                                                                                                                   // 589
FS.File.prototype.extension = function(value, options) {                                                              // 590
  var self = this;                                                                                                    // 591
                                                                                                                      // 592
  if (!options && ((typeof value === "object" && value !== null) || typeof value === "undefined")) {                  // 593
    // GET                                                                                                            // 594
    options = value || {};                                                                                            // 595
    return FS.Utility.getFileExtension(self.name(options) || '');                                                     // 596
  } else {                                                                                                            // 597
    // SET                                                                                                            // 598
    options = options || {};                                                                                          // 599
    var newName = FS.Utility.setFileExtension(self.name(options) || '', value);                                       // 600
    return self._setInfo(options.store, 'name', newName, typeof options.save === "boolean" ? options.save : true);    // 601
  }                                                                                                                   // 602
};                                                                                                                    // 603
                                                                                                                      // 604
/**                                                                                                                   // 605
 * @method FS.File.prototype.size                                                                                     // 606
 * @public                                                                                                            // 607
 * @param {Number} [value] - If setting the size, specify the new size in bytes as the first argument. Otherwise the options argument should be first.
 * @param {Object} [options]                                                                                          // 609
 * @param {Object} [options.store=none,original] - Get or set the size of the version of the file that was saved in this store. Default is the original file size.
 * @param {Boolean} [options.updateFileRecordFirst=false] Update this instance with data from the DB first? Applies to getter usage only.
 * @param {Boolean} [options.save=true] Save change to database? Applies to setter usage only.                        // 612
 * @returns {Number|undefined} If setting, returns `undefined`. If getting, returns the file size.                    // 613
 */                                                                                                                   // 614
FS.File.prototype.size = function(value, options) {                                                                   // 615
  var self = this;                                                                                                    // 616
                                                                                                                      // 617
  if (!options && ((typeof value === "object" && value !== null) || typeof value === "undefined")) {                  // 618
    // GET                                                                                                            // 619
    options = value || {};                                                                                            // 620
    options = options.hash || options; // allow use as UI helper                                                      // 621
    return self._getInfo(options.store, options).size;                                                                // 622
  } else {                                                                                                            // 623
    // SET                                                                                                            // 624
    options = options || {};                                                                                          // 625
    return self._setInfo(options.store, 'size', value, typeof options.save === "boolean" ? options.save : true);      // 626
  }                                                                                                                   // 627
};                                                                                                                    // 628
                                                                                                                      // 629
/**                                                                                                                   // 630
 * @method FS.File.prototype.type                                                                                     // 631
 * @public                                                                                                            // 632
 * @param {String} [value] - If setting the type, specify the new type as the first argument. Otherwise the options argument should be first.
 * @param {Object} [options]                                                                                          // 634
 * @param {Object} [options.store=none,original] - Get or set the type of the version of the file that was saved in this store. Default is the original file type.
 * @param {Boolean} [options.updateFileRecordFirst=false] Update this instance with data from the DB first? Applies to getter usage only.
 * @param {Boolean} [options.save=true] Save change to database? Applies to setter usage only.                        // 637
 * @returns {String|undefined} If setting, returns `undefined`. If getting, returns the file type.                    // 638
 */                                                                                                                   // 639
FS.File.prototype.type = function(value, options) {                                                                   // 640
  var self = this;                                                                                                    // 641
                                                                                                                      // 642
  if (!options && ((typeof value === "object" && value !== null) || typeof value === "undefined")) {                  // 643
    // GET                                                                                                            // 644
    options = value || {};                                                                                            // 645
    options = options.hash || options; // allow use as UI helper                                                      // 646
    return self._getInfo(options.store, options).type;                                                                // 647
  } else {                                                                                                            // 648
    // SET                                                                                                            // 649
    options = options || {};                                                                                          // 650
    return self._setInfo(options.store, 'type', value, typeof options.save === "boolean" ? options.save : true);      // 651
  }                                                                                                                   // 652
};                                                                                                                    // 653
                                                                                                                      // 654
/**                                                                                                                   // 655
 * @method FS.File.prototype.updatedAt                                                                                // 656
 * @public                                                                                                            // 657
 * @param {String} [value] - If setting updatedAt, specify the new date as the first argument. Otherwise the options argument should be first.
 * @param {Object} [options]                                                                                          // 659
 * @param {Object} [options.store=none,original] - Get or set the last updated date for the version of the file that was saved in this store. Default is the original last updated date.
 * @param {Boolean} [options.updateFileRecordFirst=false] Update this instance with data from the DB first? Applies to getter usage only.
 * @param {Boolean} [options.save=true] Save change to database? Applies to setter usage only.                        // 662
 * @returns {String|undefined} If setting, returns `undefined`. If getting, returns the file's last updated date.     // 663
 */                                                                                                                   // 664
FS.File.prototype.updatedAt = function(value, options) {                                                              // 665
  var self = this;                                                                                                    // 666
                                                                                                                      // 667
  if (!options && ((typeof value === "object" && value !== null && !(value instanceof Date)) || typeof value === "undefined")) {
    // GET                                                                                                            // 669
    options = value || {};                                                                                            // 670
    options = options.hash || options; // allow use as UI helper                                                      // 671
    return self._getInfo(options.store, options).updatedAt;                                                           // 672
  } else {                                                                                                            // 673
    // SET                                                                                                            // 674
    options = options || {};                                                                                          // 675
    return self._setInfo(options.store, 'updatedAt', value, typeof options.save === "boolean" ? options.save : true); // 676
  }                                                                                                                   // 677
};                                                                                                                    // 678
                                                                                                                      // 679
function isBasicObject(obj) {                                                                                         // 680
  return (obj === Object(obj) && Object.getPrototypeOf(obj) === Object.prototype);                                    // 681
}                                                                                                                     // 682
                                                                                                                      // 683
// getPrototypeOf polyfill                                                                                            // 684
if (typeof Object.getPrototypeOf !== "function") {                                                                    // 685
  if (typeof "".__proto__ === "object") {                                                                             // 686
    Object.getPrototypeOf = function(object) {                                                                        // 687
      return object.__proto__;                                                                                        // 688
    };                                                                                                                // 689
  } else {                                                                                                            // 690
    Object.getPrototypeOf = function(object) {                                                                        // 691
      // May break if the constructor has been tampered with                                                          // 692
      return object.constructor.prototype;                                                                            // 693
    };                                                                                                                // 694
  }                                                                                                                   // 695
}                                                                                                                     // 696
                                                                                                                      // 697
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cfs-file/fsFile-server.js                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
 * Notes a details about a storage adapter failure within the file record                                             // 2
 * @param {string} storeName                                                                                          // 3
 * @param {number} maxTries                                                                                           // 4
 * @return {undefined}                                                                                                // 5
 * @todo deprecate this                                                                                               // 6
 */                                                                                                                   // 7
FS.File.prototype.logCopyFailure = function(storeName, maxTries) {                                                    // 8
  var self = this;                                                                                                    // 9
                                                                                                                      // 10
  // hasStored will update from the fileRecord                                                                        // 11
  if (self.hasStored(storeName)) {                                                                                    // 12
    throw new Error("logCopyFailure: invalid storeName");                                                             // 13
  }                                                                                                                   // 14
                                                                                                                      // 15
  // Make sure we have a temporary file saved since we will be                                                        // 16
  // trying the save again.                                                                                           // 17
  FS.TempStore.ensureForFile(self);                                                                                   // 18
                                                                                                                      // 19
  var now = new Date;                                                                                                 // 20
  var currentCount = (self.failures && self.failures.copies && self.failures.copies[storeName] && typeof self.failures.copies[storeName].count === "number") ? self.failures.copies[storeName].count : 0;
  maxTries = maxTries || 5;                                                                                           // 22
                                                                                                                      // 23
  var modifier = {};                                                                                                  // 24
  modifier.$set = {};                                                                                                 // 25
  modifier.$set['failures.copies.' + storeName + '.lastAttempt'] = now;                                               // 26
  if (currentCount === 0) {                                                                                           // 27
    modifier.$set['failures.copies.' + storeName + '.firstAttempt'] = now;                                            // 28
  }                                                                                                                   // 29
  modifier.$set['failures.copies.' + storeName + '.count'] = currentCount + 1;                                        // 30
  modifier.$set['failures.copies.' + storeName + '.doneTrying'] = (currentCount + 1 >= maxTries);                     // 31
  self.update(modifier);                                                                                              // 32
};                                                                                                                    // 33
                                                                                                                      // 34
/**                                                                                                                   // 35
 * Has this store permanently failed?                                                                                 // 36
 * @param {String} storeName The name of the store                                                                    // 37
 * @return {boolean} Has this store failed permanently?                                                               // 38
 * @todo deprecate this                                                                                               // 39
 */                                                                                                                   // 40
FS.File.prototype.failedPermanently = function(storeName) {                                                           // 41
  var self = this;                                                                                                    // 42
  return !!(self.failures                                                                                             // 43
          && self.failures.copies                                                                                     // 44
          && self.failures.copies[storeName]                                                                          // 45
          && self.failures.copies[storeName].doneTrying);                                                             // 46
};                                                                                                                    // 47
                                                                                                                      // 48
/**                                                                                                                   // 49
 * @method FS.File.prototype.createReadStream                                                                         // 50
 * @public                                                                                                            // 51
 * @param {String} [storeName]                                                                                        // 52
 * @returns {stream.Readable} Readable NodeJS stream                                                                  // 53
 *                                                                                                                    // 54
 * Returns a readable stream. Where the stream reads from depends on the FS.File instance and whether you pass a store name.
 *                                                                                                                    // 56
 * * If you pass a `storeName`, a readable stream for the file data saved in that store is returned.                  // 57
 * * If you don't pass a `storeName` and data is attached to the FS.File instance (on `data` property, which must be a DataMan instance), then a readable stream for the attached data is returned.
 * * If you don't pass a `storeName` and there is no data attached to the FS.File instance, a readable stream for the file data currently in the temporary store (`FS.TempStore`) is returned.
 *                                                                                                                    // 60
 */                                                                                                                   // 61
FS.File.prototype.createReadStream = function(storeName) {                                                            // 62
  var self = this;                                                                                                    // 63
                                                                                                                      // 64
  // If we dont have a store name but got Buffer data?                                                                // 65
  if (!storeName && self.data) {                                                                                      // 66
    FS.debug && console.log("fileObj.createReadStream creating read stream for attached data");                       // 67
    // Stream from attached data if present                                                                           // 68
    return self.data.createReadStream();                                                                              // 69
  } else if (!storeName && FS.TempStore && FS.TempStore.exists(self)) {                                               // 70
    FS.debug && console.log("fileObj.createReadStream creating read stream for temp store");                          // 71
    // Stream from temp store - its a bit slower than regular streams?                                                // 72
    return FS.TempStore.createReadStream(self);                                                                       // 73
  } else {                                                                                                            // 74
    // Stream from the store using storage adapter                                                                    // 75
    if (self.isMounted()) {                                                                                           // 76
      var storage = self.collection.storesLookup[storeName] || self.collection.primaryStore;                          // 77
      FS.debug && console.log("fileObj.createReadStream creating read stream for store", storage.name);               // 78
      // return stream                                                                                                // 79
      return storage.adapter.createReadStream(self);                                                                  // 80
    } else {                                                                                                          // 81
      throw new Meteor.Error('File not mounted');                                                                     // 82
    }                                                                                                                 // 83
                                                                                                                      // 84
  }                                                                                                                   // 85
};                                                                                                                    // 86
                                                                                                                      // 87
/**                                                                                                                   // 88
 * @method FS.File.prototype.createWriteStream                                                                        // 89
 * @public                                                                                                            // 90
 * @param {String} [storeName]                                                                                        // 91
 * @returns {stream.Writeable} Writeable NodeJS stream                                                                // 92
 *                                                                                                                    // 93
 * Returns a writeable stream. Where the stream writes to depends on whether you pass in a store name.                // 94
 *                                                                                                                    // 95
 * * If you pass a `storeName`, a writeable stream for (over)writing the file data in that store is returned.         // 96
 * * If you don't pass a `storeName`, a writeable stream for writing to the temp store for this file is returned.     // 97
 *                                                                                                                    // 98
 */                                                                                                                   // 99
FS.File.prototype.createWriteStream = function(storeName) {                                                           // 100
  var self = this;                                                                                                    // 101
                                                                                                                      // 102
  // We have to have a mounted file in order for this to work                                                         // 103
  if (self.isMounted()) {                                                                                             // 104
    if (!storeName && FS.TempStore && FS.FileWorker) {                                                                // 105
      // If we have worker installed - we pass the file to FS.TempStore                                               // 106
      // We dont need the storeName since all stores will be generated from                                           // 107
      // TempStore.                                                                                                   // 108
      // This should trigger FS.FileWorker at some point?                                                             // 109
      FS.TempStore.createWriteStream(self);                                                                           // 110
    } else {                                                                                                          // 111
      // Stream directly to the store using storage adapter                                                           // 112
      var storage = self.collection.storesLookup[storeName] || self.collection.primaryStore;                          // 113
      return storage.adapter.createWriteStream(self);                                                                 // 114
    }                                                                                                                 // 115
  } else {                                                                                                            // 116
    throw new Meteor.Error('File not mounted');                                                                       // 117
  }                                                                                                                   // 118
};                                                                                                                    // 119
                                                                                                                      // 120
Meteor.methods({                                                                                                      // 121
  // Does a HEAD request to URL to get the type, updatedAt, and size prior to actually downloading the data.          // 122
  // That way we can do filter checks without actually downloading.                                                   // 123
  '_cfs_getUrlInfo': function (url, options) {                                                                        // 124
    this.unblock();                                                                                                   // 125
                                                                                                                      // 126
    var response = HTTP.call("HEAD", url, options);                                                                   // 127
    var headers = response.headers;                                                                                   // 128
    var result = {};                                                                                                  // 129
                                                                                                                      // 130
    if (headers['content-type']) {                                                                                    // 131
      result.type = headers['content-type'];                                                                          // 132
    }                                                                                                                 // 133
                                                                                                                      // 134
    if (headers['content-length']) {                                                                                  // 135
      result.size = +headers['content-length'];                                                                       // 136
    }                                                                                                                 // 137
                                                                                                                      // 138
    if (headers['last-modified']) {                                                                                   // 139
      result.updatedAt = new Date(headers['last-modified']);                                                          // 140
    }                                                                                                                 // 141
                                                                                                                      // 142
    return result;                                                                                                    // 143
  }                                                                                                                   // 144
});                                                                                                                   // 145
                                                                                                                      // 146
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['cfs-file'] = {};

})();
