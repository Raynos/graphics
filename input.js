var document = require("global/document")
var window = require("global/window")

var signal = require("./signal/signal")

module.exports = {
    MousePosition: MousePosition
    , MouseClicks: MouseClicks
    , WindowDimensions: WindowDimensions
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
