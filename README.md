find-bower-min
===============

Made to be used with Gulp. 
Based on asset type, get bower min files in bower main files.
If no minified version is found for some files, these file names will be available as a array so you can minify them yourself.

配合Gulp一起使用，获取bower里面所有的项目min.js或min.css，如果没有找到min则返回notFound数组，可对这些文件单独处理。

It uses [main-bower-files](https://www.npmjs.com/package/main-bower-files), manipulates the result and checks for the
availability of a minimized version (in the bower package).

## Installation

```shell
  npm install --save-dev find-bower-min
```

## Usage

Require the module and get a set of asset files by giving two paramenters: First paramenter is the non-mimified file extension,
like 'js' or 'css'. Second parameter (optional) is the minified file extension, like 'min.js' or 'min.css'.
Here is a usage with JavaScript files:

两个参数，第一个是压缩或编译前的后缀，第二个是压缩或编译后的后缀。

```js
var findBowerMin = require('find-bower-min');
var findMinJs = findBowerMin('js','min.js');

var minJs = findMinJs.min;
var notFound = findMinJs.minNotFound;
```

## Example with Gulp

**JavaScript files Example:**

```js
var concat = require('gulp-concat');
    uglify = require('gulp-uglify');
    merge2 = require('merge2');
    findBowerMin = require('find-bower-min');

var findMinJs = findBowerMin('js','min.js');

gulp.task('minJs', function() {
  return merge2(
    gulp.src(findMinJs.min),
    gulp.src(findMinJs.minNotFound).pipe(uglify())
  )
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('dest/js'))
});
```

**CSS files Example:**

```js
var concat = require('gulp-concat'),
    minifyCss = require("gulp-minify-css"),
    less = require('gulp-less'),
    merge2 = require('merge2'),
    ignore = require('gulp-ignore'),
    findBowerMin = require('find-bower-min');

var findMinCss = findBowerMin('(css|less)','min.css');

gulp.task('minCss', function() {
  return merge2(
    gulp.src(findMinCss.min),
    gulp.src(findMinCss.minNotFound)
        .pipe(ignore.include('*.less'))
        .pipe(less())
        .pipe(minifyCss())
  )
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('dest/css'))
});

## Issues

If you find a bug, have a feature request or similar, then create an issue on [https://github.com/elixiao/find-bower-min/issues](https://github.com/elixiao/find-bower-min/issues).

## LICENSE

MIT © [elixiao](https://github.com/elixiao)
