"use client";

import { useEffect, useState } from "react";

export type Item = {
  id: string;
  label: string;
  detail?: string;
  href?: string;
  hrefLabel?: string;
  defaultDone?: boolean;
};
export type Section = { title: string; items: Item[] };

const KEY = "gvo-admin-checklist-v1";

export default function Checklist({ sections }: { sections: Section[] }) {
  const allItems = sections.flatMap((s) => s.items);
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(allItems.map((i) => [i.id, !!i.defaultDone]))
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || "{}");
      setChecked((prev) => ({ ...prev, ...stored }));
    } catch {}
    setLoaded(true);
  }, []);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const done = allItems.filter((i) => checked[i.id]).length;
  const pct = Math.round((done / allItems.length) * 100);

  return (
    <div>
      {/* progress */}
      <div className="card p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-white">{done} of {allItems.length} complete</span>
          <span className="text-slate-400">{pct}%</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {sections.map((s) => (
          <div key={s.title} className="card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-300/80">{s.title}</h2>
            <ul className="mt-3 divide-y divide-white/5">
              {s.items.map((i) => {
                const isDone = !!checked[i.id];
                return (
                  <li key={i.id} className="flex items-start gap-3 py-3">
                    <button
                      onClick={() => toggle(i.id)}
                      aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${
                        isDone ? "border-violet-400 bg-violet-500 text-white" : "border-white/20 bg-white/5 text-transparent hover:border-violet-400/60"
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-3 w-3"><path d="m5 12 5 5L20 7" /></svg>
                    </button>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium ${isDone ? "text-slate-500 line-through" : "text-white"}`}>{i.label}</p>
                      {i.detail && <p className="mt-0.5 text-sm text-slate-400">{i.detail}</p>}
                      {i.href && (
                        <a href={i.href} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm font-semibold text-violet-300 hover:underline">
                          {i.hrefLabel || "Open"} →
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      {loaded && done === allItems.length && (
        <p className="mt-6 rounded-lg bg-violet-400/10 px-4 py-3 text-center text-violet-200">🎉 Everything done — you&apos;re fully launched!</p>
      )}
    </div>
  );
}
