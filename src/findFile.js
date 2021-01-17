/***
 * @description 查询文件
 */
const {filePath, regexp} = require('./config');
const {readVideoStream} = require('./readStream');
const fs = require('fs');
const path = require('path');
const fileList = [];

const getFile = (filePath) => {
    const fileDirPath = path.resolve(__dirname, filePath)
    const result = fs.readdirSync(fileDirPath);
    if (result) {
        result.forEach(file => {
            const currentFile = `${filePath}\\${file}`;
            const stats = fs.statSync(path.resolve(__dirname, currentFile));
            if(stats.isDirectory()) {
                getFile(currentFile)
            }
            if (regexp.test(file)) {
                const fileArr = file.split('.');
                const type = fileArr[fileArr.length - 1];
                fileArr.pop();
                const name = fileArr.join('.');
                fileList.push({
                    name,
                    path:currentFile,
                    pathName: `/video/${name}`,
                    type
                })
            }
        })
    }
    
    return fileList;
}
// 首页数据
const file2dom = (allFile) => {
    let content = '';
    if(allFile && allFile.length) {
        content =  allFile.reduce((acc, item) => {
            return acc + `<a href='/video/${item.name}' target="_blank" style="display:block">${item.name}</a>`
        }, '')
    } else {
        content = '<h1>文件夹内无有效数据</h1>'
    }
    return `<head><meta charset="utf-8"/></head>${content}`
}
// 获取对应视频数据
const getFileObj = (url) => {
    const videoName = url.split('/')[2];
    const fileObj = fileList.find(it => {
        return `${it.name}` == videoName || `${it.name}.${it.type}` == videoName
    });
    return fileObj;
}
// 视频页面dom
const getVideo = (url, res) => {
    const fileObj = getFileObj(url);
    const dom = `<head><meta charset="utf-8"/></head><video controls autoplay src='${fileObj.pathName}.${fileObj.type}' style="width: 100%; height: 100%"></video>`;
    res.write(dom, 'utf-8');
    res.end();
}
// 视频流
const getVideoStream = (url, req, res) => {
    const fileObj = getFileObj(url);
    readVideoStream(fileObj, req, res)
}

// 获取首页数据
const domInfo = file2dom(getFile(filePath))


module.exports =  {
    domInfo, 
    fileList,
    getVideo,
    getVideoStream
};


 
