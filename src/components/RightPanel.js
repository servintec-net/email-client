import React from "react";
import { getInitials, formatFullDateTime, getAvatarGradient } from "../utils/helper";
import ThreadCard from "./ThreadCard";

const RightPanel = React.memo(function RightPanel({
  previewEmail,
  threadEmails,
  expandedById,
  showHistoryById,
  toggleExpanded,
  toggleHistory,
  loadThread,
  loadingThread,
  onReply,
  mailboxId,
  mailboxEmail,
  authToken,
}) {
  const fromAddr = previewEmail.from?.emailAddress;
  const senderName = fromAddr?.name || "Unknown Sender";
  const senderInitials = getInitials(fromAddr);
  const senderGradient = getAvatarGradient(senderName);

  const surface = {
    background: "rgba(255,255,255,0.85)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 14,
    boxShadow: "0 4px 20px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
    backdropFilter: "blur(12px)",
  };

  const chip = {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 8px",
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(0,0,0,0.04)",
    color: "rgba(0,0,0,0.72)",
    fontSize: 11,
    fontWeight: 600,
    userSelect: "none",
    whiteSpace: "nowrap",
    letterSpacing: "0.01em",
  };

  const actionBtn = {
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.9)",
    color: "rgba(0,0,0,0.82)",
    padding: "8px 14px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    transition: "background 0.15s ease, border-color 0.15s ease, transform 0.1s ease",
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "20px 20px 28px",
        minHeight: 0,
      }}
    >
      {/* Compact header: subject + meta row */}
      <div style={{ ...surface, padding: "14px 16px 12px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: senderGradient,
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              fontSize: 14,
              color: "rgba(0,0,0,0.75)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.4)",
              flexShrink: 0,
            }}
            title={senderName}
          >
            {senderInitials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 600,
                lineHeight: 1.35,
                letterSpacing: "-0.01em",
                color: "rgba(0,0,0,0.9)",
                wordBreak: "break-word",
                marginBottom: 8,
              }}
            >
              {previewEmail.subject || "(No subject)"}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(0,0,0,0.6)",
                  fontWeight: 500,
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={`${senderName} <${fromAddr?.address || ""}>`}
              >
                {senderName}
                {fromAddr?.address && (
                  <span style={{ color: "rgba(0,0,0,0.5)", fontWeight: 400 }}>
                    {" "}
                    &lt;{fromAddr.address}&gt;
                  </span>
                )}
              </span>
              <span style={{ color: "rgba(0,0,0,0.25)", fontSize: 10 }}>•</span>
              <span style={chip}>
                <span className="material-icons" style={{ fontSize: 12, opacity: 0.8 }}>
                  schedule
                </span>
                {formatFullDateTime(previewEmail.receivedDateTime)}
              </span>
              {previewEmail.isRead === false && (
                <span
                  style={{
                    ...chip,
                    borderColor: "rgba(26,115,232,0.25)",
                    background: "rgba(26,115,232,0.08)",
                    color: "#1a73e8",
                  }}
                >
                  <span className="material-icons" style={{ fontSize: 12 }}>
                    mark_email_unread
                  </span>
                  Unread
                </span>
              )}
              {previewEmail.hasAttachments && (
                <span style={chip}>
                  <span className="material-icons" style={{ fontSize: 12, opacity: 0.8 }}>
                    attach_file
                  </span>
                  Attachments
                </span>
              )}
            </div>
          </div>
          <button
            style={{
              ...actionBtn,
              background: "rgba(26,115,232,0.10)",
              borderColor: "rgba(26,115,232,0.25)",
              color: "#1a73e8",
            }}
            onClick={() => onReply?.(previewEmail)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(26,115,232,0.18)";
              e.currentTarget.style.borderColor = "rgba(26,115,232,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(26,115,232,0.10)";
              e.currentTarget.style.borderColor = "rgba(26,115,232,0.25)";
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            title="Reply to this email"
          >
            <span className="material-icons" style={{ fontSize: 14 }}>
              reply
            </span>
            Reply
          </button>
        </div>
      </div>

      {/* Preview card: clearly bounded "snippet" feel */}
      {threadEmails.length === 0 && (
        <div
          style={{
            marginTop: 12,
            ...surface,
            padding: 0,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "10px 14px 8px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.45)",
              }}
            >
              Email preview
            </span>
            <span
              style={{
                fontSize: 11,
                color: "rgba(0,0,0,0.45)",
                fontWeight: 500,
              }}
            >
              Snippet only — open thread for full message
            </span>
          </div>

          <div
            style={{
              fontSize: 13,
              lineHeight: 1.62,
              color: "rgba(0,0,0,0.78)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              height: "clamp(200px, 32vh, 380px)",
              overflow: "auto",
              padding: "14px 16px 80px",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {previewEmail.bodyPreview?.trim() || (
              <span style={{ color: "rgba(0,0,0,0.45)", fontStyle: "italic" }}>
                No preview text for this message.
              </span>
            )}
          </div>

          {/* Fade overlay */}
          <div
            style={{
              pointerEvents: "none",
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 56,
              height: 56,
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.92))",
            }}
          />

          {/* Fixed CTA bar */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "12px 16px",
              background: "rgba(255,255,255,0.95)",
              borderTop: "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "rgba(0,0,0,0.55)",
                fontWeight: 500,
              }}
            >
              View full conversation and reply
            </span>
            <button
              onClick={loadThread}
              disabled={loadingThread}
              style={{
                ...actionBtn,
                opacity: loadingThread ? 0.7 : 1,
                cursor: loadingThread ? "wait" : "pointer",
                background: loadingThread ? "rgba(0,0,0,0.04)" : "rgba(26,115,232,0.12)",
                borderColor: "rgba(26,115,232,0.25)",
                color: "#1a73e8",
              }}
              onMouseEnter={(e) => {
                if (!loadingThread) {
                  e.currentTarget.style.background = "rgba(26,115,232,0.18)";
                  e.currentTarget.style.borderColor = "rgba(26,115,232,0.35)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(26,115,232,0.12)";
                e.currentTarget.style.borderColor = "rgba(26,115,232,0.25)";
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span className="material-icons" style={{ fontSize: 18 }}>
                forum
              </span>
              {loadingThread ? "Loading…" : "Open thread"}
            </button>
          </div>
        </div>
      )}

      {threadEmails.length > 0 && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          {threadEmails.map((msg) => (
            <ThreadCard
              key={msg.id}
              msg={msg}
              isExpanded={!!expandedById[msg.id]}
              showHistory={!!showHistoryById[msg.id]}
              onToggleExpand={toggleExpanded}
              onToggleHistory={toggleHistory}
              mailboxId={mailboxId}
              mailboxEmail={mailboxEmail}
              authToken={authToken}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default RightPanel;
