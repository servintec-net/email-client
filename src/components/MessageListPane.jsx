// MessageListPane.jsx
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import EmailRow from "./EmailRow";
import { ICON_BY_NAME } from "../utils/constants";

// Dots only (keeps "Loading" fixed so left position doesn't shift)
const LOADING_FRAMES = ["Loading.", "Loading..", "Loading..."];

const MessageListPane = React.memo(function MessageListPane({
  selectedFolderPath,
  listTitle, // When in Labels mode, display name for the selected label; else derived from selectedFolderPath
  emails,
  loadingList,
  loadingMore,
  hasMoreEmails,
  hasMoreEmailsRef,
  loadingMoreRef,
  selectedEmailId,
  hoveredId,
  setHoveredId,
  onSelectEmail,
  folderCounts,
  authToken,
  selectedMailboxId,
  onEmailAction, // Callback for email actions (mark read/unread, delete, move)
  onLoadMore, // Callback to load more emails
}) {
  const folderLabel = useMemo(() => {
    if (listTitle != null && listTitle !== "") return listTitle;
    const parts = String(selectedFolderPath || "")
      .split(">")
      .map((s) => s.trim())
      .filter(Boolean);
    return parts[parts.length - 1] || selectedFolderPath || "";
  }, [selectedFolderPath, listTitle]);

  const iconName = ICON_BY_NAME[folderLabel] || ICON_BY_NAME[String(folderLabel).toLowerCase()] || "folder";

  // Infinite scroll implementation
  const scrollContainerRef = useRef(null);
  const isLoadingRef = useRef(false);

  // Cycling "loading." / "loading.." / "loading..." / "loading" when loading list
  const [loadingFrame, setLoadingFrame] = useState(0);
  const showLoadingDots = loadingList && emails.length === 0;
  useEffect(() => {
    if (!showLoadingDots) return;
    const id = setInterval(() => {
      setLoadingFrame((prev) => (prev + 1) % LOADING_FRAMES.length);
    }, 400);
    return () => clearInterval(id);
  }, [showLoadingDots]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    // Use refs for latest value so we stop immediately when hasMore is false (avoids stale closure)
    const hasMore = hasMoreEmailsRef?.current ?? hasMoreEmails;
    const loading = loadingMoreRef?.current ?? loadingMore;
    if (!container || !hasMore || loading || isLoadingRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // Only load more when user actually reaches the bottom (within 50px threshold)
    if (distanceFromBottom <= 50) {
      isLoadingRef.current = true;
      onLoadMore?.();
      // Reset the flag after a short delay to allow the request to complete
      setTimeout(() => {
        isLoadingRef.current = false;
      }, 1000);
    }
  }, [hasMoreEmails, loadingMore, onLoadMore, hasMoreEmailsRef, loadingMoreRef]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Use throttled scroll handler to prevent excessive calls
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", throttledHandleScroll);
    return () => {
      container.removeEventListener("scroll", throttledHandleScroll);
      isLoadingRef.current = false;
    };
  }, [handleScroll]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div
        style={{
          flexShrink: 0,
          height: 40,
          padding: "0 10px",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          background: "#fff",
          boxSizing: "border-box",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              minWidth: 0,
            }}
            title={listTitle ?? selectedFolderPath}
          >
            <span
              className="material-icons-outlined"
              style={{
                fontSize: 18,
                color: "rgba(0,0,0,0.80)",
                flexShrink: 0,
              }}
              aria-hidden
            >
              {iconName}
            </span>

            <div
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: "rgba(0,0,0,0.78)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
              }}
            >
              {folderLabel}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: 8,
          background: "rgba(0,0,0,0.02)",
        }}
      >
        {loadingList && emails.length === 0 && (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(0,0,0,0.55)",
              fontSize: 14,
            }}
          >
            <span style={{ minWidth: "10ch", display: "inline-block", textAlign: "left" }}>
              {LOADING_FRAMES[loadingFrame]}
            </span>
          </div>
        )}
        {!loadingList && emails.length === 0 && (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              color: "rgba(0,0,0,0.45)",
              fontSize: 14,
              transform: "translateY(-50px)",
            }}
          >
            <span
              className="material-icons-outlined"
              style={{ fontSize: 48, opacity: 0.5 }}
            >
              mail_outline
            </span>
            <span style={{ fontWeight: 500 }}>No emails in this folder</span>
            <span style={{ fontSize: 12, fontWeight: 400 }}>
              {folderLabel ? `"${folderLabel}" is empty` : "This folder is empty"}
            </span>
          </div>
        )}
        {emails.length > 0 && (
          <div
            ref={scrollContainerRef}
            style={{ flex: 1, minHeight: 0, overflow: "auto" }}
          >
            {emails.map((msg) => (
              <div key={msg.id} onMouseEnter={() => setHoveredId(msg.id)} onMouseLeave={() => setHoveredId(null)}>
                <EmailRow
                  msg={msg}
                  isSelected={msg.id === selectedEmailId}
                  isHovered={msg.id === hoveredId}
                  onSelect={onSelectEmail}
                  authToken={authToken}
                  selectedMailboxId={selectedMailboxId}
                  onEmailAction={onEmailAction}
                />
              </div>
            ))}
            {!loadingList && loadingMore && (
              <div
                style={{
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  color: "rgba(0,0,0,0.55)",
                  fontSize: 12.5,
                }}
              >
                Loading more emails…
              </div>
            )}
            {!hasMoreEmails && emails.length > 0 && (
              <div
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: "rgba(0,0,0,0.45)",
                  fontSize: 12,
                }}
              >
                No more emails
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default MessageListPane;
