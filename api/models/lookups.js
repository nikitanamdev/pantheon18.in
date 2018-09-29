const mongoose = require("mongoose");

const LookupSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
      type: String,
      unique: true
    },
    teamName:{
        type: String,
        default: "",
        //unique: true
    },
    teamPoints:{
        type: Number,
        default: 0
    },
    teamLeader: {
        type: String,
        default: "no"
    },
    requests: [{
        type: String
    }]
});

module.exports = mongoose.model("lookups", LookupSchema);
