var gulp = require('gulp');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var wiredep = require('wiredep').stream;
var gulpBowerFiles = require('gulp-bower-files');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

gulp.task('styles', function(){
  var injectAppFiles = gulp.src('src/dev/styles/*.scss', {read: false});
  var injectGlobalFiles = gulp.src('src/dev/global/*.scss', {read: false});

  function transformFilepath(filepath) {
    return '@import "' + filepath.split('/').slice(2).join('/') + '";';  //Problem z tworzeniem poprawnej ścieżki - 'naprawiono'
  }

  var injectAppOptions = {
    transform: transformFilepath,
    starttag: '// inject:app',
    endtag: '// endinject',
    addRootSlash: false
  };

  var injectGlobalOptions = {
    transform: transformFilepath,
    starttag: '// inject:global',
    endtag: '// endinject',
    addRootSlash: false
  };

  var injectFPOptions = {
    transform: transformFilepath,
    starttag: '// inject:fp',
    endtag: '// endinject',
    addRootSlash: false
  };
  //ToDo: the file fulpage.min.css is not included by wiredep <sad_panda> I added it manually, but it need to be done by gulp asap
  return gulp.src('src/dev/style.scss')
    .pipe(wiredep())
    .pipe(inject(injectGlobalFiles, injectGlobalOptions))
    .pipe(inject(injectAppFiles, injectAppOptions))
    .pipe(sass())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('src/dist/styles'));
});

gulp.task('js', function(){
  var injectFilesJS = gulp.src(['src/dev/core.js']);
  var jsdep = require('wiredep')().js;
  gulp.src(jsdep)
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/dist/js/'));
  return injectFilesJS.pipe(gulp.dest('src/dist/js'));
});

gulp.task('html', ['styles', 'js'], function(){
  var injectFiles = gulp.src(['src/dist/styles/style.css']);


  var injectOptions = {
    addRootSlash: false,
    ignorePath: ['src', 'dist']
  };

  return gulp.src('src/dev/index.html')
    .pipe(inject(injectFiles, injectOptions))
    .pipe(inject(gulp.src(['src/dist/js/libs.js','src/dist/js/core.js']), injectOptions))
    .pipe(gulp.dest('src/dist'));
});

gulp.task('stream', function () {
  // Endless stream mode
  gulp.watch('src/dev/*.html', ['html'], { ignoreInitial: false });
  gulp.watch('src/dev/*.js', ['js'], { ignoreInitial: false });
  gulp.watch('src/dev/*.scss', ['styles'], { ignoreInitial: false });
  gulp.watch('src/dev/global/*.scss', ['styles'], { ignoreInitial: false });
  gulp.watch('src/dev/styles/*.scss', ['styles'], { ignoreInitial: false });

});
