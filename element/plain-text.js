var document = require("global/document")

var getTextSize = require("./get-text-size")
var Element = require("./element")

function TextElement(textAlign, textContent) {
    this.textAlign = textAlign
    this.textContent = textContent
}

TextElement.prototype.type = "TextElement"

TextElement.prototype.create = function _TextElement_create() {
    var div = document.createElement("div")
    div.textContent = this.textContent
    div.style.textAlign = this.textAlign
    return div
}

TextElement.prototype.update = function _TextElement_update(elem, previous) {
    if (previous.textContent !== this.textContent) {
        elem.textContent = this.textContent
    }
}

module.exports = plainText

// String -> Element
function plainText(content) {
    var textSize = getTextSize(content)

    return new Element(new TextElement("left", content)
        , textSize.width, textSize.height)
}
