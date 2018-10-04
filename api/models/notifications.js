const mongoose = require("mongoose");

const notifsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    messageTitle: {
        type : String,
        default: "Pantheon Alert"
    }, 
    messageBody : {
        type: String,
        default: "Default Text"
    },
    Buffer : {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("notifications", notifsSchema);
