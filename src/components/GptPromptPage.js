import React, { useState, useEffect } from "react";
import { API_BASE } from "../utils/constants";
import { getAuthHeaders } from "../utils/auth";

const DEFAULT_PROMPT = "Write a formal, senior-level professional response suitable for job-related communication. Use precise, business-appropriate language.";

const GptPromptPage = ({ currentUser, onBack, authToken }) => {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/me/settings/gpt-prompt`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (!cancelled) setError(data.error || "Failed to load prompt.");
          return;
        }
        if (!cancelled && data.prompt != null) setPrompt(data.prompt);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load prompt.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/me/settings/gpt-prompt`, {
        method: "PUT",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() || DEFAULT_PROMPT }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to save prompt.");
        return;
      }
      setSuccess(true);
      if (data.prompt != null) setPrompt(data.prompt);
    } catch (err) {
      setError(err.message || "Failed to save prompt.");
    } finally {
      setSaving(false);
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, rgba(11,95,255,0.03), rgba(0,0,0,0.02))",
    padding: 24,
  };

  const cardStyle = {
    maxWidth: 560,
    width: "100%",
    background: "#fff",
    borderRadius: 16,
    padding: 28,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
    border: "1px solid rgba(0,0,0,0.06)",
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(0,0,0,0.6)", fontSize: 14 }}>
            <span className="material-icons-outlined" style={{ fontSize: 24, animation: "spin 1s linear infinite" }}>refresh</span>
            Loading…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "rgba(0,0,0,0.9)" }}>
            GPT reply prompt
          </h1>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.1)",
              background: "#fff",
              cursor: "pointer",
              color: "rgba(0,0,0,0.6)",
            }}
            aria-label="Back"
          >
            <span className="material-icons-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(0,0,0,0.6)", lineHeight: 1.5 }}>
          This prompt is used when generating or suggesting reply text. New users get the default below; you can edit it to match your tone.
        </p>
        <form onSubmit={handleSave}>
          <label htmlFor="gpt-prompt" style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.7)", marginBottom: 8 }}>
            Prompt
          </label>
          <textarea
            id="gpt-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={DEFAULT_PROMPT}
            rows={6}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 14px",
              fontSize: 14,
              lineHeight: 1.5,
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 10,
              background: "rgba(0,0,0,0.02)",
              color: "rgba(0,0,0,0.9)",
              resize: "vertical",
              outline: "none",
            }}
          />
          {error && (
            <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(220,53,69,0.08)", borderRadius: 8, fontSize: 13, color: "#b52b3b" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(40,167,69,0.08)", borderRadius: 8, fontSize: 13, color: "#1e7e34" }}>
              Saved.
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              type="button"
              onClick={onBack}
              style={{
                padding: "10px 18px",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "#fff",
                color: "rgba(0,0,0,0.8)",
                cursor: "pointer",
              }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "10px 18px",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 10,
                border: "none",
                background: "#1a73e8",
                color: "#fff",
                cursor: saving ? "wait" : "pointer",
                opacity: saving ? 0.8 : 1,
              }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GptPromptPage;
