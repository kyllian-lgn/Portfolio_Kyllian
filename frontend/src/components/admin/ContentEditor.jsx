import React from "react";
import { Field, TextInput, TextArea, NumberInput, StringList, Repeater, Section, SkillRepeater } from "./EditorPrimitives";
import ImageUpload from "./ImageUpload";

/* ContentEditor: a fully formed UI to edit every field of the portfolio content.
   Receives `value` (the whole content object) and `onChange(next)` to update it. */
export default function ContentEditor({ value, onChange }) {
  if (!value) return null;

  const patch = (key, sub) => {
    onChange({ ...value, [key]: { ...value[key], ...sub } });
  };
  const setKey = (key, next) => {
    onChange({ ...value, [key]: next });
  };

  /* ---------- Général ---------- */
  return (
    <div>
      <Section title="Général · Site" eyebrow="01" defaultOpen>
        <Field label="Nom complet"><TextInput value={value.site?.name} onChange={(v) => patch("site", { name: v })} /></Field>
        <Field label="Logo (texte court)" hint="Ex : KLG, KL, JD"><TextInput value={value.site?.logo} onChange={(v) => patch("site", { logo: v })} /></Field>
        <Field label="Titre de l'onglet navigateur"><TextInput value={value.site?.title} onChange={(v) => patch("site", { title: v })} /></Field>
        <Field label="URL du CV (PDF)" hint="Lien externe vers le PDF"><TextInput value={value.site?.cvUrl} onChange={(v) => patch("site", { cvUrl: v })} /></Field>
      </Section>

      {/* ---------- Hero ---------- */}
      <Section title="Page Accueil · Hero" eyebrow="02">
        <Field label="Tag (au-dessus du nom)"><TextInput value={value.hero?.tag} onChange={(v) => patch("hero", { tag: v })} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Prénom (en blanc)"><TextInput value={value.hero?.firstName} onChange={(v) => patch("hero", { firstName: v })} /></Field>
          <Field label="Nom (en orange italique)"><TextInput value={value.hero?.lastName} onChange={(v) => patch("hero", { lastName: v })} /></Field>
        </div>
        <Field label="Sous-titre (en majuscules)"><TextInput value={value.hero?.subtitle} onChange={(v) => patch("hero", { subtitle: v })} /></Field>
        <Field label="Description courte"><TextArea rows={3} value={value.hero?.description} onChange={(v) => patch("hero", { description: v })} /></Field>
        <Field label="Photo de profil"><ImageUpload value={value.hero?.photo} onChange={(v) => patch("hero", { photo: v })} /></Field>

        <div style={{ marginTop: 20, marginBottom: 10, fontFamily: "var(--heading-font)", fontSize: "1rem" }}>Statistiques (3 blocs)</div>
        <Repeater
          items={value.hero?.stats || []}
          onChange={(next) => patch("hero", { stats: next })}
          addLabel="Ajouter une stat"
          makeNew={() => ({ value: "0", label: "Nouveau" })}
          itemTitle={(it) => `${it.value} — ${it.label}`}
          renderItem={(item, i, update) => (
            <>
              <Field label="Valeur (ex: 3+, 10+, BUT)"><TextInput value={item.value} onChange={(v) => update({ value: v })} /></Field>
              <Field label="Label"><TextInput value={item.label} onChange={(v) => update({ label: v })} /></Field>
            </>
          )}
        />
      </Section>

      {/* ---------- Marquee ---------- */}
      <Section title="Bandeau défilant (Marquee)" eyebrow="03">
        <Field label="Mots qui défilent" hint="Appuyez sur Entrée pour ajouter">
          <StringList items={value.marquee || []} onChange={(next) => setKey("marquee", next)} placeholder="Ex: Catia V5, Smart 3D…" />
        </Field>
      </Section>

      {/* ---------- Projects ---------- */}
      <Section title="Projets" eyebrow="04">
        <Repeater
          items={value.projects || []}
          onChange={(next) => setKey("projects", next)}
          addLabel="Ajouter un projet"
          makeNew={() => ({
            id: `p${Date.now()}`,
            num: String((value.projects?.length || 0) + 1).padStart(2, "0"),
            title: "Nouveau projet",
            category: "Conception",
            subtitle: "",
            description: "",
            skills: "",
            deliverables: "",
            innovation: "",
            tags: [],
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
          })}
          itemTitle={(it) => `${it.num || "—"} · ${it.title || "(sans titre)"}`}
          renderItem={(item, i, update) => (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 200px", gap: 12 }}>
                <Field label="N°"><TextInput value={item.num} onChange={(v) => update({ num: v })} /></Field>
                <Field label="Titre"><TextInput value={item.title} onChange={(v) => update({ title: v })} /></Field>
                <Field label="Catégorie" hint="Sert au filtre"><TextInput value={item.category} onChange={(v) => update({ category: v })} /></Field>
              </div>
              <Field label="Sous-titre"><TextInput value={item.subtitle} onChange={(v) => update({ subtitle: v })} /></Field>
              <Field label="Description"><TextArea rows={3} value={item.description} onChange={(v) => update({ description: v })} /></Field>
              <Field label="Compétences"><TextInput value={item.skills} onChange={(v) => update({ skills: v })} /></Field>
              <Field label="Livrables"><TextInput value={item.deliverables} onChange={(v) => update({ deliverables: v })} /></Field>
              <Field label="Innovation"><TextInput value={item.innovation} onChange={(v) => update({ innovation: v })} /></Field>
              <Field label="Image du projet"><ImageUpload value={item.image} onChange={(v) => update({ image: v })} /></Field>
              <Field label="Tags">
                <StringList items={item.tags || []} onChange={(next) => update({ tags: next })} placeholder="Ex: Catia V5" />
              </Field>
            </>
          )}
        />
      </Section>

      {/* ---------- Education ---------- */}
      <Section title="Parcours · Formations" eyebrow="05">
        <Repeater
          items={value.education || []}
          onChange={(next) => setKey("education", next)}
          addLabel="Ajouter une formation"
          makeNew={() => ({
            id: `e${Date.now()}`,
            period: "2026 — 2028",
            title: "Nouvelle formation",
            place: "",
            tag: "Formation",
            details: [],
          })}
          itemTitle={(it) => `${it.period || ""} · ${it.title || "(sans titre)"}`}
          renderItem={(item, i, update) => (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Période"><TextInput value={item.period} onChange={(v) => update({ period: v })} /></Field>
                <Field label="Étiquette" hint="Ex: Formation, Alternance, Certification"><TextInput value={item.tag} onChange={(v) => update({ tag: v })} /></Field>
              </div>
              <Field label="Titre"><TextInput value={item.title} onChange={(v) => update({ title: v })} /></Field>
              <Field label="Lieu / École"><TextInput value={item.place} onChange={(v) => update({ place: v })} /></Field>
              <Field label="Points détaillés (un par ligne)">
                <StringList items={item.details || []} onChange={(next) => update({ details: next })} placeholder="Nouveau point" />
              </Field>
            </>
          )}
        />
      </Section>

      {/* ---------- Experiences ---------- */}
      <Section title="Expériences" eyebrow="06">
        <Repeater
          items={value.experiences || []}
          onChange={(next) => setKey("experiences", next)}
          addLabel="Ajouter une expérience"
          makeNew={() => ({
            id: `x${Date.now()}`,
            company: "Nouvelle entreprise",
            role: "",
            type: "Alternance",
            period: "",
            missions: [],
            highlight: "",
            tags: [],
          })}
          itemTitle={(it) => `${it.company || "(sans nom)"} · ${it.type || ""}`}
          renderItem={(item, i, update) => (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Entreprise"><TextInput value={item.company} onChange={(v) => update({ company: v })} /></Field>
                <Field label="Type" hint="Alternance / Stage / Saisonnier"><TextInput value={item.type} onChange={(v) => update({ type: v })} /></Field>
              </div>
              <Field label="Poste / Rôle"><TextInput value={item.role} onChange={(v) => update({ role: v })} /></Field>
              <Field label="Période"><TextInput value={item.period} onChange={(v) => update({ period: v })} /></Field>
              <Field label="Missions (une par ligne)">
                <StringList items={item.missions || []} onChange={(next) => update({ missions: next })} placeholder="Nouvelle mission" />
              </Field>
              <Field label="Projet phare (optionnel)"><TextArea rows={2} value={item.highlight} onChange={(v) => update({ highlight: v })} /></Field>
              <Field label="Tags / Compétences">
                <StringList items={item.tags || []} onChange={(next) => update({ tags: next })} placeholder="Nouveau tag" />
              </Field>
            </>
          )}
        />
      </Section>

      {/* ---------- Skills ---------- */}
      <Section title="Compétences" eyebrow="07">
        <div style={{ marginBottom: 10, fontFamily: "var(--heading-font)", fontSize: "1rem" }}>Logiciels CAO / FAO</div>
        <SkillRepeater items={value.skills?.software || []} onChange={(next) => patch("skills", { software: next })} />

        <div style={{ marginTop: 30, marginBottom: 10, fontFamily: "var(--heading-font)", fontSize: "1rem" }}>Programmation</div>
        <SkillRepeater items={value.skills?.programming || []} onChange={(next) => patch("skills", { programming: next })} />

        <div style={{ marginTop: 30, marginBottom: 10, fontFamily: "var(--heading-font)", fontSize: "1rem" }}>Technologies</div>
        <SkillRepeater items={value.skills?.technologies || []} onChange={(next) => patch("skills", { technologies: next })} />

        <div style={{ marginTop: 30 }}>
          <Field label="Compétences scientifiques (texte)"><TextArea rows={2} value={value.skills?.scientific} onChange={(v) => patch("skills", { scientific: v })} /></Field>
          <Field label="Moyens de production (texte)"><TextArea rows={2} value={value.skills?.production} onChange={(v) => patch("skills", { production: v })} /></Field>
          <Field label="Industrie 4.0 (texte)"><TextArea rows={2} value={value.skills?.industry} onChange={(v) => patch("skills", { industry: v })} /></Field>
        </div>

        <div style={{ marginTop: 30, marginBottom: 10, fontFamily: "var(--heading-font)", fontSize: "1rem" }}>Soft skills (avec descriptions)</div>
        <SkillRepeater items={value.skills?.soft || []} onChange={(next) => patch("skills", { soft: next })} hasLevel={false} />

        <div style={{ marginTop: 30, marginBottom: 10, fontFamily: "var(--heading-font)", fontSize: "1rem" }}>Langues</div>
        <Repeater
          items={value.skills?.languages || []}
          onChange={(next) => patch("skills", { languages: next })}
          addLabel="Ajouter une langue"
          makeNew={() => ({ name: "Nouvelle langue", level: "B1" })}
          itemTitle={(it) => `${it.name} — ${it.level}`}
          renderItem={(item, i, update) => (
            <>
              <Field label="Langue"><TextInput value={item.name} onChange={(v) => update({ name: v })} /></Field>
              <Field label="Niveau" hint="Ex: Langue maternelle, B2, C1"><TextInput value={item.level} onChange={(v) => update({ level: v })} /></Field>
            </>
          )}
        />
      </Section>

      {/* ---------- Passions ---------- */}
      <Section title="Passions" eyebrow="08">
        <div style={{ marginBottom: 10, fontFamily: "var(--heading-font)", fontSize: "1rem" }}>Sports & Activités</div>
        <Repeater
          items={value.passions?.sports || []}
          onChange={(next) => patch("passions", { sports: next })}
          addLabel="Ajouter une activité"
          makeNew={() => ({ name: "Nouvelle activité", description: "", tag: "", image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&q=80" })}
          itemTitle={(it) => it.name || "—"}
          renderItem={(item, i, update) => (
            <>
              <Field label="Nom"><TextInput value={item.name} onChange={(v) => update({ name: v })} /></Field>
              <Field label="Description"><TextArea rows={3} value={item.description} onChange={(v) => update({ description: v })} /></Field>
              <Field label="Étiquette (sous la description)"><TextInput value={item.tag} onChange={(v) => update({ tag: v })} /></Field>
              <Field label="Image de l'activité"><ImageUpload value={item.image} onChange={(v) => update({ image: v })} /></Field>
            </>
          )}
        />

        <div style={{ marginTop: 30, marginBottom: 10, fontFamily: "var(--heading-font)", fontSize: "1rem" }}>Voyages</div>
        <Field label="Texte d'introduction"><TextArea rows={3} value={value.passions?.travels?.description} onChange={(v) => patch("passions", { travels: { ...value.passions?.travels, description: v } })} /></Field>
        <Field label="Pays visités">
          <StringList items={value.passions?.travels?.countries || []} onChange={(next) => patch("passions", { travels: { ...value.passions?.travels, countries: next } })} placeholder="Nouveau pays" />
        </Field>
      </Section>

      {/* ---------- Contact ---------- */}
      <Section title="Contact" eyebrow="09">
        <Field label="Email"><TextInput value={value.contact?.email} onChange={(v) => patch("contact", { email: v })} /></Field>
        <Field label="Téléphone"><TextInput value={value.contact?.phone} onChange={(v) => patch("contact", { phone: v })} /></Field>
        <Field label="Localisation (ville/pays)"><TextInput value={value.contact?.address} onChange={(v) => patch("contact", { address: v })} /></Field>
        <Field label="Adresse complète"><TextInput value={value.contact?.fullAddress} onChange={(v) => patch("contact", { fullAddress: v })} /></Field>
        <Field label="URL LinkedIn"><TextInput value={value.contact?.linkedin} onChange={(v) => patch("contact", { linkedin: v })} /></Field>
        <Field label="Mobilité (carte info)"><TextInput value={value.contact?.mobility} onChange={(v) => patch("contact", { mobility: v })} /></Field>
      </Section>
    </div>
  );
}
