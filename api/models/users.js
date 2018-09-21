const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: true,
      default: ""
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true,
      default: "9131550773"
    },
    emailotp: {
      type: Number,
      default: -1
    },
    phoneotp: { 
      type: Number,
      default: -1
    },
    panId: {
      type: Number,
      default: -1
    },
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
    },
    gender: {
      type: String,
      default: ""
    },
    dob: {
      type: String,
      default: ""
    },
    collegeName: {
      type: String,
      default: ""
    },
    collegeCity: {
      type: String,
      default: ""
    },
    collegeState: {
      type: String,
      default: ""
    },
    collegeId: {
      type: String,
      default: ""
    },
    gradYear: {
      type: Number,
      default: 2020
    },
    otpverified: {
      type: String,
      default: "no"
    },
    status: {
      type: Boolean,
      default: false
    }
});

module.exports = mongoose.model("users", UserSchema);
