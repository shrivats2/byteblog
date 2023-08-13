const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, min: 4, unique: true },
  password: { type: String, required: true },
  followers: {
    type: Array,
    default: [],
  },
  following:{
    type: Array,
    default: [],
  }
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
