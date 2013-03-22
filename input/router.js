var window = require("global/window")
var document = require("global/document")

var signal = require("../signal/signal")

module.exports = Router

function Router(uri) {
    return signal(function (next) {
        window.addEventListener("hashchange", function (ev) {
            next({
                hash: document.location.hash,
                newURL: ev.newURL,
                oldURL: ev.oldURL
            })
        })
    }, {
        hash: document.location.hash,
        newURL: document.location.href,
        oldURL: document.location.href
    })
}
