const { getVideoDurationInSeconds } = require('get-video-duration')
const { readdirSync } = require('fs');
const file = require("file");
const {
    dirToSort,
    sortByAge,
    reverse,
    sortByName,
    sortByLength,
} = require('./config')

const allFiles = []

file.walkSync(dirToSort, (directory) => {
    const files = readdirSync(directory).filter(file => /\d\d\d\d/g.test(file))
    allFiles.push(...files)
})

function sortFiles(files) {
    let sortedFiles;

    if (sortByAge) {
        sortedFiles = files.sort((a, b) => {
            const aMatches = a.match(/\d\d\d\d/g)
            const bMatches = b.match(/\d\d\d\d/g)
            
            return aMatches[aMatches.length - 1] - bMatches[bMatches.length - 1]
        })
    }
    
    if (sortByName) {
        sortedFiles = files.sort()
    }

    if (sortByLength) {
        sortedFiles = files.sort((a, b) => {
            // getVideoDurationInSeconds('video.mov').then((duration) => {
            //     console.log(duration)
            // })
        })
    }

    if (reverse) {
        files.reverse()
    }

    return sortedFiles
}

console.log(sortFiles(allFiles).join('\n'))
