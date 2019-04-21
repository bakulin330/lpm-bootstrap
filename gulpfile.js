;
(function () {
    'use strict';

    var gulp = require('gulp'),
        prefixer = require('gulp-autoprefixer'),
        sass = require('gulp-sass'),
        csso = require('gulp-csso'),
        notify = require('gulp-notify'),
        gutil = require('gulp-util'),
        concat = require('gulp-concat'),
        imagemin = require('gulp-imagemin'),
        htmlmin = require('gulp-htmlmin'),
        pngquant = require('imagemin-pngquant'),
        concatCss = require('gulp-concat-css'),
        sourcemaps = require('gulp-sourcemaps'),
        jade = require("gulp-jade"),
        rigger = require("gulp-rigger"),
        debug = require("gulp-debug"),
        str2base64 = require("gulp-lpm-scss-str2base64"),
        browserSync = require("browser-sync"),
        rimraf = require("rimraf"),
        merge2 = require('merge2'),
        reload = browserSync.reload;

    var prod = true,
        minify = false;

    var path = {
        build: {
            base: 'build/',
            img: 'build/img/',
            fonts: 'build/fonts/'
        },
        src: {
            index: 'src/index.jade',
            style: ['src/build.scss'],
            img: 'src/img/**/*.*',
            fonts: 'src/fonts/**/*.*'
        },
        watch: {
            style: ['src/style/**/*.scss', 'src/js/modules/**/*.scss']
        },
        clean: './build'
    };

    var serverConfig = {
        server: {
            baseDir: "./build"
        },
        tunnel: false,
        host: '127.0.0.1',
        port: 59000,
        logPrefix: "Frontend_Dev"
    };

    gulp.task('default', ['build', 'webserver', 'watch']);

    gulp.task('webserver', function () {
        browserSync(serverConfig);
    });

    gulp.task('build', [
        'build:index',
        'build:style',
        'build:image',
        'build:fonts'
    ]);

    gulp.task('watch', function () {
        gulp.watch(path.src.index, ['build:index']);
        gulp.watch(path.watch.style, ['build:style']);
        gulp.watch(path.src.img, ['build:image']);
        gulp.watch(path.src.fonts, ['build:fonts']);
    });

    gulp.task('build:index', function () {
        return gulp.src(path.src.index)
            .pipe(jade())
            .pipe(gulp.dest(path.build.base))
            .pipe(reload({stream: true}));
    });

    gulp.task('build:style', function () {
        return gulp.src(path.src.style)
            //.pipe(sourcemaps.init())
            .pipe(sass({style: 'compressed'}).on('error', notify.onError(function (error) {
                return 'Error: ' + error.message;
            })))
            .pipe(str2base64())
            .pipe(concatCss('a.css'))
            .pipe(prefixer({browsers: ['> 1%', 'last 4 versions', 'IE 7']}))
            .pipe(prod || minify ? csso({
                restructure: true,
                debug: true
            }) : gutil.noop())
            //.pipe(sourcemaps.write())
            .pipe(gulp.dest(path.build.base))
            .pipe(reload({stream: true}));;
    });

    gulp.task('build-editor', function () {
        return gulp.src('src/build-editor.scss')
            .pipe(sass({style: 'compressed'}).on('error', notify.onError(function (error) {
                return 'Error: ' + error.message;
            })))
            .pipe(str2base64())
            .pipe(concatCss('e.css'))
            .pipe(prefixer({browsers: ['> 1%', 'last 4 versions', 'IE 7']}))
            .pipe(prod || minify ? csso({
                restructure: true,
                debug: true
            }) : gutil.noop())
            .pipe(gulp.dest(path.build.base))
            .pipe(reload({stream: true}));
    });

    gulp.task('build:image', function () {
        return gulp.src(path.src.img)
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()]
                //interlaced: true
            }).on('error', notify.onError(function (error) {
                return 'Error: ' + error.message;
            })))
            .pipe(gulp.dest(path.build.img))
            .pipe(reload({stream: true}));
    });

    gulp.task('build:fonts', function () {
        return gulp.src(path.src.fonts)
            .pipe(gulp.dest(path.build.fonts))
    });

    gulp.task('clean', function (cb) {
        rimraf(path.clean, cb);
    });

})();
