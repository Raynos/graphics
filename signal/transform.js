var _transform = require("observable").transform

// Signal A -> (A -> B) -> Signal B
module.exports = transform

function transform(signal, transformation) {
    return _transform(signal, transformation, readonly)
}

function readonly() {
    throw new Error("read-only")
}
