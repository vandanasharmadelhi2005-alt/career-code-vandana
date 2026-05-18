import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 800
    },
    isApproved: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
