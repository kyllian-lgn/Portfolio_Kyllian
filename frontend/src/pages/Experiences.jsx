import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Star, ExternalLink } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import Marquee from "../components/Marquee";

export default function Experiences() {
  const { content, loading } = usePortfolio();
  const [filter, setFilter] = useState("Tout");

  const types = useMemo(() => {
    if (!content) return [];
    return ["Tout", ...Array.from(new Set(content.experiences.map((e) => e.type)))];
  }, [content]);

  if (loading || !content) return <div style={{ minHeight: "100vh" }} />;

  const visible = filter === "Tout" ? content.experiences : content.experiences.filter((e) => e.type === filter);

  return (
    <>
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

      <Marquee items={content.marquee} />

      <section className="section-pad" style={{ paddingTop: 80 }}>
        <div className="container-x">
          <div className="eyebrow reveal" style={{ marginBottom: 32 }}>01 — Alternances & Stages</div>

          <div className="filter-row reveal">
            {types.map((t) => (
              <button key={t} className={`filter-chip${filter === t ? " active" : ""}`} onClick={() => setFilter(t)} data-testid={`exp-filter-${t}`}>
                {t}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {visible.map((e, idx) => (
              <article key={e.id} className="card reveal" data-testid={`exp-${e.id}`}>
                <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>

                  {/* Colonne gauche — texte */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
                      <div>
                        <div className="eyebrow no-after" style={{ marginBottom: 14, fontSize: "0.7rem" }}>
                          {String(idx + 1).padStart(2, '0')} / {String(visible.length).padStart(2, '0')}
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
                      <a href={e.link} target="_blank" rel="noreferrer" style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        marginBottom: 16, color: "var(--accent)", fontSize: "0.85rem",
                        fontWeight: 600, textDecoration: "none",
                      }}>
                        <ExternalLink size={14} /> Voir le site
                      </a>
                    )}

                    <div>{e.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}</div>
                  </div>

                  {/* Colonne droite — images */}
                  {e.images?.length > 0 && (
                    <>
                      {/* CAS : 1 seule image — centrée et plus grande */}
                      {e.images.length === 1 && (
                        <div style={{ flexShrink: 0, width: 220, alignSelf: "center" }}>
                          <img
                            src={e.images[0].url || e.images[0]}
                            alt=""
                            style={{
                              width: "100%",
                              aspectRatio: "4/3",
                              objectFit: "cover",
                              borderRadius: 12,
                              border: "2px solid var(--border)",
                              boxShadow: "4px 4px 24px rgba(0,0,0,0.35)",
                            }}
                          />
                        </div>
                      )}

                      {/* CAS : 2 images — escalier diagonal bien visible */}
                      {e.images.length >= 2 && (
                        <div style={{
                          flexShrink: 0,
                          width: 260,
                          position: "relative",
                          height: 230,
                          alignSelf: "flex-start",
                          marginTop: 8,
                        }}>
                          {/* Image 1 — haut gauche, devant */}
                          <img
                            src={e.images[0].url || e.images[0]}
                            alt=""
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              width: "62%",
                              aspectRatio: "4/3",
                              objectFit: "cover",
                              borderRadius: 10,
                              border: "2px solid var(--border)",
                              zIndex: 2,
                              boxShadow: "4px 4px 20px rgba(0,0,0,0.4)",
                            }}
                          />
                          {/* Image 2 — bas droite, derrière */}
                          <img
                            src={e.images[1].url || e.images[1]}
                            alt=""
                            style={{
                              position: "absolute",
                              right: 0,
                              bottom: 0,
                              width: "62%",
                              aspectRatio: "4/3",
                              objectFit: "cover",
                              borderRadius: 10,
                              border: "2px solid var(--border)",
                              zIndex: 1,
                              boxShadow: "4px 4px 20px rgba(0,0,0,0.4)",
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}

                </div>
              </article>
            ))}
          </div>

          <div className="divider" />

          <div className="eyebrow reveal" style={{ marginBottom: 32 }}>03 — Compétences développées</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {content.skills.software.slice(0, 7).map((s) => (
              <div key={s.name} className="card reveal" style={{ padding: 20 }}>
                <div style={{ fontFamily: "var(--heading-font)", fontSize: "1rem", marginBottom: 10 }}>{s.name}</div>
                <div className="skill-bar"><div className="skill-bar-fill" style={{ width: `${s.level}%` }} /></div>
              </div>
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
