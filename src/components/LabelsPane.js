import React from "react";
import { LABELS_CONFIG } from "../utils/constants";

const sectionHeaderStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: "rgba(0,0,0,0.5)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  padding: "4px 8px",
  flexShrink: 0,
};

const LabelsPane = React.memo(function LabelsPane({ selectedLabel, onSelectLabel }) {
  return (
    <div
      style={{
        height: "95vh",
        maxHeight: "95vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "12px 4px",
      }}
    >
      <div
        style={{
          flex: LABELS_CONFIG.jobBoards.length,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={sectionHeaderStyle}>By Job Board</div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {LABELS_CONFIG.jobBoards.map((item) => {
            const isSelected = selectedLabel === item.category;
            return (
              <button
                key={item.category}
                type="button"
                onClick={() => onSelectLabel(item.category)}
                style={{
                  flex: 1,
                  minHeight: 24,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "2px 12px",
                  border: "none",
                  borderRadius: 8,
                  background: isSelected ? "rgba(11,95,255,0.12)" : "transparent",
                  color: isSelected ? "rgba(11,95,255,0.95)" : "rgba(0,0,0,0.78)",
                  fontSize: 13,
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
              >
                <span className="material-icons-outlined" style={{ fontSize: 16, opacity: 0.8 }}>
                  label
                </span>
                {item.display}
              </button>
            );
          })}
        </div>
      </div>
      <div
        style={{
          flex: LABELS_CONFIG.roles.length,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={sectionHeaderStyle}>By Roles</div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {LABELS_CONFIG.roles.map((item) => {
            const isSelected = selectedLabel === item.category;
            return (
              <button
                key={item.category}
                type="button"
                onClick={() => onSelectLabel(item.category)}
                style={{
                  flex: 1,
                  minHeight: 24,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "2px 12px",
                  border: "none",
                  borderRadius: 8,
                  background: isSelected ? "rgba(11,95,255,0.12)" : "transparent",
                  color: isSelected ? "rgba(11,95,255,0.95)" : "rgba(0,0,0,0.78)",
                  fontSize: 13,
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
              >
                <span className="material-icons-outlined" style={{ fontSize: 16, opacity: 0.8 }}>
                  work
                </span>
                {item.display}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default LabelsPane;
