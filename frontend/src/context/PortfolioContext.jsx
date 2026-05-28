import React, { createContext, useContext, useEffect, useState } from "react";
import portfolioData from "../lib/data.jsx";

const PortfolioContext = createContext(null);

export const AVAILABLE_FONTS = [
  { name: "Syne", category: "Tech / Display" },
  { name: "Inter", category: "Body / Modern" },
  { name: "Space Grotesk", category: "Tech / Display" },
  { name: "Playfair Display", category: "Editorial / Serif" },
  { name: "Manrope", category: "Body / Clean" },
  { name: "Work Sans", category: "Body / Modern" },
  { name: "DM Sans", category: "Body / Modern" },
  { name: "Bricolage Grotesque", category: "Display / Unique" },
  { name: "IBM Plex Sans", category: "Tech" },
  { name: "Cormorant Garamond", category: "Editorial / Serif" },
  { name: "Archivo", category: "Display" },
  { name: "Fraunces", category: "Editorial / Serif" },
];

const loadedFonts = new Set();
function ensureFontLoaded(family) {
  if (!family || loadedFonts.has(family)) return;
  loadedFonts.add(family);
  const id = `gf-${family.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap`;
  document.head.appendChild(link);
}

export function applySettings(settings) {
  if (!settings) return;
  ensureFontLoaded(settings.headingFont);
  ensureFontLoaded(settings.bodyFont);
  const root = document.documentElement;
  root.style.setProperty("--heading-font", `'${settings.headingFont}', sans-serif`);
  root.style.setProperty("--body-font", `'${settings.bodyFont}', sans-serif`);
  root.style.setProperty("--accent", settings.accentColor);
  const hex = settings.accentColor.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  root.style.setProperty("--accent-soft", `rgba(${r}, ${g}, ${b}, 0.12)`);
  root.style.setProperty("--accent-glow", `rgba(${r}, ${g}, ${b}, 0.4)`);
}

const defaultSettings = {
  headingFont: "Syne",
  bodyFont: "Inter",
  accentColor: "#FF7A1A",
};

export function PortfolioProvider({ children }) {
  const [content, setContent] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSettings = portfolioData._settings || defaultSettings;
    setContent(portfolioData);
    setSettings(savedSettings);
    applySettings(savedSettings);
    setLoading(false);
}, []);

  const refresh = () => {};

  return (
    <PortfolioContext.Provider value={{ content, settings, loading, refresh, applySettings }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be inside PortfolioProvider");
  return ctx;
}
