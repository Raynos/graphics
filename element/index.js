var document = require("global/document")

var guid = require("../lib/guid")
var setPosition = require("./set-position")

var pooledDiv = document.createElement("div")
pooledDiv.style.visibility = "hidden"
pooledDiv.style.display = "absolute"
pooledDiv.style.textAlign = "left"
pooledDiv.style.styleFloat = "left"
pooledDiv.style.cssFloat = "left"
document.body.appendChild(pooledDiv)

var MATH_PI = Math.PI

module.exports = {
    plainText: plainText
    , image: image
    , video: video
    , middle: {
        horizontal: "Mid"
        , vertical: "Mid"
        , type: "Position"
    }
    , container: container
    , collage: collage
    , toForm: toForm
    , rect: rect
    , filled: filled
    , flow: flow
}

// String -> Element
function plainText(content) {
    var textSize = getTextSize(content)

    return new Element(guid(), new TextElement("left", content)
        , textSize.width, textSize.height)
}

function getTextSize(content) {
    pooledDiv.textContent = content
    // var cStyle = window.getComputedStyle(pooledDiv, null)
    // var w = cStyle.getPropertyValue("width")
    // var h = cStyle.getPropertyValue("height")
    // console.log("cStyle", cStyle, w, h)
    var size = {
        width: pooledDiv.offsetWidth
        , height: pooledDiv.offsetHeight
    }
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

// Int -> Int -> Position -> Element -> Element
function container(width, height, position, elem) {
    return new Element(guid(), new ContainerElement(position, elem)
        , width, height)
}

// Int -> Int -> [Form] -> Element
function collage(width, height, forms) {
    return new Element(guid()
        , new CollageElement(forms, width, height)
        , width, height)
}

// Element -> { x: Number, y: Number } -> Form
function toForm(elem, pos) {
    return new Form(0, 1, pos, new FormElement(elem))
}

// Int -> Int -> { x: Number, y: Number} -> Shape
function rect(width, height, pos) {
    return new Shape([{
        x: 0 - width / 2
        , y: 0 - height / 2
    }, {
        x: 0 - width / 2
        , y: height / 2
    }, {
        x: width / 2
        , y: height / 2
    }, {
        x: width / 2
        , y: 0 - height / 2
    }], pos)
}

// { r: Number, g: Number, b: Number, a: Number }
function filled(colour, shape) {
    return new Form(0, 1, shape.position
        , new FormShape("filled", colour, shape))
}

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

    return new Element(guid(), new FlowElement(direction, elements)
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

    if (previousBasicElement.type !== currentBasicElement.type) {
        return parentElem.replaceChild(currentBasicElement.create(), elem)
    }

    currentBasicElement.update(elem, previousBasicElement)

    if (previous.width !== this.width) {
        elem.style.width = (~~this.width) + "px"
    }

    if (previous.height !== this.height) {
        elem.style.height = (~~this.height) + "px"
    }
}

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

function CollageElement(forms, width, height) {
    var formGroups = []
    var group = []

    for (var i = forms.length; i--; ) {
        var form = forms[i]

        if (form.type === "FormElement") {
            if (group.length > 0) {
                formGroups.push(group)
                group = []
            }

            formGroups.push(form)
        } else {
            group.push(form)
        }
    }

    if (group.length > 0) {
        formGroups.push(group)
    }

    this.width = width
    this.height = height
    this.formGroups = formGroups
}

CollageElement.prototype.create = function _ContainerElement_create() {
    console.log("CollageElement.create")
    var formGroups = this.formGroups
    var width = this.width
    var height = this.height

    if (formGroups.length === 0) {
        return createCollageForForms(width, height, [])
    }

    var elems = []

    for (var i = formGroups.length; i--; ) {
        var group = formGroups[i]

        if (!Array.isArray(group)) {
            elems[i] = createCollageForElements(width, height, group)
        } else {
            console.log("CREATE COLLAGE FOR FORMS", formGroups)
            elems[i] = createCollageForForms(width, height, group)
        }
    }

    if (elems.length === 1) {
        return elems[0]
    }

    return flow("inward", elems)
}

CollageElement.prototype.update = function () {
    /* TODO IMPLEMENT */
}

function createCollageForForms(width, height, forms) {
    var canvas = document.createElement("canvas")
    width = ~~width
    height = ~~height
    canvas.style.width = width + "px"
    canvas.style.height = height + "px"
    canvas.style.display = "block"
    canvas.width = width
    canvas.height = height

    if (canvas.getContext) {
        var context = canvas.getContext("2d")

        context.clearRect(0, 0, width, height)

        for (var i = forms.length; i--; ) {
            var form = forms[i]
            context.save()
            var x = form.position.x
            var y = form.position.y

            if (x !== 0 || y !== 0) {
                context.translate(x, y)
            }

            var theta = form.theta

            if (theta !== ~~theta) {
                context.rotate(2 * MATH_PI * theta)
            }

            var scale = form.scale

            if (scale !== 1) {
                context.scale(scale, scale)
            }

            context.beginPath()

            var basicForm = form.basicForm
            console.log("Calling create", forms)
            basicForm.create(context)

            context.restore()
        }

        return canvas
    }

    canvas.textContent = "Your browser does not support the canvas element."
    return canvas
}

function createCollageForElements() {}

function Form(theta, scale, position, basicForm) {
    this.theta = theta
    this.scale = scale
    this.position = position
    this.basicForm = basicForm
}

function Shape(points, position) {
    this.points = points
    this.position = position
}

function FormShape(shapeStyle, colour, shape) {
    this.shapeStyle = shapeStyle
    this.colour = colour
    this.shape = shape
}

FormShape.prototype.type = "FormShape"

FormShape.prototype.create = function _FormShape_create(context) {
    var shapeStyle = this.shapeStyle
    var shape = this.shape

    if (shapeStyle === "filled") {
        tracePoints(context, shape.points)
        console.log("fillStyle?", extractColour(this.colour))
        context.fillStyle = extractColour(this.colour)
        context.fill()
    }
}

function extractColour(colour) {
    // console.log("colour?", colour)

    // if (colour.a === undefined || colour.a === 1) {
    //     return "rgb(" + colour.r + "," + colour.g + "," + colour.b + ")"
    // }

    return "rgba(" + colour.r + "," + colour.g +
        "," + colour.b + "," + (colour.a || 1) + ")"
}

function tracePoints(context, points) {
    var i = points.length - 1
    if ( i <= 0) {
        return
    }

    context.moveTo(points[i].x, points[i].y)

    while (i--) {
        context.lineTo(points[i].x, points[i].y)
    }
}

function FormElement(elem) {
    this.element = elem
}

FormElement.prototype.type = "FormElement"

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
        var domElement = element.create()

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
