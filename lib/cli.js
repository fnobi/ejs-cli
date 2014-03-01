(function () {
    var fs = require('fs');
    var optimist = require('optimist');
    var async = require('async');
    var ejs = require('ejs');

    var argv = optimist
            .boolean('h')
            .alias('h', 'help')
            .default('h', false)
            .describe('h', 'show this help.')

            .string('f')
            .alias('f', 'file')
            .describe('f', 'give ejs template file path.')

            .argv;

    if (argv.h) {
        optimist.showHelp();
        return;
    }

    var filepath = argv.f || argv._.shift();

    if (!filepath) {
        optimist.showHelp();
        return;
    }

    var src;

    async.series([function (next) {
        fs.exists(filepath, function (res) {
            if (!res) {
                return next(new Error(filepath + ' is not found.'));
            }
            next();
        });
    }, function (next) {
        fs.readFile(filepath, 'utf8', function (err, body) {
            if (err) {
                return next(err);
            }
            src = body;
            next();
        });
    }, function (next) {
        console.log(src);
        console.log(
            ejs.render(src, {})
        );
    }], function (err) {
        console.error(err);
        process.exit();
    });
})();
