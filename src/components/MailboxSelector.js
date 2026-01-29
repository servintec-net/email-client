import React from "react";
import { getMailboxDisplayLabel } from "../utils/helper";

const MailboxSelector = ({ mailboxes, selectedMailboxId, onSelectMailbox, mailboxDisplayNamesCache }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <select
        value={selectedMailboxId || ""}
        onChange={(e) => onSelectMailbox(Number(e.target.value))}
        style={{
          padding: "6px 10px",
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 8,
          background: "#fff",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          minWidth: 200,
        }}
      >
        {mailboxes.map((mb) => (
          <option key={mb.id} value={mb.id}>
            {getMailboxDisplayLabel(mb, mailboxDisplayNamesCache)} {mb.is_connected ? "" : "(Disconnected)"}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MailboxSelector;
