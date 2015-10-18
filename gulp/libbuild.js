var gulp = require('gulp'),
// all gulp plugins installed by npm
    gp = require('gulp-load-plugins')({lazy: true}),
// utils methods
    utils = require('./utils');

/**
 * Config params:
 * - src: path to client source files
 * - libName: name of concatenated (and minified) file will have
 * - build: path to build folder
 * @param config
 */
module.exports = function (taskName, config, depTasks) {

    gulp.task(taskName, depTasks, function () {
        return gulp.src(config.src)
            .pipe(gp.concat(config.libName))
            .pipe(gulp.dest(config.build))
            .pipe(gp.rename(function (path) {
                path.basename += '.min';
            }))
            .pipe(gp.uglify())
            .pipe(gulp.dest(config.build));
    });
};