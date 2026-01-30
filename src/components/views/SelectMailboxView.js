import React from "react";
import MailboxSelector from "../MailboxSelector";

export default function SelectMailboxView({
  sortedMailboxes,
  mailboxOrderIds,
  onMailboxOrderChange,
  selectedMailboxId,
  onSelectMailbox,
  onConnectNew,
  mailboxDisplayNamesCache,
}) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 20,
        background: "linear-gradient(135deg, rgba(11,95,255,0.02), rgba(226,33,15,0.02))",
      }}
    >
      <img
        src="/servintec-logo.png"
        alt="Servintec"
        style={{ height: 50, width: "auto", objectFit: "contain", marginBottom: 8 }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Select a mailbox</h2>
      <MailboxSelector
        mailboxes={sortedMailboxes}
        orderIds={mailboxOrderIds}
        onOrderChange={onMailboxOrderChange}
        selectedMailboxId={selectedMailboxId}
        onSelectMailbox={onSelectMailbox}
        onConnectNew={onConnectNew}
        mailboxDisplayNamesCache={mailboxDisplayNamesCache}
      />
    </div>
  );
}
