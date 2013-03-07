var document = require("global/document")
var window = require("global/window")
var setTimeout = require("timers").setTimeout

var signal = require("./signal/signal")

var KEYS = {
    "37": "left"
    , "38": "up"
    , "39": "right"
    , "40": "down"
}

module.exports = {
    MousePosition: MousePosition
    , MouseClicks: MouseClicks
    , WindowDimensions: WindowDimensions
    , fps: fps
    , KeyboardArrows: KeyboardArrows
}

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

// Signal {}
function MouseClicks() {
    return signal(function (next) {
        document.addEventListener("click", function () {
            next({})
        })
    })
}

// Signal { x: Int, y: Int }
function MousePosition() {
    return signal(function (next) {
        document.addEventListener("mousemove", function (event) {
            next(getXY(event))
        })
    }, new Point(0, 0))
}

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

function getXY(event) {
    var posx = 0
    var posy = 0

    if (!event) {
        event = window.event
    }

    if (event.pageX || event.pageY) {
        posx = event.pageX;
        posy = event.pageY;
    } else if (event.clientX || event.clientY)  {
        posx = event.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        posy = event.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }

    return new Point(posx, posy)
}

function Point(x, y) {
    this.x = x
    this.y = y
}

Point.prototype.toString = function _Point_toString() {
    return "[x=" + this.x + ", y=" + this.y + "]"
}
