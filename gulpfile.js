var gulp = require('gulp');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var watch = require('gulp-watch');

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

  return gulp.src('src/dev/style.scss')
    .pipe(wiredep())
    .pipe(inject(injectGlobalFiles, injectGlobalOptions))
    .pipe(inject(injectAppFiles, injectAppOptions))
    .pipe(sass())
    .pipe(gulp.dest('src/dist/styles'));
});

gulp.task('js', function(){
  var injectFilesJS = gulp.src(['src/dev/core.js']);

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
    .pipe(wiredep())
    .pipe(inject(gulp.src(['src/dist/js/core.js']), injectOptions))
    .pipe(gulp.dest('src/dist'));
});

gulp.task('stream', function () {
    // Endless stream mode
    gulp.watch('src/dev/*.html', ['html'], { ignoreInitial: false });
    gulp.watch('src/dev/*.scss', ['html'], { ignoreInitial: false });
    gulp.watch('src/dev/global/*.scss', ['html'], { ignoreInitial: false });
    gulp.watch('src/dev/styles/*.scss', ['html'], { ignoreInitial: false });
});
