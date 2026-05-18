import express from "express";
import { adminLogin } from "../controllers/authController.js";
import { dashboardStats } from "../controllers/blogController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/dashboard", protect, adminOnly, dashboardStats);

export default router;

