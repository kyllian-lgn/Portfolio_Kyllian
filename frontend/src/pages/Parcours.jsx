import React, { useState } from "react";
import { Download, ExternalLink, X } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

const Caption = ({ text }) => !text ? null : (
  <div style={{ marginTop: 8, fontSize: "0.72rem", color: "var(--fg-muted)", fontStyle: "italic", textAlign: "center", borderTop: "1px solid var(--border)", paddingTop: 6 }}>
    {text}
  </div>
);

export default function Parcours() {
  const { content, loading } = usePortfolio();
  const [lightbox, setLightbox] = useState(null);

  if (loading || !content) return <div style={{ minHeight: "100vh" }} />;

  return (
    <>
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}>
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4 }}>
            <X size={32} />
          </button>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, maxWidth: "90vw" }}>
            <img src={lightbox.url} alt="" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain", borderRadius: 16, boxShadow: "0 8px 60px rgba(0,0,0,0.7)", cursor: "default" }} />
            {lightbox.caption && (
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 10, textAlign: "center" }}>
                {lightbox.caption}
              </div>
            )}
          </div>
        </div>
      )}

      <section className="hero" style={{ minHeight: "70vh" }}>
        <div className="huge-bg" style={{ fontSize: "clamp(12rem, 30vw, 35rem)" }}>PARCOURS</div>
        <div className="container-x">
          <div className="eyebrow" style={{ marginBottom: 32 }}>Kyllian Le Guen — Formation</div>
          <h1 className="display-1">Parcours<br /><span className="italic-orange">académique.</span></h1>
          <div style={{ display: "flex", gap: 60, marginTop: 48, flexWrap: "wrap" }}>
            <div className="stat"><div className="value">2023</div><div className="label">Début BUT</div></div>
            <div className="stat"><div className="value">2028</div><div className="label">Master visé</div></div>
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ paddingTop: 60 }}>
        <div className="container-x">
          <div className="eyebrow reveal" style={{ marginBottom: 60 }}>01 — Formations & Alternances</div>
          <div className="timeline">
            {content.education.map((e) => (
              <div className="timeline-item reveal" key={e.id}>
                <span className="timeline-dot" />
                <div className="card" style={{ marginLeft: 0 }}>
                  <div className="card-flex-row" style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                        <div className="eyebrow no-after" style={{ fontSize: "0.72rem" }}>{e.period}</div>
                        <span className="tag-pill accent">{e.tag}</span>
                      </div>
                      <h3 style={{ fontFamily: "var(--heading-font)", fontSize: "1.6rem", marginBottom: 8, lineHeight: 1.15 }}>{e.title}</h3>
                      <p style={{ color: "var(--fg-soft)", fontSize: "0.92rem", marginBottom: 20 }}>{e.place}</p>
                      <ul style={{ paddingLeft: 18, color: "var(--fg-soft)", fontSize: "0.92rem", lineHeight: 1.8, margin: 0 }}>
                        {e.details.map((d, i) => <li key={i} style={{ marginBottom: 6 }}>{d}</li>)}
                      </ul>
                      {e.link && (
                        <a href={e.link} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, color: "var(--accent)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
                          <ExternalLink size={14} /> Voir le site
                        </a>
                      )}
                    </div>

                    {e.images?.length > 0 && (
                      <div className="card-img-block" style={{ flexShrink: 0 }}>
                        {e.images.length === 1 && (
                          <div style={{ width: 220, maxWidth: "100%" }}>
                            <img
                              src={e.images[0].url || e.images[0]}
                              alt=""
                              onClick={() => setLightbox(e.images[0])}
                              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 12, border: "2px solid var(--border)", boxShadow: "4px 4px 24px rgba(0,0,0,0.35)", cursor: "zoom-in", transition: "transform 0.2s" }}
                              onMouseEnter={e2 => e2.target.style.transform = "scale(1.03)"}
                              onMouseLeave={e2 => e2.target.style.transform = "scale(1)"}
                            />
                            <Caption text={e.images[0]?.caption} />
                          </div>
                        )}
                        {e.images.length >= 2 && (
                          <div style={{ width: 240, maxWidth: "100%" }}>
                            {/* Image 1 */}
                            <div style={{ marginBottom: 12 }}>
                              <img
                                src={e.images[0].url || e.images[0]}
                                alt=""
                                onClick={() => setLightbox(e.images[0])}
                                style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 10, border: "2px solid var(--border)", boxShadow: "4px 4px 20px rgba(0,0,0,0.4)", cursor: "zoom-in", transition: "transform 0.2s", display: "block" }}
                                onMouseEnter={e2 => e2.target.style.transform = "scale(1.05)"}
                                onMouseLeave={e2 => e2.target.style.transform = "scale(1)"}
                              />
                              {e.images[0]?.caption && (
                                <div style={{ fontSize: "0.68rem", color: "var(--fg-muted)", fontStyle: "italic", textAlign: "center", marginTop: 4 }}>
                                  {e.images[0].caption}
                                </div>
                              )}
                            </div>
                            {/* Image 2 */}
                            <div>
                              <img
                                src={e.images[1].url || e.images[1]}
                                alt=""
                                onClick={() => setLightbox(e.images[1])}
                                style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 10, border: "2px solid var(--border)", boxShadow: "4px 4px 20px rgba(0,0,0,0.4)", cursor: "zoom-in", transition: "transform 0.2s", display: "block" }}
                                onMouseEnter={e2 => e2.target.style.transform = "scale(1.05)"}
                                onMouseLeave={e2 => e2.target.style.transform = "scale(1)"}
                              />
                              {e.images[1]?.caption && (
                                <div style={{ fontSize: "0.68rem", color: "var(--fg-muted)", fontStyle: "italic", textAlign: "center", marginTop: 4 }}>
                                  {e.images[1].caption}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cta-banner reveal" style={{ marginTop: 60 }}>
            <div className="eyebrow" style={{ marginBottom: 24, justifyContent: "center" }}>Mon parcours complet</div>
            <h2 className="display-2" style={{ marginBottom: 32 }}>Voir mon<br /><span className="italic-orange">CV complet.</span></h2>
            <a href={content.site.cvUrl} target="_blank" rel="noreferrer" className="btn-primary">
              Télécharger le CV <Download size={16} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
