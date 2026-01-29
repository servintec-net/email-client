import React, { useState } from "react";
import { API_BASE } from "../utils/constants";
import { getAuthHeaders } from "../utils/auth";

const ChangePassword = ({ currentUser, onBack, authToken }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/me/password`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to change password.");
        return;
      }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, rgba(11,95,255,0.02), rgba(226,33,15,0.02))",
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 400,
            width: "100%",
            background: "#fff",
            borderRadius: 16,
            padding: 32,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <span
            className="material-icons-outlined"
            style={{ fontSize: 48, color: "#28a745", marginBottom: 16, display: "block" }}
          >
            check_circle
          </span>
          <h2 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 700 }}>Password changed</h2>
          <p style={{ margin: "0 0 24px 0", fontSize: 14, color: "rgba(0,0,0,0.6)" }}>
            Your password has been updated successfully.
          </p>
          <button
            onClick={onBack}
            style={{
              padding: "12px 24px",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 10,
              background: "#0b5fff",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Back to app
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, rgba(11,95,255,0.02), rgba(226,33,15,0.02))",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: "100%",
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button
            onClick={onBack}
            style={{
              padding: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Back"
          >
            <span className="material-icons-outlined" style={{ fontSize: 24 }}>arrow_back</span>
          </button>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Change password</h1>
        </div>

        {currentUser && (
          <p style={{ margin: "0 0 20px 0", fontSize: 13, color: "rgba(0,0,0,0.6)" }}>
            Signed in as <strong>{currentUser.username}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {error && (
            <div
              style={{
                padding: "10px 12px",
                background: "rgba(220, 53, 69, 0.1)",
                borderRadius: 8,
                fontSize: 13,
                color: "#dc3545",
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Current password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 44px 12px 12px",
                  border: "1px solid rgba(0,0,0,0.15)",
                  borderRadius: 10,
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((s) => !s)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 4,
                }}
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                <span className="material-icons-outlined" style={{ fontSize: 20, color: "rgba(0,0,0,0.5)" }}>
                  {showCurrent ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              New password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                style={{
                  width: "100%",
                  padding: "12px 44px 12px 12px",
                  border: "1px solid rgba(0,0,0,0.15)",
                  borderRadius: 10,
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowNew((s) => !s)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 4,
                }}
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                <span className="material-icons-outlined" style={{ fontSize: 20, color: "rgba(0,0,0,0.5)" }}>
                  {showNew ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Confirm new password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid rgba(0,0,0,0.15)",
                borderRadius: 10,
                fontSize: 14,
                boxSizing: "border-box",
              }}
              placeholder="Confirm new password"
            />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              type="button"
              onClick={onBack}
              style={{
                flex: 1,
                padding: "12px",
                border: "1px solid rgba(0,0,0,0.15)",
                borderRadius: 10,
                background: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px",
                border: "none",
                borderRadius: 10,
                background: "#0b5fff",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? "Updating..." : "Change password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
