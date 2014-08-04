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
var PowerQueue = Package['power-queue'].PowerQueue;
var ReactiveList = Package['reactive-list'].ReactiveList;

/* Package-scope variables */
var httpCall, buildUrl, encodeParams, encodeString, makeErrorByStatus, populateData, UploadTransferQueue;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/cfs-upload-http/http-call-client.js                                                                  //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
/*                                                                                                               // 1
 * We use this instead of HTTP.call from the http package for now. If/when                                       // 2
 * PR 1670 is merged and released, we can probably remove this file and begin                                    // 3
 * using HTTP.call directly.                                                                                     // 4
 */                                                                                                              // 5
                                                                                                                 // 6
httpCall = function(method, url, options, callback) {                                                            // 7
                                                                                                                 // 8
  ////////// Process arguments //////////                                                                        // 9
                                                                                                                 // 10
  if (! callback && typeof options === "function") {                                                             // 11
    // support (method, url, callback) argument list                                                             // 12
    callback = options;                                                                                          // 13
    options = null;                                                                                              // 14
  }                                                                                                              // 15
                                                                                                                 // 16
  options = options || {};                                                                                       // 17
                                                                                                                 // 18
  if (typeof callback !== "function")                                                                            // 19
    throw new Error(                                                                                             // 20
      "Can't make a blocking HTTP call from the client; callback required.");                                    // 21
                                                                                                                 // 22
  method = (method || "").toUpperCase();                                                                         // 23
                                                                                                                 // 24
  var headers = {};                                                                                              // 25
                                                                                                                 // 26
  var content = options.content;                                                                                 // 27
  if (options.data) {                                                                                            // 28
    content = JSON.stringify(options.data);                                                                      // 29
    headers['Content-Type'] = 'application/json';                                                                // 30
  }                                                                                                              // 31
                                                                                                                 // 32
  var params_for_url, params_for_body;                                                                           // 33
  if (content || method === "GET" || method === "HEAD")                                                          // 34
    params_for_url = options.params;                                                                             // 35
  else                                                                                                           // 36
    params_for_body = options.params;                                                                            // 37
                                                                                                                 // 38
  var query_match = /^(.*?)(\?.*)?$/.exec(url);                                                                  // 39
  url = buildUrl(query_match[1], query_match[2],                                                                 // 40
                 options.query, params_for_url);                                                                 // 41
                                                                                                                 // 42
  if (options.followRedirects === false)                                                                         // 43
    throw new Error("Option followRedirects:false not supported on client.");                                    // 44
                                                                                                                 // 45
  var username, password;                                                                                        // 46
  if (options.auth) {                                                                                            // 47
    var colonLoc = options.auth.indexOf(':');                                                                    // 48
    if (colonLoc < 0)                                                                                            // 49
      throw new Error('auth option should be of the form "username:password"');                                  // 50
    username = options.auth.substring(0, colonLoc);                                                              // 51
    password = options.auth.substring(colonLoc+1);                                                               // 52
  }                                                                                                              // 53
                                                                                                                 // 54
  if (params_for_body) {                                                                                         // 55
    content = encodeParams(params_for_body);                                                                     // 56
  }                                                                                                              // 57
                                                                                                                 // 58
  FS.Utility.extend(headers, options.headers || {});                                                             // 59
                                                                                                                 // 60
  ////////// Callback wrapping //////////                                                                        // 61
                                                                                                                 // 62
  // wrap callback to add a 'response' property on an error, in case                                             // 63
  // we have both (http 4xx/5xx error, which has a response payload)                                             // 64
  callback = (function(callback) {                                                                               // 65
    return function(error, response) {                                                                           // 66
      if (error && response)                                                                                     // 67
        error.response = response;                                                                               // 68
      callback(error, response);                                                                                 // 69
    };                                                                                                           // 70
  })(callback);                                                                                                  // 71
                                                                                                                 // 72
  // safety belt: only call the callback once.                                                                   // 73
  callback = FS.Utility.once(callback);                                                                          // 74
                                                                                                                 // 75
                                                                                                                 // 76
  ////////// Kickoff! //////////                                                                                 // 77
                                                                                                                 // 78
  // from this point on, errors are because of something remote, not                                             // 79
  // something we should check in advance. Turn exceptions into error                                            // 80
  // results.                                                                                                    // 81
  try {                                                                                                          // 82
    // setup XHR object                                                                                          // 83
    var xhr;                                                                                                     // 84
    if (typeof XMLHttpRequest !== "undefined")                                                                   // 85
      xhr = new XMLHttpRequest();                                                                                // 86
    else if (typeof ActiveXObject !== "undefined")                                                               // 87
      xhr = new ActiveXObject("Microsoft.XMLHttp"); // IE6                                                       // 88
    else                                                                                                         // 89
      throw new Error("Can't create XMLHttpRequest"); // ???                                                     // 90
                                                                                                                 // 91
    xhr.open(method, url, true, username, password);                                                             // 92
                                                                                                                 // 93
    // support custom "ejson-binary" response type                                                               // 94
    // and all browser-supported types                                                                           // 95
    var convertToBinary;                                                                                         // 96
    if (options.responseType === "ejson-binary") {                                                               // 97
      xhr.responseType = "arraybuffer";                                                                          // 98
      convertToBinary = true;                                                                                    // 99
    } else {                                                                                                     // 100
      xhr.responseType = options.responseType;                                                                   // 101
    }                                                                                                            // 102
                                                                                                                 // 103
    for (var k in headers)                                                                                       // 104
      xhr.setRequestHeader(k, headers[k]);                                                                       // 105
                                                                                                                 // 106
                                                                                                                 // 107
    // setup timeout                                                                                             // 108
    var timed_out = false;                                                                                       // 109
    var timer;                                                                                                   // 110
    if (options.timeout) {                                                                                       // 111
      timer = Meteor.setTimeout(function() {                                                                     // 112
        timed_out = true;                                                                                        // 113
        xhr.abort();                                                                                             // 114
      }, options.timeout);                                                                                       // 115
    };                                                                                                           // 116
                                                                                                                 // 117
    // callback on complete                                                                                      // 118
    xhr.onreadystatechange = function(evt) {                                                                     // 119
      if (xhr.readyState === 4) { // COMPLETE                                                                    // 120
        if (timer)                                                                                               // 121
          Meteor.clearTimeout(timer);                                                                            // 122
                                                                                                                 // 123
        if (timed_out) {                                                                                         // 124
          callback(new Error("timeout"));                                                                        // 125
        } else if (! xhr.status) {                                                                               // 126
          // no HTTP response                                                                                    // 127
          callback(new Error("network"));                                                                        // 128
        } else {                                                                                                 // 129
                                                                                                                 // 130
          var response = {};                                                                                     // 131
          response.statusCode = xhr.status;                                                                      // 132
                                                                                                                 // 133
          var body = xhr.response || xhr.responseText;                                                           // 134
                                                                                                                 // 135
          // Some browsers don't yet support "json" responseType,                                                // 136
          // but we can replicate it                                                                             // 137
          if (options.responseType === "json" && typeof body === "string") {                                     // 138
            try {                                                                                                // 139
              body = JSON.parse(body);                                                                           // 140
            } catch (err) {                                                                                      // 141
              body = null;                                                                                       // 142
            }                                                                                                    // 143
          }                                                                                                      // 144
                                                                                                                 // 145
          // Add support for a custom responseType: "ejson-binary"                                               // 146
          if (convertToBinary && typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined" && body instanceof ArrayBuffer) {
            var view = new Uint8Array(body);                                                                     // 148
            var len = body.byteLength;                                                                           // 149
            var binaryBody = EJSON.newBinary(len);                                                               // 150
            for (var i = 0; i < len; i++) {                                                                      // 151
              binaryBody[i] = view[i];                                                                           // 152
            }                                                                                                    // 153
            body = binaryBody;                                                                                   // 154
          }                                                                                                      // 155
                                                                                                                 // 156
          response.content = body;                                                                               // 157
                                                                                                                 // 158
          response.headers = {};                                                                                 // 159
          var header_str = xhr.getAllResponseHeaders();                                                          // 160
                                                                                                                 // 161
          // https://github.com/meteor/meteor/issues/553                                                         // 162
          //                                                                                                     // 163
          // In Firefox there is a weird issue, sometimes                                                        // 164
          // getAllResponseHeaders returns the empty string, but                                                 // 165
          // getResponseHeader returns correct results. Possibly this                                            // 166
          // issue:                                                                                              // 167
          // https://bugzilla.mozilla.org/show_bug.cgi?id=608735                                                 // 168
          //                                                                                                     // 169
          // If this happens we can't get a full list of headers, but                                            // 170
          // at least get content-type so our JSON decoding happens                                              // 171
          // correctly. In theory, we could try and rescue more header                                           // 172
          // values with a list of common headers, but content-type is                                           // 173
          // the only vital one for now.                                                                         // 174
          if ("" === header_str && xhr.getResponseHeader("content-type"))                                        // 175
            header_str =                                                                                         // 176
            "content-type: " + xhr.getResponseHeader("content-type");                                            // 177
                                                                                                                 // 178
          var headers_raw = header_str.split(/\r?\n/);                                                           // 179
          FS.Utility.each(headers_raw, function (h) {                                                            // 180
            var m = /^(.*?):(?:\s+)(.*)$/.exec(h);                                                               // 181
            if (m && m.length === 3)                                                                             // 182
              response.headers[m[1].toLowerCase()] = m[2];                                                       // 183
          });                                                                                                    // 184
                                                                                                                 // 185
          populateData(response);                                                                                // 186
                                                                                                                 // 187
          var error = null;                                                                                      // 188
          if (response.statusCode >= 400)                                                                        // 189
            error = makeErrorByStatus(response.statusCode, response.content);                                    // 190
                                                                                                                 // 191
          callback(error, response);                                                                             // 192
        }                                                                                                        // 193
      }                                                                                                          // 194
    };                                                                                                           // 195
                                                                                                                 // 196
    // send it on its way                                                                                        // 197
    xhr.send(content);                                                                                           // 198
                                                                                                                 // 199
  } catch (err) {                                                                                                // 200
    callback(err);                                                                                               // 201
  }                                                                                                              // 202
                                                                                                                 // 203
};                                                                                                               // 204
                                                                                                                 // 205
