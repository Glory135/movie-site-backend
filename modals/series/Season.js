const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SeasonSchema = new Schema(
  {
    id: {
      type: Number,
    },
    title: {
      type: String,
      required: true,
    },
    series: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Series",
    },
    season: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },

    poster: {
      type: Object,
      // required:true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Season", SeasonSchema);
