module.exports = start

function start(observable) {
    observable(noop)
}

function noop() {}
