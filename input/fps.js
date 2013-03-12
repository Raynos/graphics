var setTimeout = require("timers").setTimeout

var signal = require("../signal/signal")

module.exports = fps

// Signal Number
function fps(desiredFps) {
    var msPerFrame = 1000 / desiredFps

    return signal(function (next) {
        var prev = Date.now()

        setTimeout(tick, msPerFrame)

        function tick() {
            var curr = Date.now()
            var diff = curr - prev
            prev = curr

            next(diff)

            setTimeout(tick, msPerFrame)
        }
    }, 0)
}
