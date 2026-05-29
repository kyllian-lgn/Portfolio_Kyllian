import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Star, ExternalLink, X } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

const Caption = ({ text }) => !text ? null : (
  <div style={{ marginTop: 8, fontSize: "0.72rem", color: "var(--fg-muted)", fontStyle: "italic", textAlign: "center", borderTop: "1px solid var(--border)", paddingTop: 6 }}>
    {text}
  </div>
);

export default function Experiences() {
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
        <div className="huge-bg" style={{ fontSize: "clamp(12rem, 28vw, 32rem)" }}>EXPÉRIENCE</div>
        <div className="container-x">
          <div className="eyebrow" style={{ marginBottom: 32 }}>Kyllian Le Guen — Parcours</div>
          <h1 className="display-1">Expériences<br /><span className="italic-orange">pro.</span></h1>
          <div style={{ display: "flex", gap: 60, marginTop: 48, flexWrap: "wrap" }}>
            <div className="stat"><div className="value">2 ans</div><div className="label">Aux Chantiers</div></div>
            <div className="stat"><div className="value">{content.experiences.length}</div><div className="label">Expériences</div></div>
            <div className="stat"><div className="value">10+</div><div className="label">Outils maîtrisés</div></div>
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ paddingTop: 80 }}>
        <div className="container-x">
          <div className="eyebrow reveal" style={{ marginBottom: 32 }}>01 — Alternances & Stages</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {content.experiences.map((e, idx) => (
              <article key={e.id} className="card reveal">
                <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
                      <div>
                        <div className="eyebrow no-after" style={{ marginBottom: 14, fontSize: "0.7rem" }}>
                          {String(idx + 1).padStart(2, '0')} / {String(content.experiences.length).padStart(2, '0')}
                        </div>
                        <h3 style={{ fontFamily: "var(--heading-font)", fontSize: "2rem", marginBottom: 8, lineHeight: 1.1 }}>{e.company}</h3>
                        <div style={{ color: "var(--fg-soft)", fontSize: "1rem" }}>{e.role}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span className="tag-pill accent">{e.type}</span>
                        <div style={{ color: "var(--fg-muted)", fontSize: "0.82rem", marginTop: 12 }}>{e.period}</div>
                      </div>
                    </div>
                    <ul style={{ paddingLeft: 18, color: "var(--fg-soft)", fontSize: "0.92rem", lineHeight: 1.8, margin: "0 0 24px" }}>
                      {e.missions.map((m, i) => <li key={i} style={{ marginBottom: 6 }}>{m}</li>)}
                    </ul>
                    {e.highlight && (
                      <div style={{ padding: "20px 24px", background: "var(--accent-soft)", borderLeft: "3px solid var(--accent)", borderRadius: "0 12px 12px 0", marginBottom: 20 }}>
                        <div className="eyebrow no-after" style={{ fontSize: "0.7rem", marginBottom: 10 }}><Star size={12} /> Projet phare</div>
                        <div style={{ color: "var(--fg)", fontSize: "0.95rem", lineHeight: 1.6 }}>{e.highlight}</div>
                      </div>
                    )}
                    {e.link && (
                      <a href={e.link} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16, color: "var(--accent)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
                        <ExternalLink size={14} /> Voir le site
                      </a>
                    )}
                    <div>{e.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}</div>
                  </div>

                  {e.images?.length > 0 && (
                    <div style={{ flexShrink: 0 }}>
                      {e.images.length === 1 && (
                        <div style={{ width: 220 }}>
                          <img src={e.images[0].url || e.images[0]} alt="" onClick={() => setLightbox(e.images[0])} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 12, border: "2px solid var(--border)", boxShadow: "4px 4px 24px rgba(0,0,0,0.35)", cursor: "zoom-in", transition: "transform 0.2s" }}
                            onMouseEnter={e2 => e2.target.style.transform = "scale(1.03)"}
                            onMouseLeave={e2 => e2.target.style.transform = "scale(1)"}
                          />
                          <Caption text={e.images[0]?.caption} />
                        </div>
                      )}
                      {e.images.length >= 2 && (
                        <div style={{ width: 260 }}>
                          <div style={{ position: "relative", height: 230 }}>
                            <img src={e.images[0].url || e.images[0]} alt="" onClick={() => setLightbox(e.images[0])} style={{ position: "absolute", left: 0, top: 0, width: "62%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 10, border: "2px solid var(--border)", zIndex: 2, boxShadow: "4px 4px 20px rgba(0,0,0,0.4)", cursor: "zoom-in", transition: "transform 0.2s" }}
                              onMouseEnter={e2 => { e2.target.style.transform = "scale(1.05)"; e2.target.style.zIndex = 3; }}
                              onMouseLeave={e2 => { e2.target.style.transform = "scale(1)"; e2.target.style.zIndex = 2; }}
                            />
                            <img src={e.images[1].url || e.images[1]} alt="" onClick={() => setLightbox(e.images[1])} style={{ position: "absolute", right: 0, bottom: 0, width: "62%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 10, border: "2px solid var(--border)", zIndex: 1, boxShadow: "4px 4px 20px rgba(0,0,0,0.4)", cursor: "zoom-in", transition: "transform 0.2s" }}
                              onMouseEnter={e2 => { e2.target.style.transform = "scale(1.05)"; e2.target.style.zIndex = 3; }}
                              onMouseLeave={e2 => { e2.target.style.transform = "scale(1)"; e2.target.style.zIndex = 1; }}
                            />
                          </div>
                          {(e.images[0]?.caption || e.images[1]?.caption) && (
                            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                              <div style={{ flex: 1, fontSize: "0.72rem", color: "var(--fg-muted)", fontStyle: "italic", textAlign: "center" }}>{e.images[0]?.caption}</div>
                              <div style={{ flex: 1, fontSize: "0.72rem", color: "var(--fg-muted)", fontStyle: "italic", textAlign: "center" }}>{e.images[1]?.caption}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="cta-banner reveal" style={{ marginTop: 80 }}>
            <div className="eyebrow" style={{ marginBottom: 24, justifyContent: "center" }}>Travaillons ensemble</div>
            <h2 className="display-2" style={{ marginBottom: 32 }}>Vous avez un projet<br /><span className="italic-orange">innovant ?</span></h2>
            <Link to="/contact" className="btn-primary">Me contacter <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
