import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Save, RotateCcw, Trash2, Download, Upload, CheckCircle2, Mail, Eye } from "lucide-react";
import { Toaster, toast } from "sonner";
import apiClient from "../lib/api";
import { usePortfolio, AVAILABLE_FONTS, applySettings } from "../context/PortfolioContext";
import ContentEditor from "../components/admin/ContentEditor";

const TABS = [
  { id: "edit", label: "Édition" },
  { id: "theme", label: "Apparence" },
  { id: "messages", label: "Messages" },
  { id: "content", label: "JSON (avancé)" },
];

export default function Admin() {
  const navigate = useNavigate();
  const { content, settings, refresh } = usePortfolio();
  const [active, setActive] = useState("edit");
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [saving, setSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState(null);
  const [messages, setMessages] = useState([]);
  const [editorContent, setEditorContent] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    apiClient.get("/portfolio/verify").catch(() => {
      localStorage.removeItem("admin_token");
      navigate("/admin/login");
    });
  }, [navigate]);

  useEffect(() => {
    if (content) {
      setJsonText(JSON.stringify(content, null, 2));
      setEditorContent(content);
      setDirty(false);
    }
  }, [content]);

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (active === "messages") loadMessages();
  }, [active]);

  // live preview on settings change
  useEffect(() => {
    if (localSettings) applySettings(localSettings);
  }, [localSettings]);

  const loadMessages = async () => {
    try {
      const res = await apiClient.get("/admin/messages");
      setMessages(res.data);
    } catch {
      toast.error("Erreur de chargement des messages.");
    }
  };

  const logout = async () => {
    try { await apiClient.post("/portfolio/logout"); } catch {}
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const saveContent = async () => {
    setJsonError("");
    let parsed;
    try { parsed = JSON.parse(jsonText); }
    catch (e) { setJsonError(`JSON invalide : ${e.message}`); return; }
    setSaving(true);
    try {
      await apiClient.put("/portfolio/content", parsed);
      await refresh();
      toast.success("Contenu enregistré.");
    } catch {
      toast.error("Erreur d'enregistrement.");
    } finally { setSaving(false); }
  };

  const saveEditor = async () => {
    if (!editorContent) return;
    setSaving(true);
    try {
      await apiClient.put("/portfolio/content", editorContent);
      await refresh();
      setDirty(false);
      toast.success("Modifications enregistrées.");
    } catch {
      toast.error("Erreur d'enregistrement.");
    } finally { setSaving(false); }
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

  const resetContent = async () => {
    if (!window.confirm("Réinitialiser tout le contenu par défaut ?")) return;
    try {
      await apiClient.post("/portfolio/content/reset");
      await refresh();
      toast.success("Contenu réinitialisé.");
    } catch {
      toast.error("Erreur.");
    }
  };

  const exportJson = () => {
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "portfolio-content.json";
    a.click(); URL.revokeObjectURL(url);
  };

  const importJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        setJsonText(JSON.stringify(parsed, null, 2));
        toast.success("JSON importé. N'oubliez pas d'enregistrer.");
      } catch {
        toast.error("Fichier invalide.");
      }
    };
    reader.readAsText(file);
  };

  const saveSettings = async () => {
    if (!localSettings) return;
    try {
      await apiClient.put("/portfolio/settings", localSettings);
      await refresh();
      toast.success("Apparence enregistrée.");
    } catch {
      toast.error("Erreur.");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    try {
      await apiClient.delete(`/admin/messages/${id}`);
      setMessages(messages.filter((m) => m.id !== id));
      toast.success("Message supprimé.");
    } catch { toast.error("Erreur."); }
  };

  const markRead = async (id) => {
    try {
      await apiClient.patch(`/admin/messages/${id}/read`);
      setMessages(messages.map((m) => m.id === id ? { ...m, read: true } : m));
    } catch {}
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
            <button onClick={logout} className="btn-ghost" data-testid="logout-btn"><LogOut size={14} /> Déconnexion</button>
          </div>
        </div>

        <div className="admin-tabs">
          {TABS.map((t) => (
            <button key={t.id} className={`admin-tab${active === t.id ? " active" : ""}`} onClick={() => setActive(t.id)} data-testid={`tab-${t.id}`}>
              {t.label}
            </button>
          ))}
        </div>

        {active === "edit" && (
          <div data-testid="edit-tab">
            <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap", alignItems: "center", position: "sticky", top: 80, background: "var(--bg)", padding: "12px 0", zIndex: 5, borderBottom: dirty ? "1px solid var(--accent)" : "1px solid transparent" }}>
              <button className="btn-primary" onClick={saveEditor} disabled={!dirty || saving} data-testid="save-editor-btn">
                <Save size={14} /> {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
              <button className="btn-ghost" onClick={discardChanges} disabled={!dirty}>
                <RotateCcw size={14} /> Annuler
              </button>
              {dirty && <span style={{ color: "var(--accent)", fontSize: "0.82rem", marginLeft: 8 }}>● Modifications non enregistrées</span>}
            </div>
            <p style={{ color: "var(--fg-muted)", fontSize: "0.88rem", marginBottom: 24, maxWidth: 760, lineHeight: 1.6 }}>
              Modifiez chaque section de votre portfolio via les formulaires. Cliquez sur une section pour la déplier. Pensez à <strong style={{ color: "var(--fg)" }}>Enregistrer</strong> en haut une fois vos changements terminés.
            </p>
            <ContentEditor value={editorContent} onChange={onEditorChange} />
          </div>
        )}

        {active === "content" && (
          <div data-testid="content-tab">
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={saveContent} disabled={saving} data-testid="save-content-btn">
                <Save size={14} /> {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button className="btn-ghost" onClick={resetContent}><RotateCcw size={14} /> Réinitialiser</button>
              <button className="btn-ghost" onClick={exportJson}><Download size={14} /> Exporter</button>
              <label className="btn-ghost" style={{ cursor: "pointer" }}>
                <Upload size={14} /> Importer
                <input type="file" accept="application/json" onChange={importJson} style={{ display: "none" }} />
              </label>
            </div>
            {jsonError && (
              <div style={{ background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.4)", color: "#fca5a5", padding: 14, borderRadius: 10, marginBottom: 12, fontSize: "0.9rem" }}>
                {jsonError}
              </div>
            )}
            <p style={{ color: "var(--fg-muted)", fontSize: "0.85rem", marginBottom: 12 }}>
              Modifiez directement le JSON ci-dessous. Champs principaux : <code style={{ color: "var(--accent)" }}>hero</code>, <code style={{ color: "var(--accent)" }}>projects</code>, <code style={{ color: "var(--accent)" }}>education</code>, <code style={{ color: "var(--accent)" }}>experiences</code>, <code style={{ color: "var(--accent)" }}>skills</code>, <code style={{ color: "var(--accent)" }}>passions</code>, <code style={{ color: "var(--accent)" }}>contact</code>. Pour les images, utilisez une URL externe.
            </p>
            <textarea className="json-editor" value={jsonText} onChange={(e) => setJsonText(e.target.value)} spellCheck={false} data-testid="json-editor" />
          </div>
        )}

        {active === "theme" && localSettings && (
          <div data-testid="theme-tab" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            <div className="card" style={{ padding: 32 }}>
              <div className="eyebrow" style={{ marginBottom: 28 }}>Police d'écriture</div>

              <div className="form-field" style={{ marginBottom: 24 }}>
                <label>Police des titres</label>
                <select value={localSettings.headingFont} onChange={(e) => setLocalSettings({ ...localSettings, headingFont: e.target.value })} className="json-editor" style={{ minHeight: 0, padding: "12px 16px", fontFamily: "inherit", fontSize: "0.95rem" }} data-testid="heading-font-select">
                  {AVAILABLE_FONTS.map((f) => (<option key={f.name} value={f.name}>{f.name} — {f.category}</option>))}
                </select>
              </div>

              <div className="form-field" style={{ marginBottom: 24 }}>
                <label>Police du texte</label>
                <select value={localSettings.bodyFont} onChange={(e) => setLocalSettings({ ...localSettings, bodyFont: e.target.value })} className="json-editor" style={{ minHeight: 0, padding: "12px 16px", fontFamily: "inherit", fontSize: "0.95rem" }} data-testid="body-font-select">
                  {AVAILABLE_FONTS.map((f) => (<option key={f.name} value={f.name}>{f.name} — {f.category}</option>))}
                </select>
              </div>

              <div className="form-field">
                <label>Couleur d'accent</label>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <input type="color" value={localSettings.accentColor} onChange={(e) => setLocalSettings({ ...localSettings, accentColor: e.target.value })} style={{ width: 60, height: 50, border: "1px solid var(--border)", borderRadius: 10, background: "transparent" }} data-testid="accent-color-input" />
                  <input type="text" value={localSettings.accentColor} onChange={(e) => setLocalSettings({ ...localSettings, accentColor: e.target.value })} style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", color: "var(--fg)" }} />
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                  {["#FF7A1A", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#EF4444", "#06B6D4"].map((c) => (
                    <button key={c} onClick={() => setLocalSettings({ ...localSettings, accentColor: c })} style={{ width: 28, height: 28, background: c, border: localSettings.accentColor === c ? "2px solid #fff" : "1px solid var(--border)", borderRadius: 8 }} />
                  ))}
                </div>
              </div>

              <button className="btn-primary" onClick={saveSettings} style={{ marginTop: 28 }} data-testid="save-theme-btn">
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
              <div style={{ marginTop: 32 }}>
                <span className="tag-pill accent">Smart 3D</span>
                <span className="tag-pill">Catia V5</span>
                <span className="tag-pill">VBA</span>
              </div>
            </div>
          </div>
        )}

        {active === "messages" && (
          <div data-testid="messages-tab">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div className="eyebrow">Inbox · {messages.length} message{messages.length > 1 ? 's' : ''}</div>
              <button className="btn-ghost" onClick={loadMessages}>Actualiser</button>
            </div>
            {messages.length === 0 ? (
              <div className="card" style={{ padding: 60, textAlign: "center" }}>
                <Mail size={32} style={{ color: "var(--fg-muted)", margin: "0 auto 16px" }} />
                <div style={{ color: "var(--fg-muted)" }}>Aucun message pour le moment.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {messages.map((m) => (
                  <div key={m.id} className="card" style={{ padding: 24, opacity: m.read ? 0.7 : 1 }} data-testid={`msg-${m.id}`}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: "var(--heading-font)", fontSize: "1.2rem" }}>{m.firstName} {m.lastName}</div>
                        <a href={`mailto:${m.email}`} style={{ color: "var(--accent)", textDecoration: "none", fontSize: "0.88rem" }}>{m.email}</a>
                        {m.phone && <span style={{ color: "var(--fg-muted)", fontSize: "0.85rem", marginLeft: 12 }}>· {m.phone}</span>}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {!m.read && (
                          <button className="btn-ghost" style={{ padding: "8px 14px", fontSize: "0.72rem" }} onClick={() => markRead(m.id)}><CheckCircle2 size={12} /> Lu</button>
                        )}
                        <button className="btn-ghost" style={{ padding: "8px 14px", fontSize: "0.72rem", borderColor: "rgba(239, 68, 68, 0.3)", color: "#fca5a5" }} onClick={() => deleteMessage(m.id)}><Trash2 size={12} /></button>
                      </div>
                    </div>
                    <div style={{ color: "var(--fg-muted)", fontSize: "0.8rem", marginBottom: 12 }}>{new Date(m.createdAt).toLocaleString('fr-FR')}</div>
                    <p style={{ color: "var(--fg-soft)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{m.message}</p>
                  </div>
                ))}
              </div>
            )}
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
