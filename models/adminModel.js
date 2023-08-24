const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile:{
    type:String,
    required:false
  },
  createdAt: {
    type: Date, 
    default: Date.now,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
