var gulp = require('gulp');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;

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

gulp.task('html', ['styles'], function(){
  var injectFiles = gulp.src(['src/dist/styles/style.css']);

  var injectOptions = {
    addRootSlash: false,
    ignorePath: ['src', 'dist']
  };

  return gulp.src('src/dev/index.html')
    .pipe(inject(injectFiles, injectOptions))
    .pipe(wiredep())
    .pipe(gulp.dest('src/dist'));
});