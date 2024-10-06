const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tag: { type: String, required: true },
    type: { type: String, enum: ["article", "novel", "digest"] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Content = mongoose.model("Contents", contentSchema);

module.exports = Content;
