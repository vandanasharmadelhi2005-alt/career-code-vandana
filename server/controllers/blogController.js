import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import { ApiError, asyncHandler } from "../utils/errors.js";

const toTags = (tags) => {
  if (Array.isArray(tags)) return tags.map((tag) => String(tag).trim()).filter(Boolean);
  if (typeof tags === "string") return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  return [];
};

const sameId = (value, target) => String(value?._id || value) === String(target?._id || target);

const blogPayload = (body) => ({
  title: body.title,
  thumbnail: body.thumbnail,
  description: body.description,
  content: body.content,
  author: body.author,
  category: body.category,
  tags: toTags(body.tags),
  readTime: Number(body.readTime) || Math.max(1, Math.ceil(String(body.content || "").split(/\s+/).length / 180)),
  featured: Boolean(body.featured),
  contentBlocks: Array.isArray(body.contentBlocks) ? body.contentBlocks.filter((block) => block.value) : [],
  isPublished: body.isPublished ?? true
});

export const getBlogs = asyncHandler(async (req, res) => {
  const {
    search = "",
    category = "",
    page = 1,
    limit = 9,
    sort = "latest",
    published
  } = req.query;

  const numericPage = Math.max(Number(page) || 1, 1);
  const numericLimit = Math.min(Math.max(Number(limit) || 9, 1), 30);
  const query = {};

  if (req.user?.role !== "admin" || published === "true") {
    query.isPublished = true;
  } else if (published === "false") {
    query.isPublished = false;
  }

  if (category) query.category = category;
  if (search) {
    query.$or = [
      { title: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
      { tags: new RegExp(search, "i") }
    ];
  }

  const sortMap = {
    latest: { createdAt: -1 },
    liked: { likes: -1, views: -1, createdAt: -1 },
    viewed: { views: -1, likes: -1, createdAt: -1 },
    trending: { featured: -1, likes: -1, views: -1, createdAt: -1 }
  };

  const [blogs, total, categories] = await Promise.all([
    Blog.find(query)
      .sort(sortMap[sort] || sortMap.latest)
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit),
    Blog.countDocuments(query),
    Blog.distinct("category", req.user?.role === "admin" ? {} : { isPublished: true })
  ]);

  res.json({
    blogs,
    categories,
    pagination: {
      page: numericPage,
      limit: numericLimit,
      total,
      pages: Math.ceil(total / numericLimit) || 1
    }
  });
});

export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  if (!blog.isPublished && req.user?.role !== "admin") {
    throw new ApiError(404, "Blog not found.");
  }

  blog.views += 1;
  await blog.save();

  const [comments, relatedBlogs] = await Promise.all([
    Comment.find({ blog: blog._id, isApproved: true })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(20),
    Blog.find({
      _id: { $ne: blog._id },
      isPublished: true,
      $or: [{ category: blog.category }, { tags: { $in: blog.tags || [] } }]
    })
      .sort({ likes: -1, views: -1, createdAt: -1 })
      .limit(3)
  ]);

  res.json({ blog, comments, relatedBlogs });
});

export const createBlog = asyncHandler(async (req, res) => {
  const payload = blogPayload(req.body);

  if (!payload.title || !payload.thumbnail || !payload.description || !payload.content || !payload.author || !payload.category) {
    throw new ApiError(400, "Title, thumbnail, description, content, author, and category are required.");
  }

  const blog = await Blog.create(payload);
  res.status(201).json({ blog });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  Object.assign(blog, blogPayload(req.body));
  await blog.save();

  res.json({ blog });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  await User.updateMany({ likedBlogs: blog._id }, { $pull: { likedBlogs: blog._id } });
  await User.updateMany({ bookmarkedBlogs: blog._id }, { $pull: { bookmarkedBlogs: blog._id } });
  await Comment.deleteMany({ blog: blog._id });
  await blog.deleteOne();

  res.json({ message: "Blog deleted." });
});

export const getTrendingBlogs = asyncHandler(async (req, res) => {
  const { type = "trending", limit = 8 } = req.query;
  const numericLimit = Math.min(Math.max(Number(limit) || 8, 1), 20);
  const sortMap = {
    liked: { likes: -1, views: -1 },
    viewed: { views: -1, likes: -1 },
    latest: { createdAt: -1 },
    week: { featured: -1, likes: -1, views: -1, createdAt: -1 },
    trending: { featured: -1, likes: -1, views: -1, createdAt: -1 }
  };

  const blogs = await Blog.find({ isPublished: true })
    .sort(sortMap[type] || sortMap.trending)
    .limit(numericLimit);

  res.json({ blogs });
});

export const bookmarkBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog || !blog.isPublished) throw new ApiError(404, "Blog not found.");

  const bookmarked = req.user.bookmarkedBlogs.some((id) => sameId(id, blog._id));
  if (!bookmarked) {
    req.user.bookmarkedBlogs.push(blog._id);
    blog.bookmarks += 1;
    await Promise.all([req.user.save(), blog.save()]);
  }

  res.json({ blogId: blog._id, bookmarked: true, bookmarks: blog.bookmarks });
});

