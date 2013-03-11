var document = require("global/document")

module.exports = inspect

function inspect(observable) {
    var pre = document.createElement("pre")

    render(pre, observable())

    observable(function (value) {
        render(pre, value)
    })

    return pre
}

function render(surface, value) {
    surface.textContent = JSON.stringify(value, null, "    ")
}
