import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getLastEmail } from "../services/api";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: getLastEmail(), password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form, true);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Admin login failed.");
    }
  };

  return (
    <section className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">Admin access</span>
        <h1>Admin Login</h1>
        <label>
          Email
          <input
            autoComplete="email"
            inputMode="email"
            name="email"
            placeholder="Enter admin email"
            type="text"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value.trim().toLowerCase() })}
            required
          />
        </label>
        {form.email && <p className="form-hint">Last login email: {form.email}</p>}
        <label>
          Password
          <input autoComplete="current-password" name="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>
        {error && <p className="alert">{error}</p>}
        <button className="primary-btn" type="submit">Login as Admin</button>
      </form>
    </section>
  );
};

export default AdminLogin;
