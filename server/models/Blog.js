import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280
    },
    content: {
      type: String,
      required: true,
      minlength: 20
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    readTime: {
      type: Number,
      default: 4,
      min: 1
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    contentBlocks: [
      {
        type: {
          type: String,
          enum: ["heading", "paragraph", "bullet", "code", "image"],
          default: "paragraph"
        },
        value: {
          type: String,
          trim: true
        },
        language: {
          type: String,
          trim: true,
          default: ""
        }
      }
    ],
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    bookmarks: {
      type: Number,
      default: 0,
      min: 0
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    isPublished: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  { timestamps: true }
);

blogSchema.index({ title: "text", description: "text", content: "text", tags: "text" });
blogSchema.index({ category: 1, likes: -1, views: -1, createdAt: -1 });

export default mongoose.model("Blog", blogSchema);
