/*eslint one-var: 0 */

// Core deps
// Use require() because of rollup
const gulp = require('gulp');
const notify = require('gulp-notify');
const gulpif = require('gulp-if');
const size = require('gulp-size');
const plumber = require('gulp-plumber');
const lazypipe = require('lazypipe');
const filter = require('gulp-filter');
const gulprun = require('run-sequence');
const yargs = require('yargs');
const browserSync = require('browser-sync');
const wct = require('web-component-tester');

// HTML
const inline = require('gulp-inline-source');
const processInline = require('gulp-process-inline');
const minify = require('gulp-htmlmin');

// JS
const eslint = require('gulp-eslint');
const rollup = require('gulp-rollup-file');
const resolve = require('rollup-plugin-node-resolve');
const commonJs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');

// CSS
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssImport = require('postcss-import');

const bs = browserSync.create(),
      argv = yargs.boolean(['debug']).argv,
      errorNotifier = () => plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }),
      OPTIONS = {
        rollup: {
          plugins: [
            resolve({ main: true, browser: true }),
            commonJs(),
            json(),
            babel({
              exclude: 'node_modules/**/*'
            })
          ],
          format: 'iife'
        },
        postcss: [
          cssImport(),
          autoprefixer()
        ],
        inline: {
          compress: false,
          swallowErrors: true
        },
        HTMLmin: {
          removeComments: true,
          removeCommentsFromCDATA: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          caseSensitive: true,
          keepClosingSlash: true,
          customAttrAssign: [/\$=/],
          minifyCSS: true,
          minifyJS: true
        },
        browserSync: {
          server: {
            baseDir: './',
            index: 'demo/index.html',
            routes: {
              '/': './bower_components'
            }
          },
          open: false,
          notify: false
        }
      };

const processJs = lazypipe()
  .pipe(eslint)
  .pipe(eslint.format)
  .pipe(() => gulpif(!argv.debug, eslint.failAfterError()))
  .pipe(rollup, OPTIONS.rollup);

gulp.task('build', () => {
  let styles = processInline(),
      scripts = processInline();

  return gulp.src(['src/*.html'])
    .pipe(errorNotifier())

    // Inline assets
    .pipe(inline(OPTIONS.inline))

    // JS
    .pipe(scripts.extract('script'))
      .pipe(processJs())
    .pipe(scripts.restore())

    // CSS
    .pipe(styles.extract('style'))
      .pipe(postcss(OPTIONS.postcss))
    .pipe(styles.restore())

    .pipe(gulpif(!argv.debug, minify(OPTIONS.HTMLmin)))

    .pipe(size({ gzip: true }))
  .pipe(gulp.dest('.'))
});

gulp.task('build:tests', () => {
  const js = filter((file) => /\.(js)$/.test(file.path), { restore: true }),
        html = filter((file) => /\.(html)$/.test(file.path), { restore: true }),
        scripts = processInline();

  return gulp.src(['test/**/*'])
    .pipe(errorNotifier())

    .pipe(html)
      .pipe(inline(OPTIONS.inline))
      .pipe(scripts.extract('script'))
        .pipe(processJs())
      .pipe(scripts.restore())
    .pipe(html.restore)

    .pipe(js)
      .pipe(processJs())
    .pipe(js.restore)

  .pipe(gulp.dest('.test'));
});

wct.gulp.init(gulp);

gulp.task('test', () => gulprun('build:tests', 'test:local'));

gulp.task('watch:src', () => gulp.watch(['src/**/*'], () => gulprun('build', 'refresh')));
gulp.task('watch:tests', () => gulp.watch(['src/**/*', 'test/**/*'], () => gulprun('build:tests')))
gulp.task('watch', ['watch:src', 'watch:tests']);

gulp.task('serve', () => bs.init(OPTIONS.browserSync));
gulp.task('refresh', () => bs.reload());

gulp.task('default', ['build', 'serve', 'watch']);