buildUrl = function(before_qmark, from_qmark, opt_query, opt_params) {                                           // 206
  var url_without_query = before_qmark;                                                                          // 207
  var query = from_qmark ? from_qmark.slice(1) : null;                                                           // 208
                                                                                                                 // 209
  if (typeof opt_query === "string")                                                                             // 210
    query = String(opt_query);                                                                                   // 211
                                                                                                                 // 212
  if (opt_params) {                                                                                              // 213
    query = query || "";                                                                                         // 214
    var prms = encodeParams(opt_params);                                                                         // 215
    if (query && prms)                                                                                           // 216
      query += '&';                                                                                              // 217
    query += prms;                                                                                               // 218
  }                                                                                                              // 219
                                                                                                                 // 220
  var url = url_without_query;                                                                                   // 221
  if (query !== null)                                                                                            // 222
    url += ("?"+query);                                                                                          // 223
                                                                                                                 // 224
  return url;                                                                                                    // 225
};                                                                                                               // 226
                                                                                                                 // 227
encodeParams = function(params) {                                                                                // 228
  var buf = [];                                                                                                  // 229
  FS.Utility.each(params, function(value, key) {                                                                 // 230
    if (buf.length)                                                                                              // 231
      buf.push('&');                                                                                             // 232
    buf.push(encodeString(key), '=', encodeString(value));                                                       // 233
  });                                                                                                            // 234
  return buf.join('').replace(/%20/g, '+');                                                                      // 235
};                                                                                                               // 236
                                                                                                                 // 237
