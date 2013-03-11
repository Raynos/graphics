var image = require("../../element").image
var transform = require("../../signal").transform
var inspect = require("../../signal").inspect
var MousePosition = require("../../input").MousePosition
var render = require("../../render")

var input = MousePosition()
inspect(input) // =>

// application state
var edgeLength = transform(input, function (pos) {
    return Math.max(100, Math.max(pos.x, pos.y))
})
inspect(edgeLength) // =>

// application view
var main = transform(edgeLength, function resizableYogi(edgeLength) {
    return image(edgeLength, edgeLength, "http://elm-lang.org/yogi.jpg")
})

render(main, false) // =>
