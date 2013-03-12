var document = require("global/document")
var uuid = require("uuid")
var JSONFormat = require("../lib/json-format")

module.exports = inspect

function inspect(observable, type) {
    var pre = document.createElement("pre")
    var id = uuid()

    if (typeof observable !== "function") {
        render(pre, observable, id, type)
    } else {
        render(pre, observable(), id, type)

        observable(function (value) {
            render(pre, value, id, type)
        })
    }

    return pre
}

function render(surface, value, id, type) {
    surface.textContent = ""

    if (type === "jsonview") {
        surface.appendChild(JSONFormat(value, id))
    } else {
        surface.textContent = JSON.stringify(value, null, "\t")
    }
}
