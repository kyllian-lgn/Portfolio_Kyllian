import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export default function Passions() {
  const { content, loading } = usePortfolio();
  if (loading || !content) return <div style={{ minHeight: "100vh" }} />;

  return (
    <>
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
            {content.passions.sports.map((s, i) => (
              <article className="card reveal" key={i} style={{ overflow: "hidden", padding: 0 }} data-testid={`sport-${i}`}>
                <img src={s.image} alt={s.name} style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", filter: "grayscale(15%)" }} />
                <div style={{ padding: 32 }}>
                  <h3 style={{ fontFamily: "var(--heading-font)", fontSize: "1.8rem", marginBottom: 16 }}>{s.name}</h3>
                  <p style={{ color: "var(--fg-soft)", lineHeight: 1.7, marginBottom: 20 }}>{s.description}</p>
                  <span className="tag-pill accent">{s.tag}</span>
                </div>
              </article>
            ))}
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
