import express from "express";
import { forgotPassword, googleLogin, login, me, refresh, register, resetPassword, verifyEmail } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/google", googleLogin);
router.get("/me", protect, me);

export default router;
