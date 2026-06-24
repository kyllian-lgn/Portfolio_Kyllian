import React, { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, FileText, Download, Images, Cpu } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import ProjectGallery from "../components/ProjectGallery";

export default function ProjectDetail() {
  const { id } = useParams();
  const { content, loading } = usePortfolio();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [mainIndex, setMainIndex] = useState(0);

  if (loading || !content) return <div style={{ minHeight: "100vh" }} />;

  const project = content.projects.find((p) => p.id === id);
  if (!project) return <Navigate to="/projets" replace />;

  const media = [
    { type: "image", url: project.image, caption: project.imageCaption || "" },
    ...(project.gallery || []),
  ];

  const competences = project.competences || [];
  const documents = project.documents || [];

  return (
    <>
      {galleryOpen && (
        <ProjectGallery
          project={{ ...project, image: media[mainIndex]?.url, imageCaption: media[mainIndex]?.caption }}
          onClose={() => setGalleryOpen(false)}
        />
      )}

      <section className="section-pad" style={{ paddingTop: 140, paddingBottom: 0 }}>
        <div className="container-x">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
            <Link to="/projets" className="btn-ghost reveal" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <ArrowLeft size={14} /> Tous les projets
            </Link>
            <div className="eyebrow no-after reveal" style={{ fontSize: "0.75rem" }}>
              Projets <span style={{ margin: "0 8px", color: "var(--fg-muted)" }}>/</span>
              <span style={{ color: "var(--fg-soft)" }}>{project.title}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.7fr) minmax(280px, 1fr)", gap: 36, alignItems: "start" }}>
            <div className="reveal">
              <div
                style={{ position: "relative", borderRadius: 18, overflow: "hidden", background: "#0d0d0e", border: "1px solid var(--border)", cursor: media[mainIndex]?.type === "video" ? "default" : "pointer" }}
                onClick={() => { if (media[mainIndex]?.type !== "video") setGalleryOpen(true); }}
              >
                {media[mainIndex]?.type === "video" ? (
                  <video
                    key={media[mainIndex]?.url}
                    src={media[mainIndex]?.url}
                    controls
                    style={{ width: "100%", maxHeight: 460, display: "block", background: "#000" }}
                  />
                ) : (
                  <img
                    src={media[mainIndex]?.url}
                    alt={project.title}
                    style={{ width: "100%", maxHeight: 460, objectFit: "contain", display: "block", margin: "0 auto" }}
                  />
                )}
                {media.length > 1 && media[mainIndex]?.type !== "video" && (
                  <div style={{ position: "absolute", bottom: 14, right: 14, background: "rgba(0,0,0,0.7)", borderRadius: 20, padding: "5px 12px", fontSize: "0.74rem", color: "white", display: "flex", alignItems: "center", gap: 6 }}>
                    <Images size={13} /> {media.length} médias
                  </div>
                )}
              </div>

              {media[mainIndex]?.caption && (
                <div style={{ fontSize: "0.78rem", color: "var(--fg-muted)", fontStyle: "italic", textAlign: "center", marginTop: 12 }}>
                  {media[mainIndex].caption}
                </div>
              )}

              {media.length > 1 && (
                <div style={{ display: "flex", gap: 8, overflowX: "auto", marginTop: 16, paddingBottom: 4 }}>
                  {media.map((m, i) => (
                    <div
                      key={i}
                      onClick={() => setMainIndex(i)}
                      style={{
                        flexShrink: 0, width: 88, height: 60, borderRadius: 8, overflow: "hidden", cursor: "pointer",
                        border: i === mainIndex ? "2px solid var(--accent)" : "2px solid transparent", background: "#111",
                      }}
                    >
                      {m.type === "video"
                        ? (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a1a", position: "relative" }}>
                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: "0.6rem", marginLeft: 2, color: "#000" }}>▶</span>
                            </div>
                          </div>
                        )
                        : <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      }
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card reveal" style={{ padding: 28 }}>
              <div className="eyebrow no-after" style={{ marginBottom: 20, fontSize: "0.72rem" }}>Informations du projet</div>
              <InfoRow label="Catégorie" value={project.category} />
              <InfoRow label="Projet" value={project.title} />
              <InfoRow label="Spécialité" value={project.subtitle} />
              <InfoRow label="Compétences mobilisées" value={project.skills} />
              <InfoRow label="Livrables" value={project.deliverables} last />
              <div style={{ marginTop: 6, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
                <span style={{ color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.7rem", display: "block", marginBottom: 8 }}>Innovation</span>
                <span style={{ color: "var(--fg-soft)", fontSize: "0.9rem", lineHeight: 1.6 }}>{project.innovation}</span>
              </div>
              {project.tags?.length > 0 && (
                <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
                  {project.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x" style={{ maxWidth: 1000 }}>
          <div className="eyebrow reveal" style={{ marginBottom: 24 }}>01 — Aperçu du projet</div>
          <p className="reveal" style={{ color: "var(--fg-soft)", fontSize: "1.05rem", lineHeight: 1.85 }}>
            {project.longDescription || project.description}
          </p>
        </div>
      </section>

      {competences.length > 0 && (
        <section className="section-pad" style={{ paddingTop: 0 }}>
          <div className="container-x">
            <div className="eyebrow reveal" style={{ marginBottom: 24 }}>02 — Compétences acquises</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              {competences.map((c, i) => (
                <div key={i} className="card reveal" style={{ padding: 26 }}>
                  <Cpu size={22} style={{ color: "var(--accent)", marginBottom: 16 }} />
                  <h4 style={{ fontFamily: "var(--heading-font)", fontSize: "1.1rem", marginBottom: 10 }}>{c.name}</h4>
                  <p style={{ color: "var(--fg-soft)", fontSize: "0.9rem", lineHeight: 1.7 }}>{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {documents.length > 0 && (
        <section className="section-pad" style={{ paddingTop: 0 }}>
          <div className="container-x">
            <div className="eyebrow reveal" style={{ marginBottom: 24 }}>03 — Documents</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {documents.map((d, i) => (
                <a
                  key={i}
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="card reveal"
                  style={{ padding: 20, display: "flex", alignItems: "center", gap: 14, textDecoration: "none", color: "var(--fg)" }}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={18} style={{ color: "var(--accent)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.92rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.title || "Document"}</div>
                    <div style={{ fontSize: "0.74rem", color: "var(--fg-muted)" }}>{d.type || "Fichier"}</div>
                  </div>
                  <Download size={16} style={{ color: "var(--fg-muted)", flexShrink: 0 }} />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {media.length > 1 && (
        <section className="section-pad" style={{ paddingTop: 0 }}>
          <div className="container-x">
            <div className="eyebrow reveal" style={{ marginBottom: 24 }}>{documents.length > 0 ? "04" : "03"} — Galerie</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
              {media.map((m, i) => (
                <div
                  key={i}
                  className="reveal"
                  onClick={() => { setMainIndex(i); setGalleryOpen(true); }}
                  style={{ position: "relative", borderRadius: 12, overflow: "hidden", cursor: "pointer", aspectRatio: "4/3", background: "#111" }}
                >
                  {m.type === "video"
                    ? <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.4rem" }}>▶</div>
                    : <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  }
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-pad" style={{ paddingTop: 0 }}>
        <div className="container-x">
          <div className="cta-banner reveal">
            <div className="eyebrow" style={{ marginBottom: 24, justifyContent: "center" }}>Envie d'en savoir plus</div>
            <h2 className="display-2" style={{ marginBottom: 32 }}>Un projet en<br /><span className="italic-orange">commun ?</span></h2>
            <Link to="/contact" className="btn-primary">Me contacter <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoRow({ label, value, last }) {
  if (!value) return null;
  return (
    <div style={{ marginBottom: last ? 0 : 14, paddingBottom: last ? 0 : 14, borderBottom: last ? "none" : "1px solid var(--border)" }}>
      <div style={{ color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.68rem", marginBottom: 4 }}>{label}</div>
      <div style={{ color: "var(--fg-soft)", fontSize: "0.9rem", lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}
