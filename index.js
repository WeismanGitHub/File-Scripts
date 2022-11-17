const { dirname, parse, resolve } = require('path')
const chokidar = require('chokidar');
const { rename } = require("fs");

const watcher = chokidar.watch(
    ['../../../../_Downloaded Content/Movies', '../../../../_Downloaded Content/Shows'],
    { persistent: true, awaitWriteFinish: true }
);

watcher.on('add', function(path) {
    // Rename folders
    const splitPath = dirname(path).split('\\')
    
    splitPath[splitPath.length - 1] = splitPath[splitPath.length - 1].replaceAll('.', ' ').split('1080p')[0]
    .split('WEBRip')[0].split('720p')[0].split('BDRip')[0].split('REMASTERED')[0].trim('')

    const normalizedPath = resolve(splitPath.join('\\'))

    rename(dirname(path), normalizedPath, (err) => {})
    
    // Rename files
    const name = parse(path).name
    const extension = parse(path).ext
    const normalizedName = name.replaceAll('.', ' ').split('1080p')[0]
    .split('WEBRip')[0].split('720p')[0].split('BDRip')[0].split('REMASTERED')[0].trim('')
    
    rename(path, resolve(normalizedPath, normalizedName + extension), (err) => {})
})