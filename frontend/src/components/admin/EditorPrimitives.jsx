import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";

/* -------------------- Tiny generic field primitives -------------------- */
export function Field({ label, children, hint }) {
  return (
    <div className="form-field" style={{ marginBottom: 14 }}>
      <label>{label}</label>
      {children}
      {hint && <div style={{ color: "var(--fg-muted)", fontSize: "0.72rem", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder, type = "text" }) {
  return <input type={type} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

export function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return <textarea rows={rows} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

export function NumberInput({ value, onChange, min = 0, max = 100 }) {
  return <input type="number" min={min} max={max} value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} />;
}

/* List of simple strings (e.g. marquee, travels.countries, missions, details, tags) */
export function StringList({ items = [], onChange, placeholder = "Ajouter…" }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    if (!draft.trim()) return;
    onChange([...(items || []), draft.trim()]);
    setDraft("");
  };
  const update = (i, v) => {
    const next = [...items]; next[i] = v; onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
        {(items || []).map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8 }}>
            <input value={item} onChange={(e) => update(i, e.target.value)} style={{ flex: 1 }} />
            <button type="button" className="btn-ghost" style={{ padding: "8px 12px" }} onClick={() => remove(i)}>
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={placeholder} style={{ flex: 1 }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <button type="button" className="btn-ghost" style={{ padding: "8px 14px" }} onClick={add}>
          <Plus size={12} /> Ajouter
        </button>
      </div>
    </div>
  );
}

/* Generic repeater: render each item via renderItem(item, idx, update, remove, moveUp, moveDown) */
export function Repeater({ items = [], onChange, addLabel = "Ajouter un élément", makeNew, renderItem, itemTitle = (it, i) => `Élément ${i + 1}` }) {
  const [open, setOpen] = useState({});

  const update = (idx, patch) => {
    const next = [...items];
    next[idx] = typeof patch === "function" ? patch(next[idx]) : { ...next[idx], ...patch };
    onChange(next);
  };
  const remove = (idx) => {
    if (!window.confirm("Supprimer cet élément ?")) return;
    onChange(items.filter((_, i) => i !== idx));
  };
  const move = (idx, dir) => {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };
  const add = () => {
    onChange([...(items || []), makeNew()]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {(items || []).map((item, i) => (
        <div key={i} style={{ background: "var(--bg-soft)", border: "1px solid var(--border)", borderRadius: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", gap: 10 }}>
            <button type="button" onClick={() => setOpen({ ...open, [i]: !open[i] })}
              style={{ background: "transparent", border: "none", color: "var(--fg)", flex: 1, textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
              <GripVertical size={14} style={{ color: "var(--fg-muted)" }} />
              <span style={{ fontFamily: "var(--heading-font)", fontSize: "0.95rem" }}>{itemTitle(item, i)}</span>
              {open[i] ? <ChevronUp size={14} style={{ marginLeft: "auto" }} /> : <ChevronDown size={14} style={{ marginLeft: "auto" }} />}
            </button>
            <div style={{ display: "flex", gap: 4 }}>
              <button type="button" className="btn-ghost" style={{ padding: "6px 10px", fontSize: "0.7rem" }} onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
              <button type="button" className="btn-ghost" style={{ padding: "6px 10px", fontSize: "0.7rem" }} onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</button>
              <button type="button" className="btn-ghost" style={{ padding: "6px 10px", fontSize: "0.7rem", borderColor: "rgba(239,68,68,0.3)", color: "#fca5a5" }} onClick={() => remove(i)}>
                <Trash2 size={12} />
              </button>
            </div>
          </div>
          {open[i] && (
            <div style={{ padding: "0 18px 18px 18px", borderTop: "1px solid var(--border)" }}>
              <div style={{ paddingTop: 16 }}>
                {renderItem(item, i, (patch) => update(i, patch))}
              </div>
            </div>
          )}
        </div>
      ))}
      <button type="button" className="btn-ghost" onClick={add} style={{ alignSelf: "flex-start" }}>
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

/* Section block (header + body, collapsible) */
export function Section({ title, eyebrow, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card" style={{ padding: 0, marginBottom: 20 }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "transparent", border: "none", color: "var(--fg)", padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
        <div>
          {eyebrow && <div className="eyebrow no-after" style={{ marginBottom: 8, fontSize: "0.7rem" }}>{eyebrow}</div>}
          <div style={{ fontFamily: "var(--heading-font)", fontSize: "1.3rem" }}>{title}</div>
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && (
        <div style={{ padding: "0 28px 28px 28px", borderTop: "1px solid var(--border)" }}>
          <div style={{ paddingTop: 20 }}>{children}</div>
        </div>
      )}
    </div>
  );
}

/* Skill repeater specialised */
export function SkillRepeater({ items, onChange, hasLevel = true }) {
  return (
    <Repeater
      items={items}
      onChange={onChange}
      addLabel="Ajouter une compétence"
      makeNew={() => hasLevel ? { name: "Nouvelle compétence", level: 70 } : { name: "Nouveau", description: "" }}
      itemTitle={(it) => it.name || "—"}
      renderItem={(item, i, update) => (
        <>
          <Field label="Nom"><TextInput value={item.name} onChange={(v) => update({ name: v })} /></Field>
          {hasLevel ? (
            <Field label={`Niveau (${item.level ?? 0}%)`}>
              <input type="range" min="0" max="100" value={item.level ?? 0} onChange={(e) => update({ level: Number(e.target.value) })} style={{ width: "100%" }} />
            </Field>
          ) : (
            <Field label="Description"><TextArea rows={2} value={item.description} onChange={(v) => update({ description: v })} /></Field>
          )}
        </>
      )}
    />
  );
}
