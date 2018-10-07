const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    name: {
        type : String,
        default: "Anonymus"
    }, 
    contact : {
        type: String,
        default: "-1"
    },
    comment : {
        type : String,
        default: "NA"
    }
});

module.exports = mongoose.model("feedbacks", feedbackSchema);
