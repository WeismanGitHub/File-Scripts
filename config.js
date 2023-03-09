module.exports = {
    // RENAME CONFIG
    dirsToRename: [
        '../../../../_Downloaded Content/Movies',
        '../../../../_Downloaded Content/Shows',
        '../../../../_Downloaded Content/Subtitles'
    ],
    // SORT CONFIG
    moviesDirectory: '../../../../_Downloaded Content/Movies',
    subTitlesDirectory: '../../../../_Downloaded Content/Subtitles',
    words: ['fuck', 'shit', 'ass', 'crap', 'bitch', 'cunt'],
    byReleaseYear: true, // Sorts by release date at the end of file name. EX: The Thing 1982
    byName: false,
    byLength: false,
    bySize: false,
    byFileAge: false,
    byWords: false,
    reverse: false,
    walkDirectories: false,
    returnCount: true, // Return the count, or return the matches.
    returnSortedByCount: true,
}