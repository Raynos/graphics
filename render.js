var document = require("global/document")

var start = require("./signal/start")
var foldp = require("./signal/foldp")

module.exports = render

function render(scenes, container) {
    if (container === undefined) {
        container = document.body
    }

    var surface = document.createElement("div")

    var initial = typeof scenes === "function" ? scenes() : scenes
    var elem = initial.create()
    surface.appendChild(elem)

    if (typeof scenes === "function") {
        var main = foldp(scenes, function (previous, current) {
            current.update(surface.firstChild, previous)

            return current
        }, initial)

        start(main)
    }

    if (container !== false) {
        container.insertBefore(surface, container.firstChild)
    }

    return surface
}
