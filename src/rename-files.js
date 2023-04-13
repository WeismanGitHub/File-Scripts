const { dirname, parse, resolve } = require('path')
const { dirsToRename } = require('../config')
const { rename, unlink } = require("fs");
const chokidar = require('chokidar');

const watcher = chokidar.watch(dirsToRename, { persistent: true, awaitWriteFinish: true });

watcher.on('add', function(path) { // rename folders
    const splitPath = dirname(path).split('\\')
    
    splitPath[splitPath.length - 1] = splitPath[splitPath.length - 1].replaceAll('.', ' ')
    .split('1080p')[0].split('720p')[0].split('WEBRip')[0].replace('REMASTERED', '').replace('PROPER', '').trim()
    
    const normalizedPath = resolve(splitPath.join('\\'))

    if (resolve(dirname(path)) !== normalizedPath) {
        rename(dirname(path), normalizedPath, (err) => {if (err) console.log(err)})
    }
})

watcher.on('add', function(path) { // rename files
    const extension = parse(path).ext
    const name = parse(path).name
    const dir = dirname(path)
    
    if (name.toUpperCase() == 'RARBG') {
        return unlink(resolve(dir, name + extension), (err) => { if (err) throw err })
    }

    const normalizedName = name.replaceAll('.', ' ').split('1080p')[0].split('720p')[0]
    .split('WEBRip')[0].replace('REMASTERED', '').replace('PROPER', '').trim()
    
    if (normalizedName !== name) {
        rename(path, resolve(dir, normalizedName + extension), (err) => {if (err) console.log(err)})
    }
})