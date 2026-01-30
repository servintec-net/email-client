import React from "react";

export default function LoadingScreen() {
  return (
    <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ fontSize: 14, color: "rgba(0,0,0,0.6)" }}>Loading...</div>
    </div>
  );
}
