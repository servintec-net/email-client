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
    background: rgba(0,0,0,0.05) !important;
  }
  .topbar-dropdown-btn-signout:hover {
    background: rgba(220, 53, 69, 0.08) !important;
  }
`;

const dropdownBtnBase = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 10px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
  color: "rgba(0,0,0,0.85)",
  borderRadius: 6,
  textAlign: "left",
};

const TopBar = React.memo(function TopBar({
  currentUser,
  selectedMailbox,
  mailboxes,
  loadingList,
  onRefresh,
  onSelectMailbox,
  onConnectMailbox,
  onManageMailboxes,
  onSignOut,
  onChangePassword,
  selectedMailbox,
  mailboxDisplayNamesCache,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const topBarTitle = selectedMailbox
    ? (getMailboxDisplayLabel(selectedMailbox, mailboxDisplayNamesCache) || null)
    : null;

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
    border: "none",
    background: "rgba(0,0,0,0.04)",
    borderRadius: 8,
    width: 32,
    height: 32,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  return (
    <>
      <style>{spinKeyframes}</style>
      <style>{dropdownHoverStyles}</style>
      <header
        style={{
          padding: "8px 14px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fafafa",
          gap: 12,
          minHeight: 44,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <img
            src="/servintec-logo.png"
            alt="Servintec"
            style={{
              height: 21,
              width: "auto",
              objectFit: "contain",
              flexShrink: 0,
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            {topBarTitle && (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(0,0,0,0.75)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                }}
                title={topBarTitle}
              >
                {topBarTitle}
              </span>
            )}
          </div>

          {mailboxes.length > 1 && (
            <MailboxSelector
              mailboxes={mailboxes}
              selectedMailboxId={selectedMailbox?.id}
              onSelectMailbox={onSelectMailbox}
              mailboxDisplayNamesCache={mailboxDisplayNamesCache}
            />
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={onRefresh}
            disabled={loadingList}
            style={{
              ...buttonStyle,
              cursor: loadingList ? "default" : "pointer",
              opacity: loadingList ? 0.6 : 1,
            }}
            title="Refresh"
            aria-label="Refresh"
          >
            {loadingList ? (
              <span className="material-icons-outlined" style={{ fontSize: 18, animation: "spin 1s linear infinite" }}>
                refresh
              </span>
            ) : (
              <span className="material-icons-outlined" style={{ fontSize: 18 }}>refresh</span>
            )}
          </button>

          <div style={{ position: "relative" }} ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                ...buttonStyle,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "transparent",
                border: "1px solid rgba(0,0,0,0.08)",
                overflow: "hidden",
                padding: 0,
              }}
              title={currentUser?.username}
              aria-label="Profile menu"
            >
              <img
                src="/avatar.jpg"
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  marginTop: 6,
                  minWidth: 200,
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 10,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  padding: 6,
                  zIndex: 1000,
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    padding: "8px 10px",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "rgba(0,0,0,0.85)",
                  }}
                >
                  {currentUser?.username}
                </div>
                <div style={{ paddingTop: 6 }}>
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
                  <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "6px 0" }} />
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
