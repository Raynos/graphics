var extend = require("xtend")

var render = require("../../render")
var Input = require("../../input")
var Signal = require("../../signal")
var Element = require("../../element")

var WindowDimensions = Input.WindowDimensions
var KeyboardArrows = Input.KeyboardArrows
var fps = Input.fps

var transform = Signal.transform
var transformMany = Signal.transformMany
var foldp = Signal.foldp
var inspect = Signal.inspect

var rect = Element.rect
var filled = Element.filled
var collage = Element.collage
var image = Element.image
var toForm = Element.toForm

// named color variables
var skyblue = { r: 174, g: 238, b: 238 }
var grassgreen = { r: 74, g: 163, b: 41 }

/* Application Model */
var MarioModel = {
    xPosition: 0
    , yPosition: 0
    , xVelocity: 0
    , yVelocity: 0
    , direction: "right"
}

/* Inputs */
var dimensions = WindowDimensions()
inspect(dimensions) // =>

var arrows = KeyboardArrows()
var framerate = fps(25)

var input = transformMany([framerate, arrows], function toTuple(delta, arrows) {
    return { delta: delta, arrows: arrows }
})
inspect(input) // =>

function gravity(mario, delta) {
    return extend(mario, {
        yVelocity: mario.yVelocity - (delta / 700)
    })
}

function jump(mario, arrows) {
    return (arrows.y > 0 && mario.yPosition === 0) ?
        extend(mario, { yVelocity: 0.5 }) : mario
}

function walk(mario, arrows) {
    return extend(mario, {
        xVelocity: arrows.x / 20
        , direction: arrows.x < 0 ? "left" :
            arrows.x > 0 ? "right" : mario.direction
    })
}

function move(mario, delta) {
    return extend(mario, {
        xPosition: mario.xPosition + (delta * mario.xVelocity)
        , yPosition: Math.max(0, mario.yPosition + delta * mario.yVelocity)
    })
}

/* state */
var marioState = foldp(input, function update(mario, inputState) {
    var delta = inputState.delta
    var arrows = inputState.arrows

    var jumpedMario = jump(mario, arrows)
    var gravityMario = gravity(jumpedMario, delta)
    var walkedMario = walk(gravityMario, arrows)

    return move(walkedMario, delta)
}, MarioModel)
inspect(marioState) // =>

/* rendering */
var main = transformMany([
    dimensions, marioState
], function display(dimensions, mario) {
    // console.log("mario?", mario)

    var yPosition = mario.yPosition

    var w = dimensions.width / 2
    var h = dimensions.height / 2
    var verb = yPosition > 0 ? "jump" :
        mario.xVelocity !== 0 ? "walk" : "stand"
    var direction = mario.direction

    var src = "http://elm-lang.org/imgs/mario/" +
        verb + "/" + direction + ".gif"

    var largeRect = rect(w, h, { x: w / 2, y: h / 2 })
    var smallRect = rect(w, 50, { x: w / 2, y: (h - 25) })
    var sky = filled(skyblue, largeRect)
    var grass = filled(grassgreen, smallRect)
    var marioImage = image(35, 35, src)

    var marioForm = toForm(marioImage, {
        x: mario.xPosition
        , y: (h - 63) - yPosition
    })

    return collage(w, h, [ sky, grass, marioForm ])
})

render(main, false)
// =>
