## What is this
Add Sass variables to gulp stream, so that you can use for example environment variables in your Sass build process.

Supports strings, numbers, booleans, and hex colors.

## Installation

```bash
$ npm install gulp-sass-variables --save-dev
```

## Usage

### gulpfile.js
```javascript
var gulp = require('gulp'),
    argv = require('yargs').argv,
    sassVariables = require('gulp-sass-variables'),
    sass = require('gulp-sass');

// Compile css
gulp.task('css', function () {
  return gulp.src('./src/scss/master.scss')
             .pipe(sassVariables({
               $env: argv.production ? 'production' : 'development'
             }))
             .pipe(sass())
             .pipe(gulp.dest('./dist/css'))
});

```

### master.scss
```scss
$env: 'development' !default;
$path: '/dev/path/' !default;

@if($env == 'production') {
  $path: '/prod/path';
}
```

## Options
### allowHexColors 
(bool) - when true, will print hex colors as colors instead of strings
```javascript
gulp.src('./src/scss/master.scss')
  .pipe(sassVariables({
    $color-primary: '#800080'
  }, { allowHexColors: true }))
```
```scss
body {
  color: $color-primary;
}
```
