var gulp = require('gulp'),
		sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    mqpacker = require('css-mqpacker'),
    minify = require('gulp-csso'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    dirSync = require('gulp-directory-sync'),
    del = require('del'),
    uglify = require('gulp-uglify'),
		html5Lint = require('gulp-html5-lint'),
		pug = require('gulp-pug');

var outputDir = 'dist/';
var buildDir = 'build/';

/* Compiling */
gulp.task('pug', function () {
	gulp.src(['pug/*.pug', '!' + 'pug/template.pug'])
		.pipe(plumber())
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest(outputDir))
		.pipe(browserSync.stream());
});

gulp.task('style', function () {
    gulp.src('sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({browsers: [
        'last 1 version',
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Opera versions',
        'last 2 Edge versions'
    ]}))
    .pipe(postcss([
        mqpacker({
            sort: true
        })
    ]))
    .pipe(gulp.dest(outputDir + 'css/'))
    .pipe(browserSync.stream());
});

gulp.task('imageSync', function () {
    return gulp.src('')
    .pipe(plumber())
    .pipe(dirSync('img', outputDir + 'img/', {printSummary: true}))
    .pipe(browserSync.stream());
});

gulp.task('fontsSync', function () {
    return gulp.src('')
    .pipe(plumber())
    .pipe(dirSync('fonts', outputDir + 'fonts/', {printSummary: true}))
    .pipe(browserSync.stream());
});

gulp.task('jsSync', function () {
    return gulp.src('')
    .pipe(plumber())
    .pipe(dirSync('js', outputDir + 'js/', {printSummary: true}))
    .pipe(browserSync.stream());
});

gulp.task('watch', function () {
		gulp.watch('pug/**/*.pug', ['pug']);
		gulp.watch('sass/**/*.scss', ['style']);
    gulp.watch('js/**/*.js', ['jsSync']);
    gulp.watch('img/**/*', ['imageSync']);
    gulp.watch('fonts/**/*', ['fontsSync']);
});

gulp.task('browser-sync', function () {
    browserSync.init({
        port: 1337,
        server: {
            baseDir: outputDir
        }
    });
});

gulp.task('default', ['pug', 'style', 'imageSync', 'jsSync', 'fontsSync', 'watch', 'browser-sync']);

/* Build */
gulp.task('clean', function () {
    return del(buildDir);
});

gulp.task('imgBuild', function () {
    return gulp.src(outputDir + 'img/**/*')
    .pipe(imagemin([
      imagemin.optipng({optimizationLever: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest(buildDir + 'img/'));
});

gulp.task('fontsBuild', function () {
    return gulp.src(outputDir + 'fonts/**/*')
    .pipe(gulp.dest(buildDir + 'fonts/'));
});

gulp.task('htmlBuild', function () {
    return gulp.src(outputDir + '**/*.html')
    .pipe(gulp.dest(buildDir));
});

gulp.task('jsBuild', function () {
    return gulp.src(outputDir + 'js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(buildDir + 'js/'));
});

gulp.task('cssBuild', function () {
    return gulp.src(outputDir + 'css/**/*.css')
    .pipe(minify())
    .pipe(gulp.dest(buildDir + 'css/'));
});

gulp.task('validation', function () {
    return gulp.src(buildDir + '**/*.html')
    .pipe(html5Lint());
});


gulp.task('build', ['clean'], function () {
    gulp.start('htmlBuild', 'imgBuild', 'fontsBuild', 'jsBuild', 'cssBuild');
});
