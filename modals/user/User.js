const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    id: {
      type: Number,
    },
    firstname: {
      type: String,
      // required: true,
    },
    lastname: {
      type: String,
      // required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: Number,
      unique: true,
      required: true,
    },
    admin: {
      type: Boolean,
      // required: true,
    },
    gender: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      required: true,
    },
    favourites: {
      type: Array,
    },
    image: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", UserSchema);
module.exports = Users;
