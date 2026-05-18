import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminBlogEditor from "./pages/AdminBlogEditor";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminManageBlogs from "./pages/AdminManageBlogs";
import AuthPage from "./pages/AuthPage";
import BlogDetails from "./pages/BlogDetails";
import BlogsList from "./pages/BlogsList";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const App = () => (
  <>
    <Navbar />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<BlogsList />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute admin><AdminDashboard /></ProtectedRoute>}
        />
        <Route
          path="/admin/blogs"
          element={<ProtectedRoute admin><AdminManageBlogs /></ProtectedRoute>}
        />
        <Route
          path="/admin/blogs/create"
          element={<ProtectedRoute admin><AdminBlogEditor /></ProtectedRoute>}
        />
        <Route
          path="/admin/blogs/:id/edit"
          element={<ProtectedRoute admin><AdminBlogEditor /></ProtectedRoute>}
        />
      </Routes>
    </main>
    <footer className="site-footer">
      <strong>CareerCoded Blog</strong>
      <span>Developer careers, MERN projects, interview prep, and AI-assisted learning.</span>
      <div>
        <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://x.com" target="_blank" rel="noreferrer">X</a>
      </div>
    </footer>
  </>
);

export default App;
