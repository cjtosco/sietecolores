var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');
var cssnano = require('gulp-cssnano');
var htmlmin = require('gulp-htmlmin');
var minify = require('gulp-minify');
var compass = require('gulp-compass');
var browserSync = require('browser-sync').create();
var ghPages = require('gulp-gh-pages');

//const { series } = require('gulp');
//const { watch } = require('gulp');
const { series, watch, src, dest } = require('gulp');

const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const critical = require('critical');

function nunjucksTask(cb) {
  // Gets .html and .nunjucks files in pages
   return gulp.src('pages/*.html')
  // Renders template with nunjucks
    .pipe(nunjucksRender({
      path: ['pages/', 'templates/'],
      watch: false,
    }))
  // Gets .html and .nunjucks files in pages
    .pipe(gulp.dest('.www'));
  cb();
}

function compassTask(cb){
  gulp.src('./sass/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: 'stylesheets',
      sass: 'sass'
    }))
    .pipe(gulp.dest('stylesheets'));
  cb();
}

function cssMinifyTask(cb) {
  return gulp.src('stylesheets/**.css')
      .pipe(cssnano())
      .pipe(gulp.dest('.www/css'));
  cb();
}

function minifyHtmlTask(cb) {
  return gulp.src('./*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('.www'))
  cb();
}

function compressTask(cb) {
  gulp.src('js/*.js')
    .pipe(minify({
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('.www/js'))
  cb();
}

function imageMinTask(cb) {
  return src('img/*')
    .pipe(imagemin({
       progressive: true,
       svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(dest('.www/images'));
}

// Static Server + watching scss/html files
function serveTask(cb) {
    browserSync.init({
        server: ".www"
    });
    watch(['sass/*.scss'], compassTask, function(cb) {
      cb();
    });
    watch(".www/*.html").on('change', browserSync.reload);
    cb();
}

function criticalTask(cb) {
  critical.generate({
      inline: true,
      base: './.www/',
      src: 'index.html',
      target: 'css/index-critical.css',
      //target: 'index-critical.html',
      minify: true
  });
  cb();
}

exports.nunjucks = nunjucksTask
exports.compass = compassTask
exports.cssMinify = cssMinifyTask
exports.compress = compressTask
exports.imagemin = imageMinTask
exports.serve = serveTask
exports.critical = criticalTask
exports.build = series(nunjucksTask, compassTask, cssMinifyTask, compressTask, imageMinTask);