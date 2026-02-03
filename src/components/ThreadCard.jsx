import React, { useMemo } from "react";
import {
  getInitials,
  getSenderLabel,
  formatFullDateTime,
  getQuotedHtmlParts,
  getQuotedTextParts,
  trimQuotedText,
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
  onReply,
}) {
  const senderLabelRaw = getSenderLabel(msg, mailboxEmail);

  const fromObj = msg.from?.emailAddress;
  const fromAddress = (fromObj?.address || "").toLowerCase();
  const meAddress = (mailboxEmail || "").toLowerCase();
  const isMe = !!fromAddress && !!meAddress && fromAddress === meAddress;
  const isDraft = msg.isDraft === true;

  const senderLabel = isDraft ? "Draft" : (isMe ? `You (${fromObj?.name || fromObj?.address || "Me"})` : senderLabelRaw);
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

  const { mainContent, historyContent, hasHistory } = useMemo(() => {
    if (!isExpanded) return { mainContent: "", historyContent: "", hasHistory: false };
    if (isHtml) {
      const { main, history } = getQuotedHtmlParts(fullContent);
      return { mainContent: main, historyContent: history, hasHistory: history.length > 0 };
    }
    const { main, history } = getQuotedTextParts(fullContent);
    return { mainContent: main, historyContent: history, hasHistory: history.length > 0 };
  }, [isExpanded, isHtml, fullContent]);

  const headerPreview = useMemo(() => trimQuotedText(msg.bodyPreview || ""), [msg.bodyPreview]);

  const surface = {
    border: isDraft
      ? "1px solid rgba(245, 158, 11, 0.35)"
      : "1px solid rgba(0,0,0,0.06)",
    borderRadius: 16,
    background: isDraft ? "rgba(255, 251, 235, 0.6)" : "#fff",
    boxShadow: isExpanded
      ? (isDraft ? "0 12px 32px rgba(245,158,11,0.08)" : "0 12px 32px rgba(0,0,0,0.06)")
      : "0 2px 8px rgba(0,0,0,0.04)",
    transition: "box-shadow 200ms ease, transform 200ms ease, border-color 200ms ease, background 200ms ease",
    transform: isExpanded ? "translateY(-2px)" : "translateY(0)",
    overflow: "hidden",
  };

  const header = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    cursor: "pointer",
    userSelect: "none",
    backgroundImage: isDraft
      ? "linear-gradient(135deg, rgba(255,251,235,0.95) 0%, rgba(254,243,199,0.9) 100%)"
      : `linear-gradient(rgba(255,255,255,${isExpanded ? 0.82 : 0.94}), rgba(255,255,255,${isExpanded ? 0.82 : 0.94})), ${gradient}`,
    backgroundColor: "transparent",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    borderBottom: isDraft ? "1px solid rgba(245,158,11,0.15)" : "1px solid rgba(0,0,0,0.06)",
    transition: "background-image 0.2s ease, background-color 0.2s ease",
  };

  const chevron = {
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: "rgba(0,0,0,0.45)",
    flexShrink: 0,
    transition: "transform 0.2s ease, color 0.2s ease",
    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
  };

  return (
    <div style={surface}>
      <div style={header} onClick={() => onToggleExpand(msg.id)}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: isDraft ? "linear-gradient(135deg, rgba(245,158,11,0.5), rgba(217,119,6,0.6))" : gradient,
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            letterSpacing: "0.02em",
            boxShadow: isDraft ? "0 1px 2px rgba(245,158,11,0.2)" : "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          {isDraft ? (
            <span className="material-icons-outlined" style={{ fontSize: 18 }}>edit_note</span>
          ) : (
            avatarInitials || "?"
          )}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap", minWidth: 0 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: isDraft ? "rgba(120,53,15,0.95)" : "rgba(0,0,0,0.9)",
              }}
            >
              {senderLabel}
            </span>
            <span style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", flexShrink: 0 }}>
              {msg.receivedDateTime ? formatFullDateTime(msg.receivedDateTime) : "Not sent"}
            </span>
            {isDraft && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "rgba(245,158,11,0.9)",
                  background: "rgba(245,158,11,0.12)",
                  padding: "2px 6px",
                  borderRadius: 4,
                  flexShrink: 0,
                }}
              >
                Draft
              </span>
            )}
          </div>
          <div
            style={{
              marginTop: 2,
              fontSize: 12,
              color: isDraft ? "rgba(120,53,15,0.65)" : "rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.4,
            }}
          >
            {headerPreview || (isDraft ? "No preview" : "")}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          {!isMe && onReply && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReply(msg);
              }}
              title="Reply"
              aria-label="Reply"
              style={{
                width: 32,
                height: 32,
                padding: 0,
                borderRadius: "50%",
                border: "none",
                background: "transparent",
                color: "rgba(0,0,0,0.45)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.stopPropagation();
                e.currentTarget.style.background = "rgba(26,115,232,0.1)";
                e.currentTarget.style.color = "#1a73e8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(0,0,0,0.45)";
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
            >
              <span className="material-icons-outlined" style={{ fontSize: 18 }}>reply</span>
            </button>
          )}
          <div style={chevron} aria-hidden>
            <span className="material-icons-outlined" style={{ fontSize: 20 }}>expand_more</span>
          </div>
        </div>
      </div>

      <div style={{ maxHeight: isExpanded ? 2000 : 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 18px 18px" }} onClick={(e) => e.stopPropagation()}>
          {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
              {msg.attachments.map((att) => (
                <AttachmentTile key={att.id} att={att} msgId={msg.id} mailboxId={mailboxId} authToken={authToken} />
              ))}
            </div>
          )}

          {/* Main content only (no history) — force dark text so sender inline colors don't mix black/white */}
          {isHtml ? (
            <div
              className="thread-email-body"
              style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(0,0,0,0.9)" }}
              dangerouslySetInnerHTML={{ __html: mainContent }}
            />
          ) : (
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.55, color: "rgba(0,0,0,0.9)" }}>
              {mainContent}
            </pre>
          )}

          {/* Button row: "…" (toggle history) and Reply — stays right after main content */}
          {((!isMe && onReply) || hasHistory) && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                      minWidth: 22,
                      padding: 0,
                      borderRadius: 4,
                      background: "rgba(0,0,0,0.05)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      color: "rgba(0,0,0,0.65)",
                      fontSize: 10,
                      fontWeight: 600,
                      lineHeight: 1,
                      letterSpacing: 0.2,
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.05)")}
                  >
                    …
                  </button>
                )}
              </div>
              {!isMe && onReply && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReply(msg);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(26,115,232,0.25)",
                    background: "rgba(26,115,232,0.12)",
                    color: "#1a73e8",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background 0.15s ease, border-color 0.15s ease, transform 0.1s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(26,115,232,0.18)";
                    e.currentTarget.style.borderColor = "rgba(26,115,232,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(26,115,232,0.12)";
                    e.currentTarget.style.borderColor = "rgba(26,115,232,0.25)";
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <span className="material-icons-outlined" style={{ fontSize: 14 }}>reply</span>
                  Reply
                </button>
              )}
            </div>
          )}

          {/* History portion — only after the button, when expanded */}
          {hasHistory && showHistory && historyContent && (
            <>
              {isHtml ? (
                <div
                  className="thread-email-body"
                  style={{
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: "1px solid rgba(0,0,0,0.08)",
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "rgba(0,0,0,0.9)",
                  }}
                  dangerouslySetInnerHTML={{ __html: historyContent }}
                />
              ) : (
                <pre
                  style={{
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: "1px solid rgba(0,0,0,0.08)",
                    whiteSpace: "pre-wrap",
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "rgba(0,0,0,0.7)",
                  }}
                >
                  {historyContent}
                </pre>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default ThreadCard;
