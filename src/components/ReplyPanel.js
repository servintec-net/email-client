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
    const toTrim = to.trim();
    if (!toTrim) {
      setError("Recipient (To) is required.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(
        `${API_BASE}/me/send-mail?mailboxId=${mailboxId}`,
        {
          method: "POST",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ to: toTrim, subject: subject.trim(), body: body.trim() }),
        }
      );
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
    padding: "12px 14px",
    fontSize: 14,
    lineHeight: 1.4,
    border: focusedId === id
      ? "1px solid #1a73e8"
      : "1px solid rgba(0,0,0,0.14)",
    borderRadius: 12,
    background: focusedId === id ? "#fff" : "rgba(0,0,0,0.02)",
    color: "rgba(0,0,0,0.9)",
    outline: "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
    boxShadow: focusedId === id ? "0 0 0 3px rgba(26,115,232,0.15)" : "none",
  });

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 0,
        background: "#fff",
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px 20px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          background: "linear-gradient(180deg, rgba(26,115,232,0.04) 0%, rgba(0,0,0,0.02) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 700,
              color: "rgba(0,0,0,0.9)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              className="material-icons"
              style={{ fontSize: 20, color: "#1a73e8" }}
            >
              reply
            </span>
            Reply
          </h2>
          <p
            style={{
              margin: "4px 0 0 0",
              fontSize: 13,
              color: "rgba(0,0,0,0.55)",
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
                color: "rgba(0,0,0,0.45)",
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
            e.currentTarget.style.color = "rgba(0,0,0,0.8)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(0,0,0,0.5)";
          }}
        >
          <span className="material-icons" style={{ fontSize: 22 }}>close</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        {/* Fields */}
        <div style={{ padding: "20px 20px 16px", flex: 1, minHeight: 0 }}>
          <div style={{ marginBottom: 18 }}>
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
          <div style={{ marginBottom: 18 }}>
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
                minHeight: 220,
                resize: "vertical",
                fontFamily: "inherit",
                padding: "14px 14px",
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
            padding: "16px 20px 20px",
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
              padding: "10px 18px",
              fontSize: 14,
              fontWeight: 600,
              border: "1px solid rgba(0,0,0,0.12)",
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
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={sending}
            style={{
              padding: "10px 22px",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              borderRadius: 10,
              background: sending ? "rgba(26,115,232,0.6)" : "#1a73e8",
              color: "#fff",
              cursor: sending ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: sending ? "none" : "0 2px 8px rgba(26,115,232,0.35)",
            }}
            onMouseEnter={(e) => {
              if (!sending) {
                e.currentTarget.style.background = "#1557b0";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(26,115,232,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = sending ? "rgba(26,115,232,0.6)" : "#1a73e8";
              e.currentTarget.style.boxShadow = sending ? "none" : "0 2px 8px rgba(26,115,232,0.35)";
            }}
          >
            {sending ? (
              <>
                <span
                  className="material-icons"
                  style={{ fontSize: 18, animation: "spin 1s linear infinite" }}
                >
                  hourglass_empty
                </span>
                Sending…
              </>
            ) : (
              <>
                <span className="material-icons" style={{ fontSize: 18 }}>send</span>
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
