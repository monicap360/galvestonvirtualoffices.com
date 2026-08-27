"use client";

import { useState } from "react";
import type { ChatTurn } from "@/lib/ai/agent";

type Props = {
  name: string;
  tagline: string;
  description: string;
  configurationSummary: string;
  samplePrompts: string[];
};

type Reply = { reply?: string; error?: string; limitReached?: boolean };

export default function PreviewPanel({ name, tagline, description, configurationSummary, samplePrompts }: Props) {
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: ChatTurn[] = [...history, { role: "user", text: trimmed }];
    setHistory(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: { name, tagline, description },
          history: next,
          mode: "chat",
          configurationSummary,
        }),
      });
      const data = (await response.json()) as Reply;
      if (!response.ok) {
        setError(data.error || "Preview unavailable.");
        return;
      }
      if (data.limitReached) {
        setError("Preview message limit reached. Save your setup and continue when you are ready.");
        return;
      }
      setHistory([...next, { role: "assistant", text: data.reply || "I’m ready for another question." }]);
    } catch {
      setError("Couldn’t reach the preview right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="preview" className="scroll-mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">Preview</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Test your configured agent</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.07] px-2.5 py-1 text-[11px] font-semibold text-amber-200">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
          Preview only
        </span>
      </div>

      <div className="mt-4 max-h-72 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-black/10 p-3" aria-live="polite">
        {history.length === 0 ? (
          <div className="py-3 text-center">
            <p className="text-sm text-slate-300">Try a customer question to see how {name} responds with your current setup.</p>
            <p className="mt-1 text-xs text-slate-500">Unconnected systems stay unavailable in preview.</p>
          </div>
        ) : (
          history.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[86%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-6 ${message.role === "user" ? "rounded-br-sm bg-violet-500/20 text-violet-50" : "rounded-bl-sm border border-white/10 bg-white/[0.04] text-slate-200"}`}>
                {message.text}
              </div>
            </div>
          ))
        )}
        {loading && <p className="text-xs text-violet-300">{name} is thinking…</p>}
        {error && <p className="rounded-xl bg-red-400/10 px-3 py-2 text-xs text-red-300">{error}</p>}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {samplePrompts.slice(0, 3).map((prompt) => (
          <button key={prompt} type="button" onClick={() => void ask(prompt)} className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-2 text-left text-[11px] text-slate-400 transition hover:border-violet-300/25 hover:text-white">
            {prompt}
          </button>
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void ask(input);
        }}
      >
        <input value={input} onChange={(event) => setInput(event.target.value)} className="input" placeholder="Ask like a customer would…" aria-label={`Preview ${name}`} />
        <button type="submit" disabled={loading || !input.trim()} className="btn-primary shrink-0 px-4 disabled:opacity-50">Send</button>
      </form>
    </div>
  );
}
