import React, { useState, useRef, useEffect } from "react";
import { getMailboxDisplayLabel } from "../utils/helper";

const MailboxSelector = ({
  mailboxes,
  orderIds = [],
  onOrderChange,
  selectedMailboxId,
  onSelectMailbox,
  mailboxDisplayNamesCache,
  onConnectNew,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (disabled && open) setOpen(false);
  }, [disabled, open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const selectedMailbox = mailboxes.find((mb) => mb.id === selectedMailboxId);
  const label = selectedMailbox
    ? getMailboxDisplayLabel(selectedMailbox, mailboxDisplayNamesCache) + (selectedMailbox.is_connected ? "" : " (Disconnected)")
    : "Select mailbox";

  const moveUp = (e, index) => {
    e.stopPropagation();
    if (index <= 0 || !onOrderChange || orderIds.length < 2) return;
    const newIds = [...orderIds];
    [newIds[index - 1], newIds[index]] = [newIds[index], newIds[index - 1]];
    onOrderChange(newIds);
  };

  const moveDown = (e, index) => {
    e.stopPropagation();
    if (index >= orderIds.length - 1 || !onOrderChange || orderIds.length < 2) return;
    const newIds = [...orderIds];
    [newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]];
    onOrderChange(newIds);
  };

  const selectMailbox = (mb) => {
    onSelectMailbox(mb.id);
    setOpen(false);
  };

  const styles = {
    container: {
      position: "relative",
      display: "inline-block",
      width: 420,
      minWidth: 420,
      maxWidth: 420,
      flexShrink: 0,
    },
    trigger: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      width: "100%",
      minWidth: 0,
      padding: "4px 10px",
      border: "1px solid rgba(0,0,0,0.12)",
      borderRadius: 12,
      background: "#fff",
      fontSize: 13,
      fontWeight: 600,
      color: "rgba(0,0,0,0.88)",
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      minHeight: 36,
      boxSizing: "border-box",
      outline: "none",
    },
    triggerDefault: {
      borderColor: "rgba(0,0,0,0.12)",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    },
    triggerHover: {
      borderColor: "rgba(0,0,0,0.22)",
      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
    },
    triggerOpen: {
      borderColor: "#0b5fff",
      boxShadow: "0 0 0 2px rgba(11,95,255,0.22)",
    },
    triggerFocus: {
      borderColor: "#0b5fff",
      boxShadow: "0 0 0 2px rgba(11,95,255,0.22)",
    },
    chevron: {
      flexShrink: 0,
      transition: "transform 0.2s",
    },
    dropdown: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      marginTop: 6,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
      border: "1px solid rgba(0,0,0,0.08)",
      maxHeight: 320,
      overflowX: "hidden",
      overflowY: "auto",
      minWidth: 0,
      zIndex: 1000,
    },
    option: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "5px 14px",
      cursor: "pointer",
      border: "none",
      background: "transparent",
      width: "100%",
      minWidth: 0,
      overflow: "hidden",
      textAlign: "left",
      fontSize: 13,
      fontWeight: 500,
      color: "rgba(0,0,0,0.85)",
      transition: "background 0.15s",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
      boxSizing: "border-box",
    },
    optionLast: {
      borderBottom: "none",
    },
    optionSelected: {
      background: "rgba(11,95,255,0.08)",
      color: "#0b5fff",
      fontWeight: 600,
    },
    optionHover: {
      background: "rgba(0,0,0,0.04)",
    },
    optionContent: {
      flex: 1,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    reorderBtns: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
      flexShrink: 0,
    },
    reorderBtn: {
      width: 28,
      height: 28,
      padding: 0,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "rgba(0,0,0,0.5)",
      transition: "color 0.15s, background 0.15s",
    },
  };

  return (
    <div ref={containerRef} style={styles.container}>
      <style>{`
        .mailbox-reorder-btn:hover:not(:disabled) {
          background: rgba(11, 95, 255, 0.1) !important;
          color: #0b5fff !important;
          border-radius: 6px;
        }
        .mailbox-reorder-btn:disabled {
          color: rgba(0,0,0,0.2) !important;
          cursor: default;
        }
      `}</style>
      <button
        type="button"
        className="mailbox-select-trigger"
        disabled={disabled}
        style={{
          ...styles.trigger,
          ...(open ? styles.triggerOpen : focused ? styles.triggerFocus : hovered ? styles.triggerHover : styles.triggerDefault),
          ...(disabled && { cursor: "default", opacity: 0.7, pointerEvents: "none" }),
        }}
        onClick={() => !disabled && setOpen((o) => !o)}
        onMouseEnter={() => !disabled && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => !disabled && setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select mailbox"
      >
        <span
          className="material-icons-outlined"
          style={{
            fontSize: 20,
            color: selectedMailbox?.is_connected ? "#0b5fff" : "rgba(0,0,0,0.45)",
            flexShrink: 0,
          }}
        >
          {selectedMailbox?.is_connected ? "mail" : "mail_outline"}
        </span>
        <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {label}
        </span>
        <span
          className="material-icons-outlined"
          style={{
            ...styles.chevron,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            fontSize: 20,
            color: "rgba(0,0,0,0.5)",
          }}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div style={styles.dropdown} role="listbox">
          {mailboxes.map((mb, index) => {
            const isSelected = mb.id === selectedMailboxId;
            const canMoveUp = index > 0 && onOrderChange && orderIds.length > 1;
            const canMoveDown = index < mailboxes.length - 1 && onOrderChange && orderIds.length > 1;
            return (
              <div
                key={mb.id}
                role="option"
                aria-selected={isSelected}
                style={{
                  ...styles.option,
                  ...(index === mailboxes.length - 1 ? styles.optionLast : {}),
                  ...(isSelected ? styles.optionSelected : {}),
                }}
                onClick={() => selectMailbox(mb)}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
              >
                <span className="material-icons-outlined" style={{ fontSize: 18, color: mb.is_connected ? "#0b5fff" : "rgba(0,0,0,0.4)", flexShrink: 0 }}>
                  {mb.is_connected ? "mail" : "mail_outline"}
                </span>
                <span style={styles.optionContent}>
                  {getMailboxDisplayLabel(mb, mailboxDisplayNamesCache)} {mb.is_connected ? "" : "(Disconnected)"}
                </span>
                {onOrderChange && orderIds.length > 1 && (
                  <div style={styles.reorderBtns} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="mailbox-reorder-btn"
                      style={styles.reorderBtn}
                      disabled={!canMoveUp}
                      onClick={(e) => moveUp(e, index)}
                      aria-label="Move up"
                      title="Move up"
                    >
                      <span className="material-icons-outlined" style={{ fontSize: 18 }}>arrow_upward</span>
                    </button>
                    <button
                      type="button"
                      className="mailbox-reorder-btn"
                      style={styles.reorderBtn}
                      disabled={!canMoveDown}
                      onClick={(e) => moveDown(e, index)}
                      aria-label="Move down"
                      title="Move down"
                    >
                      <span className="material-icons-outlined" style={{ fontSize: 18 }}>arrow_downward</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {onConnectNew && (
            <button
              type="button"
              style={{
                ...styles.option,
                ...styles.optionLast,
                color: "#0b5fff",
                fontWeight: 600,
                borderTop: "1px solid rgba(0,0,0,0.08)",
              }}
              onClick={() => { onConnectNew(); setOpen(false); }}
            >
              <span className="material-icons-outlined" style={{ fontSize: 18 }}>add_circle_outline</span>
              <span>Add mailbox</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MailboxSelector;
