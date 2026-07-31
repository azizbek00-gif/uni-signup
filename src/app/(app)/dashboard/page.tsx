"use client";

import { Sparkles, Flame, Trophy, Target, Lock, Check, Play, Info } from "lucide-react";
import { styles } from "@/lib/styles";
import { C } from "@/lib/tokens";
import { T } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import AiAssistant from "@/components/AiAssistant";

const TOTAL_DAYS = 31;

export default function DashboardPage() {
  const { user, lang } = useSession();
  const t = T[lang];
  const name = user.firstName || "Talaba";
  const lastDay = user.lastDay || 1;
  const progressPct = Math.round((lastDay / TOTAL_DAYS) * 100);

  return (
    <div style={styles.homeInner}>
      <div className="uv-rise" style={styles.hero}>
        <div style={styles.heroGreet}>
          <Sparkles size={16} color={C.violet} /> {t.homeGreet}, {name}!
        </div>
        <h1 style={styles.heroTitle}>{t.homeHero}</h1>
        <p style={styles.heroSub}>{t.homeHeroSub}</p>
      </div>

      <div
        className="uv-rise"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: 12,
          marginTop: 8,
          animationDelay: "0.05s",
        }}
      >
        <StatCard icon={<Flame size={20} color="#fff" />} color={C.amber} label={t.streak} value={String(user.streak)} />
        <StatCard icon={<Trophy size={20} color="#fff" />} color={C.violet} label={t.points} value={String(user.points)} />
        <StatCard icon={<Target size={20} color="#fff" />} color={C.emerald} label={t.progress} value={`${progressPct}%`} />
      </div>

      <div
        className="uv-rise"
        style={{ ...styles.infoCard, marginTop: 20, animationDelay: "0.1s", textAlign: "center" }}
      >
        <div style={{ fontFamily: "var(--font-space)", fontSize: 19, fontWeight: 700, marginBottom: 8 }}>
          {t.dayLabel} {lastDay}
        </div>
        <p style={{ color: C.muted, fontSize: 14, margin: "0 0 18px" }}>
          {user.dir ?? t.roadmapSub}
        </p>
        <a
          href="#roadmap"
          className="uv-btn"
          style={{ ...styles.primaryBtn, justifyContent: "center", display: "inline-flex", textDecoration: "none" }}
        >
          <Play size={18} /> {t.startLesson}
        </a>
      </div>

      <div id="roadmap" className="uv-rise" style={{ ...styles.infoCard, marginTop: 20, animationDelay: "0.15s" }}>
        <div style={styles.infoHead}>{t.roadmapTitle}</div>
        <p style={{ color: C.muted, fontSize: 13.5, margin: "-12px 0 18px" }}>{t.roadmapSub}</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(52px,1fr))",
            gap: 8,
          }}
        >
          {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => {
            const unlocked = day <= lastDay;
            const done = day < lastDay;
            return (
              <div
                key={day}
                title={unlocked ? `${t.dayLabel} ${day}` : t.locked}
                style={{
                  aspectRatio: "1",
                  borderRadius: 12,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  fontSize: 12.5,
                  fontWeight: 700,
                  background: done ? `${C.emerald}14` : unlocked ? `${C.primary}12` : "#F3F3F8",
                  border: `1.5px solid ${done ? C.emerald : unlocked ? C.primary : C.line}`,
                  color: done ? C.emeraldDark : unlocked ? C.primary : C.muted,
                }}
              >
                {done ? <Check size={14} /> : unlocked ? day : <Lock size={12} />}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="uv-rise"
        style={{
          marginTop: 16,
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          padding: "14px 16px",
          borderRadius: 15,
          background: "rgba(255,255,255,0.85)",
          border: `1px solid ${C.line}`,
          fontSize: 12.5,
          color: C.muted,
          animationDelay: "0.2s",
        }}
      >
        <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        {t.disclaimer}
      </div>

      <div style={{ marginTop: 20 }}>
        <AiAssistant topic={`DTM tayyorgarlik, foydalanuvchi yo'nalishi: ${user.dir ?? "umumiy"}, ${lastDay}-kun dasturi`} />
      </div>
    </div>
  );
}

function StatCard({ icon, color, label, value }: { icon: React.ReactNode; color: string; label: string; value: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: 18,
        padding: "16px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 16px 40px rgba(23,20,60,0.25)",
        border: "1px solid rgba(255,255,255,0.6)",
      }}
    >
      <span
        style={{
          width: 42,
          height: 42,
          borderRadius: 13,
          display: "grid",
          placeItems: "center",
          background: color,
          flexShrink: 0,
          boxShadow: `0 8px 18px ${color}55`,
        }}
      >
        {icon}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{label}</div>
        <div style={{ fontFamily: "var(--font-space)", fontSize: 19, fontWeight: 700, color: C.ink }}>{value}</div>
      </div>
    </div>
  );
}
