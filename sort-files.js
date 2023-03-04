const { getVideoDurationInSeconds } = require('get-video-duration')
const { readdirSync, statSync } = require('fs');
const { parse, resolve } = require('path')
const file = require("file");
const {
    dirToSort,
    sortByAge,
    sortByName,
    sortByLength,
    sortBySize,
    sortByFileAge,
    reverse,
    walkDirectories,
} = require('./config')

async function sortPaths(paths) {
    let sortedPaths = paths;

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

    if (sortByLength) {
        const pathsWithDuration = await Promise.all(paths.map(async path => {
            return { path, duration: await getVideoDurationInSeconds(path) }
        }))

        sortedPaths = pathsWithDuration.sort((a, b) => a.duration - b.duration).map(pathData => pathData.path)
    }

    if (sortBySize) {
        sortedPaths = paths.sort((a, b) => 
            statSync(a).size -statSync(b).size
        )
    }

    if (sortByFileAge) {
        sortedPaths = paths.sort((a, b) => 
            statSync(b).birthtime -statSync(a).birthtime
        )
    }

    if (reverse) {
        paths.reverse()
    }

    return sortedPaths
}

const allPaths = []

if (walkDirectories) {
    file.walkSync(dirToSort, (directory) => {
        const paths = readdirSync(directory).filter(file => /\d\d\d\d/g.test(file)).map(file => resolve(directory, file))
        allPaths.push(...paths)
    })
} else {
    const paths = readdirSync(dirToSort).filter(file => /\d\d\d\d/g.test(file)).map(file => resolve(dirToSort, file))
    allPaths.push(...paths)
}

sortPaths(allPaths).then(paths => {
    console.log(paths.map(path => parse(path).name).join('\n'))
})
