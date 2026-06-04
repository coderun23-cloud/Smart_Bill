import { useContext, useEffect, useState } from "react";
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

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    address: "",
    phone_number: "",
    role: "customer",
    customer_type: "",
  });
  const { setToken } = useContext(AppContext);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tariff, setTariff] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1); // multi-step: 1 = account, 2 = details
  const nav = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (formData.phone_number && !/^251\d{9}$/.test(formData.phone_number)) {
      setErrors({
        phone_number: [
          "Phone number must start with 251 followed by 9 digits (e.g., 251912345678)",
        ],
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        // Go back to step 1 if account errors
        if (data.errors?.name || data.errors?.email || data.errors?.password)
          setStep(1);
      } else {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        nav("/index");
      }
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value.startsWith("251") && value.length > 0) value = "251" + value;
    if (value.length > 12) value = value.substring(0, 12);
    setFormData({ ...formData, phone_number: value });
  };

  async function fetchTariff() {
    try {
      const res = await fetch("api/tariff");
      const data = await res.json();
      if (res.ok) setTariff(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchTariff();
  }, []);

  const handleNext = (e) => {
    e.preventDefault();
    const stepErrors = {};
    if (!formData.name) stepErrors.name = ["Full name is required"];
    if (!formData.email) stepErrors.email = ["Email is required"];
    if (!formData.password) stepErrors.password = ["Password is required"];
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep(2);
  };

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

  const EyeIcon = () => (
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
  );
  const EyeOffIcon = () => (
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
  );

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
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes stepSlideIn {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes stepSlideBack {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .reg-page {
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
          top: 0; left: 0; right: 0;
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
          display: flex; align-items: center; gap: 10px; text-decoration: none;
        }
        .logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #2563eb, #10b981);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 700; color: white; flex-shrink: 0;
        }
        .logo-text { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 1.1rem; color: #fff; letter-spacing: -0.3px; }
        .logo-sub { font-size: 0.65rem; color: rgba(148, 163, 184, 0.8); font-weight: 400; letter-spacing: 0.5px; text-transform: uppercase; display: block; margin-top: -3px; }
        .nav-badge { font-size: 0.7rem; font-family: 'Space Mono', monospace; color: rgba(16, 185, 129, 0.9); border: 1px solid rgba(16, 185, 129, 0.3); padding: 3px 10px; border-radius: 100px; }

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
        .reg-wrapper {
          width: 100%;
          max-width: 500px;
          animation: slideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }
        .card-top-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: 100px;
          padding: 5px 14px; margin-bottom: 24px;
          font-size: 0.7rem; color: rgba(110, 231, 183, 0.9);
          font-family: 'Space Mono', monospace; letter-spacing: 0.5px;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; animation: pulse 2s ease-in-out infinite; flex-shrink: 0; }
        .card-heading { font-size: 2rem; font-weight: 700; color: #f1f5f9; line-height: 1.15; margin-bottom: 6px; letter-spacing: -0.5px; }
        .card-subheading { font-size: 0.875rem; color: rgba(148, 163, 184, 0.8); margin-bottom: 28px; font-weight: 400; line-height: 1.5; }

        /* Step indicator */
        .step-indicator {
          display: flex; align-items: center; gap: 0;
          margin-bottom: 28px;
        }
        .step-item {
          display: flex; align-items: center; gap: 8px;
          flex: 1;
        }
        .step-circle {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 700;
          font-family: 'Space Mono', monospace;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .step-circle.active { background: #2563eb; color: white; box-shadow: 0 0 12px rgba(37,99,235,0.5); }
        .step-circle.done { background: #10b981; color: white; }
        .step-circle.inactive { background: rgba(255,255,255,0.06); color: rgba(148,163,184,0.5); border: 1px solid rgba(255,255,255,0.08); }
        .step-label { font-size: 0.7rem; color: rgba(148,163,184,0.7); font-family: 'Space Mono', monospace; letter-spacing: 0.3px; }
        .step-label.active { color: #93c5fd; }
        .step-label.done { color: #6ee7b7; }
        .step-connector { flex: 1; height: 1px; background: rgba(255,255,255,0.06); margin: 0 8px; max-width: 60px; }
        .step-connector.done { background: rgba(16, 185, 129, 0.4); }

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
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), rgba(37, 99, 235, 0.3), transparent);
        }

        .step-panel { animation: stepSlideIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .step-panel.back { animation: stepSlideBack 0.35s cubic-bezier(0.22, 1, 0.36, 1) both; }

        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
        .field-group { margin-bottom: 20px; }
        .field-group-inline { }

        .field-label {
          display: block; font-size: 0.72rem; font-weight: 600;
          color: rgba(148, 163, 184, 0.9); letter-spacing: 0.8px;
          text-transform: uppercase; margin-bottom: 8px;
          font-family: 'Space Mono', monospace;
        }
        .req { color: rgba(248, 113, 113, 0.9); margin-left: 2px; }
        .opt { color: rgba(100,116,139,0.6); font-size: 0.65rem; margin-left: 4px; text-transform: none; letter-spacing: 0; font-family: 'Sora', sans-serif; }

        .input-wrap { position: relative; }
        .input-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: rgba(100, 116, 139, 0.8); font-size: 16px;
          pointer-events: none; display: flex; align-items: center;
        }
        .input-field {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 13px 14px 13px 42px;
          font-family: 'Sora', sans-serif;
          font-size: 0.88rem;
          color: #f1f5f9;
          outline: none;
          transition: all 0.2s ease;
          -webkit-appearance: none;
        }
        .input-field.no-icon { padding-left: 14px; }
        .input-field::placeholder { color: rgba(100, 116, 139, 0.6); font-size: 0.85rem; }
        .input-field:focus { border-color: rgba(59, 130, 246, 0.5); background: rgba(59, 130, 246, 0.06); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        .input-field.has-error { border-color: rgba(239, 68, 68, 0.5); background: rgba(239, 68, 68, 0.04); }
        .input-field option { background: #1e293b; color: #f1f5f9; }

        .toggle-pw {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(100, 116, 139, 0.7); padding: 2px;
          display: flex; align-items: center; font-size: 16px; transition: color 0.2s;
        }
        .toggle-pw:hover { color: rgba(148, 163, 184, 0.9); }

        .hint { font-size: 0.7rem; color: rgba(100, 116, 139, 0.65); margin-top: 5px; font-family: 'Space Mono', monospace; }
        .error-msg { font-size: 0.73rem; color: #f87171; margin-top: 6px; display: flex; align-items: center; gap: 4px; font-family: 'Space Mono', monospace; }

        .btn-row { display: flex; gap: 12px; margin-top: 4px; }

        .submit-btn {
          flex: 1; padding: 14px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%);
          color: white; font-family: 'Sora', sans-serif; font-size: 0.9rem; font-weight: 600;
          cursor: pointer; transition: all 0.25s ease; position: relative; overflow: hidden;
          letter-spacing: 0.2px; box-shadow: 0 4px 24px rgba(37, 99, 235, 0.35);
        }
        .submit-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(37, 99, 235, 0.5); filter: brightness(1.08); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { cursor: not-allowed; opacity: 0.7; }
        .submit-btn.green { background: linear-gradient(135deg, #059669 0%, #047857 100%); box-shadow: 0 4px 24px rgba(5, 150, 105, 0.35); }
        .submit-btn.green:hover:not(:disabled) { box-shadow: 0 8px 32px rgba(5, 150, 105, 0.5); }

        .back-btn {
          padding: 14px 20px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(148, 163, 184, 0.8);
          font-family: 'Sora', sans-serif; font-size: 0.88rem; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .back-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); color: #f1f5f9; }

        .spinner {
          display: inline-block; width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
          border-radius: 50%; animation: spin 0.6s linear infinite;
          vertical-align: middle; margin-right: 8px;
        }

        .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0; }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
        .divider-text { font-size: 0.72rem; color: rgba(100, 116, 139, 0.7); font-family: 'Space Mono', monospace; letter-spacing: 0.5px; }

        .login-row { text-align: center; font-size: 0.82rem; color: rgba(148, 163, 184, 0.7); }
        .login-link { color: rgba(96, 165, 250, 0.9); font-weight: 600; text-decoration: none; margin-left: 4px; transition: color 0.2s; }
        .login-link:hover { color: #93c5fd; text-decoration: underline; }

        .footer {
          position: relative; z-index: 1;
          background: rgba(6, 10, 20, 0.8);
          border-top: 1px solid rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          padding: 40px 24px 28px; text-align: center;
        }
        .footer-title { font-size: 1.1rem; font-weight: 700; color: #f1f5f9; margin-bottom: 10px; letter-spacing: -0.2px; }
        .footer-desc { font-size: 0.8rem; color: rgba(148, 163, 184, 0.65); max-width: 480px; margin: 0 auto 20px; line-height: 1.6; }
        .social-links { display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; }
        .social-btn {
          width: 34px; height: 34px; border-radius: 8px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          color: rgba(148, 163, 184, 0.7); text-decoration: none; font-size: 15px; transition: all 0.2s;
        }
        .social-btn:hover { background: rgba(37, 99, 235, 0.15); border-color: rgba(37, 99, 235, 0.3); color: #93c5fd; }
        .footer-copy { font-size: 0.7rem; color: rgba(100, 116, 139, 0.55); font-family: 'Space Mono', monospace; line-height: 1.8; }
        .footer-copy strong { color: rgba(148, 163, 184, 0.7); font-weight: 400; }
      `}</style>

      <div className="reg-page">
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

        <main className="main-content">
          <div className="reg-wrapper">
            <div className="card-top-badge">
              <span className="badge-dot" />
              CREATE YOUR ACCOUNT
            </div>
            <h1 className="card-heading">Get started today</h1>
            <p className="card-subheading">
              Register to access Ethiopia's smart electricity billing portal.
            </p>

            {/* Step Indicator */}
            <div className="step-indicator">
              <div className="step-item">
                <div
                  className={`step-circle ${step === 1 ? "active" : "done"}`}
                >
                  {step > 1 ? "✓" : "01"}
                </div>
                <span
                  className={`step-label ${step === 1 ? "active" : "done"}`}
                >
                  Account
                </span>
              </div>
              <div className={`step-connector ${step > 1 ? "done" : ""}`} />
              <div className="step-item">
                <div
                  className={`step-circle ${step === 2 ? "active" : "inactive"}`}
                >
                  02
                </div>
                <span className={`step-label ${step === 2 ? "active" : ""}`}>
                  Details
                </span>
              </div>
            </div>

            <div className="card-body">
              <form
                onSubmit={step === 1 ? handleNext : handleRegister}
                noValidate
              >
                {/* STEP 1 */}
                {step === 1 && (
                  <div className="step-panel">
                    {/* Name */}
                    <div className="field-group">
                      <label className="field-label">
                        Full Name <span className="req">*</span>
                      </label>
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
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </span>
                        <input
                          type="text"
                          placeholder="Abebe Girma"
                          className={`input-field${errors.name ? " has-error" : ""}`}
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      {errors.name && (
                        <p className="error-msg">⚠ {errors.name[0]}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="field-group">
                      <label className="field-label">
                        Email Address <span className="req">*</span>
                      </label>
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
                        />
                      </div>
                      {errors.email && (
                        <p className="error-msg">⚠ {errors.email[0]}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="field-group">
                      <label className="field-label">
                        Password <span className="req">*</span>
                      </label>
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
                          placeholder="Create a strong password"
                          className={`input-field${errors.password ? " has-error" : ""}`}
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                        />
                        <button
                          type="button"
                          className="toggle-pw"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="error-msg">⚠ {errors.password[0]}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="field-group">
                      <label className="field-label">
                        Confirm Password <span className="req">*</span>
                      </label>
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
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                        </span>
                        <input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Repeat your password"
                          className="input-field"
                          value={formData.password_confirmation}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password_confirmation: e.target.value,
                            })
                          }
                        />
                        <button
                          type="button"
                          className="toggle-pw"
                          onClick={() => setShowConfirm(!showConfirm)}
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </div>

                    <button type="submit" className="submit-btn">
                      Continue to Details →
                    </button>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="step-panel">
                    {/* Address */}
                    <div className="field-group">
                      <label className="field-label">
                        Address <span className="req">*</span>
                      </label>
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
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </span>
                        <input
                          type="text"
                          placeholder="Addis Ababa, Bole Sub-city"
                          className={`input-field${errors.address ? " has-error" : ""}`}
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                      {errors.address && (
                        <p className="error-msg">⚠ {errors.address[0]}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="field-group">
                      <label className="field-label">
                        Phone Number <span className="opt">(optional)</span>
                      </label>
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
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.7 12.21 19.79 19.79 0 0 1 1.1 3.58a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 5.59 5.59l.53-.53a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15.9z" />
                          </svg>
                        </span>
                        <input
                          type="tel"
                          placeholder="251912345678"
                          className={`input-field${errors.phone_number ? " has-error" : ""}`}
                          value={formData.phone_number}
                          onChange={handlePhoneChange}
                          pattern="^251\d{9}$"
                        />
                      </div>
                      {errors.phone_number && (
                        <p className="error-msg">⚠ {errors.phone_number[0]}</p>
                      )}
                      <p className="hint">
                        Format: 251 + 9 digits (e.g. 251912345678)
                      </p>
                    </div>

                    {/* Tariff Type */}
                    <div className="field-group">
                      <label className="field-label">
                        Tariff Type <span className="req">*</span>
                      </label>
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
                            <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                          </svg>
                        </span>
                        <select
                          className={`input-field${errors.customer_type ? " has-error" : ""}`}
                          value={formData.customer_type}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customer_type: e.target.value,
                            })
                          }
                        >
                          <option value="">Select tariff type...</option>
                          {tariff.map((t) => (
                            <option key={t.id} value={t.tariff_name}>
                              {t.tariff_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.customer_type && (
                        <p className="error-msg">⚠ {errors.customer_type[0]}</p>
                      )}
                    </div>

                    <div className="btn-row">
                      <button
                        type="button"
                        className="back-btn"
                        onClick={() => setStep(1)}
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="submit-btn green"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner" />
                            Creating account...
                          </>
                        ) : (
                          "Create Account ✓"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>

              <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">HAVE AN ACCOUNT?</span>
                <div className="divider-line" />
              </div>

              <div className="login-row">
                Already registered?
                <Link to="/login" className="login-link">
                  Sign in instead
                </Link>
              </div>
            </div>
          </div>
        </main>

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
              Designed by <strong>St Mary's University Student</strong>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Register;
