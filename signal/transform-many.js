var transformMany = require("observable").compute

// [Signal Tn] -> (T1 -> T2 -> T3 -> ... -> T) -> Signal T
module.exports = transformMany
