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
  mailboxId,
  mailboxEmail,
  authToken,
}) {
  const fromAddr = previewEmail.from?.emailAddress;
  const senderName = fromAddr?.name || "Unknown Sender";
  const senderInitials = getInitials(fromAddr);
  const senderGradient = getAvatarGradient(senderName);

  const surface = {
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 18,
    boxShadow: "0 10px 28px rgba(0,0,0,0.07)",
    backdropFilter: "blur(10px)",
  };

  const chip = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.20)",
    background: "rgba(255,255,255,0.65)",
    color: "rgba(0,0,0,0.80)",
    fontSize: 12,
    fontWeight: 700,
    userSelect: "none",
    whiteSpace: "nowrap",
  };

  const actionBtn = {
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.70)",
    color: "rgba(0,0,0,0.80)",
    padding: "6px 10px",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 12,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  };

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "16px 16px 22px" }}>
      <div style={{ ...surface, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: -0.2,
                color: "rgba(0,0,0,0.88)",
                marginBottom: 10,
                wordBreak: "break-word",
              }}
            >
              {previewEmail.subject || "(No subject)"}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={chip}>
                <span className="material-icons" style={{ fontSize: 13, opacity: 0.7 }}>
                  schedule
                </span>
                {formatFullDateTime(previewEmail.receivedDateTime)}
              </span>

              {previewEmail.isRead === false && (
                <span
                  style={{
                    ...chip,
                    borderColor: "rgba(11,95,255,0.20)",
                    background: "rgba(11,95,255,0.08)",
                    color: "#0b5fff",
                  }}
                >
                  <span className="material-icons" style={{ fontSize: 14 }}>
                    mark_email_unread
                  </span>
                  Unread
                </span>
              )}
              {previewEmail.hasAttachments && (
                <span style={chip}>
                  <span className="material-icons" style={{ fontSize: 15, opacity: 0.7 }}>
                    attach_file
                  </span>
                  Attachments
                </span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                background: senderGradient,
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: 18,
                color: "rgba(0,0,0,0.80)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)",
                flexShrink: 0,
              }}
              title={senderName}
            >
              {senderInitials}
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: "rgba(0,0,0,0.08)", margin: "14px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12.5, color: "rgba(0,0,0,0.7)", fontWeight: 600 }}>From</div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "rgba(0,0,0,0.76)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 700,
              }}
              title={`${senderName} <${fromAddr?.address || ""}>`}
            >
              {senderName}{" "}
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(0,0,0,0.70)" }}>
                &lt;{fromAddr?.address}&gt;
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={actionBtn}
              onClick={() => navigator.clipboard?.writeText(fromAddr?.address)}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              title="Copy Email Address"
            >
              <span className="material-icons" style={{ fontSize: 14, opacity: 0.85 }}>
                content_copy
              </span>
              Copy
            </button>
          </div>
        </div>
      </div>

      {threadEmails.length === 0 && (
        <div style={{ marginTop: 12, ...surface, padding: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 12.5, fontWeight: 900, color: "rgba(0,0,0,0.75)" }}>Preview</div>
            <div style={{ fontSize: 12, color: "rgba(0,0,0,0.50)", fontWeight: 700 }}>Showing Email Preview...</div>
          </div>

          <div
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: "rgba(0,0,0,0.78)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              height: "clamp(300px, 40vh, 500px)",
              overflow: "auto",
              paddingBottom: "clamp(42px, 6vh, 52px)",
            }}
          >
            {previewEmail.bodyPreview || "—"}
          </div>

          <div
            style={{
              pointerEvents: "none",
              position: "absolute",
              left: 16,
              right: 16,
              bottom: 44,
              height: 70,
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.88), rgba(255,255,255,1))",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              bottom: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.70)" }}>
              Open thread to see the full conversation ↓
            </div>

            <button
              onClick={loadThread}
              disabled={loadingThread}
              style={{ ...actionBtn, opacity: loadingThread ? 0.6 : 1, cursor: loadingThread ? "default" : "pointer" }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span className="material-icons" style={{ fontSize: 18, opacity: 0.85 }}>
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
