import React, { useState, useEffect, useRef } from "react";
import { API_BASE } from "../utils/constants";
import { getAuthHeaders } from "../utils/auth";

const ReplyPanel = ({ replyToEmail, mailboxId, onClose, onSent }) => {
  const fromAddr = replyToEmail?.from?.emailAddress;
  const senderName = fromAddr?.name || fromAddr?.address || "Unknown";
  const defaultTo = fromAddr?.address || "";
  const defaultSubject = replyToEmail?.subject
    ? (replyToEmail.subject.startsWith("Re:") ? replyToEmail.subject : `Re: ${replyToEmail.subject}`)
    : "Re:";

  const [to, setTo] = useState(defaultTo);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [focusedId, setFocusedId] = useState(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    setTo(defaultTo);
    setSubject(defaultSubject);
    setBody("");
    setError("");
  }, [replyToEmail?.id, defaultTo, defaultSubject]);

  useEffect(() => {
    const t = setTimeout(() => bodyRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [replyToEmail?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const bodyTrim = body.trim();
    const messageId = replyToEmail?.id;
    // In-thread reply: use message reply API (keeps same conversation). Otherwise fallback to send-mail.
    const useReplyApi = messageId && replyToEmail?.conversationId;
    setSending(true);
    try {
      const url = useReplyApi
        ? `${API_BASE}/me/messages/${encodeURIComponent(messageId)}/reply?mailboxId=${mailboxId}`
        : `${API_BASE}/me/send-mail?mailboxId=${mailboxId}`;
      const payload = useReplyApi
        ? { comment: bodyTrim || " " }
        : { to: (to || "").trim(), subject: subject.trim(), body: bodyTrim };
      if (!useReplyApi && !payload.to) {
        setError("Recipient (To) is required.");
        setSending(false);
        return;
      }
      const res = await fetch(url, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message =
          data.code === "SendPermissionRequired"
            ? data.error
            : (data.error || "Failed to send email.");
        setError(message);
        return;
      }
      onSent?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  const fieldLabel = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.5)",
    marginBottom: 8,
  };

  const getInputStyle = (id) => ({
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    minWidth: 0,
    padding: "10px 12px",
    fontSize: 14,
    lineHeight: 1.45,
    border: focusedId === id
      ? "1px solid #0b5fff"
      : "1px solid rgba(0,0,0,0.12)",
    borderRadius: 10,
    background: focusedId === id ? "#fff" : "rgba(0,0,0,0.02)",
    color: "rgba(0,0,0,0.9)",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxShadow: focusedId === id ? "0 0 0 2px rgba(11,95,255,0.2)" : "none",
  });

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 560,
        margin: "0 auto",
        padding: 0,
        background: "#fff",
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.04)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          background: "rgba(11,95,255,0.04)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "rgba(0,0,0,0.9)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span className="material-icons-outlined" style={{ fontSize: 20, color: "#0b5fff" }}>
              reply
            </span>
            Reply
          </h2>
          <p
            style={{
              margin: "6px 0 0 0",
              fontSize: 13,
              color: "rgba(0,0,0,0.6)",
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Replying to {senderName}
          </p>
          {defaultSubject && defaultSubject !== "Re:" && (
            <p
              style={{
                margin: "2px 0 0 0",
                fontSize: 12,
                color: "rgba(0,0,0,0.5)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {defaultSubject}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            background: "transparent",
            borderRadius: 10,
            cursor: "pointer",
            color: "rgba(0,0,0,0.5)",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0,0,0,0.06)";
            e.currentTarget.style.color = "rgba(0,0,0,0.85)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(0,0,0,0.5)";
          }}
        >
          <span className="material-icons-outlined" style={{ fontSize: 20 }}>close</span>
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.ctrlKey && e.key === "Enter") {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, minWidth: 0 }}
      >
        {/* Fields — constrain width so TO/SUBJECT/MESSAGE don't break layout */}
        <div style={{ padding: "20px 20px 16px", flex: 1, minHeight: 0, minWidth: 0, boxSizing: "border-box" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={fieldLabel} htmlFor="reply-to">To</label>
            <input
              id="reply-to"
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => setFocusedId("reply-to")}
              onBlur={() => setFocusedId(null)}
              placeholder="recipient@example.com"
              style={getInputStyle("reply-to")}
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={fieldLabel} htmlFor="reply-subject">Subject</label>
            <input
              id="reply-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onFocus={() => setFocusedId("reply-subject")}
              onBlur={() => setFocusedId(null)}
              placeholder="Subject"
              style={getInputStyle("reply-subject")}
            />
          </div>
          <div style={{ marginBottom: 0 }}>
            <label style={fieldLabel} htmlFor="reply-body">Message</label>
            <textarea
              ref={bodyRef}
              id="reply-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onFocus={() => setFocusedId("reply-body")}
              onBlur={() => setFocusedId(null)}
              placeholder="Write your reply…"
              rows={10}
              style={{
                ...getInputStyle("reply-body"),
                minHeight: 200,
                resize: "vertical",
                fontFamily: "inherit",
                padding: "12px 14px",
              }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              margin: "0 20px 16px",
              padding: "12px 14px",
              background: "rgba(220,53,69,0.06)",
              border: "1px solid rgba(220,53,69,0.2)",
              borderRadius: 12,
              fontSize: 13,
              color: "#b52b3b",
              lineHeight: 1.5,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <span className="material-icons" style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>
              error_outline
            </span>
            <div>
              {error}
              {error.includes("Disconnect and reconnect") && (
                <div style={{ marginTop: 6, fontSize: 12, color: "rgba(0,0,0,0.65)" }}>
                  Top bar → Manage Mailboxes → disconnect this mailbox, then connect again.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            padding: "14px 20px 18px",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            background: "rgba(0,0,0,0.02)",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 10,
              background: "#fff",
              color: "rgba(0,0,0,0.75)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.04)";
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={sending}
            style={{
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              borderRadius: 10,
              background: sending ? "rgba(11,95,255,0.5)" : "#0b5fff",
              color: "#fff",
              cursor: sending ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              boxShadow: sending ? "none" : "0 2px 8px rgba(11,95,255,0.3)",
            }}
            onMouseEnter={(e) => {
              if (!sending) {
                e.currentTarget.style.background = "#0949c4";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(11,95,255,0.35)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = sending ? "rgba(11,95,255,0.5)" : "#0b5fff";
              e.currentTarget.style.boxShadow = sending ? "none" : "0 2px 8px rgba(11,95,255,0.3)";
            }}
          >
            {sending ? (
              <>
                <span className="material-icons-outlined" style={{ fontSize: 16, animation: "spin 1s linear infinite" }}>
                  hourglass_empty
                </span>
                Sending…
              </>
            ) : (
              <>
                <span className="material-icons-outlined" style={{ fontSize: 16 }}>send</span>
                Send
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReplyPanel;
