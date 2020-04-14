let gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer');

// Clean task
gulp.task('clean', async function(){
    del.sync('dist');
})    

// Generate css file
gulp.task('scss', function() {
    return gulp.src('app/scss/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            browsers: ['last 8 versions']
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

// Generate & concat css files
gulp.task('css', function() {
    return gulp.src([
        'node_modules/normalize.css/normalize.css',
        'node_modules/slick-carousel/slick/slick.css'
    ])
        .pipe(concat('_libs.scss'))
        .pipe(gulp.dest('app/scss'))
        .pipe(browserSync.reload({stream: true}))
})

// Generate html file
gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({stream: true}))
})

// Generate js file
gulp.task('script', function() {
    return gulp.src('app/js/*.js')
        .pipe(browserSync.reload({stream: true}))
})

// Generate js file
gulp.task('js', function(){
    return gulp.src([
        'node_modules/slick-carousel/slick/slick.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true}))
})

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
});

// Export to dist
gulp.task('export', function(){
    let buildHtml = gulp.src('app/**/*.html')
        .pipe(gulp.dest('dist'));
    
    let BuildCss = gulp.src('app/css/**/*.css')
        .pipe(gulp.dest('dist/css'));

    let BuildJs = gulp.src('app/js/**/*.js')
        .pipe(gulp.dest('dist/js'));

    let BuildFonts = gulp.src('app/fonts/**/.*')
        .pipe(gulp.dest('dist/fonts'));        

    let BuildImg = gulp.src('app/img/**/.*')
        .pipe(gulp.dest('dist/img'));         
});

//Clean & Build project
gulp.task('build', gulp.series('clean', 'export'));

// Watchdog server
gulp.task('watch', function() {
    gulp.watch('app/scss/*.scss', gulp.parallel('scss'));
    gulp.watch('app/*.html', gulp.parallel('html'))
    gulp.watch('app/js/*.js', gulp.parallel('script'))
});

// Default task
gulp.task('default', gulp.parallel('css', 'scss', 'js', 'browser-sync', 'watch'))