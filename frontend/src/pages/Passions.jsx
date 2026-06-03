import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export default function Passions() {
  const { content, loading } = usePortfolio();
  const [lightbox, setLightbox] = useState(null);

  if (loading || !content) return <div style={{ minHeight: "100vh" }} />;

  const openLightbox = (images, index) => setLightbox({ images, index });
  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox(l => ({ ...l, index: Math.max(0, l.index - 1) }));
  const next = () => setLightbox(l => ({ ...l, index: Math.min(l.images.length - 1, l.index + 1) }));

  return (
    <>
      {lightbox && (
        <div onClick={closeLightbox} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "90vw", maxWidth: 900, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={closeLightbox} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={18} color="white" />
              </button>
            </div>
            <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200, maxHeight: "75vh" }}>
              <img src={lightbox.images[lightbox.index]?.url || lightbox.images[lightbox.index]} alt="" style={{ maxWidth: "100%", maxHeight: "75vh", objectFit: "contain", display: "block" }} />
              {lightbox.index > 0 && (
                <button onClick={prev} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronLeft size={20} color="white" />
                </button>
              )}
              {lightbox.index < lightbox.images.length - 1 && (
                <button onClick={next} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronRight size={20} color="white" />
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {lightbox.images.map((img, i) => (
                <div key={i} onClick={() => setLightbox(l => ({ ...l, index: i }))} style={{ flexShrink: 0, width: 70, height: 50, borderRadius: 8, overflow: "hidden", border: i === lightbox.index ? "2px solid var(--accent)" : "2px solid transparent", cursor: "pointer" }}>
                  <img src={img?.url || img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
            {lightbox.images[lightbox.index]?.caption && (
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 }}>
                {lightbox.images[lightbox.index].caption}
              </div>
            )}
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>
              {lightbox.index + 1} / {lightbox.images.length}
            </div>
          </div>
        </div>
      )}

      <section className="hero" style={{ minHeight: "70vh" }}>
        <div className="huge-bg" style={{ fontSize: "clamp(12rem, 28vw, 32rem)" }}>PASSIONS</div>
        <div className="container-x">
          <div className="eyebrow" style={{ marginBottom: 32 }}>Kyllian Le Guen — Loisirs</div>
          <h1 className="display-1">Passions<br /><span className="italic-orange">& loisirs.</span></h1>
          <div style={{ display: "flex", gap: 60, marginTop: 48, flexWrap: "wrap" }}>
            <div className="stat"><div className="value">{content.passions.travels.countries.length}</div><div className="label">Pays visités</div></div>
            <div className="stat"><div className="value">{content.passions.sports.length}</div><div className="label">Sports pratiqués</div></div>
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ paddingTop: 60 }}>
        <div className="container-x">
          <div className="eyebrow reveal" style={{ marginBottom: 40 }}>01 — Sports & Activités</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 28 }}>
            {content.passions.sports.map((s, i) => {
              const allImages = [{ url: s.image, caption: s.imageCaption || "" }, ...(s.gallery || [])];
              return (
                <article className="card reveal" key={i} style={{ overflow: "hidden", padding: 0 }}>
                  <div style={{ position: "relative", cursor: allImages.length > 1 ? "pointer" : "default" }}
                    onClick={() => allImages.length > 1 && openLightbox(allImages, 0)}>
                    <img src={s.image} alt={s.name} style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", filter: "grayscale(15%)" }} />
                    {allImages.length > 1 && (
                      <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.7)", borderRadius: 20, padding: "4px 10px", fontSize: "0.72rem", color: "white" }}>
                        📷 {allImages.length} photos
                      </div>
                    )}
                  </div>

                  <div style={{ padding: 32 }}>
                    <h3 style={{ fontFamily: "var(--heading-font)", fontSize: "1.8rem", marginBottom: 16 }}>{s.name}</h3>
                    <p style={{ color: "var(--fg-soft)", lineHeight: 1.7, marginBottom: 20 }}>{s.description}</p>
                    <span className="tag-pill accent">{s.tag}</span>

                    {s.gallery?.length > 0 && (
                      <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
                        {s.gallery.map((img, j) => (
                          <div key={j} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <div onClick={() => openLightbox(allImages, j + 1)} style={{ width: 72, height: 52, borderRadius: 8, overflow: "hidden", cursor: "pointer", border: "1px solid var(--border)", flexShrink: 0 }}>
                              <img src={img?.url || img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            {img?.caption && (
                              <div style={{ fontSize: "0.65rem", color: "var(--fg-muted)", fontStyle: "italic", textAlign: "center", maxWidth: 72 }}>
                                {img.caption}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="divider" />

          <div className="eyebrow reveal" style={{ marginBottom: 40 }}>02 — Voyages & Découvertes</div>
          <p className="reveal" style={{ maxWidth: 760, color: "var(--fg-soft)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: 40 }}>
            {content.passions.travels.description}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {content.passions.travels.countries.map((c) => (
              <div key={c} className="card reveal" style={{ padding: 28, textAlign: "center" }}>
                <MapPin size={18} style={{ color: "var(--accent)", marginBottom: 10 }} />
                <div style={{ fontFamily: "var(--heading-font)", fontSize: "1.4rem" }}>{c}</div>
              </div>
            ))}
          </div>

          <div className="cta-banner reveal" style={{ marginTop: 80 }}>
            <div className="eyebrow" style={{ marginBottom: 24, justifyContent: "center" }}>Parlons-nous</div>
            <h2 className="display-2" style={{ marginBottom: 32 }}>Un projet<br /><span className="italic-orange">commun ?</span></h2>
            <Link to="/contact" className="btn-primary">Me contacter <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
