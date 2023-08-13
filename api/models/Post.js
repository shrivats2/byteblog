const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    title: String,
    summary: String,
    content: String,
    cover: String,
    category: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
    likes: {
      type: Map,
      of: Boolean,
    },
    views: Number,
  },
  {
    timestamps: true,
  }
);

const PostModel = model("Post", PostSchema);

module.exports = PostModel;
