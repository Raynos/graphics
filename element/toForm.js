var Form = require("./form")

function FormElement(elem) {
    this.element = elem
}

FormElement.prototype.type = "FormElement"

module.exports = toForm

// Element -> { x: Number, y: Number } -> Form
function toForm(elem, pos) {
    return new Form(0, 1, pos, new FormElement(elem))
}

