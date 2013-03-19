var document = require("global/document")
var DataSet = require("data-set")
var uuid = require("uuid")
var extend = require("xtend")

var HtmlElement = require("../element/html-element").HtmlElement
var Element = require("../element/element")
var signal = require("../signal/signal")

var ENTER = 13

module.exports = InputPool

/* String -> { 
    signal: Signal, 
    input: Element -> String -> (String -> Any) -> Element
}
*/
function InputPool(name) {
    var nameSection = name + "~"
    var nameSectionLen = nameSection.length
    var fns = {
        submit: {},
        change: {}
    }

    return {
        signal: signal(function (next) {
            handleSubmit(next)
            handleChange(next)
        }),
        submit: withType("submit"),
        change: withType("change")
    }

    function handleSubmit(next) {
        document.addEventListener("keypress", function (ev) {
            var target = ev.target
            var fn = getTransform("submit", target)
            var value = target.value && target.value.trim()

            var validEvent = fn && target.type === "text" &&
                ev.keyCode === ENTER && !ev.shiftKey && value !== ""

            if (!validEvent) {
                return
            }

            var item = fn(value)
            target.value = ""
            next(item)
        })
    }

    function handleChange(next) {
        document.addEventListener("keypress", function (ev) {
            var target = ev.target
            var fn = getTransform("change", target)

            if (!fn || target.type !== "text") {
                return
            }

            var item = fn(target.value)
            next(item)
        })

        document.addEventListener("change", function (ev) {
            var target = ev.target
            var fn = getTransform("change", target)

            if (!fn || target.type !== "checkbox") {
                return
            }

            var item = fn(target.checked)
            next(item)
        })
    }

    function getTransform(type, target) {
        var ds = DataSet(target)
        var id = ds.graphicsId

        if (!id || id.indexOf(nameSection) !== 0) {
            return null
        }

        var itemId = id.substr(nameSectionLen) || null
        var fn = fns[type][itemId]

        return fn || null
    }

    function withType(type) {
        return function (elem, transform)  {
            var basicElement = elem.basicElement
            var specialProperties = basicElement.specialProperties
            var dataset = specialProperties.dataset
            var id = uuid()

            fns[type][id] = transform

            specialProperties = extend(specialProperties, {
                dataset: extend(dataset,  {
                    graphicsId:  nameSection + id
                })
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