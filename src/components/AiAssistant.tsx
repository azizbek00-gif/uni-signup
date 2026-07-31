"use client";

import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { styles } from "@/lib/styles";
import { C } from "@/lib/tokens";
import { T } from "@/lib/i18n";
import { useSession } from "@/lib/session";

type Msg = { role: "user" | "model"; text: string };

export default function AiAssistant({ topic }: { topic: string }) {
  const { lang } = useSession();
  const t = T[lang];
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const nextHistory = [...messages, { role: "user" as const, text }];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, message: text, history: messages }),
      });
      const data = await res.json();
      setMessages([...nextHistory, { role: "model", text: data.text || "..." }]);
    } catch {
      setMessages([...nextHistory, { role: "model", text: "Xatolik yuz berdi, qayta urinib ko'ring." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uv-rise" style={styles.infoCard}>
      <div style={styles.infoHead}>
        <Bot size={18} color={C.violet} /> {t.aiHelperTitle}
      </div>

      {messages.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14, maxHeight: 320, overflowY: "auto" }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                padding: "10px 14px",
                borderRadius: 14,
                fontSize: 13.5,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                background: m.role === "user" ? `linear-gradient(135deg,${C.primary},${C.violet})` : "#F7F7FD",
                color: m.role === "user" ? "#fff" : C.ink,
              }}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: "flex-start", fontSize: 13, color: C.muted, display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={14} className="uv-pop" /> ...
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={t.aiHelperPh}
          style={{
            flex: 1,
            border: `1.5px solid ${C.line}`,
            borderRadius: 13,
            padding: "12px 14px",
            fontSize: 14,
            outline: "none",
            background: "#F9FAFB",
            color: C.ink,
          }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="uv-btn"
          style={{ ...styles.primaryBtn, ...((!input.trim() || loading) ? styles.btnDisabled : {}) }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
