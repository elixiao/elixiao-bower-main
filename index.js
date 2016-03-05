var mainBowerFiles = require('main-bower-files'),
  fs = require('fs');
/**
 * Based on asset type, get bower main files as normal file names array and as minimized file names array.
 * If no minified version is found for some files, these file names will be available as a 3rd array,
 * so you can minify them yourself.
 *
 * @param  {String} extension - The asset type you want, for example .js or .css
 * @param  {String} minifiedExtension - Optional: The minified asset type you want, for example .min.js, .min.js.gzip or .min.css
 * @return {Object} - With the properties of type Array: 'normal', 'minified' and 'minifiedNotFound'. The last two properties is only present if function is called with both parameters.
 */
module.exports = function (extension, minifiedExtension) {
    var matchExtension = new RegExp('.+\\.' + extension + '$'),
    matchMinifiedExtension = new RegExp('.+\\.' + minifiedExtension + '$'),
    filenameWithoutExtension = new RegExp('^(.+)\\.' + extension + '$'),
    result = {},
    tmpFiles;

    result.normal = mainBowerFiles().filter(function (filename) {
      return filename.match(matchExtension)
    });

    if (minifiedExtension) {
        if (minifiedExtension=="min.css") {
            tmpFiles = result.normal.map(function (orgFilename) {
                var minFilename = orgFilename.replace(filenameWithoutExtension, '$1.' + minifiedExtension);
                var replaceLess2css = minFilename.replace("less/","css/");
                var replaceScss2css = minFilename.replace("scss/","css/");
                var distLess2css = minFilename.replace("less/","dist/css/");
                var distScss2css = minFilename.replace("scss/","dist/css/");
                if (fs.existsSync(minFilename)) return minFilename
                else if(fs.existsSync(replaceLess2css)) return replaceLess2css
                else if(fs.existsSync(replaceScss2css)) return replaceScss2css
                else if(fs.existsSync(distLess2css)) return distLess2css
                else if(fs.existsSync(distScss2css)) return distScss2css
                return orgFilename;
            });
        }else {
            tmpFiles = result.normal.map(function (orgFilename) {
                var minFilename = orgFilename.replace(filenameWithoutExtension, '$1.' + minifiedExtension);
                if (fs.existsSync(minFilename)) {
                    return minFilename
                }
                return orgFilename;
            });
        }
        
        result.min = tmpFiles.filter(function (filename) {
            return filename.match(matchMinifiedExtension)
        });
        
        result.minNotFound = tmpFiles.filter(function (filename) {
            if (filename.indexOf(minifiedExtension, this.length - minifiedExtension.length) === -1) {
                return filename;
            }
        });
    }
  return result;
};
