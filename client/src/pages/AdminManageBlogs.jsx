import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import api from "../services/api";

const AdminManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");

  const loadBlogs = async () => {
    const { data } = await api.get("/blogs", { params: { limit: 30 } });
    setBlogs(data.blogs);
  };

  useEffect(() => {
    loadBlogs().catch((err) => setError(err.response?.data?.message || "Unable to load blogs."));
  }, []);

  const removeBlog = async (id) => {
    if (!confirm("Delete this blog?")) return;
    await api.delete(`/blogs/${id}`);
    setBlogs((current) => current.filter((blog) => blog._id !== id));
  };

  return (
    <section className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="split-heading">
          <div>
            <span className="eyebrow">Content</span>
            <h1>Manage Blogs</h1>
          </div>
          <Link className="primary-btn" to="/admin/blogs/create">Create Blog</Link>
        </div>
        {error && <p className="alert">{error}</p>}
        <section className="table-card">
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Likes</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>{blog.title}</td>
                  <td>{blog.category}</td>
                  <td>{blog.likes}</td>
                  <td>{blog.isPublished ? "Published" : "Draft"}</td>
                  <td className="table-actions">
                    <Link title="Edit blog" to={`/admin/blogs/${blog._id}/edit`}><Edit size={18} /></Link>
                    <button title="Delete blog" onClick={() => removeBlog(blog._id)} type="button"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </section>
  );
};

export default AdminManageBlogs;
