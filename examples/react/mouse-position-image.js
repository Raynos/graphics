var image = require("../../element").image
var map = require("../../signal/map")
var MousePosition = require("../../input").MousePosition
var render = require("../../render")

var input = MousePosition()
input
// =>

var edgeLength = map(input, function (pos) {
    return Math.max(100, Math.max(pos.x, pos.y))
})
edgeLength // application state
// =>

var main = map(edgeLength, function resizableYogi(edgeLength) {
    return image(edgeLength, edgeLength, "http://elm-lang.org/yogi.jpg")
}) // application view

render(main, false)
// =>
