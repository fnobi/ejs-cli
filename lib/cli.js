var fs = require('fs');
var path = require('path');

const yargs = require('yargs');
var async = require('async');
var ejs = require('ejs');
var glob = require('glob');
var mkdirp = require('mkdirp');
var chalk = require('chalk');

var fetchStdio = require(__dirname + '/fetchStdio');
var parseOptionsFile = require(__dirname + '/parseOptionsFile');

(function () {
    const argv = yargs
        .option('h', {
            type: 'boolean',
            alias: 'help',
            default: false,
            description: 'show this help.',
        })
        .option('f', {
            type: 'string',
            alias: 'file',
            description: 'give ejs template file path.',
        })

        .option('b', {
            type: 'string',
            alias: 'base-dir',
            default: './',
            description: 'base directory that -f is relative to.',
        })

        .option('e', {
            type: 'string',
            description: 'exclude files and/or directories',
            alias: 'exclude'
        })
        .option('o', {
            type: 'string',
            description: 'file to write compiled.',
            alias: 'out'
        })
        .option('O', {
            type: 'string',
            description: 'option variables (file path or JSON string).',
            alias: 'options'
        })
        .argv;

    if (argv.help) {
        yargs.showHelp();
        return;
    }

    var excludes = argv.e ? typeof argv.e === "string" ? argv.e.split(' ') : argv.e : null;
    var srcGlob = argv.file || argv._.shift();
    var outDir = argv.out;
    var baseDir = argv.b;

    var verbose = !!outDir; // output log only file output mode.
    function log (tag, msg) {
        if (!verbose) {
            return;
        }
        console.log(chalk.green(tag + ':\t' + msg));
    }

    function writeCompiled (result, srcPath, callback) {
        if (outDir) {
            srcPath = srcPath.replace(/\.ejs$/, '');
            if (!/\./.test(srcPath)) {
                srcPath += '.html';
            }
            srcPath = srcPath.replace(baseDir, '');

            var dest = path.join(outDir, srcPath);
            log('output', '"' + dest + '"');
            try{
                mkdirp(path.dirname(dest)).then(()=> {
                    fs.writeFile(dest, result, { encoding: 'utf8' }, function (err) {
                        callback(err);
                    });
                });
            } catch (e) {
                return callback(err);
            }
        } else {
            log('output', 'STDOUT');
            console.log(result);
            callback();
        }
    }

    var srcPaths = [];
    var options = {};

    async.series([function (next) {
        // read options
        if (!argv.options) {
            log('opts', 'none');
            return next();
        }

        if (fs.existsSync(argv.options)) {
            log('opts', '"' + argv.options + '"');
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
        glob(path.join(baseDir, srcGlob), function (err, array) {
            if (err) {
                return next(err);
            }

            if (excludes) {
                srcPaths = array.filter(function (path) {
                    var isIncluded = true;
                    excludes.forEach(function (toExclude) {
                        if (path.includes(toExclude)) isIncluded = false;
                    });

                    return isIncluded;
                });
            }

            else {
                srcPaths = array;
            }
            next();
        });
    }, function (next) {
        if (!srcGlob) {
            fetchStdio(function (err, src) {
                var result = ejs.render(src, options);
                writeCompiled(result, null, next);
            });
            return;
        }

        async.each(srcPaths, function (srcPath, done) {
            ejs.renderFile(srcPath, options, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    writeCompiled(result, srcPath, done);
                }
            });
        }, next);
    }], function (err) {
        if (err) {
            console.error(err);
        }
        process.exit();
    });
})();
