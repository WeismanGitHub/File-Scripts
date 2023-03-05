const { getVideoDurationInSeconds } = require('get-video-duration')
const { readdirSync, statSync, readFileSync } = require('fs');
const { default: srtParser2 } = require('srt-parser-2');
const { resolve, parse } = require('path')
const file = require("file");
const {
    moviesDirectory,
    subTitlesDirectory,
    words,
    sortByAge,
    sortByName,
    sortByLength,
    sortBySize,
    sortByFileAge,
    sortByWords,
    walkDirectories,
    reverse,
} = require('../config')

async function sortPaths(moviePaths, subtitlePaths) {
    let sortedPaths = moviePaths;

    if (sortByAge) {
        sortedPaths = moviePaths.sort((a, b) => {
            const aMatches = a.match(/\d\d\d\d/g)
            const bMatches = b.match(/\d\d\d\d/g)
            
            return aMatches[aMatches.length - 1] - bMatches[bMatches.length - 1]
        })
    }
    
    if (sortByName) {
        sortedPaths = moviePaths.sort()
    }

    if (sortByLength) {
        const pathsWithDuration = await Promise.all(moviePaths.map(async path => {
            return { path, duration: await getVideoDurationInSeconds(path) }
        }))

        sortedPaths = pathsWithDuration.sort((a, b) => a.duration - b.duration).map(pathData => pathData.path)
    }

    if (sortBySize) {
        sortedPaths = moviePaths.sort((a, b) =>
            statSync(a).size - statSync(b).size
        )
    }

    if (sortByFileAge) {
        sortedPaths = moviePaths.sort((a, b) => 
            statSync(b).birthtime - statSync(a).birthtime
        )
    }

    if (sortByWords) {
        const regexList = words.map(word => new RegExp(word, "gi"))
        const parser = new srtParser2()

        const pathsWithCount = subtitlePaths.map(path => {
            const text = parser.fromSrt(readFileSync(path, { encoding: "utf-8" }))
            .map(part => part.text).join('')
            let count = 0;

            for (let regex of regexList) {
                count += (text.match(regex) || []).length
            }

            return { path, count }
        })

        sortedPaths = pathsWithCount.sort((a, b) => a.count - b.count).map(pathWithCount => pathWithCount.path)
    }

    if (reverse) {
        sortedPaths.reverse()
    }

    return sortedPaths
}

function getFilePaths(directory, walk=true) {
    const filePaths = []

    if (walk) {
        file.walkSync(directory, (dir) => {
            const paths = readdirSync(dir).filter(file => /\d\d\d\d/g.test(file)).map(file => resolve(dir, file))
            filePaths.push(...paths)
        })
    } else {
        const paths = readdirSync(directory).filter(file => /\d\d\d\d/g.test(file)).map(file => resolve(directory, file))
        filePaths.push(...paths)
    }

    return filePaths
}

const subtitlePaths = getFilePaths(subTitlesDirectory, walkDirectories)
const moviePaths = getFilePaths(moviesDirectory, walkDirectories)

sortPaths(moviePaths, subtitlePaths)
.then(paths => {
    console.log(paths.map(path => parse(path).name).join('\n'))
})
