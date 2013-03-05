var document = require("global/document")

var consume = require("./signal/consume")
var foldp = require("./signal/foldp")

module.exports = render

function render(scenes, container) {
    if (!container) {
        container = document.body
    }

    var surface = document.createElement("div")

    var main = foldp(scenes, function (previous, current) {
        if (previous === null) {
            var elem = create(current)
            surface.appendChild(elem)
        } else {
            update(surface.firstChild, previous, current)
        }

        return current
    }, null)

    container.insertBefore(surface, container.firstChild)

    consume(main)
}

function create(scene) {
    var basicElement = scene.basicElement
    var elem = basicElement.create()
    elem.id = scene.id
    elem.style.width = (~~scene.width) + "px"
    elem.style.height = (~~scene.height) + "px"
    return elem
}

function update(elem, previousScene, currentScene) {
    // console.log("update", elem, previousScene, currentScene)
    var previousBasicElement = previousScene.basicElement
    var currentBasicElement = currentScene.basicElement
    var parentElem = elem.parentNode

    if (previousBasicElement.type !== currentBasicElement.type) {
        return parentElem.replaceChild(currentBasicElement.create(), elem)
    }

    currentBasicElement.update(elem, previousBasicElement)

    if (previousScene.width !== currentScene.width) {
        elem.style.width = (~~currentScene.width) + "px"
    }

    if (previousScene.height !== currentScene.height) {
        elem.style.height = (~~previousScene.height) + "px"
    }
}
