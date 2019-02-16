var cheerio = require('cheerio');
var path = require('path');
var Stream = require('stream');
var chalk = require('chalk');
var Vinyl = require('vinyl');

module.exports = function (config) {

  config = config || {}

  var namespaces = {}
  var isEmpty = true
  var outputFilename = config.outputFilename || null
  var inlineSvg = config.inlineSvg || false
  var keepIds = config.keepIds || false
  var ids = {}

  var resultSvg = '';
  if (!inlineSvg) {
    resultSvg =
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ' +
      '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
      '<svg xmlns="http://www.w3.org/2000/svg"><defs/></svg>';
  } else {
    resultSvg = '<svg><defs/></svg>';
  }

  var $ = cheerio.load(resultSvg, {xmlMode: true})
  var $combinedSvg = $('svg')
  var $combinedDefs = $('defs')
  var stream = new Stream.Transform({objectMode: true})

  stream._transform = function transform(file, encoding, cb) {

    if (file.isStream()) {
      return cb(new Error('gulp-svgstore Streams are not supported!'))
    }

    if (file.isNull()) return cb()


    var $svg = cheerio.load(file.contents.toString(), {xmlMode: true})('svg')

    if ($svg.length === 0) return cb()

    var fileId = $svg.attr('id')
    var filename = path.basename(file.relative, path.extname(file.relative))

    if (!fileId || !keepIds) {
      fileId = filename;
    }

    var viewBoxAttr = $svg.attr('viewBox')
    var preserveAspectRatioAttr = $svg.attr('preserveAspectRatio')
    var width = $svg.attr('width')
    var height = $svg.attr('height')

    var $childSVG = $('<svg/>')

    if (fileId in ids) {
      return cb(new Error('gulp-svgstore File name should be unique: ' + filename))
    }

    ids[fileId] = true

    if (!outputFilename) {
      outputFilename = path.basename(file.base)
      if (outputFilename === '.' || !outputFilename) {
        outputFilename = 'svgstore.svg'
      } else {
        outputFilename = outputFilename.split(path.sep).shift() + '.svg'
      }
    }

    if (file && isEmpty) {
      isEmpty = false
    }

    $childSVG.attr('id', fileId)
    $childSVG.attr('filename', filename + '.svg')

    if (viewBoxAttr) {
      $childSVG.attr('viewBox', viewBoxAttr)
    }
    if (preserveAspectRatioAttr) {
      $childSVG.attr('preserveAspectRatio', preserveAspectRatioAttr)
    }
    if (width) {
      $childSVG.attr('width', width)
    }
    if (height) {
      $childSVG.attr('height', height)
    }

    var attrs = $svg[0].attribs
    for (var attrName in attrs) {
      if (attrName.match(/xmlns:.+/)) {
        var storedNs = namespaces[attrName]
        var attrNs = attrs[attrName]

        if (storedNs !== undefined) {
          if (storedNs !== attrNs) {
            console.log(chalk.red(
              attrName + ' namespace appeared multiple times with different value.' +
              ' Keeping the first one : "' + storedNs +
              '".\nEach namespace must be unique across files.'
            ))
          }
        } else {
          for (var nsName in namespaces) {
            if (namespaces[nsName] === attrNs) {
              console.log(chalk.yellow(
                'Same namespace value under different names : ' +
                nsName +
                ' and ' +
                attrName +
                '.\nKeeping both.'
              ))
            }
          }
          namespaces[attrName] = attrNs;
        }
      }
    }

    var $defs = $svg.find('defs')
    if ($defs.length > 0) {
      $combinedDefs.append($defs.contents())
      $defs.remove()
    }

    $childSVG.append($svg.contents())
    $combinedDefs.append($childSVG)
    cb()
  }

  stream._flush = function flush(cb) {
    if (isEmpty) return cb()
    if ($combinedDefs.contents().length === 0) {
      $combinedDefs.remove()
    }
    for (var nsName in namespaces) {
      $combinedSvg.attr(nsName, namespaces[nsName])
    }
    var file = new Vinyl({path: outputFilename, contents:  Buffer.from($.xml())})
    this.push(file)
    cb()
  }

  return stream;
}
