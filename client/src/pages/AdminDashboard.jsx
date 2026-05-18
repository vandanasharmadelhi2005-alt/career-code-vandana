import { FileText, Heart, Library, MessageSquare, PenSquare, Users } from "lucide-react";
import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import { useFetch } from "../hooks/useFetch";
import api from "../services/api";

const AdminDashboard = () => {
  const { data, loading, error } = useFetch(async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
  }, []);

  const stats = data?.stats || {};

  return (
    <section className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="page-heading">
          <span className="eyebrow">Overview</span>
          <h1>Dashboard</h1>
        </div>
        {error && <p className="alert">{error}</p>}
        {loading ? <p className="muted">Loading dashboard...</p> : (
          <>
            <div className="stats-grid">
              <div><Library /><span>Total Blogs</span><strong>{stats.totalBlogs}</strong></div>
              <div><Users /><span>Total Users</span><strong>{stats.totalUsers}</strong></div>
              <div><FileText /><span>Published</span><strong>{stats.publishedBlogs}</strong></div>
              <div><PenSquare /><span>Drafts</span><strong>{stats.draftBlogs}</strong></div>
              <div><Heart /><span>Total Likes</span><strong>{stats.totalLikes}</strong></div>
              <div><MessageSquare /><span>Total Comments</span><strong>{stats.totalComments}</strong></div>
            </div>
            <section className="analytics-card">
              <h2>Monthly Analytics</h2>
              <div className="bar-chart">
                {(data.monthlyAnalytics || []).map((item) => (
                  <div className="bar-item" key={item.label}>
                    <span style={{ height: `${Math.max(item.views, item.likes, item.blogs) * 2 + 18}px` }} />
                    <small>{item.label}</small>
                  </div>
                ))}
              </div>
            </section>
            <section className="table-card">
              <h2>Most Liked Blogs</h2>
              <table>
                <thead><tr><th>Title</th><th>Category</th><th>Likes</th><th>Views</th></tr></thead>
                <tbody>
                  {(data.mostLikedBlogs || []).map((blog) => (
                    <tr key={blog._id}>
                      <td>{blog.title}</td>
                      <td>{blog.category}</td>
                      <td>{blog.likes}</td>
                      <td>{blog.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <section className="table-card">
              <h2>Most Viewed Blogs</h2>
              <table>
                <thead><tr><th>Title</th><th>Category</th><th>Views</th><th>Likes</th></tr></thead>
                <tbody>
                  {(data.mostViewedBlogs || []).map((blog) => (
                    <tr key={blog._id}>
                      <td>{blog.title}</td>
                      <td>{blog.category}</td>
                      <td>{blog.views}</td>
                      <td>{blog.likes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <section className="table-card">
              <h2>User Management</h2>
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
                <tbody>
                  {(data.users || []).map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.isEmailVerified ? "Verified" : "Pending"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <section className="table-card">
              <h2>Recent Blogs</h2>
              <table>
                <thead><tr><th>Title</th><th>Category</th><th>Likes</th><th>Status</th></tr></thead>
                <tbody>
                  {data.recentBlogs.map((blog) => (
                    <tr key={blog._id}>
                      <td>{blog.title}</td>
                      <td>{blog.category}</td>
                      <td>{blog.likes}</td>
                      <td>{blog.isPublished ? "Published" : "Draft"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;
