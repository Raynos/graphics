var middle = require("../../element").middle
var plainText = require("../../element").plainText
var container = require("../../element").container

var WindowDimensions = require("../../input").WindowDimensions
var transform = require("../../signal").transform
var render = require("../../render")

function scene(dimensions) {
    var width = Math.round(dimensions.width) - 200
    var height = Math.round(dimensions.height) - 200

    return container(width, height, middle
        , plainText("Hello, World!"))
}


var main = transform(WindowDimensions(), scene)

render(main, false)
// =>
