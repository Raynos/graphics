var reductions = require("reducers/reductions")
var concat = require("reducers/concat")

module.exports = foldp

function foldp(input, folder, initial) {
    return concat(initial, reductions(input, folder, initial))
}
