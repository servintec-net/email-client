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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        backgroundSize: "200% 200%",
        animation: "gradientShift 8s ease infinite",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Modern grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          opacity: 0.4,
        }}
      />
      
      {/* Animated gradient orbs */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)",
          top: "-300px",
          right: "-300px",
          animation: "floatOrb 20s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
          bottom: "-250px",
          left: "-250px",
          animation: "floatOrb 25s ease-in-out infinite reverse",
        }}
      />
      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, 50px) scale(1.1); }
        }
      `}</style>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
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
