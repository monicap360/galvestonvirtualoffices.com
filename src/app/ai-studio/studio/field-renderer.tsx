"use client";

import type { AgentConfigValue } from "@/lib/ai-studio/config";
import type { AgentField } from "@/lib/ai-studio/types";

type Props = {
  field: AgentField;
  value: AgentConfigValue | undefined;
  onChange: (value: AgentConfigValue | undefined) => void;
};

export default function FieldRenderer({ field, value, onChange }: Props) {
  const id = `agent-field-${field.key.replaceAll(".", "-")}`;
  const helpId = `${id}-help`;
  const describedBy = field.description ? helpId : undefined;

  if (field.type === "textarea") {
    return (
      <div>
        <label className="label" htmlFor={id}>{field.label}{field.required ? " *" : ""}</label>
        {field.description && <p id={helpId} className="mb-2 text-xs leading-5 text-slate-500">{field.description}</p>}
        <textarea
          id={id}
          aria-describedby={describedBy}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          rows={4}
          className="input min-h-28 resize-y"
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        <label className="label" htmlFor={id}>{field.label}{field.required ? " *" : ""}</label>
        {field.description && <p id={helpId} className="mb-2 text-xs leading-5 text-slate-500">{field.description}</p>}
        <select
          id={id}
          aria-describedby={describedBy}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value || undefined)}
          className="input"
        >
          <option value="">Select…</option>
          {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>
    );
  }

  if (field.type === "multiselect") {
    const selected = Array.isArray(value) ? value.map(String) : [];
    return (
      <fieldset>
        <legend className="label">{field.label}{field.required ? " *" : ""}</legend>
        {field.description && <p className="mb-2 text-xs leading-5 text-slate-500">{field.description}</p>}
        <div className="flex flex-wrap gap-2">
          {field.options?.map((option) => {
            const active = selected.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(active ? selected.filter((item) => item !== option.value) : [...selected, option.value])}
                className={`rounded-full border px-3 py-2 text-xs font-medium transition ${active ? "border-violet-300/50 bg-violet-400/15 text-violet-100" : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (field.type === "toggle") {
    const active = Boolean(value);
    return (
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
        <div>
          <p className="text-sm font-medium text-white">{field.label}{field.required ? " *" : ""}</p>
          {field.description && <p className="mt-1 text-xs leading-5 text-slate-500">{field.description}</p>}
        </div>
        <button
          type="button"
          aria-pressed={active}
          aria-label={field.label}
          onClick={() => onChange(!active)}
          className={`relative h-7 w-12 shrink-0 rounded-full border transition ${active ? "border-emerald-300/40 bg-emerald-400/25" : "border-white/10 bg-white/[0.05]"}`}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${active ? "left-6" : "left-1"}`} />
        </button>
      </div>
    );
  }

  const inputType = field.type === "url" ? "url" : field.type === "number" ? "number" : field.type === "time" ? "time" : "text";
  const renderedValue = typeof value === "number" || typeof value === "string" ? value : "";

  return (
    <div>
      <label className="label" htmlFor={id}>{field.label}{field.required ? " *" : ""}</label>
      {field.description && <p id={helpId} className="mb-2 text-xs leading-5 text-slate-500">{field.description}</p>}
      <input
        id={id}
        aria-describedby={describedBy}
        type={inputType}
        value={renderedValue}
        onChange={(event) => onChange(field.type === "number" ? (event.target.value === "" ? undefined : Number(event.target.value)) : event.target.value)}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        className="input"
      />
    </div>
  );
}
