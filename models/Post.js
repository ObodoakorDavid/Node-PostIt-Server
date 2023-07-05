/** @format */

const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      minLength: 4,
      maxLength: 30,
    },
    tags: {
      type: String,
      required: [true, "Please provide a tag"],
      maxLength: 15,
    },
    story: {
      type: String,
      required: [true, "Please provide a story"],
      minLength: [10, "Story must be a minimum of 10 characters"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    image: {
      type: String, 
      // required: [true, 'Please provide an Image']
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
