// Signal A -> (A -> B) -> Signal B
module.exports = transform

function transform(signal, transformation) {
    return observable

    function observable(listener) {
        if (isGet(listener)) {
            return transformation(signal())
        } else if (isSet(listener)) {
            throw new Error("read-only")
        } else {
            signal(function (_val) {
                listener(transformation(_val))
            })
        }
    }
}

function isGet(x) { return x === undefined }
function isSet(x) { return typeof x !== "function" }
