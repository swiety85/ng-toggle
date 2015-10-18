'use strict';

var gulp = require('gulp'),
    // gulp configuration object
    config = require('./gulp.config')(),
    // custom tasks
    requiredir = require("requiredir"),
    tasks = requiredir("./gulp"),
    // utils methods
    utils = require('./gulp/utils');



// bind example index.html with dependencies (scripts and styles files)
tasks.wiredep('example', {
    index: config.index,
    src: config.allJs,
    injectRelative: true
});

tasks.clean('clean-build', {
    src: config.build
});

tasks.libbuild('build', {
    src: config.allJs,
    libName: config.libName,
    build: config.build
}, ['test', 'example', 'clean-build']);

// run unit tests - close after testing is done
tasks.test('test', {
    singleRun: true
}, ['lint']);

// run unit tests - don't close task and listen for changes to rerun task again
tasks.test('autotest', {
    singleRun: false
}, ['lint']);





// help
gulp.task('help', require('gulp-task-listing'));

// listing available tasks
gulp.task('default', ['help']);

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
tasks.bump('bump', {
    src: config.packages
});

// jshint
tasks.lint('lint', {
    src: config.allJs
});
