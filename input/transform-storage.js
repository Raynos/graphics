var DataSet = require("data-set")
var uuid = require("uuid")
var extend = require("xtend")

var HtmlElement = require("../element/html-element").HtmlElement
var Element = require("../element/element")

module.exports = TransformStorage

function TransformStorage(name) {
    var fns = {}
    var nameSection = name + "~" + uuid() + "~"

    return {
        get: function getTransform(type, target) {
            var ds = DataSet(target)
            var id = ds["graphicsId~" + type]

            if (!id || id.indexOf(nameSection) !== 0) {
                return null
            }

            var itemId = id.substr(nameSection.length) || null
            var fn = fns[type] && fns[type][itemId]

            return fn || null
        },
        set: function storeTransform(type, elem, transform) {
            var basicElement = elem.basicElement
            var specialProperties = basicElement.specialProperties
            var dataset = specialProperties.dataset
            var id = uuid()

            if (!fns[type]) {
                fns[type] = {}
            }

            fns[type][id] = transform
            var datasetProps = {}
            datasetProps["graphicsId~" + type] = nameSection + id

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