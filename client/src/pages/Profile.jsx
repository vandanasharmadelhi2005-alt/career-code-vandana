import { UserRound } from "lucide-react";
import React from "react";
import { useEffect } from "react";
import BlogCard from "../components/BlogCard";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, refreshMe } = useAuth();

  useEffect(() => {
    refreshMe().catch(() => {});
  }, []);

  return (
    <section className="page">
      <div className="profile-header">
        <UserRound size={38} />
        <div>
          <span className="eyebrow">User profile</span>
          <h1>{user.name}</h1>
          <p>{user.email} - {user.role} - {user.isEmailVerified ? "Verified" : "Email pending"}</p>
        </div>
      </div>
      <h2>Liked Blogs</h2>
      {user.likedBlogs?.length ? (
        <div className="blog-grid">
          {user.likedBlogs.map((blog) => <BlogCard key={blog._id} blog={{ ...blog, likes: blog.likes || 0, description: blog.description || "Saved article", isPublished: true }} />)}
        </div>
      ) : (
        <p className="muted">No liked blogs yet.</p>
      )}
      <h2>Bookmarked Blogs</h2>
      {user.bookmarkedBlogs?.length ? (
        <div className="blog-grid">
          {user.bookmarkedBlogs.map((blog) => <BlogCard key={blog._id} blog={{ ...blog, likes: blog.likes || 0, description: blog.description || "Bookmarked article", isPublished: true }} />)}
        </div>
      ) : (
        <p className="muted">No bookmarks yet.</p>
      )}
    </section>
  );
};

export default Profile;
