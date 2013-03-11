// Signal A -> (B -> A -> B) -> B -> Signal B
module.exports = foldp

function foldp(inputSignal, folder, initialValue) {
    var state = initialValue
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
        inputSignal(function onchange(value) {
            state = folder(state, value)
            listeners.forEach(function (cb) {
                cb(state)
            })
        })
    }
}

function isGet(x) { return x === undefined }
function isSet(x) { return typeof x !== "function" }
