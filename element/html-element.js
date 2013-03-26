var document = require("global/document")
var ClassList = require("class-list")
var DataSet = require("data-set")
var setTimeout = require("timers").setTimeout

var plainText = require("./plain-text")
var Element = require("./element")

var NOT_FOUND = -1
var splitSelectorRegex = /([\.#]?[a-zA-Z0-9_-]+)/

function TextElement(text) {
    this.text = text
}

TextElement.prototype.type = "TextElement"

TextElement.prototype.create = function _TextElement_create() {
    return document.createTextNode(this.text)
}

TextElement.prototype.update = function _TextElement_update(elem, previous) {
    if (this.text !== previous.text) {
        elem.data = this.text
    }
}

/* a HtmlElement has a tagName, a hash of special attributes and a hash
    of general attributes.

    The special attributes have special rendering & updating logic
    The general attributes are just set on the DOM element

    The children array contains a list of Element instances that are appended
        to this particular element when rendered

*/
function HtmlElement(tagName, special, general, children) {
    this.tagName = tagName
    this.specialProperties = special
    this.generalProperties = general
    this.children = children
    this.cl = null // elem.classList
    this.ds = null // elem.dataset
}

HtmlElement.prototype.type = "HtmlElement"

HtmlElement.prototype.create = function _HtmlElement_create() {
    var elem = document.createElement(this.tagName)

    var generalProperties = this.generalProperties
    var generalKeys = Object.keys(generalProperties)

    for (var i = 0; i < generalKeys.length; i++) {
        var generalKey = generalKeys[i]
        var generalProp = generalProperties[generalKey]

        elem[generalKey] = generalProp
    }


    var specialProperties = this.specialProperties
    var classes = specialProperties.classes
    var cl = this.cl = ClassList(elem)

    for (var j = 0; j < classes.length; j++) {
        cl.add(classes[j])
    }


    var dataset = specialProperties.dataset
    var datasetKeys = Object.keys(dataset)
    var ds = this.ds = DataSet(elem)

    for (var k = 0; k < datasetKeys.length; k++) {
        var datasetKey = datasetKeys[k]
        var datasetAttr = dataset[datasetKey]

        ds[datasetKey] = datasetAttr
    }

    var children = this.children

    for (var l = 0; l < children.length; l++) {
        var child = children[l]
        var domElement = child.create ? child.create() : child

        elem.appendChild(domElement)
    }

    handleFocus(elem, specialProperties)

    return elem
}

function handleFocus(elem, specialProperties) {
    // Many hacks :(
    if (specialProperties.focus) {
        setTimeout(function () {
            elem.focus()
        }, 0)
    }
}

// TODO: Be more efficient
HtmlElement.prototype.update = function _HtmlElement_update(elem, previous) {
    var parentElem = elem.parentNode
    var current = this

    if (current.tagName !== previous.tagName) {
        var replacement = current.create()
        return parentElem.replaceChild(replacement, elem)
    }

    handleProperties(previous, current, elem)
    handleClasses(previous, current)
    handleDataSet(previous, current)

    var currChildren = current.children
    var currLength = currChildren.length
    var prevChildren = previous.children
    var prevLength = prevChildren.length
    var childNodes = elem.childNodes


    var smallestLength = prevLength < currLength ?
        prevLength : currLength

    // if curr list smaller then prev then nuke excess DOM elems
    for (var i = prevLength; i > currLength; i--) {
        elem.removeChild(childNodes[currLength])
    }

    // for all elements that are in both arrays
    for (var j = 0; j < smallestLength; j++) {
        var currChild = currChildren[j]
        var prevChild = prevChildren[j]

        currChild.update(childNodes[j], prevChild)
    }

    // for all elements that are in curr but not prev
    for (var k = prevLength; k < currLength; k++) {
        var child = currChildren[k]
        var domElement = child.create ? child.create() : child

        elem.appendChild(domElement)
    }

    handleFocus(elem, current.specialProperties)
}

function handleDataSet(previous, current) {
    var currDataset = current.specialProperties.dataset
    var prevDataset = current.specialProperties.dataset
    var ds = current.ds = previous.ds

    var prevDataSetKeys = Object.keys(prevDataset)
    for (var i = 0; i < prevDataSetKeys.length; i++) {
        var key = prevDataSetKeys[i]
        if (!(key in currDataset)) {
            delete ds[key]
        }
    }

    var currDataSetKeys = Object.keys(currDataset)

    for (var j = 0; j < currDataSetKeys.length; j++) {
        var datasetKey = currDataSetKeys[j]
        var datasetAttr = currDataset[datasetKey]

        ds[datasetKey] = datasetAttr
    }
}

function handleProperties(previous, current, elem) {
    var currGeneral = current.generalProperties
    var prevGeneral = previous.generalProperties

    var currGeneralKeys = Object.keys(currGeneral)
    for (var i = 0; i < currGeneralKeys.length; i++) {
        var currGeneralKey = currGeneralKeys[i]
        var currGeneralProp = currGeneral[currGeneralKey]
        var prevGeneralProp = prevGeneral[currGeneralKey]

        if (currGeneralProp !== prevGeneralProp) {
            elem[currGeneralKey] = currGeneralProp
        }
    }
}

function handleClasses(previous, current) {
    var currClasses = current.specialProperties.classes
    var prevClasses = previous.specialProperties.classes
    var cl = current.cl = previous.cl

    for (var j = 0; j < prevClasses.length; j++) {
        var className = prevClasses[j]
        var index = currClasses.indexOf(className)

        if (index === NOT_FOUND) {
            cl.remove(className)
        }
    }

    for (var k = 0; k < currClasses.length; k++) {
        var className = currClasses[k]
        var index = prevClasses.indexOf(className)

        if (index === NOT_FOUND) {
            cl.add(className)
        }
    }
}

h.HtmlElement = HtmlElement

module.exports = h

function h(selector, attributes, children) {
    if (typeof attributes === "string" || Array.isArray(attributes)) {
        children = attributes
        attributes = {}
    }

    var hElement = new HtmlElement("", {
        classes: [], dataset: {}, focus: false
    }, {}, [])

    unpackAttributes(hElement, attributes)
    unpackSelector(hElement, selector)
    unpackChildren(hElement, children)

    return new Element(hElement, -1, -1)
}

function unpackAttributes(hElement, attributes) {
    if (!attributes) {
        return
    }

    var special = hElement.specialProperties
    var dataset = special.dataset
    var classes = special.classes
    var general = hElement.generalProperties

    // TODO: Handle special attributes and put them in special hash
    var attributesKeys = Object.keys(attributes)
    for (var i = 0; i < attributesKeys.length; i++) {
        var key = attributesKeys[i]
        var attribute = attributes[key]

        if (key.indexOf("data-") === 0) {
            var attr = key.substr(5)
            dataset[attr] = attribute
        } else if (key === "focus") {
            special.focus = attribute
        } else {
            general[key] = attribute
        }
    }
}

function unpackSelector(hElement, selector) {
    var matches = selector.split(splitSelectorRegex)
    var classes = hElement.specialProperties.classes
    var general = hElement.generalProperties

    for (var j = 0; j < matches.length; j++) {
        var match = matches[j]
        var value = match.substring(1, match.length)

        if (match[0] === ".") {
            classes.push(value)
        } else if (match[0] === "#") {
            general.id = value
        } else if (match.length > 0) {
            hElement.tagName = match
        }
    }
}

function unpackChildren(hElement, children) {
    if (!children) {
        return
    }

    if (typeof children === "string") {
        children = [children]
    }

    var elChildren = hElement.children

    for (var k = 0; k < children.length; k++) {
        var child = children[k]

        if (typeof child === "string") {
            children[k] = new TextElement(child)
        }
    }

    hElement.children = children
}
