const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const typedoc = require('gulp-typedoc');
const ts = require('gulp-typescript');
const merge = require('merge-stream');
const { Linter } = require('tslint');
const webpack = require('webpack-stream');

gulp.task('clean', () => {
  del('lib/*', { force: true });
  del('bundle/*', { force: true });
  del('coverage/*', { force: true });
  del('docs/*', { force: true });
});

gulp.task('main', () => {
  const tsProject = ts.createProject('tsconfig.json', { declaration: true, module: 'commonjs' });

  const transpiled = gulp.src(['src/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib/main'));

  const copied = gulp.src(['src/**/*.d.ts'])
    .pipe(gulp.dest('lib/main'));

  return merge(transpiled, copied)
    .on('error', () => process.exit(1));
});

gulp.task('module', () => {
  const tsProject = ts.createProject('tsconfig.json');

  return gulp.src(['src/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib/module'))
    .on('error', () => process.exit(1));
});

gulp.task('browser', () => {
  const tsProject = ts.createProject('tsconfig.json');

  return gulp.src(['src/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib/browser'))
    .on('error', () => process.exit(1));
});

gulp.task('umd', () => webpack(require('./webpack.config')) // eslint-disable-line global-require
  .pipe(gulp.dest('lib/umd'))
  .on('error', () => process.exit(1)));

gulp.task('type-check', () => {
  const tsProject = ts.createProject('tsconfig.json', { noEmit: true });

  gulp.src(['src/**/*.ts'])
    .pipe(tsProject())
    .on('error', () => process.exit(1));
});

gulp.task('lint', () => {
  gulp.src(['src/**/*.ts'])
    .pipe(tslint({
      configuration: 'tslint.json',
      fix: true,
      formatter: 'stylish',
      program: Linter.createProgram('tsconfig.json'),
    }))
    .pipe(tslint.report())
    .on('error', () => process.exit(1));
});

gulp.task('document', () => gulp.src(['src/**/*.ts'])
  .pipe(typedoc({
    excludeExternals: true,
    excludeNotExported: true,
    excludePrivate: true,
    excludeProtected: true,
    exclude: `**/{cache-manager,cli,event-async-iterator,debuggers,fetch-manager,helpers,logger,module-definitions,
      monitoring,performance,proxies,request-parser,socket-manager,subscription-service}/**`,
    ignoreCompilerErrors: true,
    includeDeclarations: true,
    mode: 'file',
    module: 'esnext',
    name: 'Handl',
    out: './docs',
    readme: 'none',
    target: 'es6',
    theme: 'default',
    verbose: true,
    version: true,
  })));
