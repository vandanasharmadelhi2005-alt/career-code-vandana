import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      select: false
    },
    resetPasswordToken: {
      type: String,
      select: false
    },
    resetPasswordExpires: {
      type: Date,
      select: false
    },
    refreshTokens: [
      {
        token: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    likedBlogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
      }
    ],
    bookmarkedBlogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
      }
    ]
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model("User", userSchema);
