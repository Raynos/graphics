var reducible = require("reducible/reducible")
var reduce = require("reducible/reduce")
var isError = require("reducible/is-error")
var isReduced = require("reducible/is-reduced")
var reduced = require("reducible/reduced")
var end = require("reducible/end")

var nil = {}

module.exports = mapMany

function mapMany(signals, mapper) {
    return reducible(function (next, initial) {
        var state = initial
        var tokens = signals.map(function () {
            return nil
        })
        var started = false
        var done = 0
        var len = tokens.length
        var result

        signals.forEach(function (signal, index) {
            reduce(signal, function (value) {
                // If everyone has finished then we should
                // just return the result
                if (result) {
                    return result
                }

                // If error then just assign it as result
                // then send the error value downwards.
                if (isError(value)) {
                    result = reduced(state)
                    return next(value, state)
                }

                // If end then mark this index as terminated
                if (value === end) {
                    done++

                    // They have all ended
                    if (done === len) {
                        result = reduced(state)
                        return next(value, state)
                    }
                }

                // store value
                tokens[index] = value

                send(value)
            })
        })

        function send(value) {
            // if not started then check whether we started
            if (!started) {
                started = tokens.every(function (x) {
                    return x !== nil
                })
            }

            // if started then send tokens to next function
            if (started) {
                state = next(mapper.apply(null, tokens), state)

                if (isReduced(state)) {
                    result = state
                }

                return state
            }
        }
    })
}