encodeString = function(str) {                                                                                   // 238
  return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");                               // 239
};                                                                                                               // 240
                                                                                                                 // 241
makeErrorByStatus = function(statusCode, content) {                                                              // 242
  var MAX_LENGTH = 160; // if you change this, also change the appropriate test                                  // 243
                                                                                                                 // 244
  var truncate = function(str, length) {                                                                         // 245
    return str.length > length ? str.slice(0, length) + '...' : str;                                             // 246
  };                                                                                                             // 247
                                                                                                                 // 248
  var message = "failed [" + statusCode + "]";                                                                   // 249
  if (content)                                                                                                   // 250
    message += " " + truncate(content.replace(/\n/g, " "), MAX_LENGTH);                                          // 251
                                                                                                                 // 252
  return new Error(message);                                                                                     // 253
};                                                                                                               // 254
                                                                                                                 // 255
// Fill in `response.data` if the content-type is JSON.                                                          // 256
populateData = function(response) {                                                                              // 257
  // Read Content-Type header, up to a ';' if there is one.                                                      // 258
  // A typical header might be "application/json; charset=utf-8"                                                 // 259
  // or just "application/json".                                                                                 // 260
  var contentType = (response.headers['content-type'] || ';').split(';')[0];                                     // 261
                                                                                                                 // 262
  // Only try to parse data as JSON if server sets correct content type.                                         // 263
  if (FS.Utility.include(['application/json', 'text/javascript'], contentType)) {                                // 264
    try {                                                                                                        // 265
      response.data = JSON.parse(response.content);                                                              // 266
    } catch (err) {                                                                                              // 267
      response.data = null;                                                                                      // 268
    }                                                                                                            // 269
  } else {                                                                                                       // 270
    response.data = null;                                                                                        // 271
  }                                                                                                              // 272
};                                                                                                               // 273
                                                                                                                 // 274
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/cfs-upload-http/upload-http-common.js                                                                //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
FS.HTTP = FS.HTTP || {};                                                                                         // 1
                                                                                                                 // 2
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/cfs-upload-http/upload-http-client.js                                                                //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
/*                                                                                                               // 1
 * HTTP Upload Transfer Queue                                                                                    // 2
 */                                                                                                              // 3
                                                                                                                 // 4
