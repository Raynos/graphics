var server = require("tryme/bin/server")
var path = require("path")

server({
    _: [path.join(__dirname, "..", "examples")]
})
