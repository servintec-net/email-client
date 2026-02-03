import React, { useState } from "react";
import { Link } from "react-router-dom";
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
        /* Auth inputs: same as Get in Touch - white text on dark glass; placeholder visible */
        .auth-form-input::placeholder {
          color: rgba(156, 163, 175, 0.9);
        }
        .auth-form-input:-webkit-autofill,
        .auth-form-input:-webkit-autofill:hover,
        .auth-form-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #f3f4f6;
          -webkit-box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.2) inset;
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
        className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl p-6 md:p-8 w-[90%] min-w-[320px] max-w-[460px] relative z-10"
        style={{ animation: "slideIn 0.4s ease-out" }}
      >
        {/* Back to Servintec */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium mb-6 transition-colors"
        >
          <span className="material-icons-outlined text-lg">arrow_back</span>
          Back to Servintec
        </Link>

        {/* Logo and Header - same style as Get in Touch CardHeader */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/servintec-logo.png"
            alt="Servintec"
            className="h-14 w-auto object-contain mb-4"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <h1 className="text-white text-3xl font-semibold font-heading m-0 text-center">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-400 text-lg mt-2 text-center">
            {isSignup
              ? "Sign up to get started with Email Classifier"
              : "Sign in to continue to Email Classifier"}
          </p>
        </div>

        {/* Error Message - same as Get in Touch status (red variant) */}
        {error && (
          <div className="p-3 rounded-md bg-red-500/20 text-red-200 flex items-center gap-2 mb-6" style={{ animation: "shake 0.5s ease" }}>
            <span className="material-icons-outlined text-xl flex-shrink-0">error_outline</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignup && (
            <div className="space-y-4">
              <label htmlFor="auth-username" className="block text-gray-300 text-lg font-medium">
                Username
              </label>
              <input
                id="auth-username"
                type="text"
                className="auth-form-input w-full px-4 py-3 rounded-md bg-black/20 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField(null)}
                required
                placeholder="Choose a username"
              />
            </div>
          )}

          <div className="space-y-4">
            <label htmlFor="auth-email" className="block text-gray-300 text-lg font-medium">
              {isSignup ? "Email" : "Email or Username"}
            </label>
            <div className="relative">
              <span
                className={`material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none transition-colors ${
                  focusedField === "email" ? "text-blue-400" : "text-gray-400"
                }`}
              >
                {isSignup ? "email" : "person"}
              </span>
              <input
                id="auth-email"
                type={isSignup ? "email" : "text"}
                className="auth-form-input w-full pl-12 pr-4 py-3 rounded-md bg-black/20 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                required
                placeholder={isSignup ? "your@email.com" : "email or username"}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label htmlFor="auth-password" className="block text-gray-300 text-lg font-medium">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="bg-transparent border-none text-gray-400 hover:text-blue-400 cursor-pointer py-1 flex items-center text-sm font-medium transition-colors"
              >
                <span className="material-icons-outlined text-lg mr-1">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="relative">
              <span
                className={`material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none transition-colors ${
                  focusedField === "password" ? "text-blue-400" : "text-gray-400"
                }`}
              >
                lock
              </span>
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                className="auth-form-input w-full pl-12 pr-4 py-3 rounded-md bg-black/20 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                required
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl text-lg py-3 rounded-full font-semibold disabled:opacity-70 disabled:cursor-default flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="material-icons-outlined text-xl animate-spin">refresh</span>
            )}
            <span>{loading ? "Processing..." : isSignup ? "Create Account" : "Sign In"}</span>
          </button>
        </form>

        <div className="text-center text-gray-400 pt-5 mt-5 border-t border-white/10">
          <span className="mr-1">{isSignup ? "Already have an account?" : "Don't have an account?"}</span>
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
              setPassword("");
            }}
            className="bg-transparent border-none text-blue-400 hover:text-purple-400 cursor-pointer font-semibold text-base py-1 transition-colors underline-offset-2 hover:underline"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
