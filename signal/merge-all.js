// Hash<key, Signal<T>> -> Signal Hash<key, T>
module.exports = mergeAll

function mergeAll(signals) {
    var listeners = []
    var started = false

    return signal

    function signal(listener) {
        if (isGet(listener)) {
            return {}
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
        Object.keys(signals).forEach(function (key) {
            var signal = signals[key]
            signal(function onchange(value) {
                var result = {}
                result[key] = value
                listeners.forEach(function (cb) {
                    cb(result)
                })
            })
        })
    }
}

function isGet(x) { return x === undefined }
function isSet(x) { return typeof x !== "function" }
