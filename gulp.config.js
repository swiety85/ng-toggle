module.exports = function () {

    var wiredep = require('wiredep'),
        testsPath = './tests/',
        reportPath = './report/',
        bowerFiles = wiredep({devDependencies: true})['js'],
        srcPath = './src',
        examplePath = './examples',
        config = {
            index: examplePath+'/index.html',
            build: './build/',
            // all js files to compile
            allJs: [
                srcPath+'/**/*.js'
            ],
            // packages
            packages: [
                './package.json',
                './bower.json'
            ],
            libName: 'ngToggle.js'
        };

    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };

        return options;
    };

    config.karma = getKarmaOptions();

    return config;

    ////////////////

    function getKarmaOptions() {
        var options = {
            files: [].concat(
                bowerFiles,
                config.allJs,
                testsPath + '**/*.js'
            ),
            exclude: [],
            coverage: {
                dir: reportPath + 'coverage',
                reporters: [
                    {type: 'html', subdir: 'report-html'},
                    {type: 'lcov', subdir: 'report-lcov'},
                    {type: 'text-summary'}
                ]
            },
            preprocessors: {}
        };
        options.preprocessors[config.allJs] = ['coverage'];
        return options;
    }
};