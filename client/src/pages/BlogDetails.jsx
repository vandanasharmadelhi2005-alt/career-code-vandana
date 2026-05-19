import { Bookmark, Heart, MessageSquare, Share2, Tag } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const getRecordId = (item) => String(item?._id || item?.id || item || "");

const BlogDetails = () => {
  const { id } = useParams();
  const { user, refreshMe } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const liked = Boolean(user?.likedBlogs?.some((item) => getRecordId(item) === String(id)));
  const bookmarked = Boolean(user?.bookmarkedBlogs?.some((item) => getRecordId(item) === String(id)));

  const loadBlog = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/blogs/${id}`);
      setBlog(data.blog);
      setComments(data.comments || []);
      setRelatedBlogs(data.relatedBlogs || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load blog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlog();
  }, [id]);

  const toggleLike = async () => {
    if (!user) {
      setError("Please login to like blogs.");
      return;
    }

    setActionLoading("like");
    setError("");
    try {
      const endpoint = `/blogs/${id}/${liked ? "unlike" : "like"}`;
      const method = liked ? "delete" : "post";
      const { data } = await api[method](endpoint);
      setBlog((current) => ({ ...current, likes: data.likes }));
      await refreshMe();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update like. Please try again.");
    } finally {
      setActionLoading("");
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      setError("Please login to bookmark blogs.");
      return;
    }

    setActionLoading("bookmark");
    setError("");
    try {
      const method = bookmarked ? "delete" : "post";
      const { data } = await api[method](`/blogs/${id}/bookmark`);
      setBlog((current) => ({ ...current, bookmarks: data.bookmarks }));
      await refreshMe();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update bookmark. Please try again.");
    } finally {
      setActionLoading("");
    }
  };

  const shareBlog = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: blog.title, text: blog.description, url });
    } else {
      await navigator.clipboard.writeText(url);
      setError("Blog link copied to clipboard.");
    }
  };

  const submitComment = async (event) => {
    event.preventDefault();
    if (!user) {
      setError("Please login to comment.");
      return;
    }
    const { data } = await api.post(`/blogs/${id}/comments`, { message: comment });
    setComments((current) => [data.comment, ...current]);
    setComment("");
  };

  const renderBlocks = () => {
    if (blog.contentBlocks?.length) {
      return blog.contentBlocks.map((block, index) => {
        if (block.type === "heading") return <h2 key={index}>{block.value}</h2>;
        if (block.type === "bullet") return <li key={index}>{block.value}</li>;
        if (block.type === "code") return <pre key={index}><code>{block.value}</code></pre>;
        if (block.type === "image") return null;
        return <p key={index}>{block.value}</p>;
      });
    }
    return blog.content.split("\n").map((line) => <p key={line}>{line}</p>);
  };

  if (loading) return <section className="page"><p className="muted">Loading blog...</p></section>;
  if (error && !blog) return <section className="page"><p className="alert">{error}</p></section>;

  return (
    <article className="article">
      <header className="article-hero-clean">
        <span className="category-badge">{blog.category}</span>
        <h1>{blog.title}</h1>
        <p className="lead">{blog.description}</p>
      </header>
      <div className="article-body">
        <div className="card-meta">
          <span>{blog.category}</span>
          <span>{blog.readTime || 4} min read</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="article-actions">
          <button className={liked ? "like-btn liked" : "like-btn"} disabled={actionLoading === "like"} onClick={toggleLike} type="button">
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
            {actionLoading === "like" ? "Updating" : liked ? "Liked" : "Like"} - {blog.likes}
          </button>
          <button className={bookmarked ? "like-btn liked" : "like-btn"} disabled={actionLoading === "bookmark"} onClick={toggleBookmark} type="button">
            <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
            {actionLoading === "bookmark" ? "Updating" : bookmarked ? "Saved" : "Bookmark"} - {blog.bookmarks || 0}
          </button>
          <button className="like-btn" onClick={shareBlog} type="button">
            <Share2 size={18} />
            Share
          </button>
          <span>By {blog.author}</span>
        </div>
        {error && <p className="alert">{error}</p>}
        <div className="content">{renderBlocks()}</div>
        <div className="tags">
          {(blog.tags || []).map((tag) => (
            <span key={tag}><Tag size={14} />{tag}</span>
          ))}
        </div>
        <section className="comment-box">
          <h2><MessageSquare size={20} />Comments</h2>
          <form onSubmit={submitComment}>
            <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a thoughtful comment" rows="3" />
            <button className="primary-btn" type="submit">Post Comment</button>
          </form>
          <div className="comment-list">
            {comments.map((item) => (
              <div className="comment-card" key={item._id}>
                <strong>{item.user?.name || "Reader"}</strong>
                <p>{item.message}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="related-section">
          <h2>Related recommendations</h2>
          <div className="mini-grid">
            {relatedBlogs.map((item) => (
              <Link className="mini-card" key={item._id} to={`/blogs/${item._id}`}>
                <span className="category-badge">{item.category}</span>
                <strong>{item.title}</strong>
                <span>{item.category}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
};

export default BlogDetails;
