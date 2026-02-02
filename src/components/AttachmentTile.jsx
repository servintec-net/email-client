import React, { useEffect, useRef, useState } from "react";
import { formatBytes, getFileMeta } from "../utils/helper";
import { API_BASE } from "../utils/constants";
import { getAuthHeaders } from "../utils/auth";

const AttachmentTile = React.memo(function AttachmentTile({ att, msgId, mailboxId, authToken }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);

  const name = att?.name || "Attachment";
  const type = (att?.contentType || "").toLowerCase();
  const ext = (name.split(".").pop() || "").toLowerCase();

  const isImage =
    type.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"].includes(ext);
  const isPdf = type === "application/pdf" || ext === "pdf";
  const canPreview = isImage || isPdf;

  const inlineUrl =
    `${API_BASE}/email/${msgId}/attachment/${att.id}` +
    `?mailboxId=${mailboxId}&disposition=inline`;

  const sizeLabel = typeof att.size === "number" ? formatBytes(att.size) : "";
  const meta = getFileMeta(ext, type);

  useEffect(() => {
    if (!canPreview) return;

    abortRef.current?.abort?.();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    fetch(inlineUrl, {
      signal: controller.signal,
      headers: getAuthHeaders(),
    })
      .then((r) => r.blob())
      .then((blob) => setPreviewUrl(URL.createObjectURL(blob)))
      .catch((e) => {
        if (e?.name !== "AbortError") console.error("preview fetch error:", e);
      })
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [inlineUrl, canPreview]);

  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.10)",
        borderRadius: 14,
        background: "rgba(255,255,255,0.75)",
        overflow: "hidden",
        width: 190,
        display: "flex",
        flexDirection: "column",
      }}
      title={name}
    >
      <div
        style={{
          height: 110,
          background: "rgba(0,0,0,0.04)",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
          overflow: "hidden",
        }}
        onClick={() => window.open(inlineUrl)}
      >
        {canPreview && loading && (
          <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 700 }}>
            Loading preview…
          </div>
        )}

        {canPreview && !loading && previewUrl && isImage && (
          <img
            src={previewUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            draggable={false}
          />
        )}

        {canPreview && !loading && previewUrl && isPdf && (
          <iframe title="pdf-preview" src={previewUrl} style={{ width: "100%", height: "100%", border: 0 }} />
        )}

        {!canPreview && (
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 14,
              border: "1px solid rgba(0,0,0,0.10)",
              background: "rgba(255,255,255,0.8)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
              fontSize: 26,
            }}
            aria-hidden
          >
            {meta.icon}
          </div>
        )}
      </div>

      <div style={{ padding: 9, display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "rgba(0,0,0,0.78)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontSize: 11.5, color: "rgba(0,0,0,0.55)", fontWeight: 800 }}>{meta.label}</div>
          <div style={{ fontSize: 11.5, color: "rgba(0,0,0,0.55)", fontWeight: 800 }}>{sizeLabel}</div>
        </div>

        <div style={{ flex: 1 }} />

        <button
          style={{
            width: "100%",
            border: "1px solid rgba(0,0,0,0.12)",
            background: "#fff",
            borderRadius: 9,
            padding: "7px 9px",
            cursor: "pointer",
            fontWeight: 800,
            fontSize: 12.5,
          }}
          onClick={() => window.open(inlineUrl)}
        >
          Open
        </button>
      </div>
    </div>
  );
});

export default AttachmentTile;
