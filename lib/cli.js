(function () {
    var fs = require('fs');
    var optimist = require('optimist');
    var colors = require('colors');
    var async = require('async');
    var ejs = require('ejs');

    var fetchFileSource = require(__dirname + '/fetchFileSource');
    var fetchStdio = require(__dirname + '/fetchStdio');
    var parseOptionsFile = require(__dirname + '/parseOptionsFile');

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

            .string('O')
            .alias('O', 'options')
            .describe('O', 'option variables (file path or JSON string).')

            .argv;

    if (argv.help) {
        optimist.showHelp();
        return;
    }

    var srcPath = argv.file || argv._.shift();
    var destPath = argv.out;

    var verbose = !!destPath; // output log only file output mode.
    function log (tag, msg) {
        if (!verbose) {
            return;
        }
        console.log((tag + ':\t' + msg).green);
    }

    var src;
    var options = {};


    async.series([function (next) {
        if (srcPath) {
            log('src', '"' + srcPath + '"');
            fetchFileSource(srcPath, function (err, s) {
                src = s;
                next(err);
            });
        } else {
            log('src', 'STDIO');
            fetchStdio(function (err, s) {
                src = s;
                next(err);
            });
        }
    }, function (next) {
        if (!argv.options) {
            log('options', 'none');
            return next();
        }

        if (fs.existsSync(argv.options)) {
            log('options', '"' + argv.options + '"');
            parseOptionsFile(argv.options, function (err, opts) {
                options = opts;
                next(err);
            });
            return;
        }

        log('options', argv.options);
        try {
            options = JSON.parse(argv.options);
        } catch (e) {
            return next(new Error('fail to parse options JSON.\n => ' + argv.options));
        }
        return next();

    }, function (next) {
        var result = ejs.render(src, options);
        if (destPath) {
            log('output', '"' + destPath + '"');
            fs.writeFile(destPath, result, { encoding: 'utf8' }, function (err) {
                next(err);
            });
        } else {
            log('output', 'STDOUT');
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
