var document = require("global/document")

var signal = require("../signal/signal")

var KEYS = {
    "37": "left"
    , "38": "up"
    , "39": "right"
    , "40": "down"
}

module.exports = KeyboardArrows


// Signal { x: Number, y: Number }
function KeyboardArrows() {
    var validKeys = [37, 38, 39, 40]

    return signal(function (next) {
        var down = {}

        document.addEventListener("keyup", function onup(ev) {
            if (ev.which in KEYS) {
                var key = KEYS[ev.which]
                down[key] = false

                next(getState())
            }
        })

        document.addEventListener("keydown", function ondown(ev) {
            if (ev.which in KEYS) {
                var key = KEYS[ev.which]
                down[key] = true

                next(getState())
            }
        })

        function getState() {
            var x = 0, y = 0
            if (down.up) {
                y = 1
            } else if (down.down) {
                y = -1
            }

            if (down.left) {
                x = -1
            } else if (down.right) {
                x = 1
            }

            return { x: x, y: y }
        }


    }, { x: 0, y: 0 })
}



