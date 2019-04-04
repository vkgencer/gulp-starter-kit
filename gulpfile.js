const del = require("del");
const gulp = require('gulp');
const sass = require('gulp-sass');
const newer = require("gulp-newer");
const rename = require("gulp-rename");
const merge = require('merge-stream');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const htmlmin = require('gulp-htmlmin');
const imagemin = require("gulp-imagemin");
const cleanCss = require('gulp-clean-css');
const autoprefixer = require("gulp-autoprefixer");

const paths = {
    base: './app/src',
    styles: {
        main: [],
        plugins: []
    },
    scripts: {
        main: [],
        vendor: [],
        plugins: []
    },
    images: './app/src/img/**/*.{JPG,jpg,jpeg,png,gif,svg}',
    fonts: './app/src/fonts/**/*.+(ttf|eot|otf|svg|woff|woff2)',
    json: './app/src/json/**/*.json',
    html: './app/src/pages/**/*.html',
    dist: './app/dist'
}

const browsersync = require('browser-sync').create();

paths.styles.main = [
    `${paths.base}/css/normalize.css`,
    `${paths.base}/scss/main.scss`
]

paths.styles.plugins = [
    `${paths.base}/scss/plugins.scss`
]

paths.scripts.main = [
    `${paths.base}/js/main.js`
]

paths.scripts.vendor = [
    `${paths.base}/js/vendor/jquery-3.3.1.min.js`
]

paths.scripts.plugins = [
	`${paths.base}/js/plugins/util.js`,
	`${paths.base}/js/plugins/modal.js`
]

// BrowserSync
function browserSync (done) {
    browsersync.init({
        server: {
            baseDir: "./app/"
        },
        port: 3000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload (done) {
    browsersync.reload();
    done();
}

// Clean assets
function clean () {
    return del([paths.dist]);
}

// CSS task
function css () {

    const main = gulp
        .src(paths.styles.main)
        .pipe(plumber())
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('main.css'))
        .pipe(gulp.dest(`${paths.dist}/css/`))
        .pipe(rename({ suffix: ".min" }))
        .pipe(cleanCss())
        .pipe(gulp.dest(`${paths.dist}/css/`))

    const plugins = gulp
        .src(paths.styles.plugins)
        .pipe(plumber())
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('plugin.css'))
        .pipe(gulp.dest(`${paths.dist}/css/`))
        .pipe(rename({ suffix: ".min" }))
        .pipe(cleanCss())
        .pipe(gulp.dest(`${paths.dist}/css/`))

    return merge(main, plugins)
}

// Script task
function scripts () {

    const main = gulp.src(paths.scripts.main)
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(gulp.dest(`${paths.dist}/js/`))
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(`${paths.dist}/js/`))
        .pipe(browsersync.stream());

    const vendor = gulp.src(paths.scripts.vendor)
        .pipe(plumber())
        .pipe(uglify())
        .pipe(concat('vendor.js'))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(`${paths.dist}/js/vendor/`))
        .pipe(browsersync.stream());

    const plugins = gulp.src(paths.scripts.plugins)
        .pipe(plumber())
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest(`${paths.dist}/js/plugins`))
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(`${paths.dist}/js/plugins/`))
        .pipe(browsersync.stream());

    return merge(main, vendor, plugins)

}

function html() {
    return gulp.src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.dist));
}

// IMG task
function images () {
    return gulp
        .src(paths.images)
        .pipe(newer(`${paths.dist}/img/`))
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [
                        {
                            removeViewBox: false,
                            collapseGroups: true
                        }
                    ]
                })
            ])
        )
        .pipe(gulp.dest(`${paths.dist}/img/`))
}

// Fonts task
function fonts () {
    return gulp
        .src(paths.fonts)
        .pipe(newer(`${paths.dist}/fonts/`))
        .pipe(gulp.dest(`${paths.dist}/fonts/`));
}

// Json task
function json () {
    return gulp
        .src(paths.json)
        .pipe(newer(`${paths.dist}/json/`))
        .pipe(gulp.dest(`${paths.dist}/json/`));
}

// Watch files
function watchFiles () {
    gulp.watch("./app/src/scss/**/*", css);
    gulp.watch("./app/src/json/**/*", json);
    gulp.watch("./app/src/pages/**/*", html);
    gulp.watch("./app/src/js/**/*", scripts);
    gulp.watch("./app/src/img/**/*", images);
    gulp.watch("./app/src/fonts/**/*", fonts);
    gulp.watch("./app/**/*.html", browserSyncReload);
}

gulp.task("images", images);
gulp.task("clean", clean);
gulp.task("fonts", fonts);
gulp.task("js", scripts);
gulp.task("json", json);
gulp.task("css", css);

// build
gulp.task(
    "dist",
    gulp.series(clean, gulp.parallel(css))
);

gulp.task("build", gulp.parallel(scripts, html, css, images, json, fonts));

// default
gulp.task("default", gulp.parallel(scripts, html, css, images, json, fonts, watchFiles, browserSync));