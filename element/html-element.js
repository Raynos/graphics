var document = require("global/document")
var ClassList = require("class-list")
var DataSet = require("data-set")

var plainText = require("./plain-text")
var Element = require("./element")

var splitSelectorRegex = /([\.#]?[a-zA-Z0-9_-]+)/

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
    var cl = ClassList(elem)

    for (var j = 0; j < classes.length; j++) {
        cl.add(classes[j])
    }

    var dataset = specialProperties.dataset
    var datasetKeys = Object.keys(dataset)
    var ds = DataSet(elem)

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

    return elem
}

// TODO: Be more efficient
HtmlElement.prototype.update = function _HtmlElement_update(elem, previous) {
    var parentElem = elem.parentNode

    parentElem.replaceChild(this.create(), elem)
}

h.HtmlElement = HtmlElement

module.exports = h

function h(selector, attributes, children) {
    var matches = selector.split(/([\.#]?[a-zA-Z0-9_-]+)/)
    if (typeof attributes === "string" || Array.isArray(attributes)) {
        children = attributes
        attributes = {}
    }

    if (!attributes) {
        attributes = {}
    }

    if (!children) {
        children = []
    }

    var general = {}
    var special = {
        classes: [],
        dataset: {}
    }
    var classes = special.classes
    var dataset = special.dataset
    var tagName = ""

    if (typeof children === "string") {
        children = [children]
    }

    // TODO: Handle special attributes and put them in special hash
    var attributesKeys = Object.keys(attributes)
    for (var i = 0; i < attributesKeys.length; i++) {
        var key = attributesKeys[i]
        var attribute = attributes[key]

        if (key.indexOf("data-") === 0) {
            var attr = key.substr(5)
            dataset[attr] = attribute
        } else {
            general[key] = attribute
        }
    }

    for (var j = 0; j < matches.length; j++) {
        var match = matches[j]
        var value = match.substring(1, match.length)

        if (match[0] === ".") {
            classes.push(value)
        } else if (match[0] === "#") {
            general.id = value
        } else if (match.length > 0) {
            tagName = match
        }
    }

    for (var k = 0; k < children.length; k++) {
        var child = children[k]

        if (typeof child === "string") {
            children[k] = h("span", { textContent: child })
        }
    }

    return new Element(new HtmlElement(tagName, special, general, children)
        , -1, -1)
}