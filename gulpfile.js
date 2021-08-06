const { src, dest, watch, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const del = require('del');

const css = () => {
  return src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(postcss([autoprefixer()]))
    .pipe(dest('build/css'))
    .pipe(csso())
    .pipe(concat('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(dest('build/css'))
    .pipe(browserSync.stream());
};

const imgmin = () => {
  return src('source/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ quality: 94, progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(dest('build/img'));
};

const imgwebp = () => {
  return src('source/img/content-*.{png,jpg}')
    .pipe(webp({ quality: 90 }))
    .pipe(dest('build/img'));
};

const sprite = () => {
  return src('source/img/inline-*.svg')
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(dest('build/img'));
};

const mainjs = () => {
  return src('source/js/*.js')
    .pipe(concat('main.js'))
    .pipe(dest('build/js'));
};

const vendorjs = () => {
  return src('source/js/libs/*.js')
    .pipe(concat('vendor.js'))
    .pipe(dest('build/js'));
};

const localServer = () => {
  browserSync.init({
    server: {
      baseDir: 'build/',
    },
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });
};

const refresh = (done) => {
  browserSync.reload();
  done();
};

const watching = () => {
  watch('source/sass/**/*.scss', css);
  watch('source/*.html', refresh);
  watch('source/img/**/*.{png,jpg,svg}', series(cleanimg, copyimg, refresh));
  watch('source/img/inline-*.svg', series(sprite, refresh));
  watch('source/js/*.js', series(mainjs, refresh));
  watch('source/js/libs/*.js', series(vendorjs, refresh));
};

const clean = () => {
  return del('build');
};

const copy = () => {
  return src([
    'source/*.html',
    'source/fonts/**/*.{woff,woff2}',
    'source/img/**/*.{png,jpg,svg}',
    '!source/img/**/inline-*.svg',
    'source//*.ico'
  ], {
    base: 'source'
  })
    .pipe(dest('build'));
};

const copybuild = () => {
  return src([
    'source/*.html',
    'source/fonts/**/*.{woff,woff2}',
    'source//*.ico'
  ], {
    base: 'source'
  })
    .pipe(dest('build'));
};

const copyimg = () => {
  return src([
    'source/img/**/*.{png,jpg,svg}',
    '!source/img/**/inline-*.svg'
  ], {
    base: 'source'
  })
    .pipe(dest('build'));
};

const cleanimg = () => {
  return del([
    'build/img/**/*.{png,jpg,svg}',
    '!build/img/**/sprite.svg'
  ]);
};

const cleansvg = () => {
  return del('build/img/**/inline-*.{png,jpg,svg}');
};

exports.css = css;
exports.imgmin = imgmin;
exports.imgwebp = imgwebp;
exports.sprite = sprite;
exports.mainjs = mainjs;
exports.vendorjs = vendorjs;
exports.watching = watching;
exports.localServer = localServer;
exports.refresh = refresh;
exports.copy = copy;
exports.copybuild = copybuild;
exports.clean = clean;
exports.copyimg = copyimg;
exports.cleanimg = cleanimg;
exports.cleansvg = cleansvg;

exports.start = series(
  clean,
  copy,
  css,
  imgwebp,
  sprite,
  vendorjs,
  mainjs,
  parallel(watching, localServer),
);

exports.build = series(
  clean,
  copybuild,
  css,
  imgmin,
  imgwebp,
  sprite,
  cleansvg,
  vendorjs,
  mainjs,
);
