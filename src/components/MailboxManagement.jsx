import React, { useState, useEffect } from "react";
import { API_BASE } from "../utils/constants";
import { getAuthHeadersWithToken } from "../utils/auth";
import { getMailboxDisplayLabel } from "../utils/helper";

const MailboxManagement = ({
  mailboxes,
  mailboxesTotal,
  mailboxesHasMore,
  mailboxesLoadingMore,
  onLoadMore,
  authToken,
  onRefresh,
  onBack,
  onConnectNew,
  mailboxDisplayNamesCache,
}) => {
  const [disconnecting, setDisconnecting] = useState(null);
  const [error, setError] = useState("");
  const [confirmDisconnectMailbox, setConfirmDisconnectMailbox] = useState(null);

  useEffect(() => {
    if (!confirmDisconnectMailbox) return;
    const onKeyDown = (e) => e.key === "Escape" && setConfirmDisconnectMailbox(null);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirmDisconnectMailbox]);

  const handleDisconnectClick = (mailbox) => {
    setConfirmDisconnectMailbox(mailbox);
  };

  const handleDisconnect = async (mailboxId) => {
    setConfirmDisconnectMailbox(null);
    setDisconnecting(mailboxId);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/me/mailboxes/${mailboxId}`, {
        method: "DELETE",
        headers: getAuthHeadersWithToken(authToken),
      });

      if (res.ok) {
        // Refresh mailboxes list
        await onRefresh();
      } else {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setError(data.error || `Failed to disconnect mailbox (${res.status})`);
        } else {
          const text = await res.text();
          if (res.status === 404) {
            setError("Endpoint not found. Please restart the server to apply the latest changes.");
          } else {
            setError(`Failed to disconnect mailbox (${res.status}): ${text.substring(0, 100)}`);
          }
        }
      }
    } catch (e) {
      console.error("Error disconnecting mailbox:", e);
      setError(`Failed to disconnect mailbox: ${e.message}. Please ensure the server is running and has been restarted.`);
    } finally {
      setDisconnecting(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes mailbox-mgmt-bg-glow {
            0%, 100% { background: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%); }
            33% { background: radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%); }
            66% { background: radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%); }
          }
          .mailbox-mgmt-bg-glow {
            animation: mailbox-mgmt-bg-glow 15s ease-in-out infinite;
          }
        `}
      </style>

      {/* Disconnect confirmation modal */}
      {confirmDisconnectMailbox && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 24,
          }}
          onClick={() => setConfirmDisconnectMailbox(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="disconnect-modal-title"
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
              maxWidth: 400,
              width: "100%",
              padding: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
              <span
                className="material-icons-outlined"
                style={{ fontSize: 28, color: "#dc3545", flexShrink: 0 }}
              >
                link_off
              </span>
              <div>
                <h2 id="disconnect-modal-title" style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 700, color: "rgba(0,0,0,0.9)" }}>
                  Disconnect mailbox?
                </h2>
                <p style={{ margin: 0, fontSize: 14, color: "rgba(0,0,0,0.65)", lineHeight: 1.5 }}>
                  Are you sure you want to disconnect <strong>{getMailboxDisplayLabel(confirmDisconnectMailbox, mailboxDisplayNamesCache)}</strong>? This action cannot be undone.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setConfirmDisconnectMailbox(null)}
                style={{
                  padding: "10px 18px",
                  fontSize: 14,
                  fontWeight: 600,
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 10,
                  background: "#fff",
                  color: "rgba(0,0,0,0.8)",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDisconnect(confirmDisconnectMailbox.id)}
                style={{
                  padding: "10px 18px",
                  fontSize: 14,
                  fontWeight: 600,
                  border: "none",
                  borderRadius: 10,
                  background: "#dc3545",
                  color: "#fff",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span className="material-icons-outlined" style={{ fontSize: 18 }}>link_off</span>
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black"
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
      <div className="mailbox-mgmt-bg-glow absolute inset-0 opacity-20 pointer-events-none" aria-hidden />
      {/* Header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={onBack}
            style={{
              padding: "8px",
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
            <span className="material-icons-outlined" style={{ fontSize: 24, color: "rgba(0,0,0,0.7)" }}>
              arrow_back
            </span>
          </button>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "rgba(0,0,0,0.9)" }}>Manage Mailboxes</h1>
        </div>
        <button
          onClick={onConnectNew}
          style={{
            padding: "10px 20px",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 10,
            background: "#0b5fff",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span className="material-icons-outlined" style={{ fontSize: 18 }}>
            add
          </span>
          Add Mailbox
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
        {error && (
          <div
            style={{
              padding: "12px 16px",
              background: "#fee",
              border: "1px solid #fcc",
              borderRadius: 8,
              color: "#c33",
              marginBottom: 16,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {mailboxes.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "rgba(255,255,255,0.95)",
            }}
          >
            <span className="material-icons-outlined" style={{ fontSize: 64, color: "rgba(255,255,255,0.7)", marginBottom: 16, display: "block" }}>
              mail_outline
            </span>
            <p style={{ fontSize: 16, margin: "0 0 8px 0" }}>No mailboxes connected</p>
            <p style={{ fontSize: 14, margin: 0, color: "rgba(255,255,255,0.85)" }}>Click "Add Mailbox" to connect your first mailbox</p>
          </div>
        ) : (
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            {mailboxesTotal != null && mailboxesTotal !== mailboxes.length && (
              <p style={{ fontSize: 13, color: "rgba(0,0,0,0.55)", marginBottom: 12 }}>
                Showing {mailboxes.length} of {mailboxesTotal} mailboxes
              </p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mailboxes.map((mailbox) => (
                <div
                  key={mailbox.id}
                  style={{
                    padding: "20px",
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <span className="material-icons-outlined" style={{ fontSize: 24, color: mailbox.is_connected ? "#0b5fff" : "rgba(0,0,0,0.4)" }}>
                        {mailbox.is_connected ? "mail" : "mail_outline"}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: "rgba(0,0,0,0.9)",
                            marginBottom: 4,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getMailboxDisplayLabel(mailbox, mailboxDisplayNamesCache)}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span
                            style={{
                              fontSize: 12,
                              padding: "4px 8px",
                              borderRadius: 4,
                              background: mailbox.is_connected ? "#e3f2fd" : "#f5f5f5",
                              color: mailbox.is_connected ? "#1976d2" : "rgba(0,0,0,0.6)",
                              fontWeight: 600,
                            }}
                          >
                            {mailbox.is_connected ? "Connected" : "Disconnected"}
                          </span>
                          {mailbox.graph_user_id && (
                            <span style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", fontFamily: "monospace" }}>
                              ID: {mailbox.graph_user_id}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(0,0,0,0.5)", marginTop: 8 }}>
                      <div>Connected: {formatDate(mailbox.created_at)}</div>
                      {mailbox.updated_at && mailbox.updated_at !== mailbox.created_at && (
                        <div>Last updated: {formatDate(mailbox.updated_at)}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnectClick(mailbox)}
                    disabled={disconnecting === mailbox.id}
                    style={{
                      padding: "8px 16px",
                      border: "1px solid rgba(220, 53, 69, 0.3)",
                      borderRadius: 8,
                      background: disconnecting === mailbox.id ? "#f5f5f5" : "#fff",
                      color: "#dc3545",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: disconnecting === mailbox.id ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {disconnecting === mailbox.id ? (
                      <>
                        <span className="material-icons-outlined" style={{ fontSize: 16, animation: "spin 1s linear infinite" }}>
                          hourglass_empty
                        </span>
                        Disconnecting...
                      </>
                    ) : (
                      <>
                        <span className="material-icons-outlined" style={{ fontSize: 16 }}>
                          link_off
                        </span>
                        Disconnect
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
            {mailboxesHasMore && (
              <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                <button
                  onClick={onLoadMore}
                  disabled={mailboxesLoadingMore}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: 10,
                    background: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: mailboxesLoadingMore ? "default" : "pointer",
                  }}
                >
                  {mailboxesLoadingMore ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default MailboxManagement;
