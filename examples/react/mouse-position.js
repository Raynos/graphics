var MousePosition = require("../../input").MousePosition
var map = require("../../signal/map")
var plainText = require("../../element").plainText
var render = require("../../render")

var main = map(MousePosition(), function (position) {
    return plainText(position)
})

render(main, false)
// =>
