var collage = require("../../element").collage
var filled = require("../../element").filled
var rect = require("../../element").rect

var render = require("../../render")

var myBlue  = { r: 0, g: 85, b: 170 }
var myGreen = { r: 28, g: 267, b: 85, a: 1 / 2 }

var main = collage(300, 300, [
    filled(myBlue, rect(75, 75, { x: 150, y: 150 }))
    , filled(myGreen, rect(50, 50, { x: 200, y: 100 }))
])

render(main, false)
// =>
