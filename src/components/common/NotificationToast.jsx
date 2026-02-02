import React from "react";

export default function NotificationToast({ notification }) {
  if (!notification) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "12px 20px",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
        background: notification.type === "error" ? "rgba(220,53,69,0.95)" : "rgba(0,0,0,0.88)",
        color: "#fff",
        fontSize: 14,
        fontWeight: 500,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span className="material-icons-outlined" style={{ fontSize: 20 }}>
        {notification.type === "error" ? "error_outline" : "check_circle"}
      </span>
      {notification.message}
    </div>
  );
}
