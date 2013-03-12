module.exports = rect

// Int -> Int -> { x: Number, y: Number} -> Shape
function rect(width, height, pos) {
    return new Shape([{
        x: 0 - width / 2
        , y: 0 - height / 2
    }, {
        x: 0 - width / 2
        , y: height / 2
    }, {
        x: width / 2
        , y: height / 2
    }, {
        x: width / 2
        , y: 0 - height / 2
    }], pos)
}

function Shape(points, position) {
    this.points = points
    this.position = position
}
