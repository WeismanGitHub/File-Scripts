const { dirname, parse, resolve } = require('path')
const chokidar = require('chokidar');
const { rename } = require("fs");

const watcher = chokidar.watch(
    ['../../../../_Downloaded Content/Movies', '../../../../_Downloaded Content/Shows'],
    { persistent: true, awaitWriteFinish: true }
);

watcher.on('add', function(path) {
    const name = parse(path).name
    const extension = parse(path).ext
    const dir = dirname(path)
    const normalizedName = name.replaceAll('.', ' ').split('1080p')[0].split('WEBRip')[0].split('720p')[0].trim('')
    
    rename(path, resolve(dir, normalizedName + extension), (err) => {})
})