import React from "react";
import FolderTreeView from "./FolderTreeView";
import LabelsPane from "./LabelsPane";

const tabStyle = (active) => ({
  flex: 1,
  padding: "8px 12px",
  border: "none",
  borderBottom: active ? "2px solid #0b5fff" : "2px solid transparent",
  background: "transparent",
  fontSize: 12.5,
  fontWeight: active ? 800 : 600,
  color: active ? "rgba(11,95,255,0.95)" : "rgba(0,0,0,0.6)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  boxSizing: "border-box",
});

const FolderPane = React.memo(function FolderPane({
  tree,
  activeTab,
  onTabChange,
  selectedFolderPath,
  hoveredFolderPath,
  setHoveredFolderPath,
  expandedFolders,
  setExpandedFolders,
  onSelectFolderPath,
  folderCounts,
  onMarkAllAsUnread,
  onMarkAllAsRead,
  selectedLabel,
  onSelectLabel,
}) {
  return (
    <div
      style={{
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        background: "rgba(0,0,0,0.015)",
      }}
    >
      <div
        style={{
          display: "flex",
          height: 40,
          flexShrink: 0,
          alignItems: "stretch",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          background: "#fff",
          boxSizing: "border-box",
        }}
      >
        <button
          type="button"
          style={tabStyle(activeTab === "folders")}
          onClick={() => onTabChange("folders")}
        >
          <span className="material-icons-outlined" style={{ fontSize: 18 }}>folder</span>
          Folders
        </button>
        <button
          type="button"
          style={tabStyle(activeTab === "labels")}
          onClick={() => onTabChange("labels")}
        >
          <span className="material-icons-outlined" style={{ fontSize: 18 }}>label</span>
          Labels
        </button>
      </div>
      {activeTab === "folders" && (
        <div style={{ flex: 1, overflow: "auto", padding: "12px 4px" }}>
          <FolderTreeView
            tree={tree}
            selectedPath={selectedFolderPath}
            hoveredPath={hoveredFolderPath}
            onHoverPath={setHoveredFolderPath}
            expandedSet={expandedFolders}
            onMarkAllAsUnread={onMarkAllAsUnread}
            onMarkAllAsRead={onMarkAllAsRead}
            folderCounts={folderCounts}
            onToggleExpand={(path) => {
              setExpandedFolders((prev) => {
                const next = new Set(prev);
                if (next.has(path)) next.delete(path);
                else next.add(path);
                return next;
              });
            }}
            onSelectPath={onSelectFolderPath}
          />
        </div>
      )}
      {activeTab === "labels" && (
        <LabelsPane selectedLabel={selectedLabel} onSelectLabel={onSelectLabel} />
      )}
    </div>
  );
});

export default FolderPane;
