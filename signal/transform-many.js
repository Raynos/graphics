
// [Signal Tn] -> (T1 -> T2 -> T3 -> ... -> T) -> Signal T
module.exports = transformMany

function transformMany(signals, lambda) {
    var state = lambda.apply(null, values())
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

    function values() {
        return signals.map(call)
    }

    function call(signal) {
        return signal()
    }

    function start() {
        signals.forEach(function listen(signal, index) {
            signal(function onchange(value) {
                var vs = values()
                vs[index] = value
                state = lambda.apply(null, vs)
                listeners.forEach(function (cb) {
                    cb(state)
                })
            })
        })
    }
}

function isGet(x) { return x === undefined }
function isSet(x) { return typeof x !== "function" }
