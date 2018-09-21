const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    identifier: {
        type: String,
        default: "pantheonId"
    },
    count: {
        type: Number,
        default: 18001
    }
});

module.exports = mongoose.model("counters", counterSchema);
