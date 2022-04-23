const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EpisodeSchema = new Schema(
  {
    id: {
      type: Number,
    },
    title: {
      type: String,
      required: true,
    },
    seasonNo: {
      type: Number,
      required: true,
    },
    series: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Series",
    },
    season: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Season",
    },
    episode: {
      type: Number,
      required: true,
    },
    airDate: {
      type: String,
      required: true,
    },

    runTime: {
      type: String,
      required: true,
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

module.exports = mongoose.model("Episode", EpisodeSchema);
