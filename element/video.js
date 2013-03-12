var document = require("global/document")

var Element = require("./element")

function VideoElement(source) {
    this.source = source
}

VideoElement.prototype.type = "VideoElement"

VideoElement.prototype.create = function _VideoElement_create() {
    var videoSource = this.source
    var segments = videoSource.split(".")
    var video = document.createElement("video")
    var source = document.createElement("source")
    video.controls = "controls"
    source.src = videoSource
    source.type = "video/" + segments[segments.length - 1]
    video.appendChild(source)
    return video
}

module.exports = video

// Int -> Int -> String -> Element
function video(width, height, source) {
    return new Element(new VideoElement(source), width, height)
}
