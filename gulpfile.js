var gulp = require('gulp'),
  gutil = require('gulp-util'),
  bower = require('bower'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  less = require('gulp-less');
  minifyCss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  sh = require('shelljs'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  livereload = require('gulp-livereload'),
  browserSync = require('browser-sync');


var paths = {
  sass: ['./scss/**/*.scss'],
  less: ['./less/**/*.less'],
  jssrc:['./src'],
  js: ['/index','/index2'],

};


gulp.task('default', ['sass','js']);

//sass 解析
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

// less 解析
gulp.task('less', function () {
  return gulp.src('./less/style.less')
    .pipe(less())
    .pipe(minifyCss())
    .pipe(gulp.dest('./www/css'));
});

//js 打包
gulp.task('js', function() {
  for (var i = 0; i < paths.js.length; i++) {
    gulp.src(paths.jssrc+paths.js[i]+'/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('app.js'))
      .pipe(gulp.dest('www/js'+paths.js[i]))
      .pipe(livereload());
  };
});


//开发调试
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
  gulp.watch(paths.less, ['less']);
  for (var i = 0; i < paths.js.length; i++) {
    gulp.watch(paths.jssrc+paths.js[i]+'/**/*.js', ['js']);
  };
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