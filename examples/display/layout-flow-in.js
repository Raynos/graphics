var plainText = require("../../element").plainText
var video = require("../../element").video
var image = require("../../element").image
var flow = require("../../element").flow

var render = require("../../render")

var content = [
    plainText("Bears, Oh My!")
    , video(320, 240, "http://elm-lang.org/bear.ogg")
    , image(472, 315, "http://elm-lang.org/shells.jpg")
]

// Try left, right, outward, inward, up, down
var main = flow("inward", content)

render(main, false)
// =>
