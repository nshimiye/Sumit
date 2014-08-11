var exec = Npm.require('child_process').exec;

if (pdf2htmlEX === undefined)
  pdf2htmlEX = {};

/**
 * Execute pdf2htmlEX in command line
 * @param  {array}    args: pdf2htmlEX args
 * @param  {Function} callback: the callback
 */
pdf2htmlEX.execute = function (args, callback) {
  var command = 'pdf2htmlEX ' + args.join(' ');
   
  exec(command, function(err, stdout, stderr) {
    if(err){ 
      return callback(new Error(err));
    }
    else {
      callback(null, new Buffer(stdout));//unneccesary
    }
  });
};

/**
 * Methods output resulting html file in current directory
 */

pdf2htmlEX.zoom = function (pdf, scale, callback) {
  pdf2htmlEX.execute(['--zoom', scale, pdf], callback);
};

pdf2htmlEX.split = function(pdf, callback) {
  pdf2htmlEX.execute(['--split-pages', 1, pdf], callback);
};

pdf2htmlEX.pageFilename = function(pdf, filename, callback) {
  pdf2htmlEX.execute(['--split-pages', 1, '--page-filename', filename, pdf], callback);
};

pdf2htmlEX.embed = function(pdf, switches, callback) {
  pdf2htmlEX.execute(['--embed', switches, pdf], callback);
};

pdf2htmlEX.custom = function(pdf, args, callback) {
  pdf2htmlEX.execute([args, pdf], callback);
};