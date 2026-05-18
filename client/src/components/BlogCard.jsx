import { Clock, Eye, Heart, MoveRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => (
  <article className="blog-card editorial-card">
    <div className="blog-card-body">
      <div className="card-meta">
        <span className="category-badge">{blog.category}</span>
        <span className={blog.isPublished ? "status published" : "status draft"}>
          {blog.isPublished ? "Published" : "Draft"}
        </span>
      </div>
      <Link to={`/blogs/${blog._id}`} className="card-title-link">
        <h3>{blog.title}</h3>
      </Link>
      <p>{blog.description}</p>
      <div className="card-stat-row">
        <span><Clock size={16} />{blog.readTime || 4} min</span>
        <span><Heart size={16} />{blog.likes}</span>
        <span><Eye size={16} />{blog.views || 0}</span>
      </div>
      <div className="card-actions">
        <span>{blog.author || "CareerCoded Editorial"}</span>
        <Link to={`/blogs/${blog._id}`}>
          Read Article
          <MoveRight size={17} />
        </Link>
      </div>
    </div>
  </article>
);

export default BlogCard;
