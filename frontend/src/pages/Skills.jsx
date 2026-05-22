import React from "react";
import { usePortfolio } from "../context/PortfolioContext";

function SkillGroup({ title, eyebrow, skills }) {
  return (
    <div className="card reveal" style={{ padding: 36 }}>
      <div className="eyebrow no-after" style={{ marginBottom: 24, fontSize: "0.72rem" }}>{eyebrow}</div>
      <h3 style={{ fontFamily: "var(--heading-font)", fontSize: "1.6rem", marginBottom: 28 }}>{title}</h3>
      {skills.map((s) => (
        <div className="skill-row" key={s.name}>
          <div className="skill-row-head">
            <span style={{ color: "var(--fg)" }}>{s.name}</span>
            <span style={{ color: "var(--accent)" }}>{s.level}%</span>
          </div>
          <div className="skill-bar"><div className="skill-bar-fill" style={{ width: `${s.level}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

export default function Skills() {
  const { content, loading } = usePortfolio();
  if (loading || !content) return <div style={{ minHeight: "100vh" }} />;

  return (
    <>
      <section className="hero" style={{ minHeight: "70vh" }}>
        <div className="huge-bg" style={{ fontSize: "clamp(11rem, 26vw, 30rem)" }}>SKILLS</div>
        <div className="container-x">
          <div className="eyebrow" style={{ marginBottom: 32 }}>Kyllian Le Guen — Savoir-faire</div>
          <h1 className="display-1">Compétences<br /><span className="italic-orange">techniques.</span></h1>
          <div style={{ display: "flex", gap: 60, marginTop: 48, flexWrap: "wrap" }}>
            <div className="stat"><div className="value">10+</div><div className="label">Logiciels</div></div>
            <div className="stat"><div className="value">{content.skills.languages.length}</div><div className="label">Langues</div></div>
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ paddingTop: 60 }}>
        <div className="container-x">
          <div className="eyebrow reveal" style={{ marginBottom: 40 }}>01 — Logiciels CAO & FAO</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
            <SkillGroup title="Conception 3D" eyebrow="CAO industrielle" skills={content.skills.software.slice(0, 4)} />
            <SkillGroup title="FAO & Programmation" eyebrow="Production assistée" skills={content.skills.software.slice(4)} />
          </div>

          <div className="divider" />

          <div className="eyebrow reveal" style={{ marginBottom: 40 }}>02 — Programmation & Automatisation</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
            <SkillGroup title="Code & Scripts" eyebrow="Programmation" skills={content.skills.programming} />
            <SkillGroup title="Technologies" eyebrow="Outils avancés" skills={content.skills.technologies} />
          </div>

          <div className="divider" />

          <div className="eyebrow reveal" style={{ marginBottom: 40 }}>03 — Compétences scientifiques</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            <div className="card reveal" style={{ padding: 28 }}>
              <div className="eyebrow no-after" style={{ marginBottom: 18 }}>Compétences scientifiques</div>
              <p style={{ color: "var(--fg-soft)", lineHeight: 1.7 }}>{content.skills.scientific}</p>
            </div>
            <div className="card reveal" style={{ padding: 28 }}>
              <div className="eyebrow no-after" style={{ marginBottom: 18 }}>Maîtrise des moyens de production</div>
              <p style={{ color: "var(--fg-soft)", lineHeight: 1.7 }}>{content.skills.production}</p>
            </div>
            <div className="card reveal" style={{ padding: 28 }}>
              <div className="eyebrow no-after" style={{ marginBottom: 18 }}>Industrie 4.0</div>
              <p style={{ color: "var(--fg-soft)", lineHeight: 1.7 }}>{content.skills.industry}</p>
            </div>
          </div>

          <div className="divider" />

          <div className="eyebrow reveal" style={{ marginBottom: 40 }}>04 — Soft skills & Langues</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
            {content.skills.soft.map((s) => (
              <div key={s.name} className="card reveal" style={{ padding: 28 }}>
                <h4 style={{ fontFamily: "var(--heading-font)", fontSize: "1.25rem", marginBottom: 10, color: "var(--accent)" }}>{s.name}</h4>
                <p style={{ color: "var(--fg-soft)", fontSize: "0.9rem", lineHeight: 1.6 }}>{s.description}</p>
              </div>
            ))}
          </div>

          <div className="card reveal" style={{ padding: 36 }}>
            <div className="eyebrow no-after" style={{ marginBottom: 28 }}>Langues</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
              {content.skills.languages.map((l) => (
                <div key={l.name}>
                  <div style={{ fontFamily: "var(--heading-font)", fontSize: "1.6rem", marginBottom: 6 }}>{l.name}</div>
                  <div style={{ color: "var(--accent)", fontSize: "0.85rem" }}>{l.level}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
