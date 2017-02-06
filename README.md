gulp-md-svgstore 
=============

<img align="right" width="130" height="175"
     title="SVG Superman"
     src="https://raw.githubusercontent.com/w0rm/gulp-svgstore/master/svg-superman.png">
     
This is a fork of [gulp-svgstore](https://github.com/w0rm/gulp-svgstore) with refactoring to support
Angular Material.

Combine svg files into one with `<svg>` elements.  

Create a [Material 2 compatible sprite sheet](https://raw.githubusercontent.com/angular/material2/master/src/demo-app/icon/assets/core-icon-set.svg)
 to use with Material's `addSvgIconSetInNamespace`, see [Material 2 demo](https://github.com/angular/material2/blob/master/src/demo-app/icon/icon-demo.ts)


### Options:

The following options are set automatically based on file data:

* `keepIds` — keeps the `id` attribute of the svg file. If no `id` is provide, the filename is used as an `id`.
* `outputFilename` — file name of the result file. If `outputFilename` is not provided, 
* `inlineSvg` — output only `<svg>` element without `<?xml ?>` and `DOCTYPE` to use inline, default: `false`.

If your workflow is different, please use `gulp-rename` to rename sources or result.

A `filename` attribute is added to each child `svg` to see which file the child came from. This is only for developer reference, and has no functional value.


## Install

```sh
npm install gulp-md-svgstore --save-dev
```

## Usage

The following script will combine all svg sources into single svg file with `<svg>` elements.
The name of result svg is the base directory name of the first file `src.svg`.

Additionally pass through [gulp-svgmin](https://github.com/ben-eb/gulp-svgmin)
to minify svg and ensure unique ids.

```js
var gulp = require('gulp');
var svgstore = require('gulp-md-svgstore');
var svgmin = require('gulp-svgmin');
var path = require('path');

gulp.task('svgstore', function () {
    return gulp
        .src('test/src/*.svg')

        .pipe(svgstore({
                 outputFilename: 'core-icon-set.svg',
                 keepIds: true,
                 inlineSvg: true
         }))
        .pipe(gulp.dest('test/dest'));
});
```

With the above configuration the files in `test/src`: 

file: `ic_home_24px.svg`
```xml

<svg id="home" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
     viewBox="0 0 24 24">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
</svg>
```

file: `ic_settings_24px.svg`
```xml

<svg id="settings" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>

```

Will product the result `core-icon-set.svg`:
```xml
<svg>
  <defs>
    <svg id="home" filename="ic_home_24px.svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
    <svg id="settings" filename="ic_settings_24px.svg" viewBox="0 0 24 24" width="24" height="24">
      <path
        d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
    </svg>
  </defs>
</svg>
```

### Inlining svgstore result into html body

To inline combined svg into html body I suggest using [gulp-inject](https://github.com/klei/gulp-inject).
The following gulp task will inject svg into

In your html file (using [`visuallyhidden` from html5-boilerplate](https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css#L128) to fix the gradients):

```html
<div class="visuallyhidden">
  <!-- inject:svg --><!-- endinject -->
</div>
```
In your gulp tasks:

```js
var gulp = require('gulp');
var svgstore = require('gulp-svgstore');
var inject = require('gulp-inject');

gulp.task('svgstore', function () {
    var svgs = gulp
        .src('test/src/*.svg')
        .pipe(svgstore({ inlineSvg: true }));

    function fileContents (filePath, file) {
        return file.contents.toString();
    }

    return gulp
        .src('test/src/inline-svg.html')
        .pipe(inject(svgs, { transform: fileContents }))
        .pipe(gulp.dest('test/dest'));
});
```

### Generating id attributes

Id of symbol element is calculated from file name. You cannot pass files with the same name,
because id should be unique.

If you need to add prefix to each id, please use `gulp-rename`:

```js
var gulp = require('gulp');
var rename = require('gulp-rename');
var svgstore = require('gulp-svgstore');

gulp.task('default', function () {
    return gulp
        .src('src/svg/**/*.svg', { base: 'src/svg' })
        .pipe(rename({prefix: 'icon-'}))
        .pipe(svgstore())
        .pipe(gulp.dest('dest'));
});
```

If you need to have nested directories that may have files with the same name, please
use `gulp-rename`. The following example will concatenate relative path with the name of the file,
e.g. `src/svg/one/two/three/circle.svg` becomes `one-two-three-circle`.


```js
var gulp = require('gulp');
var path = require('path');
var rename = require('gulp-rename');
var svgstore = require('gulp-svgstore');

gulp.task('default', function () {
    return gulp
        .src('src/svg/**/*.svg', { base: 'src/svg' })
        .pipe(rename(function (file) {
            var name = file.dirname.split(path.sep);
            name.push(file.basename);
            file.basename = name.join('-');
        }))
        .pipe(svgstore())
        .pipe(gulp.dest('dest'));
});
```

### Using svg as external file

There is a problem with `<use xlink:href="external.svg#icon-name">` in Internet Explorer,
so you should either inline everything into body with a
[simple script like this](https://gist.github.com/w0rm/621a56a353f7b2a6b0db) or
polyfill with [svg4everybody](https://github.com/jonathantneal/svg4everybody).

## PNG sprite fallback for unsupported browsers

[gulp-svgfallback](https://github.com/w0rm/gulp-svgfallback) is a gulp plugin that generates png
sprite and css file with background offsets from svg sources. Please check it and leave feedback.

## Transform svg sources or combined svg

To transform either svg sources or combined svg you may pipe your files through
[gulp-cheerio](https://github.com/KenPowers/gulp-cheerio).

### Transform svg sources

An example below removes all fill attributes from svg sources before combining them.
Please note that you have to set `xmlMode: true` to parse svgs as xml file.

```js
var gulp = require('gulp');
var svgstore = require('gulp-svgstore');
var cheerio = require('gulp-cheerio');

gulp.task('svgstore', function () {
    return gulp
        .src('test/src/*.svg')
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(svgstore({ inlineSvg: true })
        .pipe(gulp.dest('test/dest'));
});
```

### Transform combined svg

The following example sets `style="display:none"` on the combined svg:
(beware if you use gradients and masks, display:none breaks those and just show
nothing, best method is to use the [method show above](#inlining-svgstore-result-into-html-body) )


```js
var gulp = require('gulp');
var svgstore = require('gulp-svgstore');
var cheerio = require('gulp-cheerio');

gulp.task('svgstore', function () {
    return gulp
        .src('test/src/*.svg')
        .pipe(svgstore({ inlineSvg: true }))
        .pipe(cheerio({
            run: function ($) {
                $('svg').attr('style',  'display:none');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(gulp.dest('test/dest'));
});
```

## Extracting metadata from combined svg

You can extract data with cheerio.

The following example extracts viewBox and id from each symbol in combined svg.

```js
var gulp = require('gulp');
var gutil = require('gulp-util');
var svgstore = require('gulp-svgstore');
var through2 = require('through2');
var cheerio = require('cheerio');

gulp.task('metadata', function () {
    return gulp
        .src('test/src/*.svg')
        .pipe(svgstore())
        .pipe(through2.obj(function (file, encoding, cb) {
            var $ = cheerio.load(file.contents.toString(), {xmlMode: true});
            var data = $('svg > symbol').map(function () {
                return {
                    name: $(this).attr('id'),
                    viewBox: $(this).attr('viewBox')
                };
            }).get();
            var jsonFile = new gutil.File({
                path: 'metadata.json',
                contents: new Buffer(JSON.stringify(data))
            });
            this.push(jsonFile);
            this.push(file);
            cb();
        }))
        .pipe(gulp.dest('test/dest'));
});
```

## Possible rendering issues with Clipping Paths in SVG

If you're running into issues with SVGs not rendering correctly in some browsers (see issue #47), the issue might be that clipping paths might not have been properly intersected in the SVG file. There are currently two ways of fixing this issue:

### Correcting the Clipping Path in the SVG

If you have the source file, simply converting the clipping path to a nice coded shape will fix this issue. Select the object, open up the Pathfinder panel, and click the Intersect icon.

### Editing the SVG Code

If you don't have the source file or an SVG Editor (Adobe Illustrator etc.), you can manually edit the SVG code in the file. Wrapping the `<clipPath>` into a `<defs>` will fix this issue. Here's an example:

```
<defs>
    <path d="M28.4 30.5l5.3 5c0-.1 7-6.9 7-6.9l-4-6.8-8.3 8.7z" id="a"/>
</defs>
<clipPath id="b"><use overflow="visible" xlink:href="#a"/></clipPath>
```

Becomes:

```
<defs>
    <path d="M28.4 30.5l5.3 5c0-.1 7-6.9 7-6.9l-4-6.8-8.3 8.7z" id="a"/>
    <clipPath id="b"><use overflow="visible" xlink:href="#a"/></clipPath>
</defs>
```

Or you can go further and reduce the size by removing the `<use>` element, like this:

```
<defs>
    <clipPath id="b"><path d="M28.4 30.5l5.3 5c0-.1 7-6.9 7-6.9l-4-6.8-8.3 8.7z"/></clipPath>
</defs>
```

## Changelog

* 6.1.0
  * Copy preserveAspectRatio attribute from source svg to to symbol #76

* 6.0.0
  * Removed cache of the cheerio object #61

* 5.0.5
  * Correctly set namespaces of the combined svg

* 5.0.4
  * Skip null and invalid files

* 5.0.3
  * Updated readme with a way to ensure unique ids

* 5.0.2
  * Updated direct dependencies

* 5.0.1
  * Removed cheerio from devDependencies #34

* 5.0.0
  * Removed prefix and fileName options

* 4.0.3
  * Ensure unique file names
  * Improved readme with gulp-rename usage to generate id for nested directories

* 4.0.1
  * Added cheerio to devDependencies

* 4.0.0
  * Removed `transformSvg`, pipe files through [gulp-cheerio](https://github.com/KenPowers/gulp-cheerio) instead.
  * Made cheerio 0.* a peer dependency, allows to choose what version to use.
  * Uses `file.cheerio` if cached in gulp file object and also sets it for the combined svg.
  * Improved readme.

* 3.0.0
  * Used cheerio instead of libxmljs (changes transformSvg syntax)

* 2.0.0
  * Added check for inputs before generating SVG.

* 1.0.1
  * Added check for missing viewBox in original svg.

* 1.0.0
  * Initial release.
