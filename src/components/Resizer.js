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
        width: 6,
        flexShrink: 0,
        cursor: "col-resize",
        background: dragging ? "rgba(11,95,255,0.15)" : "rgba(0,0,0,0.06)",
        borderLeft: "1px solid rgba(0,0,0,0.06)",
        borderRight: "1px solid rgba(0,0,0,0.06)",
        ...styleOverride,
      }}
    />
  );
};

export default Resizer;
