const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    teamName: {
        type: String,
        required: true,
        default: "",
        unique: true
    },
    teamPassword: {
        type: String,
        required: true,
        default: ""
    },
    teamMembers: [{
        type: String
    }],
    points: {
        type: Number,
        default: 0
    },
    eventsRegistered: {
        type: Number,
        default: 1
    },
    buffer1: {
        type: String,
        default: ""
    },
    buffer2: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("teams", teamSchema);
