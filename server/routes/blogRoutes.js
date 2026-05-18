import express from "express";
import {
  addComment,
  aiContentRecommendations,
  aiSummary,
  aiTitleSuggestions,
  bookmarkBlog,
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  getTrendingBlogs,
  likeBlog,
  unbookmarkBlog,
  unlikeBlog,
  updateBlog
} from "../controllers/blogController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

const optionalAuth = (req, _res, next) => {
  if (!req.headers.authorization) return next();
  return protect(req, _res, next);
};

router.get("/", optionalAuth, getBlogs);
router.get("/trending/list", getTrendingBlogs);
router.post("/ai/summary", protect, adminOnly, aiSummary);
router.post("/ai/titles", protect, adminOnly, aiTitleSuggestions);
router.post("/ai/recommendations", protect, adminOnly, aiContentRecommendations);
router.get("/:id", optionalAuth, getBlogById);
router.post("/", protect, adminOnly, createBlog);
router.put("/:id", protect, adminOnly, updateBlog);
router.delete("/:id", protect, adminOnly, deleteBlog);
router.post("/:id/like", protect, likeBlog);
router.delete("/:id/unlike", protect, unlikeBlog);
router.post("/:id/bookmark", protect, bookmarkBlog);
router.delete("/:id/bookmark", protect, unbookmarkBlog);
router.post("/:id/comments", protect, addComment);

export default router;
