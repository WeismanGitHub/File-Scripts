const { dirname, parse, resolve } = require('path')
const chokidar = require('chokidar');
const { rename } = require("fs");

const watcher = chokidar.watch(
    ['../../../../_Downloaded Content/Movies', '../../../../_Downloaded Content/Shows', '../../../../_Downloaded Content/Subtitles'],
    { persistent: true, awaitWriteFinish: true }
);

watcher.on('add', function(path) {
    // Rename folders
    const splitPath = dirname(path).split('\\')
    
    splitPath[splitPath.length - 1] = splitPath[splitPath.length - 1].replaceAll('.', ' ').split('1080p')[0]
    .split('WEBRip')[0].split('720p')[0].split('BDRip')[0][0].trim('')

    const normalizedPath = resolve(splitPath.join('\\'))

    if (resolve(dirname(path)) !== normalizedPath) {
        rename(dirname(path), normalizedPath, (err) => {if (err) console.log(err)})
    }
})

watcher.on('add', function(path) {
    // Rename files
    const extension = parse(path).ext
    const name = parse(path).name
    const dir = dirname(path)

    const normalizedName = name.replaceAll('.', ' ').split('1080p')[0]
    .split('WEBRip')[0].split('720p')[0].split('BDRip')[0][0].trim('')
    
    if (normalizedName !== name) {
        rename(path, resolve(dir, normalizedName + extension), (err) => {if (err) console.log(err)})
    }
})