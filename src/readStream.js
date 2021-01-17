const fs = require('fs');
const path = require('path');

function readVideoStream(fileData, req, res) {
    const {name, type} = fileData;
    const stats = fs.statSync(path.resolve(__dirname, fileData.path))
    const contentType = `video/${type ?? 'mp4'}`;

    const range = req.headers.range;
    const positions = range.replace(/bytes=/, "").split("-");
    const start = parseInt(positions[0]);
    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1]) : total - 1;
    const chunksize = (end - start) + 1;
    res.writeHead(206, {

        'Content-Type': contentType,

        'Accept-Ranges': 'bytes',

        'Server': 'Microsoft-IIS/7.5',

        'X-Powered-By': 'ASP.NET',

        "Content-Range": "bytes " + start + "-" + end + "/" + total,

    });

    const readStream = fs.ReadStream(fileData.path, {start, end});

    readStream.on('close', function () {
        res.end();
    });

    readStream.pipe(res);
}

module.exports = {
    readVideoStream
}