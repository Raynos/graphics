var MouseClicks = require("../../input").MouseClicks
var foldp = require("../../signal").foldp
var transform = require("../../signal").transform
var plainText = require("../../element").plainText
var render = require("../../render")

var clicks = foldp(MouseClicks(), function (count) {
    return count + 1
}, 0)

var main = transform(clicks, plainText)

render(main, false)
// =>
