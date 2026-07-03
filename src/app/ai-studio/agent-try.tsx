"use client";

import { useEffect, useRef, useState } from "react";
import { TRIAL_MESSAGE_LIMIT, MAX_MESSAGE_CHARS, type ChatTurn } from "@/lib/ai/agent";

type AgentInfo = { name: string; tagline: string; description: string };

type AgentReply = { reply?: string; error?: string; limitReached?: boolean };

async function callAgent(agent: AgentInfo, history: ChatTurn[], mode: "intro" | "chat"): Promise<AgentReply> {
  try {
    const res = await fetch("/api/ai-demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent, history, mode }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data?.error || "Something went wrong." };
    return data as AgentReply;
  } catch {
    return { error: "Couldn't reach the agent. Check your connection and try again." };
  }
}

export default function AgentTry({ name, tagline, description }: AgentInfo) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  async function launch() {
    setOpen(true);
    if (started) return;
    setStarted(true);
    setTyping(true);
    const res = await callAgent({ name, tagline, description }, [], "intro");
    setTyping(false);
    if (res.error) {
      setError(res.error);
      setMessages([{ role: "assistant", text: `Hi! I'm ${name}. Go ahead — try me out.` }]);
      return;
    }
    setMessages([{ role: "assistant", text: res.reply || `Hi! I'm ${name}.` }]);
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing || limitReached) return;
    setError(null);
    setInput("");
    const next: ChatTurn[] = [...messages, { role: "user", text }];
    setMessages(next);
    setTyping(true);
    const res = await callAgent({ name, tagline, description }, next, "chat");
    setTyping(false);
    if (res.limitReached) return setLimitReached(true);
    if (res.error) return setError(res.error);
    setMessages([...next, { role: "assistant", text: res.reply || "…" }]);
    if (next.filter((m) => m.role === "user").length >= TRIAL_MESSAGE_LIMIT) setLimitReached(true);
  }

  const remaining = Math.max(0, TRIAL_MESSAGE_LIMIT - messages.filter((m) => m.role === "user").length);

  return (
    <>
      <button onClick={launch} className="btn-outline w-full">
        ▶ Try a demo
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="card flex h-[85vh] w-full max-w-lg flex-col overflow-hidden p-0 sm:h-[560px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-5 py-3.5">
              <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M8.25 12h.008v.008H8.25V12Zm3.75 0h.008v.008H12V12Zm3.75 0h.008v.008h-.008V12ZM21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.555-.337A5.97 5.97 0 0 1 5.41 20.97a5.97 5.97 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0b1120] bg-emerald-400" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{name}</p>
                <p className="text-xs text-emerald-300">Live demo · online</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close demo" className="ml-auto text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4" aria-live="polite">
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
              <div className="border-t border-white/10 bg-violet-500/10 px-5 py-4 text-center">
                <p className="text-sm font-semibold text-white">Like what {name} can do?</p>
                <p className="mt-1 text-sm text-slate-300">Close this and hit Subscribe to put it to work for your business.</p>
                <button onClick={() => setOpen(false)} className="btn-primary mt-3 px-6 py-2.5 text-sm">Back to plan →</button>
              </div>
            ) : (
              <form onSubmit={send} className="border-t border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    maxLength={MAX_MESSAGE_CHARS}
                    placeholder="Type like a customer would…"
                    aria-label={`Message ${name}`}
                    className="input"
                    autoFocus
                  />
                  <button type="submit" disabled={!input.trim() || typing} className="btn-primary shrink-0 px-4 disabled:opacity-50">
                    Send
                  </button>
                </div>
                <p className="mt-2 text-center text-xs text-slate-500">Free demo · {remaining} message{remaining === 1 ? "" : "s"} left</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
