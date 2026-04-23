"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Demo login — in production, use Supabase Auth
    if (email === "mayank@shubharambh.com" && password === "mayank@mayank") {
      localStorage.setItem("sc_admin", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid email or password.");
    }
    setLoading(false);
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card glass animate-fade-in-up">
        <div className="admin-login__header">
          <span className="admin-login__icon">✦</span>
          <h1 className="admin-login__title font-display">Admin Panel</h1>
          <p className="admin-login__sub">Shubharambh Collection</p>
        </div>

        <form onSubmit={handleLogin} className="admin-login__form">
          {error && <div className="admin-login__error">{error}</div>}

          <div className="admin-login__field">
            <label htmlFor="admin-email">Email</label>
            <input
              type="email"
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="admin-login__input"
            />
          </div>

          <div className="admin-login__field">
            <label htmlFor="admin-password">Password</label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="admin-login__input"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg admin-login__btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="admin-login__hint">
            🔒 Authorized access only
          </p>
        </form>
      </div>
    </div>
  );
}