// 2MB default upload chunk size                                                                                 // 5
// Can be overridden by user with FS.config.uploadChunkSize or per FS.Collection in collection options           // 6
var defaultChunkSize = 2 * 1024 * 1024;                                                                          // 7
                                                                                                                 // 8
/**                                                                                                              // 9
 * @private                                                                                                      // 10
 * @param {Object} task                                                                                          // 11
 * @param {Function} next                                                                                        // 12
 * @return {undefined}                                                                                           // 13
 */                                                                                                              // 14
var _taskHandler = function(task, next) {                                                                        // 15
  FS.debug && console.log("uploading chunk " + task.chunk + ", bytes " + task.start + " to " + Math.min(task.end, task.fileObj.size()) + " of " + task.fileObj.size());
  task.fileObj.data.getBinary(task.start, task.end, function gotBinaryCallback(err, data) {                      // 17
    if (err) {                                                                                                   // 18
      next(new Meteor.Error(err.error, err.message));                                                            // 19
    } else {                                                                                                     // 20
                                                                                                                 // 21
      FS.debug && console.log('PUT to URL', task.url, task.urlParams);                                           // 22
                                                                                                                 // 23
      httpCall("PUT", task.url, {                                                                                // 24
        params: FS.Utility.extend({chunk: task.chunk}, task.urlParams),                                          // 25
        content: data,                                                                                           // 26
        headers: {                                                                                               // 27
          'Content-Type': task.fileObj.type()                                                                    // 28
        }                                                                                                        // 29
      }, function(error, result) {                                                                               // 30
        task = null;                                                                                             // 31
        if (error) {                                                                                             // 32
          next(new Meteor.Error(error.error, error.message));                                                    // 33
        } else {                                                                                                 // 34
          next();                                                                                                // 35
        }                                                                                                        // 36
      });                                                                                                        // 37
                                                                                                                 // 38
    }                                                                                                            // 39
  });                                                                                                            // 40
};                                                                                                               // 41
                                                                                                                 // 42
