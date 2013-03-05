var document = require("global/document")

var guid = require("./lib/guid")

var pooledDiv = document.createElement("div")
pooledDiv.style.visibility = "hidden"
pooledDiv.style.display = "absolute"
document.body.appendChild(pooledDiv)

module.exports = {
    plainText: plainText
    , image: image
    , video: video
}

// String -> Element
function plainText(content) {
    var textSize = getTextSize(content)
    return new Element(guid(), new TextElement("left", content)
        , textSize.width, textSize.height)
}

function getTextSize(content) {
    pooledDiv.textContent = content
    var size = { width: pooledDiv.offsetWidth, height: pooledDiv.offsetHeight}
    pooledDiv.textContent = ""
    return size
  }
// Int -> Int -> String -> Element
function image(width, height, source) {
    return new Element(guid(), new ImageElement(source), width, height)
}

// Int -> Int -> String -> Element
function video(width, height, source) {
    return new Element(guid(), new VideoElement(source), width, height)
}

function Element(id, basicElement, width, height, opacity, color, link) {
    this.id = id || 0
    this.basicElement = basicElement
    this.width = width || 0
    this.height = height || 0
    this.opacity = opacity || 1
    this.color = color || null
    this.link = link || null
}

Element.prototype.type = "Element"

function TextElement(textAlign, textContent) {
    this.textAlign = textAlign
    this.textContent = textContent
}

TextElement.prototype.type = "TextElement"

TextElement.prototype.create = function _TextElement_create() {
    var div = document.createElement("div")
    div.textContent = this.textContent
    return div
}

TextElement.prototype.update = function _TextElement_update(elem, previous) {
    if (previous.textContent !== this.textContent) {
        elem.textContent = this.textContent
    }
}

function ImageElement(source) {
    this.source = source
}

ImageElement.prototype.type = "ImageElement"

ImageElement.prototype.create = function _ImageElement_create() {
    var img = document.createElement("img")
    img.src = this.source
    return img
}

ImageElement.prototype.update = function _ImageElement_update(elem, previous) {
    if (previous.source !== this.source) {
        elem.src = this.source
    }
}

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
