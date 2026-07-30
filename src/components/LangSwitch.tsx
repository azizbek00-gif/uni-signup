"use client";

import { useState } from "react";
import { Check, Globe } from "lucide-react";
import { LANGS, type Lang } from "@/lib/i18n";
import { C } from "@/lib/tokens";

export default function LangSwitch({
  lang,
  setLang,
  floating,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  floating?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={
        floating
          ? { position: "fixed", top: 18, right: 18, zIndex: 20 }
          : { position: "relative" }
      }
    >
      <button
        className="uv-btn-ghost"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "9px 13px",
          borderRadius: 11,
          border: "1px solid rgba(255,255,255,0.5)",
          background: "rgba(255,255,255,0.9)",
          color: C.ink,
          fontSize: 13.5,
          fontWeight: 700,
          cursor: "pointer",
          backdropFilter: "blur(8px)",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <Globe size={16} /> {LANGS.find((o) => o.id === lang)?.label}
      </button>
      {open && (
        <div
          className="uv-menu"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: 100,
            background: "#fff",
            borderRadius: 13,
            padding: 6,
            boxShadow: "0 16px 40px rgba(23,20,60,0.28)",
            border: `1px solid ${C.line}`,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            zIndex: 30,
          }}
        >
          {LANGS.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setLang(o.id);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 12px",
                borderRadius: 9,
                border: "none",
                background: lang === o.id ? `${C.primary}12` : "transparent",
                color: lang === o.id ? C.primary : C.ink,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {o.label}
              {lang === o.id && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
