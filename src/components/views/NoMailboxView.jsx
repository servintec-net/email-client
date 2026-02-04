import React from "react";

export default function NoMailboxView({
  currentUser,
  mailboxes,
  mailboxDisplayNamesCache,
  mailboxesTotal,
  mailboxesHasMore,
  mailboxesLoadingMore,
  onConnectMailbox,
  onSelectMailboxId,
  onLoadMoreMailboxes,
  getMailboxDisplayLabel,
}) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f5f5f7",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "40px 24px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <img
          src="/servintec-logo.png"
          alt="Servintec"
          style={{ height: 60, width: "auto", objectFit: "contain" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "rgba(0,0,0,0.9)" }}>Welcome, {currentUser.username}!</h2>
        <p style={{ margin: 0, color: "rgba(0,0,0,0.6)", fontSize: 14 }}>
          Connect your Microsoft mailbox to get started.
        </p>
        <button
          onClick={onConnectMailbox}
          style={{
            padding: "12px 24px",
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
          <span className="material-icons-outlined" style={{ fontSize: 18 }}>add</span>
          Connect Mailbox
        </button>
      </div>

      {mailboxes.length > 0 ? (
        <div style={{ padding: "0 24px 40px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 16px 0", color: "rgba(0,0,0,0.8)" }}>
            Your Mailboxes
            {mailboxesTotal != null && (
              <span style={{ fontWeight: 500, color: "rgba(0,0,0,0.55)", marginLeft: 8 }}>
                ({mailboxes.length}{mailboxesTotal !== mailboxes.length ? ` of ${mailboxesTotal}` : ""})
              </span>
            )}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mailboxes.map((mailbox) => (
              <div
                key={mailbox.id}
                style={{
                  padding: "16px 20px",
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: 24, color: mailbox.is_connected ? "#0b5fff" : "rgba(0,0,0,0.4)" }}
                    >
                      {mailbox.is_connected ? "mail" : "mail_outline"}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "rgba(0,0,0,0.9)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {getMailboxDisplayLabel(mailbox, mailboxDisplayNamesCache)}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
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
                      </div>
                    </div>
                  </div>
                </div>
                {mailbox.is_connected && (
                  <button
                    onClick={() => onSelectMailboxId(mailbox.id)}
                    style={{
                      padding: "8px 16px",
                      border: "1px solid rgba(0,0,0,0.12)",
                      borderRadius: 8,
                      background: "#0b5fff",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Open
                  </button>
                )}
              </div>
            ))}
          </div>
          {mailboxesHasMore && (
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 12, alignItems: "center" }}>
              <button
                onClick={() => onLoadMoreMailboxes({ append: true })}
                disabled={mailboxesLoadingMore}
                style={{
                  padding: "10px 20px",
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 10,
                  background: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: mailboxesLoadingMore ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {mailboxesLoadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            padding: "40px 24px",
            textAlign: "center",
            color: "rgba(0,0,0,0.6)",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <span
            className="material-icons-outlined"
            style={{ fontSize: 64, color: "rgba(0,0,0,0.3)", marginBottom: 16, display: "block" }}
          >
            mail_outline
          </span>
          <p style={{ fontSize: 16, margin: "0 0 8px 0", fontWeight: 600, color: "rgba(0,0,0,0.8)" }}>
            No mailboxes connected
          </p>
          <p style={{ fontSize: 14, margin: 0 }}>
            Click "Connect Mailbox" above to connect your first Microsoft mailbox and start managing your emails.
          </p>
        </div>
      )}
    </div>
  );
}
