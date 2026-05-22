import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Download, Linkedin, Mail } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/projets", label: "Projets" },
  { to: "/parcours", label: "Parcours" },
  { to: "/experiences", label: "Expériences" },
  { to: "/competences", label: "Compétences" },
  { to: "/passions", label: "Passions" },
  { to: "/contact", label: "Contact" },
];

export default function Layout({ children }) {
  const { content } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); window.scrollTo({ top: 0 }); }, [loc.pathname]);

  // Reveal on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in");
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loc.pathname, content]);

  const cvUrl = content?.site?.cvUrl || "#";
  const logoText = content?.site?.logo || "KL";

  return (
    <div className="App">
      <nav className={`nav-wrap${scrolled ? " scrolled" : ""}`} data-testid="main-nav">
        <div className="nav-inner">
          <Link to="/" className="nav-logo" data-testid="logo-link">
            <span className="nav-logo-square">{logoText.replace('.', '').slice(0, 2)}</span>
            <span style={{ fontSize: "0.95rem" }}>{content?.site?.name || "Kyllian Le Guen"}</span>
          </Link>

          <div className="nav-links">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href={cvUrl} target="_blank" rel="noreferrer" className="nav-cv" data-testid="cv-download">
              <Download size={14} /> CV
            </a>
            <button className="nav-burger" onClick={() => setMenuOpen(!menuOpen)} data-testid="burger-btn" aria-label="Menu">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >{item.label}</NavLink>
        ))}
      </div>

      <main>{children}</main>

      <footer data-testid="footer">
        <div className="footer-grid">
          <div>
            <Link to="/" className="nav-logo" style={{ marginBottom: 18, display: "inline-flex" }}>
              <span className="nav-logo-square">{logoText.replace('.', '').slice(0, 2)}</span>
              <span>{content?.site?.name}</span>
            </Link>
            <p style={{ color: "var(--fg-muted)", maxWidth: 380, marginTop: 16, lineHeight: 1.7 }}>
              Apprenti ingénieur en conception 3D, passionné par l'innovation industrielle et les nouvelles technologies.
            </p>
          </div>
          <div>
            <div className="eyebrow no-after" style={{ marginBottom: 18 }}>Navigation</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {NAV.slice(0, 4).map((item) => (
                <Link key={item.to} to={item.to} style={{ color: "var(--fg-soft)", textDecoration: "none", fontSize: "0.9rem" }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="eyebrow no-after" style={{ marginBottom: 18 }}>Contact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href={`mailto:${content?.contact?.email}`} style={{ color: "var(--fg-soft)", textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Mail size={14} /> Email
              </a>
              <a href={content?.contact?.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--fg-soft)", textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Linkedin size={14} /> LinkedIn
              </a>
              <a href={cvUrl} target="_blank" rel="noreferrer" style={{ color: "var(--fg-soft)", textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Download size={14} /> CV PDF
              </a>
            </div>
          </div>
        </div>
        <div className="footer-copy">
          <div>© {new Date().getFullYear()} {content?.site?.name || "Kyllian Le Guen"}. Tous droits réservés.</div>
          <div>Conçu & développé avec soin.</div>
        </div>
      </footer>
    </div>
  );
}
