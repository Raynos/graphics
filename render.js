var document = require("global/document")

var consume = require("./signal/consume")
var foldp = require("./signal/foldp")

module.exports = render

function render(scenes, container) {
    if (container === undefined) {
        container = document.body
    }

    var surface = document.createElement("div")

    console.log("------------------------")
    console.log("RENDER CALLED TWICE LAWL")
    console.log("------------------------")

    var main = foldp(scenes, function (previous, current) {
        if (previous === null) {
            console.log("previos null thus create")
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
