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
        submit: {}
    }

    return {
        signal: signal(function (next) {
            handleSubmit(next)
        })
        , input: function (elem, eventType, transform) {
            if (eventType === "submit") {
                return withSubmit(elem, transform)
            }
        }
    }

    function handleSubmit(next) {
        document.addEventListener("keypress", function (ev) {
            var target = ev.target
            var ds = DataSet(target)
            var id = ds.graphicsId

            if (!id || id.indexOf(nameSection) !== 0) {
                return
            }

            if (target.type !== "text") {
                return
            }

            if (ev.keyCode !== ENTER || ev.shiftKey) {
                return
            }

            var value = target.value.trim()

            if (value === "") {
                return
            }

            var itemId = id.substr(nameSectionLen)
            var fn = fns.submit[itemId]

            if (!fn) {
                return
            }

            var item = fn(value)
            target.value = ""
            next(item)
        })
    }

    function withSubmit(elem, transform) {
        var basicElement = elem.basicElement
        var specialProperties = basicElement.specialProperties
        var dataset = specialProperties.dataset
        var id = uuid()

        fns.submit[id] = transform

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