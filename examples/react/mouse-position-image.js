var image = require("../../element").image
var lift = require("../../signal/lift")
var MousePosition = require("../../mouse").Position
var render = require("../../render")

function resizableYogi(edgeLength) {
    return image(edgeLength, edgeLength, "http://elm-lang.org/yogi.jpg")
}

var edgeLength = lift(MousePosition(), function (pos) {
    return Math.max(100, Math.max(pos.x, pos.y))
})

var main = lift(edgeLength, resizableYogi)

render(main)
