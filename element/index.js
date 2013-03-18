var document = require("global/document")

module.exports = {
    plainText: require("./plain-text")
    , image: require("./image")
    , video: require("./video")
    , container: require("./container")
    , collage: require("./collage")
    , toForm: require("./toForm")
    , rect: require("./rect")
    , filled: require("./filled")
    , flow: require("./flow")
    , h: require("./html-element")
    // Data structures. This one is used in container
    , middle: {
        horizontal: "Mid"
        , vertical: "Mid"
        , type: "Position"
    }
}


