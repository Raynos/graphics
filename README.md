# graphics

<!-- [![build status][1]][2] [![dependency status][3]][4] -->

<!-- [![browser support][5]][6] -->

Efficient data structures that represent renderable scenes

This is a direct port of [Elm][7] to a commonJS JavaScript library.
    The purpose is exploration of FRP in plain JavaScript and
    maybe rewriting Elm's rendering core in more efficient JavaScript.

## Example

```js
var MousePosition = require("graphics/mouse").Position
var map = require("graphics/signal/map")
var plainText = require("graphics/element").plainText
var render = require("graphics/render")

// Lift the stream of mouse positions through the plainText
// function
var main = map(MousePosition(), plainText)

// render the stream of mouse position as text
render(main)
```

## Development

```sh
npm i
npm run example
open localhost:9966
```

## Installation

`npm install graphics`

## Contributors

 - Raynos

## MIT Licenced


  [1]: https://secure.travis-ci.org/Raynos/graphics.png
  [2]: http://travis-ci.org/Raynos/graphics
  [3]: http://david-dm.org/Raynos/graphics.png
  [4]: http://david-dm.org/Raynos/graphics
  [5]: http://ci.testling.com/Raynos/graphics.png
  [6]: http://ci.testling.com/Raynos/graphics
  [7]: http://elm-lang.org/
