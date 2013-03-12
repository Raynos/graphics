var document = require("global/document")

var Element = require("./element")

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

module.exports = image

// Int -> Int -> String -> Element
function image(width, height, source) {
    return new Element(new ImageElement(source), width, height)
}
