const mongoose = require("mongoose");

const LookupSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
      type: String,
      required: true,
      unique: true
    },
    teamName:{
        type: String,
        required:true,
        unique: true,
        default: ""
    },
    teamPoints:{
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("lookups", LookupSchema);
