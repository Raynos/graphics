
// [Signal T] -> Signal T
module.exports = merge

function merge(signals) {
    var state = signals[signals.length - 1]()
    var listeners = []
    var started = false

    return outputSignal

    function outputSignal(listener) {
        if (isGet(listener)) {
            return state
        } else if (isSet(listener)) {
            throw new Error("read-only")
        } else {
            listeners.push(listener)
            if (!started) {
                started = true
                start()
            }
        }
    }

    function start() {
        signals.forEach(function listen(signal) {
            signal(function onchange(value) {
                state = value
                listeners.forEach(function (cb) {
                    cb(state)
                })
            })
        })
    }
}

function isGet(x) { return x === undefined }
function isSet(x) { return typeof x !== "function" }
