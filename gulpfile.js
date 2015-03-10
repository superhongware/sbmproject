var gulp = require('gulp'),
  gutil = require('gulp-util'),
  bower = require('bower'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  minifyCss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  sh = require('shelljs'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  livereload = require('gulp-livereload'),
  browserSync = require('browser-sync');


var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['./src/**/*.js'],

};


gulp.task('default', ['sass']);


gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done)
    .pipe(livereload());
});



gulp.task('js', function() {
  gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('www/js'))
    .pipe(livereload());
});


gulp.task('browser-sync', function () {
  var files = [
    'www/**/*.html',
    'www/css/**/*.css',
    'www/imgs/**/*.png',
    'www/js/**/*.js'
  ];

  browserSync.init(files, {
    server: {
      baseDir: './www'
    }
  });
});

gulp.task('watch', function() {
  // livereload.listen();
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});