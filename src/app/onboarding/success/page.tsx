"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession as useNextAuthSession } from "next-auth/react";
import { Check, CheckCircle2, Fingerprint, Sparkles } from "lucide-react";
import { styles } from "@/lib/styles";
import { C } from "@/lib/tokens";
import { T } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import LangSwitch from "@/components/LangSwitch";

const CONFETTI = Array.from({ length: 46 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 0.6,
  dur: 2.2 + Math.random() * 1.8,
  size: 7 + Math.random() * 8,
  rot: Math.random() * 360,
  color: [C.primary, C.violet, C.emerald, "#F59E0B", "#EC4899"][i % 5],
  round: Math.random() > 0.5,
}));

export default function SuccessPage() {
  const router = useRouter();
  const { update } = useNextAuthSession();
  const { user, lang, setLang, ready } = useSession();
  const t = T[lang];

  useEffect(() => {
    if (!ready) return;
    if (!user.uniName || !user.dir) router.replace("/onboarding");
  }, [ready, user.uniName, user.dir, router]);

  const [hold, setHold] = useState(0);
  const [holding, setHolding] = useState(false);
  const raf = useRef<number | null>(null);
  const start = useRef(0);

  const onDone = async () => {
    try {
      await fetch("/api/user/complete", { method: "POST" });
      await update();
    } finally {
      router.push("/dashboard");
    }
  };

  const tick = () => {
    // eslint-disable-next-line react-hooks/purity -- imperative rAF timer loop, not a render-time call
    const p = Math.min(100, ((Date.now() - start.current) / 2000) * 100);
    setHold(p);
    if (p >= 100) {
      if (raf.current) cancelAnimationFrame(raf.current);
      setTimeout(onDone, 260);
    } else {
      raf.current = requestAnimationFrame(tick);
    }
  };
  const begin = () => {
    if (hold >= 100) return;
    setHolding(true);
    start.current = Date.now();
    raf.current = requestAnimationFrame(tick);
  };
  const end = () => {
    setHolding(false);
    if (raf.current) cancelAnimationFrame(raf.current);
    setHold((p) => (p >= 100 ? p : 0));
  };
  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  const complete = hold >= 100;
  const displayName = useMemo(() => user.firstName || "Talaba", [user.firstName]);

  return (
    <div style={styles.stage}>
      <LangSwitch lang={lang} setLang={setLang} floating />
      <div style={styles.confettiLayer}>
        {CONFETTI.map((c) => (
          <span
            key={c.id}
            style={{
              position: "absolute",
              top: "-10%",
              left: `${c.left}%`,
              width: c.size,
              height: c.size,
              background: c.color,
              borderRadius: c.round ? "50%" : 2,
              transform: `rotate(${c.rot}deg)`,
              animation: `uv-confetti ${c.dur}s linear ${c.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div style={{ ...styles.card, maxWidth: 460, textAlign: "center" }} className="uv-card">
        <div className="uv-pop" style={styles.successBadge}>
          <CheckCircle2 size={44} color="#fff" strokeWidth={2.4} />
        </div>
        <h1 style={styles.successTitle}>
          <Sparkles size={20} color={C.violet} /> {t.successTitle}
        </h1>
        <p style={styles.successSub}>
          {displayName}, {t.successSub}
        </p>

        <p style={styles.holdHint}>{t.holdHint}</p>

        <div style={styles.holdCenter}>
          <button
            className="uv-hold"
            style={{
              ...styles.holdBtn,
              background: complete
                ? C.emerald
                : `conic-gradient(${C.emerald} ${hold * 3.6}deg, rgba(255,255,255,0.14) 0deg)`,
              boxShadow: holding
                ? `0 0 0 8px rgba(16,185,129,0.18), 0 18px 40px rgba(16,185,129,0.35)`
                : `0 12px 30px rgba(79,70,229,0.28)`,
            }}
            onPointerDown={begin}
            onPointerUp={end}
            onPointerLeave={end}
            onContextMenu={(e) => e.preventDefault()}
          >
            <span style={styles.holdInner}>
              {complete ? (
                <Check size={40} color="#fff" strokeWidth={3} />
              ) : (
                <>
                  <Fingerprint size={30} color="#fff" />
                  <span style={styles.holdPct}>{Math.round(hold)}%</span>
                </>
              )}
            </span>
          </button>
        </div>
        <p style={{ ...styles.holdState, color: complete ? C.emerald : C.muted }}>
          {complete ? t.done : holding ? t.holding : ""}
        </p>
      </div>
    </div>
  );
}
