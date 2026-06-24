import React, { useState } from "react";
import { uploadDocumentToCloudinary } from "../../lib/githubSave";

export default function DocumentUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadDocumentToCloudinary(file);
      onChange(url);
    } catch (err) {
      alert("Erreur upload : " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {value && (
        <a href={value} target="_blank" rel="noreferrer" style={{ fontSize: "0.8rem", color: "var(--accent)", wordBreak: "break-all" }}>
          {value}
        </a>
      )}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <label style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "10px 18px", background: "var(--accent)", color: "#0a0a0b",
          borderRadius: 999, fontWeight: 600, fontSize: "0.82rem",
          letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer"
        }}>
          {uploading ? "Envoi en cours..." : "📄 Choisir un fichier"}
          <input type="file" onChange={handleFile} style={{ display: "none" }} disabled={uploading} />
        </label>
        <span style={{ color: "var(--fg-muted)", fontSize: "0.78rem" }}>ou</span>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Coller une URL..."
          style={{
            flex: 1, minWidth: 200,
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 10, padding: "10px 14px", color: "var(--fg)", fontSize: "0.9rem"
          }}
        />
      </div>
    </div>
  );
}
