const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema(
  {
    id: {
      type: Number,
    },
    title: {
      type: String,
      required: true,
    },
    airDate: {
      type: String,
      //   required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    writter: {
      type: String,
      required: true,
    },
    genres: {
      type: Array,
      // required:true
    },
    runTime: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
    },
    dislikes: {
      type: Number,
    },
    poster: {
      type: Object,
      // required:true
    },
    video: {
      type: String,
      // required:true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movies", MovieSchema);