export const unbookmarkBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, "Blog not found.");

  const hadBookmark = req.user.bookmarkedBlogs.some((id) => sameId(id, blog._id));
  req.user.bookmarkedBlogs = req.user.bookmarkedBlogs.filter((id) => !sameId(id, blog._id));
  if (hadBookmark) blog.bookmarks = Math.max(blog.bookmarks - 1, 0);
  await Promise.all([req.user.save(), blog.save()]);

  res.json({ blogId: blog._id, bookmarked: false, bookmarks: blog.bookmarks });
});

export const addComment = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog || !blog.isPublished) throw new ApiError(404, "Blog not found.");

  const message = String(req.body.message || "").trim();
  if (message.length < 2) throw new ApiError(400, "Comment must be at least 2 characters.");

  const comment = await Comment.create({ blog: blog._id, user: req.user._id, message });
  await comment.populate("user", "name");
  res.status(201).json({ comment });
});

export const likeBlog = asyncHandler(async (req, res) => {
  const blogId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    throw new ApiError(400, "Invalid blog id.");
  }

  const blog = await Blog.findById(blogId);
  if (!blog || !blog.isPublished) {
    throw new ApiError(404, "Blog not found.");
  }

  const alreadyLiked = req.user.likedBlogs.some((id) => sameId(id, blog._id));
  if (!alreadyLiked) {
    req.user.likedBlogs.push(blog._id);
    if (!blog.likedBy.some((id) => sameId(id, req.user._id))) {
      blog.likedBy.push(req.user._id);
    }
    blog.likes = blog.likedBy.length;
    await Promise.all([req.user.save(), blog.save()]);
  }

  res.json({ blogId: blog._id, likes: blog.likes, liked: true });
});

export const unlikeBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  req.user.likedBlogs = req.user.likedBlogs.filter((id) => !sameId(id, blog._id));
  blog.likedBy = blog.likedBy.filter((id) => !sameId(id, req.user._id));
  blog.likes = blog.likedBy.length;

  await Promise.all([req.user.save(), blog.save()]);
  res.json({ blogId: blog._id, likes: blog.likes, liked: false });
});

export const dashboardStats = asyncHandler(async (_req, res) => {
  const [totalBlogs, totalUsers, totalComments, publishedBlogs, totalLikesResult, recentBlogs, mostLikedBlogs, mostViewedBlogs, users, monthlyBlogs] = await Promise.all([
    Blog.countDocuments(),
    User.countDocuments(),
    Comment.countDocuments(),
    Blog.countDocuments({ isPublished: true }),
    Blog.aggregate([{ $group: { _id: null, totalLikes: { $sum: "$likes" } } }]),
    Blog.find().sort({ createdAt: -1 }).limit(5).select("title category likes isPublished createdAt"),
    Blog.find().sort({ likes: -1, views: -1 }).limit(5).select("title category likes views"),
    Blog.find().sort({ views: -1, likes: -1 }).limit(5).select("title category likes views"),
    User.find().sort({ createdAt: -1 }).limit(8).select("name email role isEmailVerified createdAt"),
    Blog.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          blogs: { $sum: 1 },
          likes: { $sum: "$likes" },
          views: { $sum: "$views" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 }
    ])
  ]);

  res.json({
    stats: {
      totalBlogs,
      totalUsers,
      totalComments,
      publishedBlogs,
      draftBlogs: totalBlogs - publishedBlogs,
      totalLikes: totalLikesResult[0]?.totalLikes || 0
    },
    recentBlogs,
    mostLikedBlogs,
    mostViewedBlogs,
    users,
    monthlyAnalytics: monthlyBlogs.map((item) => ({
      label: `${item._id.month}/${item._id.year}`,
      blogs: item.blogs,
      likes: item.likes,
      views: item.views
    }))
  });
});

export const aiSummary = asyncHandler(async (req, res) => {
  const text = String(req.body.content || req.body.title || "").trim();
  const sentences = text.split(/[.!?]\s+/).filter(Boolean);
  const summary = sentences.slice(0, 2).join(". ") || "This blog explains practical career and coding ideas for CareerCoded readers.";
  res.json({ summary });
});

export const aiTitleSuggestions = asyncHandler(async (req, res) => {
  const topic = String(req.body.topic || req.body.content || "career growth").trim();
  const clean = topic.split(/\s+/).slice(0, 7).join(" ");
  res.json({
    titles: [
      `${clean}: A Practical Guide for Developers`,
      `How to Use ${clean} to Grow Faster`,
      `CareerCoded Playbook: ${clean}`
    ]
  });
});

export const aiContentRecommendations = asyncHandler(async (req, res) => {
  const topic = String(req.body.topic || "coding career").trim();
  res.json({
    recommendations: [
      `Add a real-world example about ${topic}.`,
      "Include a checklist readers can apply immediately.",
      "End with a short next-step action so readers know what to do after reading."
    ]
  });
});
