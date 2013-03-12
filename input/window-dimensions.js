var window = require("global/window")

var signal = require("../signal/signal")

module.exports = WindowDimensions

// Signal { width: Number, height: Number }
function WindowDimensions() {
    return signal(function (next) {
        window.addEventListener("resize", function (e) {
            next({
                width: window.innerWidth
                , height: window.innerHeight
            })
        })
    }, {
        width: window.innerWidth
        , height: window.innerHeight
    })
}

