const mongoose = require("mongoose");

const jokeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true
    },
    setup: {
      type: String,
      required: true
    },
    punchline: {
      type: String,
      required: true
    },
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Joke", jokeSchema);
