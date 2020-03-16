const { src, dest, parallel,watch } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const minifyJs = require('gulp-minify');
const uglifyJs = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const livereload = require('gulp-livereload')

/** compile sass and minifying css */
function scss() {
  return src('./themes/uncompiled/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(minifyCSS())
    .pipe(concat('main.min.css'))
    .pipe(dest('./themes/compiled/css'));
}

/** minifying javascript and encripting */
function js() {
  return src('./themes/uncompiled/js/**/*.js', { sourcemaps: true })
    .pipe(minifyJs())
    .pipe(concat('main.min.js'))
    .pipe(uglifyJs())
    .pipe(dest('./themes/compiled/js', { sourcemaps: true }))
}

function server(){
  // livereload.listen();
    var files = [
        './'
    ];

    browserSync.init(files, {
        open: 'external',
        host: 'localhost',
        proxy: 'localhost/portal_sise',
        port: 80
    });

    watch("./themes/uncompiled/sass/*.scss").on('change', browserSync.reload);
    // gulp.watch("./themes/jp_temisto/**/*.twig").on('change', browserSync.reload);
    // gulp.watch("./*.html").on('change', browserSync.reload);
}

function watcher(){
  livereload.listen();
  scss();
  js();

  watch(['./themes/uncompiled/sass/**/*.scss', 'sass'], scss);
  watch(['./themes/uncompiled/js/**/*.js', 'js'], js);

  // watch(['./themes/jp_temisto/css/styles.css', './themes/jp_temisto/**/*.twig', './themes/jp_temisto/js/*.js'], function (files){
  //   livereload.changed(files);
  // });
}

exports.scss = scss;
exports.js = js;
exports.server = server;
exports.watcher = watcher;
exports.default = parallel(scss,js,server,watcher);