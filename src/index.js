const http = require('http');

const {domInfo, fileList, getVideo, getVideoStream}  = require('./findFile');
const {videoRegExp, videoMedia} = require('./config')

const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url);
    if (videoMedia.test(url)) {
        getVideoStream(url, req, res)
    } else if (videoRegExp.test(url)) {
        getVideo(url, res)
    } else {
        res.write(domInfo, 'utf-8')
        res.end()
    }
})

server.listen(8081, () => {
    console.log(`项目已启动，本次有效视频文件为${fileList.length}个`)
});


// 视频传输fs stream流
// fs.readdirSync 同步读取文件
// fs.lstatSync 指定文件的信息
// 视频拖动 获取req.header.range 进行计算
// bytes=18841600-
// 206状态码 客户端表明自己只需要目标URL上的部分资源的时候返回的
// fs.watchFile监听文件变动