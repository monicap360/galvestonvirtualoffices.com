"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  TRIAL_MESSAGE_LIMIT,
  MAX_MESSAGE_CHARS,
  MAX_COMPANY_CHARS,
  MAX_WHAT_CHARS,
  type ChatTurn,
} from "@/lib/ai/agent";

type Phase = "setup" | "chat";

async function callAgent(payload: {
  company: string;
  whatTheyDo: string;
  history: ChatTurn[];
  mode: "intro" | "chat";
}): Promise<{ reply?: string; error?: string; limitReached?: boolean }> {
  try {
    const res = await fetch("/api/ai-demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return { error: data?.error || "Something went wrong." };
    return data;
  } catch {
    return { error: "Couldn't reach the assistant. Check your connection and try again." };
  }
}

export default function AiDemo() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [company, setCompany] = useState("");
  const [whatTheyDo, setWhatTheyDo] = useState("");
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const customerTurns = messages.filter((m) => m.role === "user").length;
  const remaining = Math.max(0, TRIAL_MESSAGE_LIMIT - customerTurns);

  async function build(e: React.FormEvent) {
    e.preventDefault();
    if (!company.trim() || !whatTheyDo.trim() || typing) return;
    setError(null);
    setPhase("chat");
    setTyping(true);
    const res = await callAgent({ company, whatTheyDo, history: [], mode: "intro" });
    setTyping(false);
    if (res.error) {
      setError(res.error);
      setMessages([
        {
          role: "assistant",
          text: `Hi! I'm ${company}'s AI assistant. Ask me anything a customer might.`,
        },
      ]);
      return;
    }
    setMessages([{ role: "assistant", text: res.reply || `Hi! I'm ${company}'s assistant.` }]);
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing || limitReached) return;
    setError(null);
    setInput("");
    const next: ChatTurn[] = [...messages, { role: "user", text }];
    setMessages(next);

    if (next.filter((m) => m.role === "user").length >= TRIAL_MESSAGE_LIMIT) {
      // This will be their last trial message; still answer it, then lock.
    }

    setTyping(true);
    const res = await callAgent({ company, whatTheyDo, history: next, mode: "chat" });
    setTyping(false);

    if (res.limitReached) {
      setLimitReached(true);
      return;
    }
    if (res.error) {
      setError(res.error);
      return;
    }
    setMessages([...next, { role: "assistant", text: res.reply || "…" }]);
    if (next.filter((m) => m.role === "user").length >= TRIAL_MESSAGE_LIMIT) {
      setLimitReached(true);
    }
  }

  // ---- Setup form ----
  if (phase === "setup") {
    return (
      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300/80">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/20 text-violet-300">✨</span>
          Build your AI agent
        </div>
        <h3 className="mt-3 text-xl font-bold text-white">Tell us about your business</h3>
        <p className="mt-1 text-sm text-slate-400">
          We&apos;ll build a live AI assistant trained on your business in seconds — then you can try it yourself.
        </p>
        <form onSubmit={build} className="mt-5 space-y-4">
          <div>
            <label className="label" htmlFor="demo-company">Company name</label>
            <input
              id="demo-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              maxLength={MAX_COMPANY_CHARS}
              required
              placeholder="e.g. Gulf Coast Dental"
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="demo-what">What does your business do?</label>
            <textarea
              id="demo-what"
              value={whatTheyDo}
              onChange={(e) => setWhatTheyDo(e.target.value)}
              maxLength={MAX_WHAT_CHARS}
              required
              rows={5}
              placeholder="Include your services, hours, pricing, booking process, policies, and common customer questions."
              className="input resize-none"
            />
            <div className="mt-1 flex items-start justify-between gap-3 text-xs text-slate-500">
              <span>The more business details you provide, the more knowledgeable Ava becomes.</span>
              <span className="shrink-0">{whatTheyDo.length}/{MAX_WHAT_CHARS}</span>
            </div>
          </div>
          <button type="submit" disabled={!company.trim() || !whatTheyDo.trim()} className="btn-primary w-full py-3 disabled:opacity-50">
            Build my AI agent →
          </button>
        </form>
      </div>
    );
  }

  // ---- Chat ----
  return (
    <div className="card overflow-hidden p-0">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-5 py-3.5">
        <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M8.25 12h.008v.008H8.25V12Zm3.75 0h.008v.008H12V12Zm3.75 0h.008v.008h-.008V12ZM21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.555-.337A5.97 5.97 0 0 1 5.41 20.97a5.97 5.97 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
          </svg>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0b1120] bg-emerald-400" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">Ava · {company}</p>
          <p className="text-xs text-emerald-300">AI assistant · online</p>
        </div>
        <button
          onClick={() => {
            setPhase("setup");
            setMessages([]);
            setLimitReached(false);
            setError(null);
          }}
          className="ml-auto text-xs text-slate-400 hover:text-violet-300"
        >
          Start over
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="h-80 space-y-3 overflow-y-auto px-5 py-4" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "rounded-br-sm bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                  : "rounded-bl-sm border border-white/10 bg-white/[0.06] text-slate-200"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.06] px-4 py-3">
              <span className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
              </span>
            </div>
          </div>
        )}
        {error && <p className="rounded-lg bg-red-400/10 px-3 py-2 text-center text-xs text-red-300">{error}</p>}
      </div>

      {/* Input / limit */}
      {limitReached ? (
        <div className="border-t border-white/10 bg-violet-500/10 px-5 py-5 text-center">
          <p className="text-sm font-semibold text-white">That&apos;s your free preview 🎉</p>
          <p className="mt-1 text-sm text-slate-300">
            Get this exact assistant — trained on {company} — answering your customers 24/7.
          </p>
          <Link href="#plans" className="btn-primary mt-3 px-6 py-2.5 text-sm">Get {company}&apos;s AI assistant →</Link>
        </div>
      ) : (
        <>
          <form onSubmit={send} className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={MAX_MESSAGE_CHARS}
              placeholder="Ask your assistant something…"
              aria-label="Message your AI assistant"
              className="input"
            />
            <button type="submit" disabled={!input.trim() || typing} className="btn-primary shrink-0 px-4 disabled:opacity-50">
              Send
            </button>
          </form>
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-2.5">
            <span className="text-xs text-slate-500">Free preview · {remaining} message{remaining === 1 ? "" : "s"} left</span>
            <Link href="#plans" className="text-xs font-semibold text-violet-300 hover:underline">Get this agent →</Link>
          </div>
        </>
      )}
    </div>
  );
}
