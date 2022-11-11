const { dirname, parse, resolve } = require('path')
const chokidar = require('chokidar');
const { rename } = require("fs");
require('dotenv').config();

const watcher = chokidar.watch(
    process.env.PATHS,
    { persistent: true, awaitWriteFinish: true }
);

watcher.on('add', function(path) {
    const name = parse(path).name
    const extension = parse(path).ext
    const dir = dirname(path)
    const normalizedName = name.replaceAll('.', ' ').split('1080p')[0].trim('')

    rename(path, resolve(dir, normalizedName + extension), (err) => {})
})