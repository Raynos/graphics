var reducible = require("reducible/reducible")
var invoker = require("invoker")

module.exports = signal

function signal(callback, defaultValue) {
    return reducible(function (next, initial) {
        var invoke = invoker(next, initial)

        invoke(defaultValue)

        callback(invoke)
    })
}
