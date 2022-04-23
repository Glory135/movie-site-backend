const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SeriesSchema = new Schema(
  {
    id: {
      type: Number,
    },
    title: {
      type: String,
      required: true,
    },
    genres: {
      type: Array,
      // required:true
    },
    likes: {
      type: Number,
    },
    dislikes: {
      type: Number,
    },
    director: {
      type: String,
      required: true,
    },
    writter: {
      type: String,
      required: true,
    },
    poster: {
      type: Object,
      // required:true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Series", SeriesSchema);
