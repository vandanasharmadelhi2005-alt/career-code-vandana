import User from "../models/User.js";
import { ApiError, asyncHandler } from "../utils/errors.js";
import { signRefreshToken, signToken } from "../utils/token.js";
import jwt from "jsonwebtoken";

const passwordIsStrong = (password) => typeof password === "string" && password.length >= 8;
const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const sendAuthResponse = async (res, user, statusCode = 200) => {
  const refreshToken = signRefreshToken(user);
  user.refreshTokens = [...(user.refreshTokens || []), { token: refreshToken }].slice(-5);
  await user.save();

  res.status(statusCode).json({
    token: signToken(user),
    refreshToken,
    user
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const email = normalizeEmail(req.body.email);

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required.");
  }

  if (!passwordIsStrong(password)) {
    throw new ApiError(400, "Password must be at least 8 characters.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const verificationToken = Math.random().toString(36).slice(2, 10).toUpperCase();
  const user = await User.create({ name, email, password, role: "user", verificationToken });
  await sendAuthResponse(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const email = normalizeEmail(req.body.email);

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  await sendAuthResponse(res, user);
});

export const adminLogin = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const email = normalizeEmail(req.body.email);

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email, role: "admin" }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid admin credentials.");
  }

  await sendAuthResponse(res, user);
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("likedBlogs", "title thumbnail category")
    .populate("bookmarkedBlogs", "title thumbnail category description");
  res.json({ user });
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(400, "Refresh token is required.");

  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  if (decoded.type !== "refresh") throw new ApiError(401, "Invalid refresh token.");

  const user = await User.findById(decoded.id);
  if (!user || !user.refreshTokens.some((item) => item.token === refreshToken)) {
    throw new ApiError(401, "Refresh token is no longer valid.");
  }

  res.json({ token: signToken(user), user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  if (!email) throw new ApiError(400, "Email is required.");

  const user = await User.findOne({ email }).select("+resetPasswordToken +resetPasswordExpires");
  if (user) {
    user.resetPasswordToken = Math.random().toString(36).slice(2, 12).toUpperCase();
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();
  }

  res.json({
    message: "If this email exists, a password reset link/token has been prepared.",
    demoResetToken: user?.resetPasswordToken
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw new ApiError(400, "Reset token and new password are required.");
  }

  if (!passwordIsStrong(password)) {
    throw new ApiError(400, "Password must be at least 8 characters.");
  }

  const user = await User.findOne({
    resetPasswordToken: String(token).trim().toUpperCase(),
    resetPasswordExpires: { $gt: new Date() }
  }).select("+resetPasswordToken +resetPasswordExpires +password");

  if (!user) {
    throw new ApiError(400, "Reset token is invalid or expired.");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshTokens = [];
  await user.save();

  res.json({ message: "Password reset successfully. You can now login with your new password." });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) throw new ApiError(400, "Verification token is required.");

  const user = await User.findOne({ verificationToken: token }).select("+verificationToken");
  if (!user) throw new ApiError(400, "Invalid verification token.");

  user.isEmailVerified = true;
  user.verificationToken = undefined;
  await user.save();
  res.json({ message: "Email verified successfully.", user });
});

export const googleLogin = asyncHandler(async (_req, res) => {
  res.status(501).json({
    message: "Google login is code-ready, but requires GOOGLE_CLIENT_ID and OAuth callback setup before it can be enabled."
  });
});
