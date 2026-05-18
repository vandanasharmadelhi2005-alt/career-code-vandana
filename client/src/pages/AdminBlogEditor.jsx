import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import BlogForm from "../components/BlogForm";
import api from "../services/api";

const AdminBlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/blogs/${id}`)
      .then(({ data }) => setBlog(data.blog))
      .catch((err) => setError(err.response?.data?.message || "Unable to load blog."));
  }, [id]);

  const saveBlog = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      if (id) await api.put(`/blogs/${id}`, payload);
      else await api.post("/blogs", payload);
      navigate("/admin/blogs");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save blog.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="page-heading">
          <span className="eyebrow">{id ? "Edit content" : "New content"}</span>
          <h1>{id ? "Edit Blog" : "Create Blog"}</h1>
        </div>
        {error && <p className="alert">{error}</p>}
        <BlogForm initialBlog={blog} onSubmit={saveBlog} submitting={submitting} />
      </div>
    </section>
  );
};

export default AdminBlogEditor;
