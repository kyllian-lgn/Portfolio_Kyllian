import React, { useState } from "react";
import { uploadToCloudinary } from "../../lib/githubSave";
import { X, Plus } from "lucide-react";

export default function GalleryUpload({ value = [], onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || value.length >= 5) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange([...value, { type: "image", url }]);
    } catch (err) {
      alert("Erreur upload : " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const addVideo = () => {
    if (value.length >= 5) return;
    const url = window.prompt("Colle l'URL de ta vidéo (YouTube, Vimeo...) :");
    if (url) onChange([...value, { type: "video", url }]);
  };

  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {value.map((item, i) => (
          <div key={i} style={{ position: "relative", width: 100, height: 70, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" }}>
            {item.type === "image"
              ? <img src={item.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ width: "100%", height: "100%", background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "var(--fg-muted)" }}>▶ Vidéo</div>
            }
            <button onClick={() => remove(i)} style={{ position: "absolute", top: 3, right: 3, background: "rgba(0,0,0,0.7)", border: "none", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={10} color="white" />
            </button>
          </div>
        ))}
        {value.length < 5 && (
          <div style={{ display: "flex", gap: 8 }}>
            <label style={{ width: 100, height: 70, border: "1px dashed var(--border)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexDirection: "column", gap: 4, color: "var(--fg-muted)", fontSize: "0.7rem" }}>
              <Plus size={16} />
              {uploading ? "Envoi..." : "Image"}
              <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} disabled={uploading} />
            </label>
            <button onClick={addVideo} style={{ width: 100, height: 70, border: "1px dashed var(--border)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexDirection: "column", gap: 4, color: "var(--fg-muted)", fontSize: "0.7rem", background: "transparent" }}>
              <Plus size={16} />
              Vidéo
            </button>
          </div>
        )}
      </div>
      <p style={{ color: "var(--fg-muted)", fontSize: "0.75rem" }}>{value.length}/5 médias ajoutés</p>
    </div>
  );
}
