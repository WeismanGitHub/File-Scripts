const { getVideoDurationInSeconds } = require('get-video-duration')
const { dirname, parse, resolve } = require('path')
const { readdirSync, statSync } = require('fs');
const file = require("file");
const {
    dirToSort,
    sortByAge,
    reverse,
    sortByName,
    sortByLength,
    sortBySize,
    sortByFileLifeTime,
} = require('./config')

const allPaths = []

file.walkSync(dirToSort, (directory) => {
    const paths = readdirSync(directory).filter(file => /\d\d\d\d/g.test(file)).map(file => resolve(directory, file))
    allPaths.push(...paths)
})

function sortFiles(paths) {
    let sortedPaths = [];

    if (sortByAge) {
        sortedPaths = paths.sort((a, b) => {
            const aMatches = a.match(/\d\d\d\d/g)
            const bMatches = b.match(/\d\d\d\d/g)
            
            return aMatches[aMatches.length - 1] - bMatches[bMatches.length - 1]
        })
    }
    
    if (sortByName) {
        sortedPaths = paths.sort()
    }

    if (sortBySize) {
        sortedPaths = paths.sort((a, b) => 
            statSync(a).size -statSync(b).size
        )
    }

    if (reverse) {
        paths.reverse()
    }

    return sortedPaths.map(path => parse(path).name)
}

console.log(sortFiles(allPaths).join('\n'))
