import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProjectGallery({ project, onClose }) {
  const media = [
    { type: "image", url: project.image },
    ...(project.gallery || []),
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrent((c) => Math.min(c + 1, media.length - 1));
      if (e.key === "ArrowLeft") setCurrent((c) => Math.max(c - 1, 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [media.length, onClose]);

  const getVideoEmbed = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const id = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("vimeo.com")) {
      const id = url.split("/").pop();
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "90vw", maxWidth: 900, display: "flex", flexDirection: "column", gap: 16,
      }}>
        {/* Bouton fermer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "var(--accent)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{project.category}</div>
            <div style={{ color: "#fff", fontFamily: "var(--heading-font)", fontSize: "1.2rem" }}>{project.title}</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={18} color="white" />
          </button>
        </div>

        {/* Media principal */}
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200, maxHeight: "75vh" }}>
          {media[current]?.type === "video"
            ? <iframe src={getVideoEmbed(media[current].url)} style={{ width: "100%", height: "100%", border: "none" }} allowFullScreen />
            : <img src={media[current]?.url} alt="" style={{ maxWidth: "100%", maxHeight: "75vh", objectFit: "contain", margin: "0 auto", display: "block" }} />
          }
          {/* Légende */}
          {media[current]?.caption && (
            <div style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.78rem",
              letterSpacing: "0.05em",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 10,
              fontStyle: "italic",
            }}>
              {media[current].caption}
            </div>
          )}

          {/* Flèches */}
          {current > 0 && (
            <button onClick={() => setCurrent(c => c - 1)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft size={20} color="white" />
            </button>
          )}
          {current < media.length - 1 && (
            <button onClick={() => setCurrent(c => c + 1)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={20} color="white" />
            </button>
          )}
        </div>

        {/* Miniatures */}
        {media.length > 1 && (
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {media.map((m, i) => (
              <div key={i} onClick={() => setCurrent(i)} style={{
                flexShrink: 0, width: 80, height: 54, borderRadius: 8, overflow: "hidden",
                border: i === current ? "2px solid var(--accent)" : "2px solid transparent",
                cursor: "pointer", background: "#111",
              }}>
                {m.type === "video"
                  ? <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.7rem" }}>▶</div>
                  : <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                }
              </div>
            ))}
          </div>
        )}

        {/* Compteur */}
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>
          {current + 1} / {media.length}
        </div>
      </div>
    </div>
  );
}
