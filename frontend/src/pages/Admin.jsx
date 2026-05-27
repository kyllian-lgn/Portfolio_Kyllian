import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Save, RotateCcw, Eye } from "lucide-react";
import { Toaster, toast } from "sonner";
import { usePortfolio, AVAILABLE_FONTS, applySettings } from "../context/PortfolioContext";
import { saveDataToGithub } from "../lib/githubSave";
import ContentEditor from "../components/admin/ContentEditor";

const TABS = [
  { id: "edit", label: "Édition" },
  { id: "theme", label: "Apparence" },
];

const defaultSettings = {
  headingFont: "Syne",
  bodyFont: "Inter",
  accentColor: "#FF7A1A",
};

export default function Admin() {
  const navigate = useNavigate();
  const { content, settings, refresh } = usePortfolio();
  const [active, setActive] = useState("edit");
  const [saving, setSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState(defaultSettings);
  const [editorContent, setEditorContent] = useState(null);
  const [dirty, setDirty] = useState(false);

  // Mot de passe simple
  useEffect(() => {
    const pwd = localStorage.getItem("admin_pwd");
    if (pwd !== "kyllian2024") {
      const input = window.prompt("Mot de passe admin :");
      if (input !== "kyllian2024") {
        navigate("/");
      } else {
        localStorage.setItem("admin_pwd", input);
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (content) {
      setEditorContent(content);
      setDirty(false);
    }
  }, [content]);

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (localSettings) applySettings(localSettings);
  }, [localSettings]);

  const logout = () => {
    localStorage.removeItem("admin_pwd");
    navigate("/");
  };

  const saveEditor = async () => {
    if (!editorContent) return;
    setSaving(true);
    try {
      await saveDataToGithub(editorContent);
      await refresh();
      setDirty(false);
      toast.success("✅ Modifications enregistrées ! Le site se met à jour dans 1 minute.");
    } catch (e) {
      toast.error("Erreur : " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    if (!editorContent) return;
    setSaving(true);
    try {
      const newData = { ...editorContent, _settings: localSettings };
      await saveDataToGithub(newData);
      applySettings(localSettings);
      toast.success("✅ Apparence enregistrée !");
    } catch (e) {
      toast.error("Erreur : " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const onEditorChange = (next) => {
    setEditorContent(next);
    setDirty(true);
  };

  const discardChanges = () => {
    if (dirty && !window.confirm("Annuler les modifications non enregistrées ?")) return;
    setEditorContent(content);
    setDirty(false);
  };

  return (
    <div className="admin-shell">
      <Toaster position="bottom-right" theme="dark" />
      <div className="container-x">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Admin Portfolio</div>
            <h1 style={{ fontFamily: "var(--heading-font)", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1 }}>
              Tableau de <span className="italic-orange">bord.</span>
            </h1>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/" className="btn-ghost" target="_blank" rel="noreferrer"><Eye size={14} /> Voir le site</a>
            <button onClick={logout} className="btn-ghost"><LogOut size={14} /> Déconnexion</button>
          </div>
        </div>

        <div className="admin-tabs">
          {TABS.map((t) => (
            <button key={t.id} className={`admin-tab${active === t.id ? " active" : ""}`} onClick={() => setActive(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {active === "edit" && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap", alignItems: "center", position: "sticky", top: 80, background: "var(--bg)", padding: "12px 0", zIndex: 5, borderBottom: dirty ? "1px solid var(--accent)" : "1px solid transparent" }}>
              <button className="btn-primary" onClick={saveEditor} disabled={!dirty || saving}>
                <Save size={14} /> {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
              <button className="btn-ghost" onClick={discardChanges} disabled={!dirty}>
                <RotateCcw size={14} /> Annuler
              </button>
              {dirty && <span style={{ color: "var(--accent)", fontSize: "0.82rem", marginLeft: 8 }}>● Modifications non enregistrées</span>}
            </div>
            <p style={{ color: "var(--fg-muted)", fontSize: "0.88rem", marginBottom: 24, maxWidth: 760, lineHeight: 1.6 }}>
              Modifiez chaque section de votre portfolio. Cliquez sur <strong style={{ color: "var(--fg)" }}>Enregistrer</strong> pour publier — le site se met à jour automatiquement en 1 minute.
            </p>
            <ContentEditor value={editorContent} onChange={onEditorChange} />
          </div>
        )}

        {active === "theme" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            <div className="card" style={{ padding: 32 }}>
              <div className="eyebrow" style={{ marginBottom: 28 }}>Police d'écriture</div>
              <div className="form-field" style={{ marginBottom: 24 }}>
                <label>Police des titres</label>
                <select value={localSettings.headingFont} onChange={(e) => setLocalSettings({ ...localSettings, headingFont: e.target.value })} className="json-editor" style={{ minHeight: 0, padding: "12px 16px", fontFamily: "inherit", fontSize: "0.95rem" }}>
                  {AVAILABLE_FONTS.map((f) => (<option key={f.name} value={f.name}>{f.name} — {f.category}</option>))}
                </select>
              </div>
              <div className="form-field" style={{ marginBottom: 24 }}>
                <label>Police du texte</label>
                <select value={localSettings.bodyFont} onChange={(e) => setLocalSettings({ ...localSettings, bodyFont: e.target.value })} className="json-editor" style={{ minHeight: 0, padding: "12px 16px", fontFamily: "inherit", fontSize: "0.95rem" }}>
                  {AVAILABLE_FONTS.map((f) => (<option key={f.name} value={f.name}>{f.name} — {f.category}</option>))}
                </select>
              </div>
              <div className="form-field">
                <label>Couleur d'accent</label>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <input type="color" value={localSettings.accentColor} onChange={(e) => setLocalSettings({ ...localSettings, accentColor: e.target.value })} style={{ width: 60, height: 50, border: "1px solid var(--border)", borderRadius: 10, background: "transparent" }} />
                  <input type="text" value={localSettings.accentColor} onChange={(e) => setLocalSettings({ ...localSettings, accentColor: e.target.value })} style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", color: "var(--fg)" }} />
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                  {["#FF7A1A", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#EF4444", "#06B6D4"].map((c) => (
                    <button key={c} onClick={() => setLocalSettings({ ...localSettings, accentColor: c })} style={{ width: 28, height: 28, background: c, border: localSettings.accentColor === c ? "2px solid #fff" : "1px solid var(--border)", borderRadius: 8 }} />
                  ))}
                </div>
              </div>
              <button className="btn-primary" onClick={saveSettings} style={{ marginTop: 28 }}>
                <Save size={14} /> Enregistrer l'apparence
              </button>
            </div>
            <div className="card" style={{ padding: 32 }}>
              <div className="eyebrow" style={{ marginBottom: 28 }}>Aperçu live</div>
              <h1 className="display-2" style={{ fontSize: "3rem", marginBottom: 20 }}>
                Kyllian<br /><span className="italic-orange">Le Guen</span>
              </h1>
              <p style={{ color: "var(--fg-soft)", lineHeight: 1.7, marginBottom: 24 }}>
                Étudiant en alternance passionné par la conception 3D et la fabrication additive.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn-primary">Voir mes projets</button>
                <button className="btn-ghost">Me contacter</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 900px) {
          .admin-shell [data-testid="theme-tab"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
