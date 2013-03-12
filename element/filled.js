var Form = require("./form")

function FormShape(shapeStyle, colour, shape) {
    this.shapeStyle = shapeStyle
    this.colour = colour
    this.shape = shape
}

FormShape.prototype.type = "FormShape"

FormShape.prototype.create = function _FormShape_create(context) {
    var shapeStyle = this.shapeStyle
    var shape = this.shape

    if (shapeStyle === "filled") {
        tracePoints(context, shape.points)
        // console.log("fillStyle?", extractColour(this.colour))
        context.fillStyle = extractColour(this.colour)
        context.fill()
    }
}

module.exports = filled

// { r: Number, g: Number, b: Number, a: Number }
function filled(colour, shape) {
    return new Form(0, 1, shape.position
        , new FormShape("filled", colour, shape))
}

function extractColour(colour) {
    return "rgba(" + colour.r + "," + colour.g +
        "," + colour.b + "," + (colour.a || 1) + ")"
}

function tracePoints(context, points) {
    var i = points.length - 1
    if ( i <= 0) {
        return
    }

    context.moveTo(points[i].x, points[i].y)

    while (i--) {
        context.lineTo(points[i].x, points[i].y)
    }
}
