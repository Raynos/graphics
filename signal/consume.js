var fold = require("reducers/fold")

module.exports = consume

function consume(input) {
    fold(input, noop)
}

function noop() {}
