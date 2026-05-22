import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import Marquee from "../components/Marquee";

export default function Home() {
  const { content, loading } = usePortfolio();
  if (loading || !content) return <div style={{ minHeight: "100vh" }} />;

  const featured = content.projects.slice(0, 3);

  return (
    <>
      <section className="hero" data-testid="hero-section">
        <div className="huge-bg">{content.hero.lastName.split(" ").join("")}</div>
        <div className="container-x">
          <div className="eyebrow reveal" style={{ marginBottom: 32 }}>{content.hero.tag}</div>
          <h1 className="display-1 reveal" data-testid="hero-name">
            {content.hero.firstName}<br />
            <span className="italic-orange">{content.hero.lastName}</span>
          </h1>
          <div className="eyebrow reveal" style={{ marginTop: 40, marginBottom: 24, color: "var(--fg-muted)" }}>
            <span style={{ color: "var(--fg-muted)" }}>{content.hero.subtitle}</span>
          </div>
          <p className="reveal" style={{ maxWidth: 580, color: "var(--fg-soft)", fontSize: "1.05rem", lineHeight: 1.7 }}>
            {content.hero.description}
          </p>
          <div className="reveal" style={{ display: "flex", gap: 16, marginTop: 40, flexWrap: "wrap" }}>
            <Link to="/projets" className="btn-primary" data-testid="cta-projects">
              Voir mes projets <ArrowUpRight size={16} />
            </Link>
            <Link to="/contact" className="btn-ghost" data-testid="cta-contact">
              Me contacter
            </Link>
          </div>

          <div className="stats-row reveal">
            {content.hero.stats.map((s, i) => (
              <div className="stat" key={i}>
                <div className="value">{s.value}</div>
                <div className="label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee items={content.marquee} />

      {/* Featured projects */}
      <section className="section-pad">
        <div className="container-x">
          <div className="section-title-block reveal">
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>01 — Projets principaux</div>
              <h2 className="display-2">Sélection<br /><span className="italic-orange">de projets.</span></h2>
            </div>
            <Link to="/projets" className="btn-ghost">Voir tous les projets <ArrowRight size={14} /></Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {featured.map((p) => (
              <Link to="/projets" key={p.id} className="card card-project reveal" data-testid={`project-card-${p.id}`}>
                <span className="num">{p.num}</span>
                <img src={p.image} alt={p.title} className="card-img" />
                <div className="eyebrow no-after" style={{ marginBottom: 12, fontSize: "0.7rem" }}>{p.subtitle}</div>
                <h3 style={{ fontFamily: "var(--heading-font)", fontSize: "1.4rem", marginBottom: 16, lineHeight: 1.2 }}>{p.title}</h3>
                <div>{p.tags.slice(0, 3).map((t) => <span key={t} className="tag-pill">{t}</span>)}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tools section */}
      <section className="section-pad" style={{ paddingTop: 0 }}>
        <div className="container-x">
          <div className="section-title-block reveal">
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>02 — Outils & Compétences</div>
              <h2 className="display-2">Stack<br /><span className="italic-orange">technique.</span></h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {content.skills.software.map((s) => (
              <div key={s.name} className="card reveal" style={{ padding: 24 }}>
                <div style={{ fontFamily: "var(--heading-font)", fontSize: "1.1rem", marginBottom: 12 }}>{s.name}</div>
                <div className="skill-bar"><div className="skill-bar-fill" style={{ width: `${s.level}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad" style={{ paddingTop: 0 }}>
        <div className="container-x">
          <div className="cta-banner reveal">
            <div className="eyebrow" style={{ marginBottom: 24, justifyContent: "center" }}>Travaillons ensemble</div>
            <h2 className="display-2" style={{ marginBottom: 32 }}>Vous avez un projet<br /><span className="italic-orange">innovant ?</span></h2>
            <Link to="/contact" className="btn-primary">Me contacter <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
