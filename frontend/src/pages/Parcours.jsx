import React from "react";
import { Download } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export default function Parcours() {
  const { content, loading } = usePortfolio();
  if (loading || !content) return <div style={{ minHeight: "100vh" }} />;

  return (
    <>
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
              <div className="timeline-item reveal" key={e.id} data-testid={`edu-${e.id}`}>
                <span className="timeline-dot" />
                <div className="card" style={{ marginLeft: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                    <div className="eyebrow no-after" style={{ fontSize: "0.72rem" }}>{e.period}</div>
                    <span className="tag-pill accent">{e.tag}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--heading-font)", fontSize: "1.6rem", marginBottom: 8, lineHeight: 1.15 }}>{e.title}</h3>
                  <p style={{ color: "var(--fg-soft)", fontSize: "0.92rem", marginBottom: 20 }}>{e.place}</p>
                  <ul style={{ paddingLeft: 18, color: "var(--fg-soft)", fontSize: "0.92rem", lineHeight: 1.8, margin: 0 }}>
                    {e.details.map((d, i) => <li key={i} style={{ marginBottom: 6 }}>{d}</li>)}
                  </ul>
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
