var setTimeout = require("timers").setTimeout

module.exports = signal

// ((A -> void) -> void) -> A -> Signal A
function signal(callback, defaultValue) {
    var value = defaultValue
    var listeners = []

    setTimeout(function () {
        callback(set)
    }, 0)

    return observable

    function observable(listener) {
        if (isGet(listener)) {
            return value
        } else if (isSet(listener)) {
            throw new Error("read-only")
        } else {
            listeners.push(listener)
        }
    }

    function set(v) {
        value = v

        listeners.forEach(send)
    }

    function send(listener) {
        listener(value)
    }
}

function isGet(x) { return x === undefined }
function isSet(x) { return typeof x !== "function" }
