import { LayoutDashboard, LogOut, Moon, Sun, UserRound } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(localStorage.getItem("cc_theme") === "dark");

  useEffect(() => {
    document.body.classList.toggle("dark-mode", dark);
    localStorage.setItem("cc_theme", dark ? "dark" : "light");
  }, [dark]);

  const signOut = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <span>CareerCoded</span>
        <strong>Blog</strong>
      </Link>
      <nav className="navlinks">
        <NavLink to="/blogs">Blogs</NavLink>
        <button className="theme-toggle" onClick={() => setDark((value) => !value)} type="button" title="Toggle dark mode">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {isAdmin && (
          <NavLink to="/admin/dashboard">
            <LayoutDashboard size={18} />
            Admin
          </NavLink>
        )}
        {user ? (
          <>
            <NavLink to="/profile">
              <UserRound size={18} />
              Profile
            </NavLink>
            <button className="icon-text" onClick={signOut} type="button">
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink className="button-link" to="/register">
              Join
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
