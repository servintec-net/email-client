import React from "react";
import TopBar from "../TopBar";
import FolderPane from "../FolderPane";
import Resizer from "../Resizer";
import MessageListPane from "../MessageListPane";
import RightPanel from "../RightPanel";
import ReplyPanel from "../ReplyPanel";
import NotificationToast from "../common/NotificationToast";
import { FOLDER_TREE, LABELS_CONFIG } from "../../utils/constants";
import { formatFullDateTime, getMailboxDisplayLabel } from "../../utils/helper";

function MailLayout({
  // Layout
  folderPaneWidth,
  listPaneWidth,
  setFolderPaneWidth,
  setListPaneWidth,
  paneLimits,
  // TopBar
  currentUser,
  selectedMailbox,
  sortedMailboxes,
  mailboxOrderIds,
  setMailboxOrderIds,
  loadingList,
  loadingCounts,
  refreshInbox,
  setSelectedMailboxId,
  connectMailbox,
  onManageMailboxes,
  onSignOut,
  onChangePassword,
  onGptPrompt,
  mailboxDisplayNamesCache,
  // Folder/list
  leftPaneTab,
  setLeftPaneTab,
  selectedFolderPath,
  hoveredFolderPath,
  setHoveredFolderPath,
  expandedFolders,
  setExpandedFolders,
  folderCounts,
  markAllAsUnread,
  markAllAsRead,
  setSelectedFolderPath,
  selectedLabel,
  setSelectedLabel,
  clearEmailState,
  threadCacheRef,
  // Email list
  emails,
  hasMoreEmails,
  hasMoreEmailsRef,
  loadingMore,
  loadingMoreRef,
  selectedEmailId,
  hoveredId,
  setHoveredId,
  handleSelectEmail,
  selectedMailboxId,
  handleEmailAction,
  loadEmails,
  searchQuery,
  onSearchChange,
  // Preview
  previewEmail,
  replyToEmail,
  setReplyToEmail,
  threadEmails,
  expandedById,
  showHistoryById,
  toggleExpanded,
  toggleHistory,
  loadThread,
  loadingThread,
  // Notification
  notification,
  authToken,
}) {
  const listTitle =
    leftPaneTab === "labels"
      ? selectedLabel
        ? [...LABELS_CONFIG.jobBoards, ...LABELS_CONFIG.roles].find((l) => l.category === selectedLabel)?.display ?? selectedLabel
        : "Select a label"
      : null;

  const onTabChange = (tab) => {
    setLeftPaneTab(tab);
    if (tab === "folders") setSelectedLabel(null);
    clearEmailState();
    threadCacheRef.current?.clear();
  };

  const onSelectFolderPath = (path) => {
    setSelectedFolderPath(path);
    clearEmailState();
    threadCacheRef.current?.clear();
  };

  const onSelectLabel = (category) => {
    setSelectedLabel(category);
    clearEmailState();
    threadCacheRef.current?.clear();
  };

  const handleReplySent = () => {
    const cid = replyToEmail?.conversationId;
    if (cid) {
      threadCacheRef.current?.delete(cid);
      setTimeout(() => loadThread().then(() => setReplyToEmail(null)), 400);
    } else {
      setReplyToEmail(null);
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen"
      style={{
        fontFamily: "system-ui",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <TopBar
        currentUser={currentUser}
        selectedMailbox={selectedMailbox}
        mailboxes={sortedMailboxes}
        mailboxOrderIds={mailboxOrderIds}
        onMailboxOrderChange={setMailboxOrderIds}
        loadingList={loadingList}
        loadingCounts={loadingCounts}
        onRefresh={refreshInbox}
        onSelectMailbox={setSelectedMailboxId}
        onConnectMailbox={connectMailbox}
        onManageMailboxes={onManageMailboxes}
        onSignOut={onSignOut}
        onChangePassword={onChangePassword}
        onGptPrompt={onGptPrompt}
        mailboxDisplayNamesCache={mailboxDisplayNamesCache}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden", minWidth: 0 }}>
        <div
          style={{
            width: folderPaneWidth,
            minWidth: paneLimits.FOLDER_MIN,
            maxWidth: paneLimits.FOLDER_MAX,
            flexShrink: 0,
            display: "flex",
            overflow: "hidden",
            background: "#fff",
            borderRight: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <FolderPane
            tree={FOLDER_TREE}
            activeTab={leftPaneTab}
            onTabChange={onTabChange}
            selectedFolderPath={selectedFolderPath}
            hoveredFolderPath={hoveredFolderPath}
            setHoveredFolderPath={setHoveredFolderPath}
            expandedFolders={expandedFolders}
            setExpandedFolders={setExpandedFolders}
            folderCounts={folderCounts}
            onMarkAllAsUnread={markAllAsUnread}
            onMarkAllAsRead={markAllAsRead}
            onSelectFolderPath={onSelectFolderPath}
            selectedLabel={selectedLabel}
            onSelectLabel={onSelectLabel}
          />
        </div>

        <Resizer
          defaultWidth={folderPaneWidth}
          minWidth={paneLimits.FOLDER_MIN}
          maxWidth={paneLimits.FOLDER_MAX}
          onResize={setFolderPaneWidth}
        />

        <div
          style={{
            width: listPaneWidth,
            minWidth: paneLimits.LIST_MIN,
            maxWidth: paneLimits.LIST_MAX,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "#fff",
            borderRight: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <MessageListPane
            selectedFolderPath={selectedFolderPath}
            listTitle={listTitle}
            emails={emails}
            loadingList={loadingList || loadingCounts}
            loadingMore={loadingMore}
            hasMoreEmails={hasMoreEmails}
            hasMoreEmailsRef={hasMoreEmailsRef}
            loadingMoreRef={loadingMoreRef}
            selectedEmailId={selectedEmailId}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            onSelectEmail={handleSelectEmail}
            folderCounts={folderCounts}
            authToken={authToken}
            selectedMailboxId={selectedMailboxId}
            onEmailAction={handleEmailAction}
            onLoadMore={() => loadEmails(true)}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
        </div>

        <Resizer
          defaultWidth={listPaneWidth}
          minWidth={paneLimits.LIST_MIN}
          maxWidth={paneLimits.LIST_MAX}
          onResize={setListPaneWidth}
        />

        <div
          style={{
            flex: 1,
            minWidth: 320,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))",
          }}
        >
          <div
            style={{
              flexShrink: 0,
              height: 40,
              padding: "0 14px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
              background: "#fff",
              boxSizing: "border-box",
            }}
          >
            <span
              className="material-icons-outlined"
              style={{ fontSize: 20, color: "rgba(0,0,0,0.7)", flexShrink: 0 }}
              aria-hidden
            >
              {replyToEmail ? "reply" : previewEmail ? "mail" : "mail_outline"}
            </span>
            {replyToEmail ? (
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.85)" }}>Reply</div>
            ) : previewEmail ? (
              <>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "rgba(0,0,0,0.88)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minWidth: 0,
                    flex: 1,
                  }}
                  title={`${(previewEmail.subject || "").replace(/^\s*Re:\s*/i, "").trim() || "No subject"} — ${previewEmail.from?.emailAddress?.name || "Unknown Sender"} · ${formatFullDateTime(previewEmail.receivedDateTime)}`}
                >
                  {(previewEmail.subject || "").replace(/^\s*Re:\s*/i, "").trim() || "No subject"}
                </div>
                <span
                  className="material-icons-outlined"
                  style={{ fontSize: 14, color: "rgba(0,0,0,0.45)", flexShrink: 0 }}
                  aria-hidden
                  title={formatFullDateTime(previewEmail.receivedDateTime)}
                >
                  schedule
                </span>
                <span
                  style={{ fontSize: 11, fontWeight: 500, color: "rgba(0,0,0,0.5)", whiteSpace: "nowrap", flexShrink: 0 }}
                  title={formatFullDateTime(previewEmail.receivedDateTime)}
                >
                  {formatFullDateTime(previewEmail.receivedDateTime)}
                </span>
              </>
            ) : (
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.85)" }}>Preview</div>
            )}
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
            {!previewEmail && (
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 14,
                  transform: "translateY(-50px)",
                }}
              >
                <span className="material-icons-outlined" style={{ fontSize: 48, opacity: 0.9 }}>visibility</span>
                <span style={{ fontWeight: 500 }}>Select an email to preview</span>
                <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.65)" }}>Preview appears here</span>
              </div>
            )}

            {replyToEmail && (
              <div style={{ flex: 1, minHeight: 0, overflow: "auto", scrollbarGutter: "stable" }}>
                <ReplyPanel
                  replyToEmail={replyToEmail}
                  mailboxId={selectedMailboxId}
                  mailboxDisplayName={selectedMailbox ? getMailboxDisplayLabel(selectedMailbox, mailboxDisplayNamesCache) : ""}
                  onClose={() => setReplyToEmail(null)}
                  onSent={handleReplySent}
                />
              </div>
            )}

            {previewEmail && !replyToEmail && (
              <div style={{ flex: 1, minHeight: 0, overflow: "auto", scrollbarGutter: "stable" }}>
                <RightPanel
                  previewEmail={previewEmail}
                  threadEmails={threadEmails}
                  expandedById={expandedById}
                  showHistoryById={showHistoryById}
                  toggleExpanded={toggleExpanded}
                  toggleHistory={toggleHistory}
                  loadThread={loadThread}
                  loadingThread={loadingThread}
                  onReply={setReplyToEmail}
                  mailboxId={selectedMailboxId}
                  mailboxEmail={selectedMailbox?.mailbox_email}
                  authToken={authToken}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <NotificationToast notification={notification} />
    </div>
  );
}

export default MailLayout;
