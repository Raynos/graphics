module.exports = setPosition

function setPosition(pos, elem) {
    elem.style.position = 'absolute';
    elem.style.margin = 'auto';
    if (pos.type === "Position") {
        if (pos.vertical !== "Top") {
            elem.style.top = 0
        }
        if (pos.vertical !== "Bottom") {
            elem.style.bottom = 0
        }

        if (pos.horizontal !== "Left") {
            elem.style.left = 0
        }
        if (pos.horizontal !== "Right") {
            elem.style.right = 0
        }
        if (pos.horizontal === "Mid") {
            elem.style.textAlign = "center"
        }
    }
}
