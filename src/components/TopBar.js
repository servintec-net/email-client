import React, { useState, useEffect, useRef, useCallback } from "react";
import MailboxSelector from "./MailboxSelector";
import { getMailboxDisplayLabel } from "../utils/helper";

const spinKeyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
const dropdownHoverStyles = `
  .topbar-dropdown-btn:hover {
    background: rgba(11, 95, 255, 0.06) !important;
    color: rgba(0,0,0,0.9) !important;
  }
  .topbar-dropdown-btn-signout:hover {
    background: rgba(220, 53, 69, 0.12) !important;
    color: rgba(220, 53, 69, 1) !important;
  }
  .topbar-refresh-btn:hover:not(:disabled) {
    background: rgba(11, 95, 255, 0.06) !important;
    border-color: rgba(11, 95, 255, 0.25) !important;
    color: #0b5fff !important;
  }
  .topbar-refresh-btn:focus-visible {
    outline: none;
    border-color: #0b5fff !important;
    box-shadow: 0 0 0 2px rgba(11, 95, 255, 0.2) !important;
  }
  .topbar-avatar-btn:hover {
    border-color: rgba(11, 95, 255, 0.3) !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
  }
  .topbar-avatar-btn:focus-visible {
    outline: none;
    border-color: #0b5fff !important;
    box-shadow: 0 0 0 2px rgba(11, 95, 255, 0.2) !important;
  }
`;

const dropdownBtnBase = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
  color: "rgba(0,0,0,0.85)",
  borderRadius: 8,
  textAlign: "left",
  transition: "background 0.15s ease",
};

const TopBar = React.memo(function TopBar({
  currentUser,
  selectedMailbox,
  mailboxes,
  mailboxOrderIds,
  onMailboxOrderChange,
  loadingList,
  loadingCounts = false,
  onRefresh,
  onSelectMailbox,
  onConnectMailbox,
  onManageMailboxes,
  onSignOut,
  onChangePassword,
  onGptPrompt,
  mailboxDisplayNamesCache,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const hoverCloseRef = useRef(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleAvatarAreaEnter = useCallback(() => {
    if (hoverCloseRef.current) {
      clearTimeout(hoverCloseRef.current);
      hoverCloseRef.current = null;
    }
    setMenuOpen(true);
  }, []);

  const handleAvatarAreaLeave = useCallback(() => {
    hoverCloseRef.current = setTimeout(() => setMenuOpen(false), 200);
  }, []);

  const topBarTitle = selectedMailbox
    ? (getMailboxDisplayLabel(selectedMailbox, mailboxDisplayNamesCache) || null)
    : null;

  useEffect(() => {
    return () => {
      if (hoverCloseRef.current) clearTimeout(hoverCloseRef.current);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) closeMenu();
    };
    const onEsc = (e) => e.key === "Escape" && closeMenu();
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen, closeMenu]);


  const buttonStyle = {
    border: "1px solid rgba(0,0,0,0.08)",
    background: "#fff",
    borderRadius: 10,
    width: 36,
    height: 36,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: "rgba(0,0,0,0.6)",
    transition: "border-color 0.2s ease, background 0.2s ease, color 0.2s ease",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  };

  const refreshButtonStyle = {
    ...buttonStyle,
  };

  return (
    <>
      <style>{spinKeyframes}</style>
      <style>{dropdownHoverStyles}</style>
      <header
        style={{
          padding: "10px 16px",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
          gap: 12,
          minHeight: 44,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
          <img
            src="/servintec-logo.png"
            alt="Servintec"
            style={{
              height: 24,
              width: "auto",
              objectFit: "contain",
              flexShrink: 0,
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          {/* Show mailbox name only when no selector (single mailbox); selector shows current mailbox when multiple */}
          {mailboxes.length <= 1 && topBarTitle && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(0,0,0,0.75)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
              }}
              title={topBarTitle}
            >
              {topBarTitle}
            </span>
          )}
          {mailboxes.length > 1 && (
            <MailboxSelector
              mailboxes={mailboxes}
              orderIds={mailboxOrderIds}
              onOrderChange={onMailboxOrderChange}
              selectedMailboxId={selectedMailbox?.id}
              onSelectMailbox={onSelectMailbox}
              mailboxDisplayNamesCache={mailboxDisplayNamesCache}
              disabled={loadingList || loadingCounts}
            />
          )}
          <button
            onClick={onRefresh}
            disabled={loadingList || loadingCounts}
            style={{
              ...refreshButtonStyle,
              cursor: loadingList || loadingCounts ? "default" : "pointer",
              opacity: loadingList || loadingCounts ? 0.7 : 1,
            }}
            title="Refresh"
            aria-label="Refresh"
            className="topbar-refresh-btn"
          >
            {loadingList || loadingCounts ? (
              <span className="material-icons-outlined" style={{ fontSize: 20, animation: "spin 1s linear infinite" }}>
                refresh
              </span>
            ) : (
              <span className="material-icons-outlined" style={{ fontSize: 20 }}>refresh</span>
            )}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{ position: "relative" }}
            ref={menuRef}
            onMouseEnter={handleAvatarAreaEnter}
            onMouseLeave={handleAvatarAreaLeave}
          >
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="topbar-avatar-btn"
              style={{
                position: "relative",
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "4px solid rgba(0,0,0,0.02)",
                background: "rgba(0,0,0,0.05)",
                overflow: "hidden",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              title={currentUser?.username}
              aria-label="Profile menu"
            >
              <img
                src="/avatar.png"
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                  const icon = e.target.nextElementSibling;
                  if (icon) icon.style.display = "flex";
                }}
              />
              <span
                className="material-icons-outlined"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: 22,
                  color: "rgba(0,0,0,0.5)",
                  display: "none",
                }}
              >
                person
              </span>
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  marginTop: 8,
                  minWidth: 220,
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 12,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)",
                  padding: 8,
                  zIndex: 1000,
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "rgba(11,95,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span className="material-icons-outlined" style={{ fontSize: 20, color: "#0b5fff" }}>person</span>
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "rgba(0,0,0,0.9)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {currentUser?.username}
                  </span>
                </div>
                <div style={{ paddingTop: 2 }}>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      onManageMailboxes?.();
                    }}
                    className="topbar-dropdown-btn"
                    style={dropdownBtnBase}
                  >
                    <span className="material-icons-outlined" style={{ fontSize: 18 }}>settings</span>
                    Manage mailboxes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      onConnectMailbox?.();
                    }}
                    className="topbar-dropdown-btn"
                    style={dropdownBtnBase}
                  >
                    <span className="material-icons-outlined" style={{ fontSize: 18 }}>add</span>
                    Connect new email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      onChangePassword?.();
                    }}
                    className="topbar-dropdown-btn"
                    style={dropdownBtnBase}
                  >
                    <span className="material-icons-outlined" style={{ fontSize: 18 }}>lock</span>
                    Change password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      onGptPrompt?.();
                    }}
                    className="topbar-dropdown-btn"
                    style={dropdownBtnBase}
                  >
                    <span className="material-icons-outlined" style={{ fontSize: 18 }}>smart_toy</span>
                    GPT prompt
                  </button>
                  <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "6px 0", borderRadius: 1 }} />
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      onSignOut?.();
                    }}
                    className="topbar-dropdown-btn-signout"
                    style={{ ...dropdownBtnBase, color: "rgba(220, 53, 69, 0.95)" }}
                  >
                    <span className="material-icons-outlined" style={{ fontSize: 18 }}>logout</span>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
});

export default TopBar;
