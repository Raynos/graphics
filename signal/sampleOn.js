var transform = require("./transform")

module.exports = sampleOn

function sampleOn(input, sampler) {
    return transform(sampler, function () {
        return input()
    })
}
