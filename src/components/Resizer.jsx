import React, { useCallback, useEffect, useState } from "react";

/**
 * Vertical resizer between two panes. Call onResize(newWidth) with the new width for the left pane.
 */
const Resizer = ({ onResize, minWidth = 180, maxWidth = 500, defaultWidth, style: styleOverride }) => {
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(defaultWidth);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
    setStartX(e.clientX);
    setStartWidth(defaultWidth);
  }, [defaultWidth]);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e) => {
      const delta = e.clientX - startX;
      const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth + delta));
      onResize(newWidth);
    };
    const handleMouseUp = () => setDragging(false);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, startX, startWidth, minWidth, maxWidth, onResize]);

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      onMouseDown={handleMouseDown}
      style={{
        width: 5,
        flexShrink: 0,
        cursor: "col-resize",
        background: dragging ? "#dbeafe" : "rgba(241, 245, 249, 1)",
        borderLeft: dragging ? "1px solid #93c5fd" : "none",
        borderRight: dragging ? "1px solid #3b82f6" : "1px solid rgba(226, 232, 240, 1)",
        transition: "background 0.15s ease, border-color 0.15s ease",
        ...styleOverride,
      }}
    />
  );
};

export default Resizer;
