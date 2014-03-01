var fs = require('fs');
var readline = require('readline');

var fetchStdio = function (stream, callback) {
    callback = callback || function () {};

    var lines = [];
    var reader = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    reader.on('line', function (line) {
        lines.push(line);
    });
    process.stdin.on('end', function () {
        callback(null, lines.join('\n'));
    });
};

module.exports = fetchStdio;
