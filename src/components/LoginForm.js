import React, { useState } from "react";
import { API_BASE } from "../utils/constants";
import { setAuthToken } from "../utils/auth";

const LoginForm = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const body = isSignup
        ? { username, email, password }
        : { emailOrUsername: email, password };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        throw new Error(
          res.status === 404
            ? "Server endpoint not found. Is the server running?"
            : "Server returned an invalid response. Please check the server logs."
        );
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      setAuthToken(data.token);
      onLogin(data.user, data.token);
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #111827, #581c87, #000)",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Moving gradient layer - drifts across screen */}
      <div
        className="auth-page-bg-drift"
        style={{
          position: "absolute",
          inset: "-50%",
          width: "200%",
          height: "200%",
          pointerEvents: "none",
        }}
      />
      {/* Animated radial glow - cycles position */}
      <div
        className="auth-page-bg-glow"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.25,
          pointerEvents: "none",
        }}
      />
      {/* Floating orbs - move around the viewport */}
      <div className="auth-page-orb auth-page-orb-1" />
      <div className="auth-page-orb auth-page-orb-2" />
      <div className="auth-page-orb auth-page-orb-3" />
      {/* Servintec-style floating items (icons) in background */}
      <div className="auth-page-float-item auth-page-float-1" style={{ top: "10%", left: "6%" }}><span className="material-icons-outlined">code</span></div>
      <div className="auth-page-float-item auth-page-float-2" style={{ top: "18%", right: "8%" }}><span className="material-icons-outlined">rocket_launch</span></div>
      <div className="auth-page-float-item auth-page-float-3" style={{ bottom: "28%", left: "5%" }}><span className="material-icons-outlined">memory</span></div>
      <div className="auth-page-float-item auth-page-float-4" style={{ bottom: "12%", right: "12%" }}><span className="material-icons-outlined">auto_awesome</span></div>
      <div className="auth-page-float-item auth-page-float-5" style={{ top: "48%", left: "4%" }}><span className="material-icons-outlined">bolt</span></div>
      <div className="auth-page-float-item auth-page-float-6" style={{ top: "58%", right: "6%" }}><span className="material-icons-outlined">storage</span></div>
      <div className="auth-page-float-item auth-page-float-7" style={{ bottom: "48%", left: "10%" }}><span className="material-icons-outlined">public</span></div>
      <div className="auth-page-float-item auth-page-float-8" style={{ top: "32%", right: "4%" }}><span className="material-icons-outlined">layers</span></div>
      <style>{`
        @keyframes authPageFloatItem {
          0%, 100% { opacity: 0.2; transform: translateY(0) scale(1) rotate(0deg); }
          50% { opacity: 0.4; transform: translateY(-18px) scale(1.15) rotate(8deg); }
        }
        .auth-page-float-item {
          position: absolute;
          pointer-events: none;
          z-index: 0;
          color: rgba(147, 197, 253, 0.35);
          font-size: 28px;
          animation: authPageFloatItem 5s ease-in-out infinite;
        }
        .auth-page-float-1 { animation-delay: 0s; animation-duration: 5.2s; }
        .auth-page-float-2 { animation-delay: 0.5s; animation-duration: 6s; }
        .auth-page-float-3 { animation-delay: 1s; animation-duration: 5.5s; }
        .auth-page-float-4 { animation-delay: 1.5s; animation-duration: 6.2s; }
        .auth-page-float-5 { animation-delay: 0.3s; animation-duration: 5.8s; }
        .auth-page-float-6 { animation-delay: 0.8s; animation-duration: 5.4s; }
        .auth-page-float-7 { animation-delay: 1.2s; animation-duration: 6.5s; }
        .auth-page-float-8 { animation-delay: 0.6s; animation-duration: 5.6s; }
      `}</style>
      <style>{`
        @keyframes authPageBgDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(2%, 1%) scale(1.02); }
          50% { transform: translate(-1%, 2%) scale(0.98); }
          75% { transform: translate(1%, -1%) scale(1.01); }
        }
        .auth-page-bg-drift {
          background: radial-gradient(ellipse 80% 50% at 30% 40%, rgba(59, 130, 246, 0.25) 0%, transparent 50%),
                      radial-gradient(ellipse 60% 80% at 70% 60%, rgba(147, 51, 234, 0.25) 0%, transparent 50%),
                      radial-gradient(ellipse 50% 50% at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 60%);
          animation: authPageBgDrift 20s ease-in-out infinite;
        }
        @keyframes authPageBgGlow {
          0%, 100% {
            background: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.35) 0%, transparent 50%);
          }
          33% {
            background: radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.35) 0%, transparent 50%);
          }
          66% {
            background: radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.35) 0%, transparent 50%);
          }
        }
        .auth-page-bg-glow {
          animation: authPageBgGlow 12s ease-in-out infinite;
        }
        @keyframes authPageOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -40px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(40px, 30px) scale(1.05); }
        }
        @keyframes authPageOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, -30px) scale(1.15); }
          66% { transform: translate(25px, 50px) scale(0.95); }
        }
        @keyframes authPageOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -50px) scale(1.2); }
        }
        .auth-page-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(40px);
        }
        .auth-page-orb-1 {
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
          top: 10%;
          left: 15%;
          animation: authPageOrb1 18s ease-in-out infinite;
        }
        .auth-page-orb-2 {
          width: 280px;
          height: 280px;
          background: radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%);
          bottom: 20%;
          right: 10%;
          animation: authPageOrb2 22s ease-in-out infinite;
        }
        .auth-page-orb-3 {
          width: 240px;
          height: 240px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          margin: -120px 0 0 -120px;
          animation: authPageOrb3 15s ease-in-out infinite;
        }
      `}</style>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>


      <div
        style={{
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter: "blur(30px) saturate(180%)",
          borderRadius: 24,
          padding: "48px 40px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.6) inset",
          minWidth: 420,
          maxWidth: 460,
          width: "90%",
          animation: "slideIn 0.4s ease-out",
          position: "relative",
          zIndex: 1,
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        {/* Logo and Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <img
            src="/servintec-logo.png"
            alt="Servintec"
            style={{
              height: 60,
              width: "auto",
              objectFit: "contain",
              marginBottom: 16,
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.5px",
            }}
          >
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p
            style={{
              margin: "8px 0 0 0",
              color: "rgba(0, 0, 0, 0.5)",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {isSignup
              ? "Sign up to get started with Email Classifier"
              : "Sign in to continue to Email Classifier"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: "14px 16px",
              marginBottom: 20,
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 12,
              color: "#dc2626",
              fontSize: 13,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 10,
              animation: "shake 0.5s ease",
            }}
          >
            <span className="material-icons-outlined" style={{ fontSize: 20, flexShrink: 0 }}>
              error_outline
            </span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(0, 0, 0, 0.8)",
                }}
              >
                Username
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  required
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: `2px solid ${
                      focusedField === "username"
                        ? "rgba(102, 126, 234, 0.5)"
                        : "rgba(0, 0, 0, 0.1)"
                    }`,
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 500,
                    boxSizing: "border-box",
                    background: focusedField === "username" ? "rgba(102, 126, 234, 0.02)" : "#fff",
                    transition: "all 0.2s ease",
                    outline: "none",
                  }}
                  placeholder="Choose a username"
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(0, 0, 0, 0.8)",
              }}
            >
              {isSignup ? "Email" : "Email or Username"}
            </label>
            <div style={{ position: "relative" }}>
              <span
                className="material-icons-outlined"
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 20,
                  color: focusedField === "email" ? "#667eea" : "rgba(0, 0, 0, 0.4)",
                  pointerEvents: "none",
                  transition: "color 0.2s ease",
                }}
              >
                {isSignup ? "email" : "person"}
              </span>
              <input
                type={isSignup ? "email" : "text"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px 14px 48px",
                  border: `2px solid ${
                    focusedField === "email" ? "rgba(102, 126, 234, 0.5)" : "rgba(0, 0, 0, 0.1)"
                  }`,
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 500,
                  boxSizing: "border-box",
                  background: focusedField === "email" ? "rgba(102, 126, 234, 0.02)" : "#fff",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                placeholder={isSignup ? "your@email.com" : "email or username"}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(0, 0, 0, 0.8)",
                }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(0, 0, 0, 0.5)",
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 12,
                  fontWeight: 500,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#667eea")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0, 0, 0, 0.5)")}
              >
                <span className="material-icons-outlined" style={{ fontSize: 18, marginRight: 4 }}>
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <span
                className="material-icons-outlined"
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 20,
                  color: focusedField === "password" ? "#667eea" : "rgba(0, 0, 0, 0.4)",
                  pointerEvents: "none",
                  transition: "color 0.2s ease",
                }}
              >
                lock
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px 14px 48px",
                  border: `2px solid ${
                    focusedField === "password" ? "rgba(102, 126, 234, 0.5)" : "rgba(0, 0, 0, 0.1)"
                  }`,
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 500,
                  boxSizing: "border-box",
                  background: focusedField === "password" ? "rgba(102, 126, 234, 0.02)" : "#fff",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: loading
                ? "rgba(102, 126, 234, 0.6)"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              marginBottom: 20,
              boxShadow: loading
                ? "none"
                : "0 8px 24px rgba(102, 126, 234, 0.4), 0 0 0 0 rgba(102, 126, 234, 0.5)",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(102, 126, 234, 0.5), 0 0 0 4px rgba(102, 126, 234, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.4), 0 0 0 0 rgba(102, 126, 234, 0.5)";
              }
            }}
            onMouseDown={(e) => {
              if (!loading) e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {loading && (
              <span
                className="material-icons-outlined"
                style={{
                  fontSize: 20,
                  animation: "spin 1s linear infinite",
                }}
              >
                refresh
              </span>
            )}
            <span>{loading ? "Processing..." : isSignup ? "Create Account" : "Sign In"}</span>
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            fontSize: 14,
            color: "rgba(0, 0, 0, 0.6)",
            paddingTop: 20,
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <span style={{ marginRight: 4 }}>
            {isSignup ? "Already have an account?" : "Don't have an account?"}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
              setPassword("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#667eea",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              padding: 4,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
              e.currentTarget.style.color = "#764ba2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
              e.currentTarget.style.color = "#667eea";
            }}
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
