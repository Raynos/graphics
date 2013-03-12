var document = require("global/document")

var Element = require("./element")
var flow = require("./flow")

var MATH_PI = Math.PI

function CollageElement(forms, width, height) {
    var formGroups = []
    var group = []

    for (var i = forms.length; i--; ) {
        var form = forms[i]

        if (form.basicForm.type === "FormElement") {
            if (group.length > 0) {
                formGroups.push(group)
                group = []
            }

            formGroups.push(form)
        } else {
            group.push(form)
        }
    }

    if (group.length > 0) {
        formGroups.push(group)
    }

    this.width = width
    this.height = height
    this.formGroups = formGroups
}

CollageElement.prototype.create = function _ContainerElement_create() {
    // console.log("CollageElement.create")
    var formGroups = this.formGroups
    var width = this.width
    var height = this.height

    if (formGroups.length === 0) {
        return createCollageForForms(width, height, [])
    }

    var elems = []

    for (var i = formGroups.length; i--; ) {
        var group = formGroups[i]

        if (!Array.isArray(group)) {
            elems[i] = createCollageForElements(width, height, group)
        } else {
            // console.log("CREATE COLLAGE FOR FORMS", formGroups)
            elems[i] = createCollageForForms(width, height, group)
        }
    }

    if (elems.length === 1) {
        return elems[0]
    }

    return flow("inward", elems).create()

}

CollageElement.prototype.update = function (elem, previous) {
    var current = this
    var currentFormGroups = this.formGroups
    var previousFormGroups = previous.formGroups

    var width = current.width
    var height = current.height

    if (currentFormGroups.length === 1) {
        return updateFormSet(elem, previousFormGroups[0]
            , currentFormGroups[0], width, height)
    }

    var kids = elem.childNodes
    var len = kids.length

    for (var i = len; i--; ) {
        var childElem = kids[len - i - 1]

        // childElem.style.width = (~~current.width) + "px"
        // childElem.style.height = (~~current.height) + "px"

        // console.log("current", current, elem.style.height)

        updateFormSet(kids[len - i - 1], previousFormGroups[i]
            , currentFormGroups[i], width, height)
    }
}

module.exports = collage

// Int -> Int -> [Form] -> Element
function collage(width, height, forms) {
    return new Element(new CollageElement(forms, width, height)
        , width, height)
}

function updateFormSet(elem, previousGroup, currentGroup, width, height) {
    // var width = elem.style.width.slice(0, -2) - 0
    // var height = elem.style.height.slice(0, -2) - 0

    elem.style.width = (~~width) + "px"
    elem.style.height = (~~height) + "px"

    if (elem.tagName === "CANVAS") {
        elem.width = width
        elem.height = height
    }

    if (Array.isArray(currentGroup) && currentGroup.length > 0) {
        if (Array.isArray(previousGroup) && previousGroup.length > 0) {
            if (elem.getContext) {
                var context = elem.getContext("2d")

                return renderForms(context, currentGroup, width, height)
            }
        }

        var newElem = createCollageForForms(width, height, currentGroup)
        newElem.style.position = "absolute"
        return elem.parentNode.replaceChild(newElem, elem)
    }

    var currentForm = currentGroup
    var previousForm = previousGroup

    var currentElement = currentForm.basicForm.element
    var previousElement = previousForm.basicForm.element
    var domElement = elem.firstChild
    currentElement.update(domElement, previousElement)

    applyTransformations(currentForm, currentElement.width
        , currentElement.height, domElement)
}

function createCollageForForms(width, height, forms) {
    var canvas = document.createElement("canvas")
    width = ~~width
    height = ~~height
    canvas.style.width = width + "px"
    canvas.style.height = height + "px"
    canvas.style.display = "block"
    canvas.width = width
    canvas.height = height

    if (canvas.getContext) {
        var context = canvas.getContext("2d")

        renderForms(context, forms, width, height)

        return canvas
    }

    canvas.textContent = "Your browser does not support the canvas element."
    return canvas
}

function createCollageForElements(width, height, form) {
    var element = form.basicForm.element
    var domElement = element.create()

    applyTransformations(form, element.width
        , element.height, domElement)

    var div = document.createElement("div")
    div.appendChild(domElement)

    div.style.width = (~~width) + "px"
    div.style.height = (~~height) + "px"
    div.style.overflow = "hidden"

    return div
}



function renderForms(context, forms, width, height) {
    context.clearRect(0, 0, width, height)

    for (var i = forms.length; i--; ) {
        var form = forms[i]
        context.save()
        var x = form.position.x
        var y = form.position.y

        if (x !== 0 || y !== 0) {
            context.translate(x, y)
        }

        var theta = form.theta

        if (theta !== ~~theta) {
            context.rotate(2 * MATH_PI * theta)
        }

        var scale = form.scale

        if (scale !== 1) {
            context.scale(scale, scale)
        }

        context.beginPath()

        var basicForm = form.basicForm
        // console.log("Calling create", forms)
        basicForm.create(context)

        context.restore()
    }
}

function applyTransformations(form, w, h, elem) {
    var theta = form.theta
    var scale = form.scale
    var position = form.position
    var x = position.x
    var y = position.y

    var t = "translate(" + (x - w / 2) + "px,"+ (y - h / 2) + "px)"
    var r = theta === (~~theta) ? "" : "rotate(" + theta*360 + "deg)"
    var s = scale === 1 ? "" : "scale(" + scale + "," + scale + ")"
    var transforms = t + " " + s + " " + r
    elem.style.transform = transforms
    elem.style.msTransform = transforms
    elem.style.MozTransform = transforms
    elem.style.webkitTransform = transforms
    elem.style.OTransform = transforms
}
