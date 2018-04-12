var fs = require('fs');
var path = require('path');
var colors = require('colors');

// 命令行第一个参数是要查找的文件夹绝对路径
var rootDir = process.argv[2]

// 第二个参数是要测试的正则表达式
var regex = process.argv[3]
regex = regex.toString()
regex = eval(regex)

//解析需要遍历的文件夹
var filePath = path.resolve(rootDir);

var lineInfoArr = [];

//调用文件遍历方法  
fileDisplay(filePath);

testRegex(regex);

/** 
 * 文件遍历方法 
 * @param filePath 需要遍历的文件路径 
 */
function fileDisplay(filePath) {
    //根据文件路径读取文件，返回文件列表  
    fs.readdir(filePath, function (err, files) {
        if (err) {
            console.warn(err)
        } else {
            //遍历读取到的文件列表  
            files.forEach(function (filename) {
                //获取当前文件的绝对路径  
                var filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象  
                fs.stat(filedir, function (eror, stats) {
                    if (eror) {
                        console.warn('获取文件stats失败');
                    } else {
                        var isFile = stats.isFile(); //是文件  
                        var isDir = stats.isDirectory(); //是文件夹  
                        if (isFile) {
                            regApply(filedir, regex)
                            console.log(filedir.rainbow);
                        }
                        if (isDir) {
                            fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件  
                        }
                    }
                })
            });
        }
    });
}

function testRegex(regex) {
    if (Object.getPrototypeOf(regex) === RegExp.prototype) {
        console.log('输入的正则表达式为：' + regex)
    } else {
        console.warn('第二个参数不是合规的正则表达式，请重新输入')
        process.abort()
    }
}

// 应用正则，参数是文件所在的路径
function regApply(filedir, regex) {
    fs.readFile(filedir, 'utf-8', function (err, data) {
        if (err) {
            console.warn('文件读取失败');
        } else {
            let indexArr = []
            let colorfulData
            var endlArr = searchEndl(data)
            let result = regex.exec(data)
            let regexResArr = []
            let index
            while (result !== null) {
                regexResArr.push(result[0])
                index = result.index
                indexArr.push(index)
                result = regex.exec(data)
            }

            // 正则exec检索匹配后的值数组不为空则继续下一步
            if (regexResArr.length !== 0) {
                pureArray(regexResArr)
                colorfulData = colorfy(data, regexResArr, indexArr, endlArr)
                console.log('\n'+colorfulData + '\n')

                //line information
                pureArray(lineInfoArr)
                for (let i = 0; i < lineInfoArr.length; i++) {
                    console.log('Line: ' + lineInfoArr[i])
                }
            }

        }
    })
}

// 给匹配到的正则上色，目前是rainbow，计划可配置
//return array
function colorfy(data, itemArr, indexArr, endlArr) {
    let dataArr = data.split("")
    itemArr.forEach(function (item) {
        //上色一次这个colorData长度为一
        let count = 0
        let len = item.length
        let stubs = ''
        indexArr.forEach(function (index) {
            let colorData = data.slice(index, index + len).rainbow
            dataArr.splice(index, len)
            dataArr.splice(index, 0, colorData)
            for (let i = 0; i < len - 1; i++) {
                dataArr.splice(index + 1 + i, 0, stubs)
            }
            for (let i = 0; i < endlArr.length; i++) {
                if (index < endlArr[i]) {
                    lineInfoArr.push(i + 1)
                    break;
                }
            }
            if(index>endlArr[endlArr.length-1]){
                lineInfoArr.push(endlArr.length+1)
            }
        })
    })

    return dataArr.join("")
}

function searchEndl(data) {
    let resArr = []
    data = data.split("")
    for (let i = 0; i < data.length; i++) {
        if (data[i] === '\n') {
            data[i]
            resArr.push(i)
        }
    }
    return resArr

}

function pureArray(arr) {
    let abunduntIndex = []
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                abunduntIndex.push(j)
            }
        }
    }
    abunduntIndex.sort(function (a, b) {
        return b - a
    })
    let repeatSplice = []
    abunduntIndex.forEach(function (item) {
        if (!repeatSplice.includes(item)) {
            arr.splice(item, 1)
            repeatSplice.push(item)
        }
    })
}