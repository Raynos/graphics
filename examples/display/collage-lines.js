var line = require("../../element").line
var collage = require("../../element").collage
var dashed = require("../../element").dashed
var dotted = require("../../element").dotted
var solid = require("../../element").solid
var customLine = require("../../element").customLine
var move = require("../../element").move

var blue = require("../../color").blue
var green = require("../../color").green
var red = require("../../color").red
var black = require("../../color").black

var outline = line([
    { x: 50, y: 50 }, { x: 150, y: 50 }, { x: 150, y: 150 }
    , { x: 50, y: 150 }, { x: 50, y: 50 }
])

var main = collage(200, 530, [
    dashed(blue, outline)
    , move(0, 110, dotted(green, outline))
    , move(0, 220, solid(red, outline))
    , move(0, 330, customLine([8, 4, 2, 4], black, outline))
])
