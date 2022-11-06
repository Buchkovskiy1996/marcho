const {src, dest, watch, parallel, series } = require('gulp');
const concat = require('gulp-concat');
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();


function styles() {
return src('app/scss/style.scss')
.pipe(scss({outputStyle:'compressed'})) // конвертация 
.pipe(concat('style.min.css'))
.pipe(autoprefixer({
    overrideBrowserslist: ['last 10 versions'],
    grid:true
}))
.pipe(dest('app/css')) //куда сохраняем
.pipe(browserSync.stream())
}




//функции для скриптов 

function scripts() {
    return src([
        'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function images() {
    return src('app/images/**/*.*')
    .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
	imagemin.mozjpeg({quality: 75, progressive: true}),
	imagemin.optipng({optimizationLevel: 5}),
	imagemin.svgo({
		plugins: [
			{removeViewBox: true},
			{cleanupIDs: false}
		  ]
	    })
    ]))
    .pipe(dest('dist/images'))
}

function build() {
    return src([
        'app/**/*.html',
        'app/css/style.min.css',  //передача файлов папку dist
        'app/js/main.min.js'
    ], {base: 'app'})
    .pipe(dest('dist'))
}

function cleanDist () {
    return del('dist')
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        notify:false
    })
}

//делаем слежение обновление авто 
function watching () {
    watch(['app/scss/**/*.scss'], styles)
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
    watch(['app/**/*.html']).on('change', browserSync.reload)
}

//чтоб наша функция работала вкл

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist,images,build);

exports.default = parallel(styles,scripts,browsersync,watching);