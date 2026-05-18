import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api, { getLastEmail } from "../services/api";

const AuthPage = ({ mode }) => {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: getLastEmail(), password: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === "email" ? value.trim().toLowerCase() : value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      if (isRegister) await register(form);
      else await login({ email: form.email, password: form.password });
      navigate("/blogs");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const forgotPassword = async () => {
    if (!form.email.trim()) {
      setError("Enter your email first.");
      return;
    }
    try {
      const { data } = await api.post("/auth/forgot-password", { email: form.email });
      if (data.demoResetToken) setResetToken(data.demoResetToken);
      setNotice(data.demoResetToken ? `Reset token generated. Enter a new password below.` : data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to start password reset.");
    }
  };

  const resetPassword = async () => {
    setError("");
    setNotice("");

    if (!resetToken) {
      setError("Reset token is required.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    try {
      const { data } = await api.post("/auth/reset-password", { token: resetToken, password: newPassword });
      setNotice(data.message);
      setNewPassword("");
      setForm((current) => ({ ...current, password: "" }));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reset password.");
    }
  };

  const googleLogin = async () => {
    try {
      const { data } = await api.post("/auth/google");
      setNotice(data.message);
    } catch (err) {
      setNotice(err.response?.data?.message || "Google login needs OAuth setup.");
    }
  };

  return (
    <section className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">{isRegister ? "Create account" : "Welcome back"}</span>
        <h1>{isRegister ? "Register" : "Login"}</h1>
        {isRegister && (
          <label>
            Name
            <input name="name" value={form.name} onChange={update} required />
          </label>
        )}
        <label>
          Email
          <input
            autoComplete="email"
            inputMode="email"
            name="email"
            placeholder="Enter your email"
            type="text"
            value={form.email}
            onChange={update}
            required
          />
        </label>
        {!isRegister && (
          <p className="form-hint">
            {form.email ? `Using last login email: ${form.email}` : "After your first login, this email field will open with your previous login ID."}
          </p>
        )}
        <label>
          Password
          <input autoComplete={isRegister ? "new-password" : "current-password"} name="password" type="password" value={form.password} onChange={update} minLength="8" required />
        </label>
        {error && <p className="alert">{error}</p>}
        {notice && <p className="notice">{notice}</p>}
        <button className="primary-btn" disabled={submitting} type="submit">
          {submitting ? "Please wait..." : isRegister ? "Create Account" : "Login"}
        </button>
        {!isRegister && (
          <div className="auth-actions">
            <button type="button" onClick={forgotPassword}>Forgot password</button>
            <button type="button" onClick={googleLogin}>Continue with Google</button>
          </div>
        )}
        {!isRegister && resetToken && (
          <div className="reset-panel">
            <label>
              Reset Token
              <input value={resetToken} onChange={(event) => setResetToken(event.target.value.toUpperCase())} />
            </label>
            <label>
              New Password
              <input
                autoComplete="new-password"
                minLength="8"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Enter new password"
              />
            </label>
            <button className="secondary-btn" type="button" onClick={resetPassword}>Reset Password</button>
          </div>
        )}
        <p className="muted">
          {isRegister ? "Already registered?" : "New to CareerCoded?"}{" "}
          <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Login" : "Register"}</Link>
        </p>
      </form>
    </section>
  );
};

export default AuthPage;
