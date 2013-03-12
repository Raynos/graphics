var document = require("global/document")

var Element = require("./element")
var setPosition = require("./set-position")

function ContainerElement(position, elem) {
    this.position = position
    this.elem = elem
}

ContainerElement.prototype.type = "ContainerElement"

ContainerElement.prototype.create = function _ContainerElement_create() {
    var child = this.elem.create()
    setPosition(this.position, child)
    var div = document.createElement("div")
    div.style.position = "relative"
    div.style.overflow = "hidden"
    div.appendChild(child)
    return div
}

ContainerElement.prototype.update =
    function _ContainerElement_update(elem, previous) {
        this.elem.update(elem.firstChild, previous.elem)
        setPosition(this.position, elem.firstChild)
    }

module.exports = container

// Int -> Int -> Position -> Element -> Element
function container(width, height, position, elem) {
    return new Element(new ContainerElement(position, elem)
        , width, height)
}
