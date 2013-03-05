var map = require("reducers/map")

module.exports = lift

function lift(input, mapper) {
    return map(input, mapper)
}
