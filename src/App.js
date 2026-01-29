// App.js
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { flattenFolderTree, getMailboxDisplayLabel } from "./utils/helper";
import { FOLDER_TREE, API_BASE, WS_BASE, LABELS_CONFIG } from "./utils/constants";
import { getAuthToken, setAuthToken, removeAuthToken, getAuthHeaders, getAuthHeadersWithToken } from "./utils/auth";

import LoginForm from "./components/LoginForm";
import MailboxSelector from "./components/MailboxSelector";
import MailboxManagement from "./components/MailboxManagement";
import TopBar from "./components/TopBar";
import FolderPane from "./components/FolderPane";
import MessageListPane from "./components/MessageListPane";
import RightPanel from "./components/RightPanel";
import ReplyPanel from "./components/ReplyPanel";
import Resizer from "./components/Resizer";
import ChangePassword from "./components/ChangePassword";

function App() {
  // Auth state
  const [authToken, setAuthTokenState] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [mailboxes, setMailboxes] = useState([]);
  const [mailboxesTotal, setMailboxesTotal] = useState(null);
  const [mailboxesHasMore, setMailboxesHasMore] = useState(false);
  const [mailboxesNextOffset, setMailboxesNextOffset] = useState(null);
  const [, setMailboxesLoading] = useState(false);
  const [mailboxesLoadingMore, setMailboxesLoadingMore] = useState(false);
  const [selectedMailboxId, setSelectedMailboxId] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [showMailboxManagement, setShowMailboxManagement] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Email state
  const [emails, setEmails] = useState([]);
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [previewEmail, setPreviewEmail] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreEmails, setHasMoreEmails] = useState(false);
  const [emailSkip, setEmailSkip] = useState(0);
  const hasMoreEmailsRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const loadEmailsRef = useRef(() => { });
  const loadMailboxesRef = useRef(() => { });
  const selectedMailboxIdRef = useRef(selectedMailboxId);
  selectedMailboxIdRef.current = selectedMailboxId;

  const [mailboxDisplayNamesCache, setMailboxDisplayNamesCache] = useState({});
  const [threadEmails, setThreadEmails] = useState([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [expandedById, setExpandedById] = useState({});
  const [showHistoryById, setShowHistoryById] = useState({});
  const [replyToEmail, setReplyToEmail] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const FOLDER_PANE_MIN = 200;
  const FOLDER_PANE_MAX = 420;
  const FOLDER_PANE_DEFAULT = 260;
  const LIST_PANE_MIN = 280;
  const LIST_PANE_MAX = 600;
  const LIST_PANE_DEFAULT = 380;
  const PANE_WIDTHS_KEY = "emailLayoutPaneWidths";

  const [folderPaneWidth, setFolderPaneWidth] = useState(() => {
    try {
      const raw = localStorage.getItem(PANE_WIDTHS_KEY);
      if (!raw) return FOLDER_PANE_DEFAULT;
      const data = JSON.parse(raw);
      const w = Number(data.folderPaneWidth);
      if (!Number.isFinite(w)) return FOLDER_PANE_DEFAULT;
      return Math.min(FOLDER_PANE_MAX, Math.max(FOLDER_PANE_MIN, w));
    } catch {
      return FOLDER_PANE_DEFAULT;
    }
  });
  const [listPaneWidth, setListPaneWidth] = useState(() => {
    try {
      const raw = localStorage.getItem(PANE_WIDTHS_KEY);
      if (!raw) return LIST_PANE_DEFAULT;
      const data = JSON.parse(raw);
      const w = Number(data.listPaneWidth);
      if (!Number.isFinite(w)) return LIST_PANE_DEFAULT;
      return Math.min(LIST_PANE_MAX, Math.max(LIST_PANE_MIN, w));
    } catch {
      return LIST_PANE_DEFAULT;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        PANE_WIDTHS_KEY,
        JSON.stringify({ folderPaneWidth, listPaneWidth })
      );
    } catch (_) {}
  }, [folderPaneWidth, listPaneWidth]);

  useEffect(() => {
    if (!previewEmail) setReplyToEmail(null);
  }, [previewEmail]);

  const allFolderPaths = useMemo(() => flattenFolderTree(FOLDER_TREE), []);
  const [selectedFolderPath, setSelectedFolderPath] = useState(allFolderPaths?.[0] || "Inbox");

  const [expandedFolders, setExpandedFolders] = useState(
    () =>
      new Set([
        "Inbox",
        "Inbox > Applications",
        "Inbox > Interviews",
        "Inbox > Interviews > Interview Request",
        "Inbox > Offer",
      ])
  );

  const [hoveredFolderPath, setHoveredFolderPath] = useState(null);
  const [folderCounts, setFolderCounts] = useState({});
  const [loadingCounts, setLoadingCounts] = useState(false);

  const [leftPaneTab, setLeftPaneTab] = useState("folders");
  const [selectedLabel, setSelectedLabel] = useState(null);

  const readRequestedRef = useRef(new Set());
  const emailsAbortRef = useRef(null);
  const threadAbortRef = useRef(null);
  const threadCacheRef = useRef(new Map());

  // must match FolderTreeView.jsx
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

  // Auth functions
  const handleLogin = useCallback(async (user, token) => {
    setAuthToken(token);
    setAuthTokenState(token);
    setCurrentUser(user);
    setLoadingAuth(false);
    // Load mailboxes after login (first page only; background will fetch rest)
    if (token && user) {
      try {
        const res = await fetch(`${API_BASE}/me/mailboxes?limit=20&offset=0`, {
          headers: getAuthHeadersWithToken(token),
        });
        if (res.ok) {
          const data = await res.json();
          const list = data.value || [];
          setMailboxes(list);
          setMailboxesTotal(data.total ?? list.length);
          setMailboxesHasMore(data.hasMore ?? false);
          setMailboxesNextOffset(data.nextOffset ?? null);
          const connectedMailboxes = list.filter((mb) => mb.is_connected);
          if (connectedMailboxes.length > 0) {
            setSelectedMailboxId(connectedMailboxes[0].id);
          }
          // Fetch remaining pages in background if any
          if (data.hasMore && data.nextOffset != null) {
            setTimeout(() => loadMailboxesRef.current({ append: true }), 100);
          }
        } else if (res.status === 401) {
          // Token expired or invalid
          const errorData = await res.json().catch(() => ({}));
          console.error("Token validation failed:", errorData.error || "Unauthorized");
          removeAuthToken();
          setAuthTokenState(null);
          setCurrentUser(null);
          // Show alert to user
          alert("Authentication failed. Please log in again. If you just restarted the server, you may need to clear your browser's localStorage.");
        }
      } catch (e) {
        console.error("Failed to load mailboxes after login:", e);
        alert("Failed to load mailboxes. Please try logging in again.");
      }
    }
  }, []);

  const verifyAndLoadUser = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: getAuthHeadersWithToken(token),
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        return true;
      } else {
        removeAuthToken();
        setAuthTokenState(null);
        return false;
      }
    } catch (e) {
      console.error("Auth verification failed:", e);
      removeAuthToken();
      setAuthTokenState(null);
      return false;
    }
  };

  const loadMailboxes = useCallback(async (options = {}) => {
    const tokenOverride = options.tokenOverride ?? null;
    const append = options.append === true;
    const tokenToUse = tokenOverride || authToken || getAuthToken();
    if (!tokenToUse) return;

    if (append) {
      if (mailboxesLoadingMore || !mailboxesHasMore) return;
      setMailboxesLoadingMore(true);
      try {
        const offset = mailboxesNextOffset ?? mailboxes.length;
        const res = await fetch(`${API_BASE}/me/mailboxes?limit=20&offset=${offset}`, {
          headers: getAuthHeadersWithToken(tokenToUse),
        });
        if (res.ok) {
          const data = await res.json();
          const list = data.value || [];
          setMailboxes((prev) => [...prev, ...list]);
          setMailboxesTotal(data.total ?? null);
          setMailboxesHasMore(data.hasMore ?? false);
          setMailboxesNextOffset(data.nextOffset ?? null);
          if (data.hasMore && data.nextOffset != null) {
            setTimeout(() => loadMailboxesRef.current({ append: true }), 100);
          }
        }
      } catch (e) {
        console.error("Failed to load more mailboxes:", e);
      } finally {
        setMailboxesLoadingMore(false);
      }
      return;
    }

    setMailboxesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/me/mailboxes?limit=20&offset=0`, {
        headers: getAuthHeadersWithToken(tokenToUse),
      });
      if (res.ok) {
        const data = await res.json();
        const list = data.value || [];
        setMailboxes(list);
        setMailboxesTotal(data.total ?? list.length);
        setMailboxesHasMore(data.hasMore ?? false);
        setMailboxesNextOffset(data.nextOffset ?? null);
        const connectedMailboxes = list.filter((mb) => mb.is_connected);
        if (connectedMailboxes.length > 0 && !selectedMailboxId) {
          setSelectedMailboxId(connectedMailboxes[0].id);
        }
        if (data.hasMore && data.nextOffset != null) {
          setTimeout(() => loadMailboxesRef.current({ append: true }), 100);
        }
      } else if (res.status === 401) {
        removeAuthToken();
        setAuthTokenState(null);
        setCurrentUser(null);
      }
    } catch (e) {
      console.error("Failed to load mailboxes:", e);
    } finally {
      setMailboxesLoading(false);
    }
  }, [authToken, selectedMailboxId, mailboxesLoadingMore, mailboxesHasMore, mailboxesNextOffset, mailboxes.length]);
  loadMailboxesRef.current = loadMailboxes;

  const connectMailbox = useCallback(async () => {
    const tokenToUse = authToken || getAuthToken();
    if (!tokenToUse) {
      alert("Please log in first");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/ms/login-url`, {
        headers: getAuthHeadersWithToken(tokenToUse),
      });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url;
      } else if (res.status === 401) {
        removeAuthToken();
        setAuthTokenState(null);
        setCurrentUser(null);
        alert("Your session has expired. Please log in again.");
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "Failed to connect mailbox. Please try again.");
      }
    } catch (e) {
      console.error("Failed to get OAuth URL:", e);
      alert("Failed to connect mailbox. Please try again.");
    }
  }, [authToken]);

  const toggleHistory = useCallback((id) => {
    setShowHistoryById((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleExpanded = useCallback((id) => {
    setExpandedById((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const decUnreadCountsBy = useCallback((fullPath, n) => {
    if (!fullPath || !n || n <= 0) return;

    const parts = String(fullPath)
      .split(">")
      .map((s) => s.trim())
      .filter(Boolean);

    const paths = [];
    for (let i = 0; i < parts.length; i++) {
      paths.push(parts.slice(0, i + 1).join(" > "));
    }

    setFolderCounts((prev) => {
      const next = { ...prev };
      for (const p of paths) {
        if (!next[p]) continue;
        const curr = Number(next[p].unread ?? 0);
        next[p] = { ...next[p], unread: Math.max(0, curr - n) };
      }
      return next;
    });
  }, []);

  const markEmailIdAsRead = useCallback(
    async (id) => {
      if (!authToken || !selectedMailboxId) return;
      await fetch(`${API_BASE}/email/${id}/read?mailboxId=${selectedMailboxId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
    },
    [authToken, selectedMailboxId]
  );

  const markAsRead = useCallback(
    async (id, folderPathForCount) => {
      try {
        await markEmailIdAsRead(id);

        setEmails((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
        setPreviewEmail((prev) => (prev && prev.id === id ? { ...prev, isRead: true } : prev));
        setThreadEmails((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));

        decUnreadCountsBy(folderPathForCount, 1);
      } catch (err) {
        console.error("markAsRead error:", err);
      }
    },
    [markEmailIdAsRead, decUnreadCountsBy]
  );

  const refreshFolderCounts = useCallback(async (mailboxIdOverride = null) => {
    const mailboxIdToUse = mailboxIdOverride || selectedMailboxId;
    if (!authToken || !mailboxIdToUse) return;

    const paths = allFolderPaths;

    try {
      setLoadingCounts(true);
      const res = await fetch(`${API_BASE}/folderCounts?mailboxId=${mailboxIdToUse}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ paths }),
      });

      if (res.status === 401) {
        removeAuthToken();
        setAuthTokenState(null);
        setCurrentUser(null);
        return;
      }

      const data = await res.json();
      // Only update counts if we're still on the same mailbox (prevent race conditions)
      if (mailboxIdToUse === selectedMailboxId) {
        setFolderCounts(data.counts || {});
      }
    } catch (e) {
      console.error("refreshFolderCounts error:", e);
    } finally {
      setLoadingCounts(false);
    }
  }, [authToken, selectedMailboxId, allFolderPaths]);

  const loadEmails = useCallback(async (append = false) => {
    if (!authToken || !selectedMailboxId) return;

    const isLabelsMode = leftPaneTab === "labels" && selectedLabel;
    const urlParams = isLabelsMode
      ? `mailboxId=${selectedMailboxId}&category=${encodeURIComponent(selectedLabel)}&top=50&skip=${append ? emailSkip : 0}`
      : `mailboxId=${selectedMailboxId}&folderPath=${encodeURIComponent(selectedFolderPath)}&top=50&skip=${append ? emailSkip : 0}`;

    // Reset pagination when loading a new folder/label (not appending)
    if (!append) {
      setEmailSkip(0);
      setHasMoreEmails(false);
      hasMoreEmailsRef.current = false;
      emailsAbortRef.current?.abort?.();
      const controller = new AbortController();
      emailsAbortRef.current = controller;

      setLoadingList(true);
      try {
        const res = await fetch(
          `${API_BASE}/emails?${urlParams}`,
          {
            signal: controller.signal,
            headers: getAuthHeaders(),
          }
        );

        if (res.status === 401) {
          removeAuthToken();
          setAuthTokenState(null);
          setCurrentUser(null);
          return;
        }

        const data = await res.json();
        const list = data.value || [];

        setEmails(list);
        const more = data.hasMore || false;
        setHasMoreEmails(more);
        hasMoreEmailsRef.current = more;
        setEmailSkip(data.skip || list.length);

        // Only keep selected email if it still exists in the new list, otherwise clear selection
        // Don't auto-select the first email when opening a folder
        const nextSelectedId =
          (selectedEmailId && list.some((m) => m.id === selectedEmailId) && selectedEmailId) ||
          null;

        setSelectedEmailId(nextSelectedId);
        setPreviewEmail(nextSelectedId ? list.find((m) => m.id === nextSelectedId) : null);
      } catch (e) {
        if (e?.name !== "AbortError") console.error(e);
      } finally {
        setLoadingList(false);
      }
    } else {
      // Append mode: load more emails
      if (loadingMore || !hasMoreEmails) return;

      setLoadingMore(true);
      loadingMoreRef.current = true;
      try {
        const appendParams = isLabelsMode
          ? `mailboxId=${selectedMailboxId}&category=${encodeURIComponent(selectedLabel)}&top=50&skip=${emailSkip}`
          : `mailboxId=${selectedMailboxId}&folderPath=${encodeURIComponent(selectedFolderPath)}&top=50&skip=${emailSkip}`;
        const res = await fetch(
          `${API_BASE}/emails?${appendParams}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (res.status === 401) {
          removeAuthToken();
          setAuthTokenState(null);
          setCurrentUser(null);
          return;
        }

        const data = await res.json();
        const newList = data.value || [];

        if (newList.length === 0 || data.hasMore === false) {
          setHasMoreEmails(false);
          hasMoreEmailsRef.current = false;
        } else {
          // Prevent duplicates
          setEmails((prev) => {
            const existingIds = new Set(prev.map((e) => e.id));
            const uniqueNew = newList.filter((e) => !existingIds.has(e.id));
            return uniqueNew.length > 0 ? [...prev, ...uniqueNew] : prev;
          });
          const existingIds = new Set(emails.map((e) => e.id));
          const uniqueNew = newList.filter((e) => !existingIds.has(e.id));
          const stopFetching = uniqueNew.length === 0 || !(data.hasMore === true);
          setHasMoreEmails(!stopFetching);
          hasMoreEmailsRef.current = !stopFetching;
          setEmailSkip(data.skip || emailSkip + newList.length);
        }
      } catch (e) {
        console.error("Error loading more emails:", e);
        setHasMoreEmails(false);
        hasMoreEmailsRef.current = false;
      } finally {
        setLoadingMore(false);
        loadingMoreRef.current = false;
      }
    }
  }, [authToken, selectedMailboxId, selectedFolderPath, selectedLabel, leftPaneTab, selectedEmailId, emailSkip, hasMoreEmails, loadingMore, emails]);

  loadEmailsRef.current = loadEmails;

  const handleSelectEmail = useCallback(
    (id) => {
      threadAbortRef.current?.abort?.();

      setSelectedEmailId(id);
      setThreadEmails([]);
      setExpandedById({});
      setLoadingThread(false);
      setShowHistoryById({});

      setPreviewEmail(emails.find((m) => m.id === id) || null);
    },
    [emails]
  );

  // Handle email actions from context menu (mark read/unread, delete, move to inbox)
  const handleEmailAction = useCallback(
    async (emailId, action) => {
      if (!authToken || !selectedMailboxId) return;

      const email = emails.find((m) => m.id === emailId);
      if (!email) return;

      const folderPath = email.folderPath || selectedFolderPath;

      try {
        if (action === "reply") {
          // Open mailto link for reply
          const senderEmail = email.from?.emailAddress?.address;
          const subject = email.subject || "";
          const replySubject = subject.startsWith("Re:") ? subject : `Re: ${subject}`;
          if (senderEmail) {
            window.location.href = `mailto:${senderEmail}?subject=${encodeURIComponent(replySubject)}`;
          }
        } else if (action === "markRead") {
          await markAsRead(emailId, folderPath);
        } else if (action === "markUnread") {
          await fetch(`${API_BASE}/email/${emailId}/read?mailboxId=${selectedMailboxId}&isRead=false`, {
            method: "PATCH",
            headers: getAuthHeaders(),
          });
          setEmails((prev) => prev.map((m) => (m.id === emailId ? { ...m, isRead: false } : m)));
          setPreviewEmail((prev) => (prev && prev.id === emailId ? { ...prev, isRead: false } : prev));
          setThreadEmails((prev) => prev.map((m) => (m.id === emailId ? { ...m, isRead: false } : m)));
          // Increment unread count
          setFolderCounts((prev) => {
            const next = { ...prev };
            if (next[folderPath]) {
              const curr = Number(next[folderPath].unread ?? 0);
              next[folderPath] = { ...next[folderPath], unread: curr + 1 };
            }
            return next;
          });
          await refreshFolderCounts();
        } else if (action === "delete") {
          await fetch(`${API_BASE}/email/${emailId}?mailboxId=${selectedMailboxId}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
          });
          // Remove from UI
          setEmails((prev) => prev.filter((m) => m.id !== emailId));
          if (selectedEmailId === emailId) {
            setSelectedEmailId(null);
            setPreviewEmail(null);
          }
          setThreadEmails((prev) => prev.filter((m) => m.id !== emailId));
          await refreshFolderCounts();
        } else if (action === "moveToInbox") {
          await fetch(`${API_BASE}/email/${emailId}/move?mailboxId=${selectedMailboxId}`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ destinationId: "inbox" }),
          });
          // Remove from current folder view
          setEmails((prev) => prev.filter((m) => m.id !== emailId));
          if (selectedEmailId === emailId) {
            setSelectedEmailId(null);
            setPreviewEmail(null);
          }
          setThreadEmails((prev) => prev.filter((m) => m.id !== emailId));
          await refreshFolderCounts();
        }
      } catch (err) {
        console.error(`Error performing ${action} on email:`, err);
        alert(`Failed to ${action} email. Please try again.`);
      }
    },
    [authToken, selectedMailboxId, emails, selectedFolderPath, markAsRead, refreshFolderCounts, selectedEmailId]
  );

  const refreshInbox = useCallback(async () => {
    threadAbortRef.current?.abort?.();
    threadCacheRef.current.clear();
    await Promise.all([loadEmails(), refreshFolderCounts()]);
  }, [loadEmails, refreshFolderCounts]);

  const loadThread = useCallback(async () => {
    if (!previewEmail?.conversationId || !authToken || !selectedMailboxId) return;

    const cid = previewEmail.conversationId;

    if (threadCacheRef.current.has(cid)) {
      const cached = threadCacheRef.current.get(cid);
      setThreadEmails(cached);
      const newest = cached[cached.length - 1];
      setExpandedById(newest?.id ? { [newest.id]: true } : {});
      return;
    }

    threadAbortRef.current?.abort?.();
    const controller = new AbortController();
    threadAbortRef.current = controller;

    try {
      setLoadingThread(true);
      const res = await fetch(`${API_BASE}/thread/${cid}?mailboxId=${selectedMailboxId}`, {
        signal: controller.signal,
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        removeAuthToken();
        setAuthTokenState(null);
        setCurrentUser(null);
        return;
      }

      const { value: msgsRaw } = await res.json();
      const msgs = msgsRaw || [];

      threadCacheRef.current.set(cid, msgs);
      setThreadEmails(msgs);

      const newest = msgs[msgs.length - 1];
      setExpandedById(newest?.id ? { [newest.id]: true } : {});
    } catch (e) {
      if (e?.name !== "AbortError") console.error(e);
    } finally {
      setLoadingThread(false);
    }
  }, [previewEmail?.conversationId, authToken, selectedMailboxId]);

  // ✅ Mark All As Unread (used by FolderTreeView right-click + MessageListPane icon)
  const markAllAsUnread = useCallback(
    async (targetPath) => {
      if (!authToken || !selectedMailboxId || !targetPath) return;

      // folders to process:
      // - if toggle-only container: process its descendants (and skip known containers)
      // - otherwise: process just targetPath
      let folderPathsToProcess = [];

      if (TOGGLE_ONLY.has(targetPath)) {
        folderPathsToProcess = allFolderPaths
          .filter((p) => p === targetPath || p.startsWith(targetPath + " > "))
          .filter((p) => !TOGGLE_ONLY.has(p));
      } else {
        folderPathsToProcess = [targetPath];
      }

      if (!folderPathsToProcess.length) return;

      // best-effort server updates (mark all messages as unread)
      const TOP = 200;
      let markedCount = 0;
      let errorOccurred = false;

      try {
        for (const folderPath of folderPathsToProcess) {
          const res = await fetch(
            `${API_BASE}/emails?mailboxId=${selectedMailboxId}&folderPath=${encodeURIComponent(
              folderPath
            )}&top=${TOP}`,
            { headers: getAuthHeaders() }
          );

          if (res.status === 401) {
            removeAuthToken();
            setAuthTokenState(null);
            setCurrentUser(null);
            return;
          }

          if (!res.ok) {
            console.error(`Failed to fetch emails for ${folderPath}:`, res.status, res.statusText);
            errorOccurred = true;
            continue;
          }

          const data = await res.json();
          const list = data.value || [];
          // Mark ALL emails as unread (both read and unread ones)
          if (!list.length) continue;

          // Use batch API instead of individual calls
          const emailIds = list.map((m) => m.id);
          try {
            const batchRes = await fetch(`${API_BASE}/emails/mark-read?mailboxId=${selectedMailboxId}`, {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify({
                emailIds,
                isRead: false,
                folderPath,
              }),
            });

            if (batchRes.ok) {
              const batchData = await batchRes.json();
              markedCount += batchData.successCount || 0;
              if (batchData.errorCount > 0) {
                errorOccurred = true;
              }
            } else {
              console.error(`Failed to batch mark emails as unread:`, batchRes.status);
              errorOccurred = true;
            }
          } catch (err) {
            console.error(`Error batch marking emails as unread:`, err);
            errorOccurred = true;
          }

          if (folderPath === selectedFolderPath) {
            // Update UI state - mark all as unread
            setEmails((prev) => prev.map((m) => ({ ...m, isRead: false })));
            setPreviewEmail((prev) => (prev ? { ...prev, isRead: false } : null));
            setThreadEmails((prev) => prev.map((m) => ({ ...m, isRead: false })));
          }
        }

        // Refresh folder counts after marking as unread to ensure accuracy
        if (markedCount > 0 || !errorOccurred) {
          await refreshFolderCounts();
        }

        if (errorOccurred) {
          console.warn("Some emails may not have been marked as unread. Refreshing counts...");
          // Still refresh counts even if there were errors
          await refreshFolderCounts();
        }
      } catch (e) {
        console.error("markAllAsUnread error:", e);
        // Refresh counts even on error to get accurate state
        await refreshFolderCounts();
      }
    },
    [authToken, selectedMailboxId, TOGGLE_ONLY, allFolderPaths, selectedFolderPath, refreshFolderCounts]
  );

  // ✅ Mark All As Read (used by FolderTreeView right-click)
  const markAllAsRead = useCallback(
    async (targetPath) => {
      if (!authToken || !selectedMailboxId || !targetPath) return;

      let folderPathsToProcess = [];
      if (TOGGLE_ONLY.has(targetPath)) {
        folderPathsToProcess = allFolderPaths
          .filter((p) => p === targetPath || p.startsWith(targetPath + " > "))
          .filter((p) => !TOGGLE_ONLY.has(p));
      } else {
        folderPathsToProcess = [targetPath];
      }
      if (!folderPathsToProcess.length) return;

      const TOP = 200;
      let markedCount = 0;
      let errorOccurred = false;

      try {
        for (const folderPath of folderPathsToProcess) {
          const res = await fetch(
            `${API_BASE}/emails?mailboxId=${selectedMailboxId}&folderPath=${encodeURIComponent(
              folderPath
            )}&top=${TOP}`,
            { headers: getAuthHeaders() }
          );

          if (res.status === 401) {
            removeAuthToken();
            setAuthTokenState(null);
            setCurrentUser(null);
            return;
          }

          if (!res.ok) {
            console.error(`Failed to fetch emails for ${folderPath}:`, res.status, res.statusText);
            errorOccurred = true;
            continue;
          }

          const data = await res.json();
          const list = data.value || [];
          if (!list.length) continue;

          const emailIds = list.map((m) => m.id);
          try {
            const batchRes = await fetch(`${API_BASE}/emails/mark-read?mailboxId=${selectedMailboxId}`, {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify({
                emailIds,
                isRead: true,
                folderPath,
              }),
            });

            if (batchRes.ok) {
              const batchData = await batchRes.json();
              markedCount += batchData.successCount || 0;
              if (batchData.errorCount > 0) errorOccurred = true;
            } else {
              console.error(`Failed to batch mark emails as read:`, batchRes.status);
              errorOccurred = true;
            }
          } catch (err) {
            console.error(`Error batch marking emails as read:`, err);
            errorOccurred = true;
          }

          if (folderPath === selectedFolderPath) {
            setEmails((prev) => prev.map((m) => ({ ...m, isRead: true })));
            setPreviewEmail((prev) => (prev ? { ...prev, isRead: true } : null));
            setThreadEmails((prev) => prev.map((m) => ({ ...m, isRead: true })));
          }
        }

        if (markedCount > 0 || !errorOccurred) {
          await refreshFolderCounts();
        }
        if (errorOccurred) {
          console.warn("Some emails may not have been marked as read. Refreshing counts...");
          await refreshFolderCounts();
        }
      } catch (e) {
        console.error("markAllAsRead error:", e);
        await refreshFolderCounts();
      }
    },
    [authToken, selectedMailboxId, TOGGLE_ONLY, allFolderPaths, selectedFolderPath, refreshFolderCounts]
  );

  // Initialize auth on mount (mailboxes are loaded by the "Reload mailboxes when auth token is available" effect)
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setAuthTokenState(token);
      verifyAndLoadUser(token).then((isValid) => {
        setLoadingAuth(false);
      });
    } else {
      setLoadingAuth(false);
    }

    // Check for OAuth callback
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    if (connected === "1") {
      // Mailboxes will be reloaded when auth effect runs after currentUser is set
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Reload mailboxes when auth token is available
  useEffect(() => {
    if (authToken && currentUser && mailboxes.length === 0) {
      loadMailboxesRef.current();
    }
  }, [authToken, currentUser, mailboxes.length]);

  // Keep refs in sync with state so scroll handler sees latest hasMore/loading
  useEffect(() => {
    hasMoreEmailsRef.current = hasMoreEmails;
    loadingMoreRef.current = loadingMore;
  }, [hasMoreEmails, loadingMore]);

  // Load emails when mailbox, folder, or label changes — clear list and show loading, then fetch
  useEffect(() => {
    if (!authToken || !selectedMailboxId) return;
    if (leftPaneTab === "labels" && !selectedLabel) return;
    setEmails([]);
    setSelectedEmailId(null);
    setPreviewEmail(null);
    setThreadEmails([]);
    setHasMoreEmails(false);
    hasMoreEmailsRef.current = false;
    setEmailSkip(0);
    setLoadingList(true);
    loadEmailsRef.current();
  }, [authToken, selectedMailboxId, selectedFolderPath, selectedLabel, leftPaneTab]);

  // WebSocket: refetch folder counts and/or emails when backend pushes (move to inbox, new mail via cron invalidation)
  const wsRef = useRef(null);
  const refreshFolderCountsRef = useRef(refreshFolderCounts);
  const loadEmailsRefForWs = useRef(loadEmails);
  refreshFolderCountsRef.current = refreshFolderCounts;
  loadEmailsRefForWs.current = loadEmails;

  useEffect(() => {
    if (!authToken) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }
    const url = `${WS_BASE}/ws`;
    let ws;
    try {
      ws = new WebSocket(url);
    } catch (e) {
      return;
    }
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "auth", token: authToken }));
    };
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "folderCountsInvalidated" && msg.mailboxId != null) {
          const mid = Number(msg.mailboxId);
          if (mid === selectedMailboxIdRef.current) {
            refreshFolderCountsRef.current(mid);
            loadEmailsRefForWs.current(false);
          }
        }
        if (msg.type === "folderUpdated" && msg.mailboxId != null) {
          const mid = Number(msg.mailboxId);
          if (mid === selectedMailboxIdRef.current) {
            refreshFolderCountsRef.current(mid);
            loadEmailsRefForWs.current(false);
          }
        }
      } catch (_) { }
    };
    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [authToken, selectedMailboxId]);

  // Clear folder counts when mailbox changes to prevent showing wrong counts
  useEffect(() => {
    setFolderCounts({});
    if (selectedMailboxId && authToken) {
      refreshFolderCounts(selectedMailboxId);
    }
  }, [selectedMailboxId, authToken, refreshFolderCounts]);

  // Fetch all connected mailbox display names at first (backend cache). Used for mailbox selector / top bar.
  useEffect(() => {
    if (!authToken || mailboxes.length === 0) {
      setMailboxDisplayNamesCache({});
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/me/mailbox-display-names`, {
          headers: getAuthHeadersWithToken(authToken),
        });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          setMailboxDisplayNamesCache(typeof data === "object" && data !== null ? data : {});
        } else {
          setMailboxDisplayNamesCache({});
        }
      } catch {
        if (!cancelled) setMailboxDisplayNamesCache({});
      }
    })();
    return () => { cancelled = true; };
  }, [authToken, mailboxes.length]);

  useEffect(() => {
    if (!selectedEmailId || !previewEmail) return;
    if (previewEmail.isRead) return;
    if (readRequestedRef.current.has(selectedEmailId)) return;

    readRequestedRef.current.add(selectedEmailId);
    markAsRead(selectedEmailId, previewEmail.folderPath || selectedFolderPath);
  }, [selectedEmailId, previewEmail, markAsRead, selectedFolderPath]);

  useEffect(() => {
    return () => {
      emailsAbortRef.current?.abort?.();
      threadAbortRef.current?.abort?.();
    };
  }, []);

  const selectedMailbox = mailboxes.find((mb) => mb.id === selectedMailboxId);

  const handleSignOut = useCallback(() => {
    removeAuthToken();
    setAuthTokenState(null);
    setCurrentUser(null);
    setMailboxes([]);
    setSelectedMailboxId(null);
  }, []);

  // Loading state
  if (loadingAuth) {
    return (
      <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
        <div style={{ fontSize: 14, color: "rgba(0,0,0,0.6)" }}>Loading...</div>
      </div>
    );
  }

  // Not authenticated
  if (!authToken || !currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Show change password page
  if (showChangePassword) {
    return (
      <ChangePassword
        currentUser={currentUser}
        authToken={authToken}
        onBack={() => setShowChangePassword(false)}
      />
    );
  }

  // Show mailbox management page
  if (showMailboxManagement) {
    return (
      <MailboxManagement
        mailboxes={mailboxes}
        mailboxesTotal={mailboxesTotal}
        mailboxesHasMore={mailboxesHasMore}
        mailboxesLoadingMore={mailboxesLoadingMore}
        onLoadMore={() => loadMailboxes({ append: true })}
        authToken={authToken}
        onRefresh={() => loadMailboxes()}
        onBack={() => setShowMailboxManagement(false)}
        onConnectNew={connectMailbox}
        mailboxDisplayNamesCache={mailboxDisplayNamesCache}
      />
    );
  }

  // Authenticated but no connected mailboxes
  const connectedMailboxes = mailboxes.filter((mb) => mb.is_connected);
  if (connectedMailboxes.length === 0) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, rgba(11,95,255,0.02), rgba(226,33,15,0.02))",
          overflowY: "auto",
        }}
      >
        {/* Header */}
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
            style={{
              height: 60,
              width: "auto",
              objectFit: "contain",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Welcome, {currentUser.username}!</h2>
          <p style={{ margin: 0, color: "rgba(0,0,0,0.6)", fontSize: 14 }}>
            Connect your Microsoft mailbox to get started.
          </p>
          <button
            onClick={connectMailbox}
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
            <span className="material-icons-outlined" style={{ fontSize: 18 }}>
              add
            </span>
            Connect Mailbox
          </button>
        </div>

        {/* Mailboxes List */}
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
                        style={{
                          fontSize: 24,
                          color: mailbox.is_connected ? "#0b5fff" : "rgba(0,0,0,0.4)",
                        }}
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
                      onClick={() => setSelectedMailboxId(mailbox.id)}
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
                  onClick={() => loadMailboxes({ append: true })}
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
              style={{
                fontSize: 64,
                color: "rgba(0,0,0,0.3)",
                marginBottom: 16,
                display: "block",
              }}
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

  // No mailbox selected
  if (!selectedMailboxId) {
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
          style={{
            height: 50,
            width: "auto",
            objectFit: "contain",
            marginBottom: 8,
          }}
          onError={(e) => {
            // Fallback if logo not found
            e.target.style.display = "none";
          }}
        />
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Select a mailbox</h2>
        <MailboxSelector
          mailboxes={mailboxes}
          selectedMailboxId={selectedMailboxId}
          onSelectMailbox={setSelectedMailboxId}
          onConnectNew={connectMailbox}
          mailboxDisplayNamesCache={mailboxDisplayNamesCache}
        />
      </div>
    );
  }

  // Main app (mailbox selected)
  return (
    <div
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
        mailboxes={mailboxes}
        loadingList={loadingList}
        onRefresh={refreshInbox}
        onSelectMailbox={setSelectedMailboxId}
        onConnectMailbox={connectMailbox}
        onManageMailboxes={() => setShowMailboxManagement(true)}
        onSignOut={handleSignOut}
        onChangePassword={() => setShowChangePassword(true)}
        mailboxDisplayNamesCache={mailboxDisplayNamesCache}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden", minWidth: 0 }}>
        <div
          style={{
            width: folderPaneWidth,
            minWidth: FOLDER_PANE_MIN,
            maxWidth: FOLDER_PANE_MAX,
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
            onTabChange={(tab) => {
              setLeftPaneTab(tab);
              if (tab === "folders") {
                setSelectedLabel(null);
              } else {
                setEmails([]);
                setHasMoreEmails(false);
                hasMoreEmailsRef.current = false;
              }
              setSelectedEmailId(null);
              setPreviewEmail(null);
              setThreadEmails([]);
              setExpandedById({});
              setShowHistoryById({});
              threadCacheRef.current.clear();
            }}
            selectedFolderPath={selectedFolderPath}
            hoveredFolderPath={hoveredFolderPath}
            setHoveredFolderPath={setHoveredFolderPath}
            expandedFolders={expandedFolders}
            setExpandedFolders={setExpandedFolders}
            folderCounts={folderCounts}
            onMarkAllAsUnread={markAllAsUnread}
            onMarkAllAsRead={markAllAsRead}
            onSelectFolderPath={(path) => {
              setSelectedFolderPath(path);
              setSelectedEmailId(null);
              setPreviewEmail(null);
              setThreadEmails([]);
              setExpandedById({});
              setShowHistoryById({});
              threadCacheRef.current.clear();
            }}
            selectedLabel={selectedLabel}
            onSelectLabel={(category) => {
              setSelectedLabel(category);
              setSelectedEmailId(null);
              setPreviewEmail(null);
              setThreadEmails([]);
              setExpandedById({});
              setShowHistoryById({});
              threadCacheRef.current.clear();
            }}
          />
        </div>

        <Resizer
          defaultWidth={folderPaneWidth}
          minWidth={FOLDER_PANE_MIN}
          maxWidth={FOLDER_PANE_MAX}
          onResize={setFolderPaneWidth}
        />

        <div
          style={{
            width: listPaneWidth,
            minWidth: LIST_PANE_MIN,
            maxWidth: LIST_PANE_MAX,
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
            listTitle={
              leftPaneTab === "labels"
                ? selectedLabel
                  ? [...LABELS_CONFIG.jobBoards, ...LABELS_CONFIG.roles].find((l) => l.category === selectedLabel)?.display ?? selectedLabel
                  : "Select a label"
                : null
            }
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
          />
        </div>

        <Resizer
          defaultWidth={listPaneWidth}
          minWidth={LIST_PANE_MIN}
          maxWidth={LIST_PANE_MAX}
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
          {/* Right pane toolbar — matches MessageListPane header height/style for aligned content */}
          <div
            style={{
              flexShrink: 0,
              height: 40,
              padding: "0 10px",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              minWidth: 0,
              background: "#fff",
              boxSizing: "border-box",
            }}
          >
            <span
              className="material-icons-outlined"
              style={{ fontSize: 18, color: "rgba(0,0,0,0.80)", flexShrink: 0 }}
              aria-hidden
            >
              {replyToEmail
                ? "reply"
                : previewEmail
                  ? "mail"
                  : "mail_outline"}
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
              title={replyToEmail ? "Reply" : previewEmail ? (previewEmail.subject || "No subject") : "Preview"}
            >
              {replyToEmail
                ? "Reply"
                : previewEmail
                  ? (previewEmail.subject || "No subject")
                  : "Preview"}
            </div>
          </div>

          {/* Content area — flex layout, no scroll here so empty state never shows scrollbar */}
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
                  color: "rgba(0,0,0,0.45)",
                  fontSize: 14,
                  transform: "translateY(-50px)",
                }}
              >
                <span className="material-icons-outlined" style={{ fontSize: 48, opacity: 0.5 }}>
                  visibility
                </span>
                <span style={{ fontWeight: 500 }}>Select an email to preview</span>
                <span style={{ fontSize: 12, fontWeight: 400 }}>Preview appears here</span>
              </div>
            )}

            {replyToEmail && (
              <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
                <ReplyPanel
                  replyToEmail={replyToEmail}
                  mailboxId={selectedMailboxId}
                  onClose={() => setReplyToEmail(null)}
                  onSent={() => setReplyToEmail(null)}
                />
              </div>
            )}

            {previewEmail && !replyToEmail && (
              <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
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
    </div>
  );
}

export default App;
