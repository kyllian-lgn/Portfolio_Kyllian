import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Images } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import ProjectGallery from "../components/ProjectGallery";

export default function Projects() {
  const { content, loading } = usePortfolio();
  const [galleryProject, setGalleryProject] = useState(null);
  const navigate = useNavigate();

  if (loading || !content) return <div style={{ minHeight: "100vh" }} />;

  const visible = content.projects;

  return (
    <>
      {galleryProject && (
        <ProjectGallery project={galleryProject} onClose={() => setGalleryProject(null)} />
      )}

      <section className="hero" style={{ minHeight: "70vh" }}>
        <div className="huge-bg" style={{ fontSize: "clamp(15rem, 35vw, 40rem)" }}>PROJETS</div>
        <div className="container-x">
          <div className="eyebrow" style={{ marginBottom: 32 }}>Kyllian Le Guen — Portfolio</div>
          <h1 className="display-1">Projets<br /><span className="italic-orange">réalisés.</span></h1>
          <div style={{ display: "flex", gap: 60, marginTop: 48, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className="stat"><div className="value">{content.projects.length}+</div><div className="label">Projets</div></div>
            {content._settings?.projectsHeroTags?.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 4 }}>
                {content._settings.projectsHeroTags.map((tag) => (
                  <div key={tag} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block", flexShrink: 0 }} />
                    <span style={{ color: "var(--fg-soft)", fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>{tag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ paddingTop: 60 }}>
        <div className="container-x">
          <div className="eyebrow reveal" style={{ marginBottom: 24 }}>01 — Sélection de projets</div>
          <p className="reveal" style={{ maxWidth: 720, color: "var(--fg-soft)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: 48 }}>
            Voici une sélection de mes projets d'ingénierie réalisés durant ma formation ou au sein de mon alternance, mettant en valeur la conception mécanique, la fabrication additive, la modélisation 3D et la programmation.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 28 }}>
            {visible.map((p) => (
              <article key={p.id} className="card card-project reveal">
                <span className="num">{p.num}</span>

                {/* Image cliquable -> page de détail */}
                <div style={{ cursor: "pointer" }} onClick={() => navigate(`/projets/${p.id}`)}>
                  <div style={{ position: "relative" }}>
                    <img src={p.image} alt={p.title} className="card-img" />
                    <div
                      style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.2s", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.4)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0)"}
                    />
                    {p.gallery?.length > 0 && (
                      <div
                        onClick={(e) => { e.stopPropagation(); setGalleryProject(p); }}
                        style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.7)", borderRadius: 20, padding: "4px 10px", fontSize: "0.72rem", color: "white", display: "flex", alignItems: "center", gap: 5 }}
                      >
                        <Images size={12} /> {p.gallery.length + 1} photos
                      </div>
                    )}
                  </div>
                  {/* Légende style Passions — sous l'image */}
                  {p.imageCaption && (
                    <div style={{ fontSize: "0.65rem", color: "var(--fg-muted)", fontStyle: "italic", textAlign: "center", marginTop: 6 }}>
                      {p.imageCaption}
                    </div>
                  )}
                </div>

                <div style={{ cursor: "pointer" }} onClick={() => navigate(`/projets/${p.id}`)}>
                  <div className="eyebrow no-after" style={{ marginBottom: 12, fontSize: "0.7rem", marginTop: 16 }}>{p.subtitle}</div>
                  <h3 style={{ fontFamily: "var(--heading-font)", fontSize: "1.5rem", marginBottom: 16, lineHeight: 1.2 }}>{p.title}</h3>
                  <p style={{ color: "var(--fg-soft)", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: 20 }}>{p.description}</p>
                </div>

                <div className="eyebrow no-after" style={{ marginBottom: 12, fontSize: "0.7rem", marginTop: 16 }}>{p.subtitle}</div>
                <h3 style={{ fontFamily: "var(--heading-font)", fontSize: "1.5rem", marginBottom: 16, lineHeight: 1.2 }}>{p.title}</h3>
                <p style={{ color: "var(--fg-soft)", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: 20 }}>{p.description}</p>

                <div className="divider" style={{ margin: "20px 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 12, fontSize: "0.85rem", marginBottom: 8 }}>
                  <span style={{ color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.7rem" }}>Compétence</span>
                  <span style={{ color: "var(--fg-soft)" }}>{p.skills}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 12, fontSize: "0.85rem", marginBottom: 8 }}>
                  <span style={{ color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.7rem" }}>Livrables</span>
                  <span style={{ color: "var(--fg-soft)" }}>{p.deliverables}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 12, fontSize: "0.85rem", marginBottom: 24 }}>
                  <span style={{ color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.7rem" }}>Innovation</span>
                  <span style={{ color: "var(--fg-soft)" }}>{p.innovation}</span>
                </div>

                <div style={{ marginBottom: 20 }}>{p.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}</div>

                <Link to={`/projets/${p.id}`} className="btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  Voir le détail <ArrowUpRight size={14} />
                </Link>
              </article>
            ))}
          </div>

          <div className="cta-banner reveal" style={{ marginTop: 100 }}>
            <div className="eyebrow" style={{ marginBottom: 24, justifyContent: "center" }}>Envie d'en savoir plus</div>
            <h2 className="display-2" style={{ marginBottom: 32 }}>Un projet en<br /><span className="italic-orange">commun ?</span></h2>
            <Link to="/contact" className="btn-primary">Me contacter <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
