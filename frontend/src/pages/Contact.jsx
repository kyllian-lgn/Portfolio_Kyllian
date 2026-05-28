import React, { useState } from "react";
import { Mail, Phone, MapPin, Linkedin, Car, Send } from "lucide-react";
import { Toaster, toast } from "sonner";
import emailjs from "@emailjs/browser";
import { usePortfolio } from "../context/PortfolioContext";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function Contact() {
  const { content, loading } = usePortfolio();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  if (loading || !content) return <div style={{ minHeight: "100vh" }} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.lastName || !form.email || !form.message) {
      toast.error("Merci de remplir les champs obligatoires.");
      return;
    }
    setSubmitting(true);
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: `${form.firstName} ${form.lastName}`.trim(),
          from_email: form.email,
          phone: form.phone || "Non renseigné",
          message: form.message,
          reply_to: form.email,
        },
        PUBLIC_KEY
      );
      toast.success("✅ Message envoyé ! Je vous répondrai rapidement.");
      setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error("Erreur lors de l'envoi. Utilisez le lien mail direct.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const mailtoHref = `mailto:${content.contact.email}?subject=Contact%20Portfolio&body=${encodeURIComponent(form.message || '')}`;

  return (
    <>
      <Toaster position="bottom-right" theme="dark" />
      <section className="hero" style={{ minHeight: "70vh" }}>
        <div className="huge-bg" style={{ fontSize: "clamp(12rem, 28vw, 32rem)" }}>CONTACT</div>
        <div className="container-x">
          <div className="eyebrow" style={{ marginBottom: 32 }}>Kyllian Le Guen — Contact</div>
          <h1 className="display-1">Entrons<br /><span className="italic-orange">en contact.</span></h1>
        </div>
      </section>

      <section className="section-pad" style={{ paddingTop: 60 }}>
        <div className="container-x">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 60, alignItems: "start" }} className="contact-grid">
            <div className="reveal">
              <div className="eyebrow" style={{ marginBottom: 24 }}>À l'écoute de nouvelles opportunités</div>
              <h2 className="display-2" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: 24 }}>À l'écoute de<br /><span className="italic-orange">nouvelles opportunités.</span></h2>
              <p style={{ color: "var(--fg-soft)", lineHeight: 1.7, marginBottom: 40 }}>
                Disponible pour échanger autour de nouveaux projets innovants, de collaborations ou d'opportunités professionnelles.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <a href={`mailto:${content.contact.email}`} className="card" style={{ padding: 22, display: "flex", alignItems: "center", gap: 18, textDecoration: "none" }}>
                  <div style={{ width: 44, height: 44, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10 }}><Mail size={18} /></div>
                  <div>
                    <div style={{ color: "var(--fg-muted)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Email</div>
                    <div style={{ color: "var(--fg)", marginTop: 4 }}>{content.contact.email}</div>
                  </div>
                </a>
                <a href={`tel:${content.contact.phone.replace(/\s/g, '')}`} className="card" style={{ padding: 22, display: "flex", alignItems: "center", gap: 18, textDecoration: "none" }}>
                  <div style={{ width: 44, height: 44, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10 }}><Phone size={18} /></div>
                  <div>
                    <div style={{ color: "var(--fg-muted)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Téléphone</div>
                    <div style={{ color: "var(--fg)", marginTop: 4 }}>{content.contact.phone}</div>
                  </div>
                </a>
                <div className="card" style={{ padding: 22, display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ width: 44, height: 44, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10 }}><MapPin size={18} /></div>
                  <div>
                    <div style={{ color: "var(--fg-muted)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Localisation</div>
                    <div style={{ color: "var(--fg)", marginTop: 4 }}>{content.contact.address}</div>
                    <div style={{ color: "var(--fg-muted)", fontSize: "0.82rem", marginTop: 2 }}>{content.contact.fullAddress}</div>
                  </div>
                </div>
                <a href={content.contact.linkedin} target="_blank" rel="noreferrer" className="card" style={{ padding: 22, display: "flex", alignItems: "center", gap: 18, textDecoration: "none" }}>
                  <div style={{ width: 44, height: 44, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10 }}><Linkedin size={18} /></div>
                  <div>
                    <div style={{ color: "var(--fg-muted)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>LinkedIn</div>
                    <div style={{ color: "var(--fg)", marginTop: 4 }}>le-guen-kyllian</div>
                  </div>
                </a>
                <div className="card" style={{ padding: 22, display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ width: 44, height: 44, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10 }}><Car size={18} /></div>
                  <div>
                    <div style={{ color: "var(--fg-muted)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Mobilité</div>
                    <div style={{ color: "var(--fg)", marginTop: 4 }}>{content.contact.mobility}</div>
                  </div>
                </div>
              </div>
            </div>

            <form className="card reveal" style={{ padding: 40, display: "flex", flexDirection: "column", gap: 18 }} onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-field">
                  <label>Prénom</label>
                  <input type="text" placeholder="Votre prénom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>Nom *</label>
                  <input type="text" placeholder="Votre nom" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div className="form-field">
                <label>Email *</label>
                <input type="email" placeholder="votre@email.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Téléphone</label>
                <input type="tel" placeholder="+33 6 ..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Message *</label>
                <textarea rows="6" placeholder="Décrivez votre projet ou votre demande..." required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? "Envoi en cours..." : "Envoyer le message"} <Send size={14} />
                </button>
                <a href={mailtoHref} className="btn-ghost">Ouvrir dans mon mail</a>
              </div>
            </form>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </>
  );
}