/**                                                                                                              // 43
 * @private                                                                                                      // 44
 * @param {Object} data                                                                                          // 45
 * @param {Function} addTask                                                                                     // 46
 * @return {undefined}                                                                                           // 47
 */                                                                                                              // 48
var _errorHandler = function(data, addTask) {                                                                    // 49
  // What to do if file upload fails?                                                                            // 50
};                                                                                                               // 51
                                                                                                                 // 52
/** @method UploadTransferQueue                                                                                  // 53
 * @namespace UploadTransferQueue                                                                                // 54
 * @constructor                                                                                                  // 55
 * @param {Object} [options]                                                                                     // 56
 */                                                                                                              // 57
UploadTransferQueue = function(options) {                                                                        // 58
  // Rig options                                                                                                 // 59
  options = options || {};                                                                                       // 60
                                                                                                                 // 61
  // Init the power queue                                                                                        // 62
  var self = new PowerQueue({                                                                                    // 63
    name: 'HTTPUploadTransferQueue',                                                                             // 64
    // spinalQueue: ReactiveList,                                                                                // 65
    maxProcessing: 1,                                                                                            // 66
    maxFailures: 5,                                                                                              // 67
    jumpOnFailure: true,                                                                                         // 68
    autostart: true,                                                                                             // 69
    isPaused: false,                                                                                             // 70
    filo: false,                                                                                                 // 71
    debug: true                                                                                                  // 72
  });                                                                                                            // 73
                                                                                                                 // 74
  // Keep track of uploaded files via this queue                                                                 // 75
  self.files = {};                                                                                               // 76
                                                                                                                 // 77
  // cancel maps onto queue reset                                                                                // 78
  self.cancel = self.reset;                                                                                      // 79
                                                                                                                 // 80
  /**                                                                                                            // 81
    * @method UploadTransferQueue.isUploadingFile                                                                // 82
    * @param {FS.File} fileObj File to check if uploading                                                        // 83
    * @returns {Boolean} True if the file is uploading                                                           // 84
    *                                                                                                            // 85
    * @todo Maybe have a similar function for accessing the file upload queue?                                   // 86
    */                                                                                                           // 87
  self.isUploadingFile = function(fileObj) {                                                                     // 88
    // Check if file is already in queue                                                                         // 89
    return !!(fileObj && fileObj._id && fileObj.collectionName && (self.files[fileObj.collectionName] || {})[fileObj._id]);
  };                                                                                                             // 91
                                                                                                                 // 92
  /** @method UploadTransferQueue.resumeUploadingFile                                                            // 93
   * @param {FS.File} File to resume uploading                                                                   // 94
   * @todo Not sure if this is the best way to handle resumes                                                    // 95
   */                                                                                                            // 96
  self.resumeUploadingFile = function(fileObj) {                                                                 // 97
    // Make sure we are handed a FS.File                                                                         // 98
    if (!(fileObj instanceof FS.File)) {                                                                         // 99
      throw new Error('Transfer queue expects a FS.File');                                                       // 100
    }                                                                                                            // 101
                                                                                                                 // 102
    if (fileObj.isMounted()) {                                                                                   // 103
      // This might still be true, preventing upload, if                                                         // 104
      // there was a server restart without client restart.                                                      // 105
      self.files[fileObj.collectionName] = self.files[fileObj.collectionName] || {};                             // 106
      self.files[fileObj.collectionName][fileObj._id] = false;                                                   // 107
      // Kick off normal upload                                                                                  // 108
      self.uploadFile(fileObj);                                                                                  // 109
    }                                                                                                            // 110
  };                                                                                                             // 111
                                                                                                                 // 112
  /** @method UploadTransferQueue.uploadFile                                                                     // 113
   * @param {FS.File} File to upload                                                                             // 114
   * @todo Check that a file can only be added once - maybe a visual helper on the FS.File?                      // 115
   * @todo Have an initial request to the server getting uploaded chunks for resume                              // 116
   */                                                                                                            // 117
  self.uploadFile = function(fileObj) {                                                                          // 118
    FS.debug && console.log("HTTP uploadFile");                                                                  // 119
                                                                                                                 // 120
    // Make sure we are handed a FS.File                                                                         // 121
    if (!(fileObj instanceof FS.File)) {                                                                         // 122
      throw new Error('Transfer queue expects a FS.File');                                                       // 123
    }                                                                                                            // 124
                                                                                                                 // 125
    // Make sure that we have size as number                                                                     // 126
    if (typeof fileObj.size() !== 'number') {                                                                    // 127
      throw new Error('TransferQueue upload failed: fileObj size not set');                                      // 128
    }                                                                                                            // 129
                                                                                                                 // 130
    // We don't add the file if it's already in transfer or if already uploaded                                  // 131
    if (self.isUploadingFile(fileObj) || fileObj.isUploaded()) {                                                 // 132
      return;                                                                                                    // 133
    }                                                                                                            // 134
                                                                                                                 // 135
    // Make sure the file object is mounted on a collection                                                      // 136
    if (fileObj.isMounted()) {                                                                                   // 137
                                                                                                                 // 138
      var collectionName = fileObj.collectionName;                                                               // 139
      var id = fileObj._id;                                                                                      // 140
                                                                                                                 // 141
      // Set the chunkSize to match the collection options, or global config, or default                         // 142
      fileObj.chunkSize = fileObj.collection.options.chunkSize || FS.config.uploadChunkSize || defaultChunkSize; // 143
      // Set counter for uploaded chunks                                                                         // 144
      fileObj.chunkCount = 0;                                                                                    // 145
      // Calc the number of chunks                                                                               // 146
      fileObj.chunkSum = Math.ceil(fileObj.size() / fileObj.chunkSize);                                          // 147
                                                                                                                 // 148
      if (fileObj.chunkSum === 0)                                                                                // 149
        return;                                                                                                  // 150
                                                                                                                 // 151
      // Update the filerecord                                                                                   // 152
      // TODO eventually we should be able to do this without storing any chunk info in the filerecord           // 153
      fileObj.update({$set: {chunkSize: fileObj.chunkSize, chunkCount: fileObj.chunkCount, chunkSum: fileObj.chunkSum}});
                                                                                                                 // 155
      // Create a sub queue                                                                                      // 156
      var chunkQueue = new PowerQueue({                                                                          // 157
        onEnded: function oneChunkQueueEnded() {                                                                 // 158
          // Remove from list of files being uploaded                                                            // 159
          self.files[collectionName][id] = false;                                                                // 160
        },                                                                                                       // 161
        spinalQueue: ReactiveList,                                                                               // 162
        maxProcessing: 1,                                                                                        // 163
        maxFailures: 5,                                                                                          // 164
        jumpOnFailure: true,                                                                                     // 165
        autostart: false,                                                                                        // 166
        isPaused: false,                                                                                         // 167
        filo: false                                                                                              // 168
      });                                                                                                        // 169
                                                                                                                 // 170
      // Rig the custom task handler                                                                             // 171
      chunkQueue.taskHandler = _taskHandler;                                                                     // 172
                                                                                                                 // 173
      // Rig the error handler                                                                                   // 174
      chunkQueue.errorHandler = _errorHandler;                                                                   // 175
                                                                                                                 // 176
      // Set flag that this file is being transfered                                                             // 177
      self.files[collectionName] = self.files[collectionName] || {};                                             // 178
      self.files[collectionName][id] = true;                                                                     // 179
                                                                                                                 // 180
      // Construct URL                                                                                           // 181
      var url = FS.HTTP.uploadUrl + '/' + collectionName;                                                        // 182
      if (id) {                                                                                                  // 183
        url += '/' + id;                                                                                         // 184
      }                                                                                                          // 185
                                                                                                                 // 186
      // TODO: Could we somehow figure out if the collection requires login?                                     // 187
      var authToken = '';                                                                                        // 188
      if (typeof Accounts !== "undefined") {                                                                     // 189
        var authObject = {                                                                                       // 190
          authToken: Accounts._storedLoginToken() || '',                                                         // 191
        };                                                                                                       // 192
                                                                                                                 // 193
        // Set the authToken                                                                                     // 194
        var authString = JSON.stringify(authObject);                                                             // 195
        authToken = FS.Utility.btoa(authString);                                                                 // 196
      }                                                                                                          // 197
                                                                                                                 // 198
      // Construct query string                                                                                  // 199
      var urlParams = {                                                                                          // 200
        filename: fileObj.name()                                                                                 // 201
      };                                                                                                         // 202
      if (authToken !== '') {                                                                                    // 203
        urlParams.token = authToken;                                                                             // 204
      }                                                                                                          // 205
                                                                                                                 // 206
      // Add chunk upload tasks                                                                                  // 207
      for (var chunk = 0, start; chunk < fileObj.chunkSum; chunk++) {                                            // 208
        start = chunk * fileObj.chunkSize;                                                                       // 209
        // Create and add the task                                                                               // 210
        // XXX should we somehow make sure we haven't uploaded this chunk already, in                            // 211
        // case we are resuming?                                                                                 // 212
        chunkQueue.add({                                                                                         // 213
          chunk: chunk,                                                                                          // 214
          name: fileObj.name(),                                                                                  // 215
          url: url,                                                                                              // 216
          urlParams: urlParams,                                                                                  // 217
          fileObj: fileObj,                                                                                      // 218
          start: start,                                                                                          // 219
          end: (chunk + 1) * fileObj.chunkSize                                                                   // 220
        });                                                                                                      // 221
      }                                                                                                          // 222
                                                                                                                 // 223
      // Add the queue to the main upload queue                                                                  // 224
      self.add(chunkQueue);                                                                                      // 225
    }                                                                                                            // 226
                                                                                                                 // 227
  };                                                                                                             // 228
                                                                                                                 // 229
  return self;                                                                                                   // 230
};                                                                                                               // 231
                                                                                                                 // 232
