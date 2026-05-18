import { FilePenLine, Gauge, ListChecks, PlusCircle } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => (
  <aside className="admin-sidebar">
    <h2>Admin</h2>
    <NavLink to="/admin/dashboard">
      <Gauge size={19} />
      Dashboard
    </NavLink>
    <NavLink to="/admin/blogs">
      <ListChecks size={19} />
      Manage Blogs
    </NavLink>
    <NavLink to="/admin/blogs/create">
      <PlusCircle size={19} />
      Create Blog
    </NavLink>
    <NavLink to="/blogs">
      <FilePenLine size={19} />
      Public View
    </NavLink>
  </aside>
);

export default AdminSidebar;
