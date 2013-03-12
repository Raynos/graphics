var document = require("global/document")

var pooledDiv = document.createElement("div")
pooledDiv.style.visibility = "hidden"
pooledDiv.style.display = "absolute"
pooledDiv.style.textAlign = "left"
pooledDiv.style.styleFloat = "left"
pooledDiv.style.cssFloat = "left"
document.body.appendChild(pooledDiv)

module.exports = getTextSize

function getTextSize(content) {
    pooledDiv.textContent = content
    // var cStyle = window.getComputedStyle(pooledDiv, null)
    // var w = cStyle.getPropertyValue("width")
    // var h = cStyle.getPropertyValue("height")
    // console.log("cStyle", cStyle, w, h)
    var size = {
        width: pooledDiv.offsetWidth
        , height: pooledDiv.offsetHeight
    }
    pooledDiv.textContent = ""
    return size
}
