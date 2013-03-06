var image = require("../../element").image
var map = require("../../signal/map")
var MousePosition = require("../../input").MousePosition
var render = require("../../render")

function resizableYogi(edgeLength) {
    return image(edgeLength, edgeLength, "http://elm-lang.org/yogi.jpg")
}

var edgeLength = map(MousePosition(), function (pos) {
    return Math.max(100, Math.max(pos.x, pos.y))
})

var main = map(edgeLength, resizableYogi)

render(main, false)
// =>
