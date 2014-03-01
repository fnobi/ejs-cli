var fs = require('fs');

var fetchFileSource = function (filepath, callback) {
    filepath = filepath || '';
    callback = callback || function () {};

    fs.exists(filepath, function (res) {
        if (!res) {
            return callback(new Error(filepath + ' is not found.'));
        }

        fs.readFile(filepath, 'utf8', function (err, body) {
            if (err) {
                return callbacck(err);
            }
            callback(null, body);
        });
    });

};

module.exports = fetchFileSource;
