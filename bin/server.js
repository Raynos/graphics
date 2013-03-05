var spawn = require("child_process").spawn

var p = spawn("node", [
    "./node_modules/.bin/browservefy"
    , "./examples/simple.js"
    , "--browserify='browserify-server'"
    , "--live"
    , "--indexed=./examples"
    , "--"
    , "--debug"
    , "--bundle"
])

p.stdout.pipe(process.stdout)
p.stderr.pipe(process.stderr)
