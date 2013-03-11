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
var sampleOn = Signal.sampleOn

var rect = Element.rect
var filled = Element.filled
var collage = Element.collage
var image = Element.image
var toForm = Element.toForm

// named color variables
var skyblue = { r: 174, g: 238, b: 238 }
var grassgreen = { r: 74, g: 163, b: 41 }

/* Application Model

Whenever you build an FRP-style app you should decide what pieces
    of state belong in your application model.

If you explicitely model all the state in your application
    then it's easy to write a display function that takes your
    current state and returns a "scene" representation of your
    current app state.

This makes describing how to display your application dead simple.
    It also means that when your application doesn't display
    correctly, you can actually peek into your application state
    to see whether it's a display bug or whether your application
    is in an unexpected state

In our case we are going to model position, velocity and
    direction. We need direction to know which way we should
    face when stationary since velocity is zero and you can't
    figure out which way we should face without storing direction
    information directly

*/
var MarioModel = {
    xPosition: 0
    , yPosition: 0
    , xVelocity: 0
    , yVelocity: 0
    , direction: "right"
}

/* Inputs

Whenever you build an FRP-style app you should model your actual
    user inputs. These are the interactions a user can make to
    change your application state.

These inputs do not effect the scene or the display directly. All
    visual changes to the display or scene should happen through
    a change in an input, which then causes the current
    application state to change

In our case our user interaction is going to come from keyboard
    arrow input. So we create a signal of the state of the
    arrows keys.

We also grab the dimensions of the window because the resizing
    of the browser is a user interaction.

Lastly we grab frameRate because our application logic is based
    around the notion that we should change our current
    application state 25 times per second. So we take our input
    and we sample it at 25 frames per second.

*/
var dimensions = WindowDimensions()
inspect(dimensions) // =>

var arrows = KeyboardArrows()
var framerate = fps(25)

var tuples = transformMany([framerate, arrows]
    , function toTuple(delta, arrows) {
        return { delta: delta, arrows: arrows }
    })
var input = sampleOn(tuples, framerate)
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

/* Modelling the current state

To model the current state of your application, you should take
    your input source. Which is a single Signal that represents
    all the inputs that change. In our case it's the time since
    the last frame and the current state of the arrows keys.

We also take the initial state of the application, in our case
    it's our MarioModel defined up above.

Then we simply say every time we have a new input, take our
    previous representation of our application state and the
    change in the input and return a new application state.

In our case we apply the jumping, gravity, walking and moving
    logic to mario.

*/
var marioState = foldp(input, function update(mario, inputState) {
    var delta = inputState.delta
    var arrows = inputState.arrows

    var jumpedMario = jump(mario, arrows)
    var gravityMario = gravity(jumpedMario, delta)
    var walkedMario = walk(gravityMario, arrows)

    return move(walkedMario, delta)
}, MarioModel)
inspect(marioState) // =>

/* Displaying the scene

Once you have modelled the application state, all that is left
    is to transform that application state into a scene.

In our case we transform both the application state and the size
    of the window so we can render our application in a nice
    responsive fashion.

The actual rendering logic is simple, compute a gif based on
    our velocity and direction.

Then render a collage of multiple forms, in this case a form
    representing the sky (a large blue box), a form representing
    the floor (a green box) and form representing an image
    of mario at his x, y position.

 */
var main = transformMany([
    dimensions, marioState
], function display(dimensions, mario) {
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

/* Finally we start the entire rendering engine by passing a
    Signal representation of our scene to render which will
    do the heavy lifting of touching the DOM & canvas APIs
*/
render(main, false)
// =>
