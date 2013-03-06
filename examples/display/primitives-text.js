var plainText = require("../../element").plainText
var render = require("../../render")

var main = plainText("Hello, World!")

render(main, false)
// =>
