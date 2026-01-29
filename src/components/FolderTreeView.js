// FolderTreeView.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { ICON_BY_NAME } from "../utils/constants";

const FolderTreeView = React.memo(function FolderTreeView({
  tree,
  selectedPath,
  hoveredPath,
  onHoverPath,
  expandedSet,
  onToggleExpand,
  onSelectPath,
  folderCounts,
  onMarkAllAsUnread,
  onMarkAllAsRead,
  depth = 0,
  prefix = "",
}) {
  const baseIndent = 10;
  const indentStep = 8;

  const TOGGLE_ONLY = useMemo(
    () =>
      new Set([
        "Inbox > Applications",
        "Inbox > Interviews",
        "Inbox > Interviews > Interview Request",
        "Inbox > Offer",
      ]),
    []
  );

  const hasChildren = (node) =>
    !!node && typeof node === "object" && Object.keys(node).length > 0;

  const sumUnreadInSubtree = (subtree, subtreePath) => {
    if (!hasChildren(subtree)) return 0;
    let sum = 0;
    for (const [childName, childNode] of Object.entries(subtree)) {
      const childPath = `${subtreePath} > ${childName}`;
      if (hasChildren(childNode)) sum += sumUnreadInSubtree(childNode, childPath);
      else sum += Number(folderCounts?.[childPath]?.unread ?? 0);
    }
    return sum;
  };

  const sumTotalInSubtree = (subtree, subtreePath) => {
    if (!hasChildren(subtree)) return 0;
    let sum = 0;
    for (const [childName, childNode] of Object.entries(subtree)) {
      const childPath = `${subtreePath} > ${childName}`;
      if (hasChildren(childNode)) sum += sumTotalInSubtree(childNode, childPath);
      else sum += Number(folderCounts?.[childPath]?.total ?? 0);
    }
    return sum;
  };


  const getUnreadColor = (path) => {
    if (path.startsWith("Inbox > Applications")) return null;
    if (path.startsWith("Inbox > System Noise")) return null;
    if (path.startsWith("Inbox > Personal")) return null;

    if (path === "Inbox") return "rgba(11,95,255,0.95)";

    if (
      path === "Inbox > Interviews > Interview Scheduled" ||
      path.startsWith("Inbox > Interviews > Interview Scheduled >")
    ) {
      return "rgba(11,95,255,0.95)";
    }
    if (path.startsWith("Inbox > Interviews")) return "rgba(226,33,15,0.95)";

    if (
      path === "Inbox > Offer > Offer Accepted" ||
      path.startsWith("Inbox > Offer > Offer Accepted >")
    ) {
      return "rgba(16,124,65,0.95)";
    }
    if (path.startsWith("Inbox > Offer")) return "rgba(226,33,15,0.95)";

    if (path === "Inbox > Docs Requested" || path.startsWith("Inbox > Docs Requested >")) {
      return "rgba(226,33,15,0.95)";
    }

    return null;
  };

  const getIcon = (name, hasKids, isExpanded) => {
    const icon = ICON_BY_NAME[name] || ICON_BY_NAME[String(name).toLowerCase()] || null;
    const fallback = hasKids ? (isExpanded ? "folder_open" : "folder") : "folder";

    // ✅ RULE:
    // - closed folder => FILLED
    // - expanded folder => OUTLINED
    // - leaf => OUTLINED
    const iconClass = hasKids && !isExpanded ? "material-icons" : "material-icons-outlined";

    return { iconClass, iconName: icon || fallback };
  };

  // ✅ Context menu state
  const [menu, setMenu] = useState(null); // { x, y, path, node }

  const closeMenu = useCallback(() => setMenu(null), []);

  useEffect(() => {
    if (!menu) return;
    const onDown = () => closeMenu();
    const onEsc = (e) => e.key === "Escape" && closeMenu();
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [menu, closeMenu]);

  const openMenu = useCallback((e, path, node) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu({
      x: e.clientX,
      y: e.clientY,
      path,
      node,
    });
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <style>{`
        @keyframes unreadPulseBadge {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: .55; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {Object.entries(tree || {}).map(([name, child]) => {
        const path = prefix ? `${prefix} > ${name}` : name;

        const hasKids = hasChildren(child);
        const isExpanded = expandedSet.has(path);
        const isSelected = selectedPath === path;
        const isHovered = hoveredPath === path;

        const rowBg = isSelected
          ? "rgba(11,95,255,0.10)"
          : isHovered
            ? "rgba(0,0,0,0.035)"
            : "transparent";

        const isToggleOnly = hasKids && TOGGLE_ONLY.has(path);

        // For TOGGLE_ONLY folders, sum from children, but also check direct count if available
        const unread = isToggleOnly
          ? Math.max(
              sumUnreadInSubtree(child, path),
              Number(folderCounts?.[path]?.unread ?? 0)
            )
          : Number(folderCounts?.[path]?.unread ?? 0);
        
        const total = isToggleOnly
          ? Math.max(
              sumTotalInSubtree(child, path),
              Number(folderCounts?.[path]?.total ?? 0)
            )
          : Number(folderCounts?.[path]?.total ?? 0);

        // Get color based on path pattern, then apply only if there are unread emails
        const pathColor = getUnreadColor(path);
        const unreadColor = (unread > 0 && pathColor) ? pathColor : null;

        const { iconClass, iconName } = getIcon(name, hasKids, isExpanded);

        // For specific folders (Interviews, Offer, Docs Requested, Inbox, etc.) with unread, use path color for icon and label
        const iconColor = unreadColor ?? (isSelected ? "#0b5fff" : "rgba(0,0,0,0.90)");
        const labelColor = unreadColor ?? (isSelected ? "#0b5fff" : "rgba(0,0,0,0.76)");

        // badge: use normal colors for background, unread color only for unread number
        const badgeFg = "rgba(0,0,0,0.80)";
        const badgeBg = "rgba(0,0,0,0.06)";
        // Unread number color (only for the unread number itself)
        const unreadNumberColor = unreadColor ? unreadColor.replace("0.95", "1") : "rgba(0,0,0,0.80)";
        // Only pulse the unread number, not the entire badge
        const unreadPulseStyle = (unread > 0 && unreadColor) ? { animation: "unreadPulseBadge 0.9s ease-in-out infinite" } : null;

        const handleRowClick = () => {
          if (isToggleOnly) {
            onToggleExpand(path);
            return;
          }
          onSelectPath(path);
        };

        return (
          <div key={path}>
            <div
              onMouseEnter={() => onHoverPath(path)}
              onMouseLeave={() => onHoverPath(null)}
              onClick={handleRowClick}
              onContextMenu={(e) => openMenu(e, path, child)} // ✅ right click menu
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                height: 30,
                padding: "0 8px",
                marginLeft: baseIndent + depth * indentStep - 6,
                borderRadius: 8,
                cursor: "pointer",
                userSelect: "none",
                background: rowBg,
                border: "none",
                transition: "background 120ms ease",
              }}
              title={path}
            >
              <div
                onClick={(e) => {
                  if (!hasKids) return;
                  e.stopPropagation();
                  onToggleExpand(path);
                }}
                style={{
                  width: 18,
                  height: 18,
                  display: "grid",
                  placeItems: "center",
                  background: "transparent",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(0,0,0,0.80)",
                  flexShrink: 0,
                  opacity: hasKids ? 1 : 0,
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 140ms ease",
                  lineHeight: "18px",
                }}
              >
                {hasKids ? ">" : ""}
              </div>

              <span
                className={iconClass}
                style={{
                  fontSize: 18,
                  color: iconColor,
                  flexShrink: 0,
                }}
              >
                {iconName}
              </span>

              <div
                style={{
                  minWidth: 0,
                  flex: 1,
                  fontSize: 13,
                  fontWeight: 400,
                  color: labelColor,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {name}
              </div>

              {(unread > 0 || total > 0) && (
                <div
                  style={{
                    minWidth: unread > 0 ? "auto" : 16,
                    height: 16,
                    padding: "0 6px",
                    borderRadius: 999,
                    background: badgeBg,
                    color: badgeFg,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 500,
                    flexShrink: 0,
                    gap: unread > 0 ? 2 : 0,
                  }}
                  title={unread > 0 ? `${unread} unread / ${total} total` : `${total} total`}
                >
                  {unread > 0 ? (
                    <>
                      <span style={{ color: unreadNumberColor, ...(unreadPulseStyle || {}) }}>{unread}</span>
                      <span style={{ opacity: 0.6, color: badgeFg }}>/</span>
                      <span style={{ color: badgeFg }}>{total}</span>
                    </>
                  ) : (
                    total
                  )}
                </div>
              )}
            </div>

            {hasKids && isExpanded && (
              <FolderTreeView
                tree={child}
                selectedPath={selectedPath}
                hoveredPath={hoveredPath}
                onHoverPath={onHoverPath}
                expandedSet={expandedSet}
                onToggleExpand={onToggleExpand}
                onSelectPath={onSelectPath}
                folderCounts={folderCounts}
                onMarkAllAsUnread={onMarkAllAsUnread} // ✅ pass down
                onMarkAllAsRead={onMarkAllAsRead} // ✅ pass down
                depth={depth + 1}
                prefix={path}
              />
            )}
          </div>
        );
      })}

      {/* ✅ Context menu UI */}
      {menu && (
        (() => {
          const hasKids = hasChildren(menu.node);
          const isToggleOnly = hasKids && TOGGLE_ONLY.has(menu.path);

          const unread = isToggleOnly
            ? Math.max(
                sumUnreadInSubtree(menu.node, menu.path),
                Number(folderCounts?.[menu.path]?.unread ?? 0)
              )
            : Number(folderCounts?.[menu.path]?.unread ?? 0);

          const total = isToggleOnly
            ? Math.max(
                sumTotalInSubtree(menu.node, menu.path),
                Number(folderCounts?.[menu.path]?.total ?? 0)
              )
            : Number(folderCounts?.[menu.path]?.total ?? 0);

          const disableRead = total <= 0 || unread <= 0; // nothing unread to mark read
          const disableUnread = total <= 0 || (unread >= total); // already all unread

          const menuBtnStyle = (disabled) => ({
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: 8,
            border: "none",
            background: "transparent",
            cursor: disabled ? "not-allowed" : "pointer",
            fontSize: 12.5,
            fontWeight: 650,
            color: "rgba(0,0,0,0.85)",
            opacity: disabled ? 0.45 : 1,
          });

          return (
        <div
          style={{
            position: "fixed",
            left: menu.x,
            top: menu.y,
            zIndex: 9999,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            padding: 6,
            minWidth: 190,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={async () => {
              if (disableRead) return;
              closeMenu();
              await onMarkAllAsRead?.(menu.path);
            }}
            style={menuBtnStyle(disableRead)}
            title="Mark all as read"
            disabled={disableRead}
          >
            <span className="material-icons-outlined" style={{ fontSize: 18, opacity: 0.85 }}>
              mark_email_read
            </span>
            Mark all as read
          </button>

          <button
            onClick={async () => {
              if (disableUnread) return;
              closeMenu();
              await onMarkAllAsUnread?.(menu.path);
            }}
            style={menuBtnStyle(disableUnread)}
            title="Mark all as unread"
            disabled={disableUnread}
          >
            <span className="material-icons-outlined" style={{ fontSize: 18, opacity: 0.85 }}>
              mark_email_unread
            </span>
            Mark all as unread
          </button>
        </div>
          );
        })()
      )}
    </div>
  );
});

export default FolderTreeView;
