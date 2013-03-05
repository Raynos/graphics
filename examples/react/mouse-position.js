var MousePosition = require("../../mouse").Position
var lift = require("../../signal/lift")
var plainText = require("../../element").plainText
var render = require("../../render")

var main = lift(MousePosition(), plainText)

render(main)
