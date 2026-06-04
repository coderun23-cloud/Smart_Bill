import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const FloatingParticle = ({ style }) => (
  <div
    style={{
      position: "absolute",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.08)",
      animation: "float linear infinite",
      ...style,
    }}
  />
);

function Login() {
  const { setToken } = useContext(AppContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.errors) {
        setErrors(data.errors);
      } else {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        nav("/index");
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  }

  const particles = [
    {
      width: 80,
      height: 80,
      top: "10%",
      left: "5%",
      animationDuration: "18s",
      animationDelay: "0s",
      opacity: 0.4,
    },
    {
      width: 120,
      height: 120,
      top: "60%",
      left: "2%",
      animationDuration: "24s",
      animationDelay: "-6s",
      opacity: 0.25,
    },
    {
      width: 50,
      height: 50,
      top: "80%",
      left: "15%",
      animationDuration: "14s",
      animationDelay: "-3s",
      opacity: 0.5,
    },
    {
      width: 200,
      height: 200,
      top: "-5%",
      right: "8%",
      animationDuration: "30s",
      animationDelay: "-10s",
      opacity: 0.15,
    },
    {
      width: 60,
      height: 60,
      top: "40%",
      right: "5%",
      animationDuration: "20s",
      animationDelay: "-8s",
      opacity: 0.35,
    },
    {
      width: 90,
      height: 90,
      top: "75%",
      right: "12%",
      animationDuration: "16s",
      animationDelay: "-2s",
      opacity: 0.3,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { font-family: 'Sora', sans-serif; }

        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(120deg); }
          66% { transform: translateY(15px) rotate(240deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Sora', sans-serif;
          background: #0a0f1e;
          position: relative;
          overflow: hidden;
        }

        .bg-gradient {
          position: fixed;
          inset: 0;
          background: 
            radial-gradient(ellipse 80% 60% at 20% 0%, rgba(37, 99, 235, 0.25) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 100%, rgba(16, 185, 129, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 60% 40%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
            linear-gradient(135deg, #0a0f1e 0%, #0d1733 50%, #091624 100%);
          z-index: 0;
        }

        .grid-overlay {
          position: fixed;
          inset: 0;
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: 0;
        }

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 0 2rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(10, 15, 30, 0.7);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(59, 130, 246, 0.12);
          animation: fadeIn 0.6s ease both;
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #2563eb, #10b981);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          color: white;
          letter-spacing: -1px;
          flex-shrink: 0;
        }

        .logo-text {
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .logo-sub {
          font-size: 0.65rem;
          color: rgba(148, 163, 184, 0.8);
          font-weight: 400;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          display: block;
          margin-top: -3px;
        }

        .nav-badge {
          font-size: 0.7rem;
          font-family: 'Space Mono', monospace;
          color: rgba(16, 185, 129, 0.9);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 3px 10px;
          border-radius: 100px;
          letter-spacing: 0.3px;
        }

        .main-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 1rem 2rem;
          position: relative;
          z-index: 1;
          min-height: 100vh;
        }

        .login-wrapper {
          width: 100%;
          max-width: 460px;
          animation: slideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }

        .card-top-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(37, 99, 235, 0.12);
          border: 1px solid rgba(37, 99, 235, 0.25);
          border-radius: 100px;
          padding: 5px 14px;
          margin-bottom: 24px;
          font-size: 0.7rem;
          color: rgba(147, 197, 253, 0.9);
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.5px;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          animation: pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        .card-heading {
          font-size: 2rem;
          font-weight: 700;
          color: #f1f5f9;
          line-height: 1.15;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }

        .card-subheading {
          font-size: 0.875rem;
          color: rgba(148, 163, 184, 0.8);
          margin-bottom: 32px;
          font-weight: 400;
          line-height: 1.5;
        }

        .card-body {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 36px;
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
        }

        .card-body::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), rgba(16, 185, 129, 0.3), transparent);
        }

        .field-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          color: rgba(148, 163, 184, 0.9);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 8px;
          font-family: 'Space Mono', monospace;
        }

        .input-wrap {
          position: relative;
          margin-bottom: 4px;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(100, 116, 139, 0.8);
          font-size: 16px;
          pointer-events: none;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }

        .input-field {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 13px 42px 13px 42px;
          font-family: 'Sora', sans-serif;
          font-size: 0.88rem;
          color: #f1f5f9;
          outline: none;
          transition: all 0.2s ease;
          -webkit-appearance: none;
        }

        .input-field::placeholder {
          color: rgba(100, 116, 139, 0.6);
          font-size: 0.85rem;
        }

        .input-field:focus {
          border-color: rgba(59, 130, 246, 0.5);
          background: rgba(59, 130, 246, 0.06);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .input-field.has-error {
          border-color: rgba(239, 68, 68, 0.5);
          background: rgba(239, 68, 68, 0.04);
        }

        .toggle-pw {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(100, 116, 139, 0.7);
          padding: 2px;
          display: flex;
          align-items: center;
          font-size: 16px;
          transition: color 0.2s;
        }

        .toggle-pw:hover { color: rgba(148, 163, 184, 0.9); }

        .field-group { margin-bottom: 20px; }

        .error-msg {
          font-size: 0.73rem;
          color: #f87171;
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: 'Space Mono', monospace;
        }

        .row-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          margin-top: -4px;
        }

        .remember-row {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .remember-row input[type="checkbox"] {
          width: 15px;
          height: 15px;
          accent-color: #2563eb;
          cursor: pointer;
        }

        .remember-label {
          font-size: 0.78rem;
          color: rgba(148, 163, 184, 0.75);
          cursor: pointer;
          font-weight: 400;
        }

        .forgot-link {
          font-size: 0.78rem;
          color: rgba(96, 165, 250, 0.9);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .forgot-link:hover { color: #93c5fd; text-decoration: underline; }

        .submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%);
          color: white;
          font-family: 'Sora', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
          letter-spacing: 0.2px;
          box-shadow: 0 4px 24px rgba(37, 99, 235, 0.35);
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(37, 99, 235, 0.5);
          filter: brightness(1.08);
        }

        .submit-btn:active:not(:disabled) { transform: translateY(0); }

        .submit-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        .divider-text {
          font-size: 0.72rem;
          color: rgba(100, 116, 139, 0.7);
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.5px;
        }

        .register-row {
          text-align: center;
          font-size: 0.82rem;
          color: rgba(148, 163, 184, 0.7);
        }

        .register-link {
          color: rgba(96, 165, 250, 0.9);
          font-weight: 600;
          text-decoration: none;
          margin-left: 4px;
          transition: color 0.2s;
        }

        .register-link:hover { color: #93c5fd; text-decoration: underline; }

        .stat-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          overflow: hidden;
          margin-top: 28px;
        }

        .stat-cell {
          background: rgba(10, 15, 30, 0.6);
          padding: 12px 8px;
          text-align: center;
        }

        .stat-num {
          font-family: 'Space Mono', monospace;
          font-size: 1rem;
          font-weight: 700;
          color: #60a5fa;
          display: block;
        }

        .stat-label {
          font-size: 0.64rem;
          color: rgba(100, 116, 139, 0.75);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
          margin-top: 2px;
        }

        .footer {
          position: relative;
          z-index: 1;
          background: rgba(6, 10, 20, 0.8);
          border-top: 1px solid rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          padding: 40px 24px 28px;
          text-align: center;
        }

        .footer-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 10px;
          letter-spacing: -0.2px;
        }

        .footer-desc {
          font-size: 0.8rem;
          color: rgba(148, 163, 184, 0.65);
          max-width: 480px;
          margin: 0 auto 20px;
          line-height: 1.6;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .social-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(148, 163, 184, 0.7);
          text-decoration: none;
          font-size: 15px;
          transition: all 0.2s;
        }

        .social-btn:hover {
          background: rgba(37, 99, 235, 0.15);
          border-color: rgba(37, 99, 235, 0.3);
          color: #93c5fd;
        }

        .footer-copy {
          font-size: 0.7rem;
          color: rgba(100, 116, 139, 0.55);
          font-family: 'Space Mono', monospace;
          line-height: 1.8;
        }

        .footer-copy strong { color: rgba(148, 163, 184, 0.7); font-weight: 400; }
      `}</style>

      <div className="login-page">
        <div className="bg-gradient" />
        <div className="grid-overlay" />

        {particles.map((p, i) => (
          <FloatingParticle key={i} style={p} />
        ))}

        {/* Navbar */}
        <nav className="navbar">
          <Link to="/" className="logo-area">
            <div className="logo-icon">⚡</div>
            <div>
              <span className="logo-text">SmartBill</span>
              <span className="logo-sub">Ethiopia Electricity</span>
            </div>
          </Link>
        </nav>

        {/* Main */}
        <main className="main-content">
          <div className="login-wrapper">
            <div className="card-top-badge">
              <span className="badge-dot" />
              SECURE PORTAL ACCESS
            </div>
            <h1 className="card-heading">Welcome back</h1>
            <p className="card-subheading">
              Sign in to manage your electricity billing account and services.
            </p>

            <div className="card-body">
              <form onSubmit={handleLogin} noValidate>
                {/* Email */}
                <div className="field-group">
                  <label className="field-label">Email Address</label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className={`input-field${errors.email ? " has-error" : ""}`}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                  {errors.email && (
                    <p className="error-msg">⚠ {errors.email[0]}</p>
                  )}
                </div>

                {/* Password */}
                <div className="field-group">
                  <label className="field-label">Password</label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="18"
                          height="11"
                          x="3"
                          y="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`input-field${errors.password ? " has-error" : ""}`}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                    />
                    <button
                      type="button"
                      className="toggle-pw"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="error-msg">⚠ {errors.password[0]}</p>
                  )}
                </div>

                {/* Remember / Forgot */}
                <div className="row-meta">
                  <label className="remember-row">
                    <input type="checkbox" />
                    <span className="remember-label">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    state={{ email: formData.email }}
                    className="forgot-link"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Authenticating...
                    </>
                  ) : (
                    "Sign in to Dashboard →"
                  )}
                </button>
              </form>

              <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">NEW HERE?</span>
                <div className="divider-line" />
              </div>

              <div className="register-row">
                Don't have an account?
                <a href="/register" className="register-link">
                  Create one free
                </a>
              </div>

              {/* Stats Strip */}
              <div className="stat-strip">
                <div className="stat-cell">
                  <span className="stat-num">2.4M+</span>
                  <span className="stat-label">Customers</span>
                </div>
                <div className="stat-cell">
                  <span className="stat-num">99.9%</span>
                  <span className="stat-label">Uptime</span>
                </div>
                <div className="stat-cell">
                  <span className="stat-num">256-bit</span>
                  <span className="stat-label">Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p className="footer-title">Ethiopia Electricity Billing System</p>
          <p className="footer-desc">
            A reliable and efficient system for managing electricity billing in
            Ethiopia. Accurate billing, transparent services, and an improved
            customer experience.
          </p>
          <div className="social-links">
            {[
              { href: "#", icon: "𝕏" },
              { href: "#", icon: "f" },
              { href: "#", icon: "in" },
              { href: "#", icon: "ig" },
            ].map((s, i) => (
              <a key={i} href={s.href} className="social-btn">
                {s.icon}
              </a>
            ))}
          </div>
          <div className="footer-copy">
            <div>
              © 2024 <strong>Ethiopia Electricity Billing System</strong> · All
              Rights Reserved
            </div>
            <div style={{ marginTop: 4 }}>
              Designed by <strong>St Mary's University Seniors</strong>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Login;
