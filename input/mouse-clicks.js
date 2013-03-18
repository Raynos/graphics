var document = require("global/document")

var signal = require("../signal/signal")

module.exports = MouseClicks

// Signal {}
function MouseClicks() {
    return signal(function (next) {
        document.addEventListener("click", function (ev) {
            next({})
        })
    })
}
