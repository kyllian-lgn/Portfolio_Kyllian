import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Toaster, toast } from "sonner";
import apiClient from "../lib/api";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post("/portfolio/login", { password });
      localStorage.setItem("admin_token", res.data.token);
      toast.success("Connecté.");
      navigate("/admin");
    } catch (err) {
      toast.error("Mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <Toaster position="bottom-right" theme="dark" />
      <form onSubmit={submit} className="card" style={{ width: "100%", maxWidth: 440, padding: 48, display: "flex", flexDirection: "column", gap: 22 }} data-testid="admin-login-form">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <div style={{ width: 64, height: 64, background: "var(--accent-soft)", color: "var(--accent)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={24} />
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div className="eyebrow" style={{ marginBottom: 16, justifyContent: "center" }}>Espace admin</div>
          <h2 style={{ fontFamily: "var(--heading-font)", fontSize: "2rem", marginBottom: 6 }}>Connexion</h2>
          <p style={{ color: "var(--fg-muted)", fontSize: "0.9rem" }}>Accès réservé à l'administrateur</p>
        </div>
        <div className="form-field">
          <label>Mot de passe</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus data-testid="admin-password-input" />
        </div>
        <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: "center" }} data-testid="admin-login-btn">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
