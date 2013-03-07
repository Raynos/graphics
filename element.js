var document = require("global/document")

var guid = require("./lib/guid")

var pooledDiv = document.createElement("div")
pooledDiv.style.visibility = "hidden"
pooledDiv.style.display = "absolute"
pooledDiv.style.textAlign = "left"
pooledDiv.style.styleFloat = "left"
pooledDiv.style.cssFloat = "left"
document.body.appendChild(pooledDiv)

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
    return new Form(0, 1, pos, elem)
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
    setPos(this.position, child)
    var div = document.createElement("div")
    div.style.position = "relative"
    div.style.overflow = "hidden"
    div.appendChild(child)
    return div
}

ContainerElement.prototype.update =
    function _ContainerElement_update(elem, previous) {
        this.elem.update(elem.firstChild, previous.elem)
        setPos(this.position, elem.firstChild)
    }

function CollageElement(forms, width, height) {
    this.width = width
    this.height = height
    this.forms = forms
}

function Form(theta, scale, position, basicForm) {
    this.theta = theta
    this.scale = scale
    this.position = position
    this.basicForm = basicForm
}


function setPos(pos, elem) {
    elem.style.position = 'absolute';
    elem.style.margin = 'auto';
    if (pos.type === "Position") {
        if (pos.vertical !== "Top") {
            elem.style.top = 0
        }
        if (pos.vertical !== "Bottom") {
            elem.style.bottom = 0
        }

        if (pos.horizontal !== "Left") {
            elem.style.left = 0
        }
        if (pos.horizontal !== "Right") {
            elem.style.right = 0
        }
        if (pos.horizontal === "Mid") {
            elem.style.textAlign = "center"
        }
    }
}