/**                                                                                                              // 233
 * @namespace FS                                                                                                 // 234
 * @type UploadTransferQueue                                                                                     // 235
 *                                                                                                               // 236
 * There is a single uploads transfer queue per client (not per CFS)                                             // 237
 */                                                                                                              // 238
FS.HTTP.uploadQueue = new UploadTransferQueue();                                                                 // 239
                                                                                                                 // 240
/*                                                                                                               // 241
 * FS.File extensions                                                                                            // 242
 */                                                                                                              // 243
                                                                                                                 // 244
/**                                                                                                              // 245
 * @method FS.File.prototype.resume                                                                              // 246
 * @public                                                                                                       // 247
 * @param {File|Blob|Buffer} ref                                                                                 // 248
 * @todo WIP, Not yet implemented for server                                                                     // 249
 *                                                                                                               // 250
 * > This function is not yet implemented for server                                                             // 251
 */                                                                                                              // 252
FS.File.prototype.resume = function(ref) {                                                                       // 253
  var self = this;                                                                                               // 254
  FS.uploadQueue.resumeUploadingFile(self);                                                                      // 255
};                                                                                                               // 256
                                                                                                                 // 257
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['cfs-upload-http'] = {};

})();

//# sourceMappingURL=9d04fd0effda6304abbafa27a1fe95cf51b10434.map
