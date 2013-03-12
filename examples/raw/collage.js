var collage = require("../../element").collage
var filled = require("../../element").filled
var rect = require("../../element").rect

var inspect = require("../../signal").inspect

var observable = require("observable")

var myBlue  = { r: 0, g: 85, b: 170 }
var myGreen = { r: 28, g: 267, b: 85, a: 1 / 2 }

// Rectangles are instances of `Shape`

var rect1 = rect(75, 75, { x: 150, y: 150 })
var rect2 = rect(50, 50, { x: 200, y: 100 })

// filled(colour, shape) returns an instance of `Form`
var blueRect = filled(myBlue, rect1)
var greenRect = filled(myGreen, rect2)

// collage(width, height, [Form]) returns an instance of `Element`
var scene = collage(300, 300, [ blueRect, greenRect ])

// With graphics you want to use `graphics/element` to
// create instances of `Element`
// These are just data structures
inspect(scene, "jsonview")
// =>

// To render Element's you should call .create() on them

var domElement = scene.create()
domElement
// =>

// Cool we now have a domElement and we can put it in the DOM
// or somehow render it. In this case collage() returned a
// canvas element that renders our blue and green thing.

// let's generate a fresh domElement so we can render it twice
// in this demo
var domElement2 = scene.create()

// Now let's imagine we have some kind of model for this scene
var model = observable()

// set the initial state on the model
model({
    blue: { width: 75, height: 75 }
    , green: { width: 50, height: 50 }
})

// when the model changes we should update the view we created
// earlier

model(function onChange(state) {
    var rect1 = rect(state.blue.width, state.blue.height, { x: 150, y: 150 })
    var rect2 = rect(state.green.width, state.green.height, { x: 200, y: 100 })

    // create a brand new scene with the most current data

    var newScene = collage(300, 300, [
        filled(myBlue, rect1)
        , filled(myGreen, rect2)
    ])

    // then update this scene with our domElement and the
    // previous scene
    newScene.update(domElement2, scene)

    // make sure to overwrite the scene with the most current
    // scene so that next time we update the newScene with
    // the most recent scene
    scene = newScene
})

// uncomment these lines to update state
/*
model({
    blue: { width: 150, height: 75 }
    , green: { width: 50, height: 50 }
})
*/
/*
model({
    blue: { width: 150, height: 75 }
    , green: { width: 50, height: 150 }
})
*/

domElement2
// =>
