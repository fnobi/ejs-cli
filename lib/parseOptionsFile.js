var async = require('async');
var fs = require('fs');

var parseOptionsFile = function (filepath, callback) {
    callback = callback || function () {};
    
    var src;
    var options = {};

    async.series([function (next) {
        fs.exists(filepath, function (exists) {
            if (!exists) {
                return next(new Error('"' + filepath + '" is not found.'));
            }
            return next();
        });
    }, function (next) {
        fs.readFile(filepath, 'utf8', function (err, body) {
            src = body;
            next(err);
        });
    }, function (next) {
        if (/\.json$/.test(filepath)) {
            try {
                options = JSON.parse(src.replace(/\n/g, ''));
            } catch (e) {
                return next(new Error('fail to parse JSON file.'));
            }
            return next();
        }

        callback(new Error('"' + filepath + '" is invalid file format.'));

    }], function (err) {
        callback(err, options);
    });
};

module.exports = parseOptionsFile;
