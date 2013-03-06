var document = require("global/document")

var consume = require("./signal/consume")
var foldp = require("./signal/foldp")

module.exports = render

function render(scenes, container) {
    if (container === undefined) {
        container = document.body
    }

    var surface = document.createElement("div")

    var main = foldp(scenes, function (previous, current) {
        if (previous === null) {
            var elem = current.create()
            surface.appendChild(elem)
        } else {
            current.update(surface.firstChild, previous)
        }

        return current
    }, null)

    if (container !== false) {
        container.insertBefore(surface, container.firstChild)
    }

    consume(main)

    return surface
}
