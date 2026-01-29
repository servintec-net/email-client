import React, { useMemo } from "react";
import {
  getInitials,
  getSenderLabel,
  formatFullDateTime,
  trimQuotedHtml,
  getAvatarGradient,
} from "../utils/helper";
import AttachmentTile from "./AttachmentTile";

const ThreadCard = React.memo(function ThreadCard({
  msg,
  isExpanded,
  showHistory,
  onToggleExpand,
  onToggleHistory,
  mailboxEmail,
  mailboxId,
  authToken,
}) {
  const senderLabelRaw = getSenderLabel(msg, mailboxEmail);

  const fromObj = msg.from?.emailAddress;
  const fromAddress = (fromObj?.address || "").toLowerCase();
  const meAddress = (mailboxEmail || "").toLowerCase();
  const isMe = !!fromAddress && !!meAddress && fromAddress === meAddress;

  const senderLabel = isMe ? "You" : senderLabelRaw;
  const avatarInitials = isMe
    ? getInitials(fromObj)
    : (senderLabelRaw || "?")
      .split(" ")
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("");

  const isHtml = msg.body?.contentType === "html";
  const fullContent = msg.body?.content || "";
  const gradientBase = isMe ? (fromObj?.name || fromObj?.address || "You") : senderLabelRaw;
  const gradient = getAvatarGradient(gradientBase);

  const { trimmedContent, hasHistory } = useMemo(() => {
    if (!isExpanded) return { trimmedContent: "", hasHistory: false };
    if (!isHtml) return { trimmedContent: fullContent, hasHistory: false };
    const trimmed = trimQuotedHtml(fullContent);
    return { trimmedContent: trimmed, hasHistory: trimmed !== fullContent };
  }, [isExpanded, isHtml, fullContent]);

  const surface = {
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 14,
    background: "#fff",
    boxShadow: isExpanded ? "0 10px 28px rgba(0,0,0,0.08)" : "0 2px 10px rgba(0,0,0,0.04)",
    transition: "box-shadow 180ms ease, transform 180ms ease, border-color 180ms ease",
    transform: isExpanded ? "translateY(-1px)" : "translateY(0)",
    overflow: "hidden",
  };

  const header = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    cursor: "pointer",
    userSelect: "none",
    backgroundImage: `linear-gradient(rgba(255,255,255,${isExpanded ? 0.72 : 0.82}), rgba(255,255,255,${isExpanded ? 0.72 : 0.82
      })), ${gradient}`,
    backgroundColor: "#fff",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    borderBottom: isExpanded ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(0,0,0,0.04)",
  };

  const chevron = {
    width: 26,
    height: 26,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: isExpanded ? "rgba(11,95,255,0.12)" : "rgba(0,0,0,0.04)",
    color: "rgba(0,0,0,0.65)",
    flexShrink: 0,
    transition: "transform 200ms ease",
    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
  };

  return (
    <div style={surface}>
      <div style={header} onClick={() => onToggleExpand(msg.id)}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            background: gradient,
            color: "#fff",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            letterSpacing: 0.2,
          }}
        >
          {avatarInitials || "?"}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, width: "100%", minWidth: 0 }}>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 700,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {senderLabel}
            </div>
            <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", whiteSpace: "nowrap", flexShrink: 0 }}>
              {formatFullDateTime(msg.receivedDateTime)}
            </div>
          </div>

          <div
            style={{
              marginTop: 3,
              fontSize: 13,
              color: "rgba(0,0,0,0.72)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {msg.bodyPreview}
          </div>
        </div>

        <div style={chevron} aria-hidden>
          ▾
        </div>
      </div>

      <div style={{ maxHeight: isExpanded ? 2000 : 0, overflow: "hidden" }}>
        <div style={{ padding: "12px 14px 14px 14px" }} onClick={(e) => e.stopPropagation()}>
          {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
              {msg.attachments.map((att) => (
                <AttachmentTile key={att.id} att={att} msgId={msg.id} mailboxId={mailboxId} authToken={authToken} />
              ))}
            </div>
          )}

          {isHtml ? (
            <div
              style={{ fontSize: 14, lineHeight: 1.55 }}
              dangerouslySetInnerHTML={{ __html: showHistory ? fullContent : trimmedContent }}
            />
          ) : (
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.55 }}>
              {showHistory ? fullContent : trimmedContent}
            </pre>
          )}

          {hasHistory && (
            <button
              type="button"
              aria-label="Toggle quoted text"
              aria-pressed={showHistory}
              onClick={(e) => {
                e.stopPropagation();
                onToggleHistory(msg.id);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 16,
                minWidth: 34,
                padding: "0px 6px 6px 6px",
                borderRadius: 10,
                background: "rgba(250,249,248,1)",
                border: "1px solid rgba(225,223,221,1)",
                color: "rgba(54, 54, 54, 1)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1,
                cursor: "pointer",
                userSelect: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(243,242,241,1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(250,249,248,1)")}
              onMouseDown={(e) => (e.currentTarget.style.background = "rgba(237,235,233,1)")}
              onMouseUp={(e) => (e.currentTarget.style.background = "rgba(243,242,241,1)")}
            >
              …
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default ThreadCard;
