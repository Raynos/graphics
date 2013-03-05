var video = require("../../element").video
var render = require("../../render")

var main = video(320, 240, "http://elm-lang.org/bear.ogg")

render(main)
