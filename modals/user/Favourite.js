const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavouriteSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Favourites", FavouriteSchema);
