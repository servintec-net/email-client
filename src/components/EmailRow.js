import React, { useState, useEffect, useCallback } from "react";
import { getInitials, getTimeLabel, getAvatarGradient } from "../utils/helper";
import { API_BASE } from "../utils/constants";
import { getAuthHeaders } from "../utils/auth";

const EmailRow = React.memo(function EmailRow({
  msg,
  isSelected,
  isHovered,
  onSelect,
  authToken,
  selectedMailboxId,
  onEmailAction,
}) {
  const unread = !msg.isRead;
  const sender = msg.from?.emailAddress;
  const senderName = sender?.name || "Unknown Sender";
  const initials = getInitials(sender);
  const dateLabel = getTimeLabel(msg.receivedDateTime);
  const gradient = getAvatarGradient(senderName);
  const categories = Array.isArray(msg.categories) ? msg.categories.filter(Boolean) : [];
  const formatCategory = (cat) => {
    if (cat === "JobBoard: Other Job Board") return "Other";
    return cat;
  };

  const cardBg = isSelected
    ? "rgba(11,95,255,0.09)"
    : isHovered
      ? "rgba(0,0,0,0.03)"
      : unread
        ? "rgba(3, 76, 211, 0.02)"
        : "#fff";

  const borderColor = isSelected
    ? "rgba(11,95,255,0.30)"
    : unread
      ? "rgba(11,95,255,0.18)"
      : "rgba(0,0,0,0.06)";

  // Context menu state
  const [menu, setMenu] = useState(null);

  const closeMenu = useCallback(() => setMenu(null), []);

  useEffect(() => {
    if (!menu) return;
    const onDown = () => closeMenu();
    const onEsc = (e) => e.key === "Escape" && closeMenu();
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [menu, closeMenu]);

  const openMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu({
      x: e.clientX,
      y: e.clientY,
    });
  }, []);

  const handleAction = useCallback(async (action) => {
    closeMenu();
    if (onEmailAction) {
      await onEmailAction(msg.id, action);
    }
  }, [msg.id, onEmailAction, closeMenu]);

  return (
    <div 
      onClick={() => onSelect(msg.id)} 
      onContextMenu={openMenu}
      style={{ padding: "2px 3px", cursor: "pointer", position: "relative" }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: "6px 8px",
          borderRadius: 4,
          border: `1px solid ${borderColor}`,
          background: cardBg,
          transition: "background 120ms ease, border-color 120ms ease",
          position: "relative",
        }}
      >
        {unread && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 6,
              bottom: 6,
              width: 4,
              borderRadius: 999,
              background: "#0b5fff",
            }}
          />
        )}

        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(0,0,0,0.65)",
            fontWeight: 800,
            fontSize: 12,
            flexShrink: 0,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)",
          }}
        >
          {initials}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: unread ? 850 : 500,
                color: unread ? "rgba(0,0,0,0.90)" : "rgba(0,0,0,0.78)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {senderName}
            </div>

            <div
              style={{
                fontSize: 11,
                color: "rgba(0,0,0,0.55)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {dateLabel}
            </div>
          </div>

          <div
            style={{
              marginTop: 1,
              fontSize: 12,
              fontWeight: unread ? 700 : 550,
              color: "rgba(0,0,0,0.78)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {msg.subject || "(No subject)"}
          </div>

          <div
            style={{
              marginTop: 1,
              fontSize: 11.5,
              color: unread ? "rgba(0,0,0,0.66)" : "rgba(0,0,0,0.52)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {(msg.bodyPreview || "").trim()}
          </div>

          {categories.length > 0 && (
            <div
              style={{
                marginTop: 6,
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
              }}
            >
              {categories.map((cat) => (
                <span
                  key={cat}
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "rgba(11,95,255,0.9)",
                    background: "rgba(11,95,255,0.10)",
                    padding: "2px 6px",
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                    maxWidth: 140,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={formatCategory(cat)}
                >
                  {formatCategory(cat)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Context menu */}
      {menu && (
        <div
          style={{
            position: "fixed",
            left: menu.x,
            top: menu.y,
            zIndex: 9999,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            padding: 6,
            minWidth: 200,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleAction("reply")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 12.5,
              fontWeight: 650,
              color: "rgba(0,0,0,0.85)",
              transition: "background 120ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            title="Reply"
          >
            <span className="material-icons-outlined" style={{ fontSize: 18, opacity: 0.85 }}>
              reply
            </span>
            Reply
          </button>

          <div
            style={{
              height: 1,
              background: "rgba(0,0,0,0.08)",
              margin: "4px 0",
            }}
          />

          <button
            onClick={() => handleAction("markRead")}
            disabled={msg.isRead}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: msg.isRead ? "not-allowed" : "pointer",
              fontSize: 12.5,
              fontWeight: 650,
              color: msg.isRead ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.85)",
              transition: "background 120ms ease",
              opacity: msg.isRead ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!msg.isRead) {
                e.currentTarget.style.background = "rgba(0,0,0,0.05)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            title="Mark as read"
          >
            <span className="material-icons-outlined" style={{ fontSize: 18, opacity: 0.85 }}>
              mark_email_read
            </span>
            Mark as read
          </button>

          <button
            onClick={() => handleAction("markUnread")}
            disabled={!msg.isRead}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: !msg.isRead ? "not-allowed" : "pointer",
              fontSize: 12.5,
              fontWeight: 650,
              color: !msg.isRead ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.85)",
              transition: "background 120ms ease",
              opacity: !msg.isRead ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (msg.isRead) {
                e.currentTarget.style.background = "rgba(0,0,0,0.05)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            title="Mark as unread"
          >
            <span className="material-icons-outlined" style={{ fontSize: 18, opacity: 0.85 }}>
              mark_email_unread
            </span>
            Mark as unread
          </button>

          <div
            style={{
              height: 1,
              background: "rgba(0,0,0,0.08)",
              margin: "4px 0",
            }}
          />

          <button
            onClick={() => handleAction("moveToInbox")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 12.5,
              fontWeight: 650,
              color: "rgba(0,0,0,0.85)",
              transition: "background 120ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            title="Move to Inbox"
          >
            <span className="material-icons-outlined" style={{ fontSize: 18, opacity: 0.85 }}>
              inbox
            </span>
            Move to Inbox
          </button>

          <div
            style={{
              height: 1,
              background: "rgba(0,0,0,0.08)",
              margin: "4px 0",
            }}
          />

          <button
            onClick={() => handleAction("delete")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 12.5,
              fontWeight: 650,
              color: "rgba(226,33,15,0.90)",
              transition: "background 120ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(226,33,15,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            title="Delete"
          >
            <span className="material-icons-outlined" style={{ fontSize: 18, opacity: 0.85 }}>
              delete
            </span>
            Delete
          </button>
        </div>
      )}
    </div>
  );
});

export default EmailRow;
