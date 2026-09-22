import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Loader2, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

type ChatMessage = { from: "user" | "ai"; text: string };

const SUGGESTIONS = ["Gate hours?", "When's my payment due?", "Gate code not working", "Can I get a bigger unit?"];

export default function ChatWidget({ tenantContext }: { tenantContext?: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "ai", text: "Hi! I'm the Titusville Self-Storage AI assistant \u2014 ask me anything about your account, or try one of the suggestions below." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    const history = messages;
    setMessages((m) => [...m, { from: "user", text: trimmed }]);
    setInput("");
    setSending(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("tenant-chat", {
        body: { message: trimmed, history, tenantContext },
      });
      if (fnError) throw fnError;
      const reply = (data as { reply?: string; error?: string })?.reply ?? (data as { error?: string })?.error ?? "Sorry, something went wrong.";
      setMessages((m) => [...m, { from: "ai", text: reply }]);
    } catch (err) {
      console.error("chat error", err);
      setError("Couldn't reach the assistant. Please try again, or contact the office directly.");
    } finally {
      setSending(false);
    }
  }

  if (!open) {
    return (
      <button className="chat-fab" onClick={() => setOpen(true)} aria-label="Open AI chat">
        <MessageCircle size={21} /><i />
      </button>
    );
  }

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, width: 340, maxWidth: "calc(100vw - 32px)", maxHeight: 520, display: "flex", flexDirection: "column", background: "var(--surface-2, #fff)", border: "1px solid var(--border, #e1e0d9)", borderRadius: 14, boxShadow: "0 8px 30px rgba(0,0,0,.18)", zIndex: 1000, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: "1px solid var(--border, #e1e0d9)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600 }}><Sparkles size={16} /> AI Assistant</div>
        <button onClick={() => setOpen(false)} aria-label="Close chat" style={{ all: "unset", cursor: "pointer", display: "flex" }}><X size={18} /></button>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8, fontSize: 13.5 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.from === "user" ? "flex-end" : "flex-start", background: m.from === "user" ? "var(--accent, #2a78d6)" : "var(--surface, #f4f3ee)", color: m.from === "user" ? "#fff" : "inherit", borderRadius: 10, padding: "8px 11px", maxWidth: "85%", whiteSpace: "pre-wrap" }}>
            {m.text}
          </div>
        ))}
        {sending && <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6, color: "var(--ink-3, #898781)", fontSize: 12 }}><Loader2 size={14} className="hub-spin" /> Thinking…</div>}
        {error && <div style={{ color: "#d03b3b", fontSize: 12 }}>{error}</div>}
      </div>
      <div style={{ display: "flex", gap: 6, padding: "8px 10px", flexWrap: "wrap" }}>
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => send(s)} disabled={sending} style={{ fontSize: 11.5, padding: "5px 9px", borderRadius: 999, border: "1px solid var(--border, #e1e0d9)", background: "none", cursor: "pointer" }}>{s}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderTop: "1px solid var(--border, #e1e0d9)" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
          placeholder="Type a question..."
          disabled={sending}
          style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border, #e1e0d9)", fontSize: 13 }}
        />
        <button onClick={() => send(input)} disabled={sending || !input.trim()} aria-label="Send" style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", padding: 8, color: "var(--accent, #2a78d6)" }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
