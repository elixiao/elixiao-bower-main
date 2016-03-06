find-bower-min
===============

- Made to be used with Gulp. 
- Based on type, get bower min files in bower main files.
- If min files are not found, return main files as a array so you can minify them yourself.

## Installation

```shell
  npm install --save-dev find-bower-min
```

## Usage

Require two paramenters: 

- First paramenter is the non-mimified file extension,like 'js' or 'css'. 
- Second parameter (optional) is the minified file extension, like 'min.js' or 'min.css'.

**Find min.js**


```js
var findBowerMin = require('find-bower-min');
var findMinJs = findBowerMin('js','min.js');

var minJs = findMinJs.min;
var notFound = findMinJs.minNotFound;
```




## Example with Gulp

**Find all min.js in bower_components**

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

**Want some min.js in specified order?(so you can concat them in sequence)**

```js
// jquery is before angular now
var findMinJs = findBowerMin('js','min.js',["jquery","angular"]); 
```

**Only want some specified min.js files?**

```js
// only find min.js of files specified in the array.
var findMinJs = findBowerMin('js','min.js',["jquery","angular","angular-ui-router","ocLazyLoad","js-yaml"],true); 
```

**Find all min.css in bower_components**

```js
var concat = require('gulp-concat'),
    minifyCss = require("gulp-minify-css"),
    merge2 = require('merge2'),
    ignore = require('gulp-ignore'),
    findBowerMin = require('find-bower-min');

var findMinCss = findBowerMin('(css|less)','min.css');

gulp.task('minCss', function() {
  return merge2(
    gulp.src(findMinCss.min),
    gulp.src(findMinCss.minNotFound)
        .pipe(ignore.include('*.css'))
        .pipe(minifyCss())
  )
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('dest/css'))
});
```

## Issues

If you find a bug, have a feature request or similar, then create an issue on [https://github.com/elixiao/find-bower-min/issues](https://github.com/elixiao/find-bower-min/issues).

## LICENSE

MIT © [elixiao](https://github.com/elixiao)
