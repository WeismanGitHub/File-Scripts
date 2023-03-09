const { getVideoDurationInSeconds } = require('get-video-duration')
const { readdirSync, statSync, readFileSync } = require('fs');
const { default: srtParser2 } = require('srt-parser-2');
const { resolve, parse } = require('path')
const file = require("file");
const {
    moviesDirectory,
    subTitlesDirectory,
    words,
    byReleaseYear,
    byName,
    byLength,
    bySize,
    byFileAge,
    byWords,
    walkDirectories,
    reverse,
    returnCount,
    returnSortedByCount,
} = require('../config')

async function countPaths(paths, subtitlePaths) {
    let countedPaths = {};

    if (byReleaseYear) {
        paths.forEach(path => {
            const year = path.match(/\d\d\d\d/g)[0]

            if (countedPaths[year]) {
                countedPaths[year].push(path.split(/\d\d\d\d/g)[0])
            } else {
                countedPaths[year] = [path.split(/\d\d\d\d/g)[0]]
            }
        })

        if (returnSortedByCount) {
        }

        const sortedPaths = []

        for (let [year, paths] of Object.entries(countedPaths)) {
            if (returnCount) {
                sortedPaths.push(`${year}: ${paths.length}`)
            } else {
                sortedPaths.push(`${year}: ${paths.map(path => parse(path).name).join(' ')}`)
            }
        }

        countedPaths = sortedPaths
    }
    
    if (byName) {
        countedPaths = paths.sort()
    }

    if (byLength) {
        const pathsWithDuration = await Promise.all(paths.map(async path => {
            return { path, duration: await getVideoDurationInSeconds(path) }
        }))

        countedPaths = pathsWithDuration.sort((a, b) => a.duration - b.duration).map(pathData => pathData.path)
    }

    if (bySize) {
        countedPaths = paths.sort((a, b) =>
            statSync(a).size - statSync(b).size
        )
    }

    if (byFileAge) {
        countedPaths = paths.sort((a, b) => 
            statSync(b).birthtime - statSync(a).birthtime
        )
    }

    if (byWords) {
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

        countedPaths = pathsWithCount.sort((a, b) => a.count - b.count).map(pathWithCount => pathWithCount.path)
    }

    if (reverse) {
        countedPaths.reverse()
    }

    return countedPaths
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

countPaths(moviePaths, subtitlePaths)
.then(countData => {
    console.log(countData)
})
