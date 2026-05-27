import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Images } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import ProjectGallery from "../components/ProjectGallery";

export default function Projects() {
  const { content, loading } = usePortfolio();
  const [filter, setFilter] = useState("Tout");
  const [galleryProject, setGalleryProject] = useState(null);

  const categories = useMemo(() => {
    if (!content) return [];
    return ["Tout", ...Array.from(new Set(content.projects.map((p) => p.category)))];
  }, [content]);

  if (loading || !content) return <div style={{ minHeight: "100vh" }} />;

  const visible = filter === "Tout" ? content.projects : content.projects.filter((p) => p.category === filter);

  return (
    <>
      {galleryProject && (
        <ProjectGallery project={galleryProject} onClose={() => setGalleryProject(null)} />
      )}

      <section className="hero" style={{ minHeight: "70vh" }} data-testid="projects-hero">
        <div className="huge-bg" style={{ fontSize: "clamp(15rem, 35vw, 40rem)" }}>PROJETS</div>
        <div className="container-x">
          <div className="eyebrow" style={{ marginBottom: 32 }}>Kyllian Le Guen — Portfolio</div>
          <h1 className="display-1">Projets<br /><span className="italic-orange">réalisés.</span></h1>
          <div style={{ display: "flex", gap: 60, marginTop: 48, flexWrap: "wrap" }}>
            <div className="stat"><div className="value">{content.projects.length}+</div><div className="label">Projets</div></div>
            <div className="stat"><div className="value">{categories.length - 1}</div><div className="label">Domaines
