var mainBowerFiles = require('main-bower-files'),
    fs = require('fs');

module.exports = function (extension, minifiedExtension, orderArray, partial) {
    var matchExtension = new RegExp('.+\\.' + extension + '$'),
    matchMinifiedExtension = new RegExp('.+\\.' + minifiedExtension + '$'),
    filenameWithoutExtension = new RegExp('^(.+)\\.' + extension + '$'),
    result = {},
    tmpFiles;

    result.normal = mainBowerFiles().filter(function (filename) {
      return filename.match(matchExtension)
    });
    
    var ignoreList = []
    if(orderArray) {
        var ordered = [];
        var notOrdered = [];
        var isWin = /^win/.test(process.platform);
        var matchFile;
        orderArray.forEach(function (orderElement) {
            if(isWin) {
                matchFile = new RegExp('.+\\\\' + orderElement.toLowerCase() +'\\\\.+');
            }else {
                matchFile = new RegExp('.+/' + orderElement.toLowerCase() +'/.+');
            }
            result.normal.forEach(function (filename) {
                if(filename.toLowerCase().match(matchFile)) ordered.push(filename)
            })
        })
        
        if(partial) {
            result.normal = ordered;
        }else {
            result.normal.forEach(function (normalElement) {
                var flag = false
                ordered.forEach(function (filename) {
                    if(normalElement.toLowerCase()==filename.toLowerCase()) {
                        flag = true;
                        return
                    }
                })
                if(!flag) {
                    var remove = false
                    orderArray.forEach(function (orderElement) {
                        var str = orderElement
                        if(orderElement.charAt(0)=="!")  {
                            if(isWin) {
                                str = '\\' + orderElement.toLowerCase().substr(1,orderElement.length-1) +'\\';
                            }else {
                                str = '/' + orderElement.toLowerCase().substr(1,orderElement.length-1) +'/';
                            }
                            if(normalElement.indexOf(str)!=-1) {
                                remove = true
                                ignoreList.push(normalElement)
                                return
                            }
                        }
                    });
                    if(!remove) notOrdered.push(normalElement);
                }
            })
            ordered.push.apply(ordered,notOrdered);
            result.normal = ordered;
            result.ignore = ignoreList;
        }
    }

    if (minifiedExtension) {
        if (minifiedExtension=="min.css") {
            tmpFiles = result.normal.map(function (orgFilename) {
                var minFilename = orgFilename.replace(filenameWithoutExtension, '$1.' + minifiedExtension);
                var dir1,dir2,dir3,dir4;
                if(isWin) {
                    dir1 = minFilename.replace("\\less\\","\\css\\");
                    dir2 = minFilename.replace("\\scss\\","\\css\\");
                    dir3 = minFilename.replace("\\less\\","\\dist\\css\\");
                    dir4 = minFilename.replace("\\scss\\","\\dist\\css\\");
                }else {
                    dir1 = minFilename.replace("/less/","/css/");
                    dir2 = minFilename.replace("/scss/","/css/");
                    dir3 = minFilename.replace("/less/","/dist/css/");
                    dir4 = minFilename.replace("/scss/","/dist/css/");
                }
                if (fs.existsSync(minFilename)) return minFilename
                else if(fs.existsSync(dir1)) return dir1
                else if(fs.existsSync(dir2)) return dir2
                else if(fs.existsSync(dir3)) return dir3
                else if(fs.existsSync(dir4)) return dir4
                return orgFilename;
            });
        }else {
            tmpFiles = result.normal.map(function (orgFilename) {
                var minFilename = orgFilename.replace(filenameWithoutExtension, '$1.' + minifiedExtension);
                if (fs.existsSync(minFilename)) return minFilename
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
