var DataSet = require("data-set")
var uuid = require("uuid")
var extend = require("xtend")

var HtmlElement = require("../element/html-element").HtmlElement
var Element = require("../element/element")

module.exports = TransformStorage

function TransformStorage(name) {
    // var fns = {}
    var nameSection = "graphicsId~" + name + "~" + uuid() + "~"

    return {
        get: function getTransform(type, target) {
            var ds = DataSet(target)
            var fn = ds[nameSection + type]

            return fn || null
        },
        set: function storeTransform(type, elem, transform) {
            var basicElement = elem.basicElement
            var specialProperties = basicElement.specialProperties
            var dataset = specialProperties.dataset

            var datasetProps = {}
            datasetProps[nameSection + type] = transform || id

            specialProperties = extend(specialProperties, {
                dataset: extend(dataset, datasetProps)
            })

            elem = new HtmlElement(
                basicElement.tagName,
                specialProperties,
                basicElement.generalProperties,
                basicElement.children
            )

            return new Element(elem, -1, -1)
        }
    }
}

function id(x) { return x }
