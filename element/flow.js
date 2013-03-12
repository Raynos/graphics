var document = require("global/document")

var Element = require("./element")

function FlowElement(direction, elements) {
    this.direction = direction
    this.elements = elements
}

FlowElement.prototype.type = "FlowElement"

FlowElement.prototype.create = function _FlowElement_create() {
    var elements = this.elements
    if (this.direction === "down" ||
        this.direction === "right" ||
        this.direction === "outward"
    ) {
        elements = elements.slice().reverse()
    }

    var container = document.createElement("div")

    for (var i = elements.length; i--;) {
        var element = elements[i]
        var domElement = element.create ? element.create() : element

        if (this.direction === "right" || this.direction === "left") {
            domElement.style.styleFloat = "left"
            domElement.style.cssFloat = "left"
        } else if (this.direction === "inward" ||
            this.direction === "outward"
        ) {
            domElement.style.position = "absolute"
        }

        container.appendChild(domElement)
    }

    return container
}

FlowElement.prototype.update = function _FlowElement_update(elem, previous) {
    var parentElem = elem.parentNode
    if (this.direction !== previous.direction) {
        return parentElem.replaceChild(this.create(), elem)
    }

    var nextElements = this.elements
    var childNodes = elem.childNodes

    if (childNodes.length !== nextElements.length) {
        return parentElem.replaceChild(this.create(), elem)
    }

    var previousElements = previous.elements

    for (var i = childNodes.length; i--;) {
        nextElements[i].update(childNodes[i], previousElements[i])
        var domElement = childNodes[i]

        if (this.direction === "right" || this.direction === "left") {
            domElement.style.styleFloat = "left"
            domElement.style.cssFloat = "left"
        } else if (this.direction === "inward" ||
            this.direction === "outward"
        ) {
            domElement.style.position = "absolute"
        }
    }
}

module.exports = flow

// String -> [Element] -> Element
function flow(direction, elements) {
    var widths = elements.map(widthOf)
    var heights = elements.map(heightOf)

    var width = direction === "left" ?
        sum(widths) : direction === "right" ?
        sum(widths) : maximum(widths)
    var height = direction === "down" ?
        sum(heights) : direction === "right" ?
        sum(heights) : maximum(heights)

    return new Element(new FlowElement(direction, elements)
        , width, height)
}

function widthOf(elem) {
    return elem.width
}

function heightOf(elem) {
    return elem.height
}

function sum(list) {
    var total = 0
    for (var i = 0; i < list.length; i++) {
        total += list[i]
    }
    return total
}

function maximum(list) {
    var max = 0
    for (var i = 0; i < list.length; i++) {
        var item = list[i]
        if (item > max) {
            max = item
        }
    }
    return max
}
