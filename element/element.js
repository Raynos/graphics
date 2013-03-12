var uuid = require("uuid")

module.exports = Element

function Element(basicElement, width, height, opacity, color, link) {
    this.id = uuid()
    this.basicElement = basicElement
    this.width = width || 0
    this.height = height || 0
    this.opacity = opacity || 1
    this.color = color || null
    this.link = link || null
}

Element.prototype.type = "Element"

Element.prototype.create = function _Element_create() {
    var basicElement = this.basicElement
    var elem = basicElement.create()
    elem.id = this.id
    elem.style.width = (~~this.width) + "px"
    elem.style.height = (~~this.height) + "px"
    return elem
}

Element.prototype.update = function _Element_update(elem, previous) {
    var previousBasicElement = previous.basicElement
    var currentBasicElement = this.basicElement
    var parentElem = elem.parentNode

    if (previous.width !== this.width) {
        elem.style.width = (~~this.width) + "px"
    }

    if (previous.height !== this.height) {
        elem.style.height = (~~this.height) + "px"
    }

    if (previousBasicElement.type !== currentBasicElement.type) {
        return parentElem.replaceChild(currentBasicElement.create(), elem)
    }

    currentBasicElement.update(elem, previousBasicElement)
}
