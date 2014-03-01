(function () {
    var fs = require('fs');
    var optimist = require('optimist');
    var async = require('async');
    var ejs = require('ejs');

    var fetchFileSource = require(__dirname + '/fetchFileSource');
    var fetchStdio = require(__dirname + '/fetchStdio');

    var argv = optimist
            .boolean('h')
            .alias('h', 'help')
            .default('h', false)
            .describe('h', 'show this help.')

            .string('f')
            .alias('f', 'file')
            .describe('f', 'give ejs template file path.')

            .string('o')
            .alias('o', 'out')
            .describe('o', 'file to write compiled.')

            .argv;

    if (argv.h) {
        optimist.showHelp();
        return;
    }

    var srcPath = argv.f || argv._.shift();
    var destPath = argv.o;

    var src;

    async.series([function (next) {
        if (srcPath) {
            fetchFileSource(srcPath, function (err, s) {
                src = s;
                next(err);
            });
        } else {
            fetchStdio(function (err, s) {
                src = s;
                next(err);
            });
        }
    }, function (next) {
        var result = ejs.render(src, {});
        if (destPath) {
            fs.writeFile(destPath, result, { encoding: 'utf8' }, function (err) {
                next(err);
            });
        } else {
            console.log(result);
            next();
        }
    }], function (err) {
        if (err) {
            console.error(err);
        }
        process.exit();
    });
})();
