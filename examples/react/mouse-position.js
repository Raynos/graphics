var MousePosition = require("../../input").MousePosition
var transform = require("../../signal").transform
var plainText = require("../../element").plainText
var render = require("../../render")

var main = transform(MousePosition(), function (position) {
    return plainText(position)
})

render(main, false)
// =>
