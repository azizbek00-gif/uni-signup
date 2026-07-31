"use client";

import Link from "next/link";
import { Sparkles, Flame, Trophy, Target, Lock, Check, Play, Info, Bell } from "lucide-react";
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
  const activeToday = user.lastActiveAt
    ? new Date(user.lastActiveAt).toDateString() === new Date().toDateString()
    : false;

  return (
    <div style={styles.homeInner}>
      <div className="uv-rise" style={styles.hero}>
        <div style={styles.heroGreet}>
          <Sparkles size={16} color={C.violet} /> {t.homeGreet}, {name}!
        </div>
        <h1 style={styles.heroTitle}>{t.homeHero}</h1>
        <p style={styles.heroSub}>{t.homeHeroSub}</p>
      </div>

      {!activeToday && (
        <Link
          href={`/dashboard/day/${lastDay}`}
          className="uv-rise"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 18px",
            borderRadius: 16,
            marginBottom: 8,
            background: `linear-gradient(135deg,${C.amber}22,${C.amber}0d)`,
            border: `1.5px solid ${C.amber}55`,
            textDecoration: "none",
          }}
        >
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              display: "grid",
              placeItems: "center",
              background: C.amber,
              flexShrink: 0,
            }}
          >
            <Bell size={17} color="#fff" />
          </span>
          <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: "var(--text-strong)" }}>{t.reminderText}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#B45309", whiteSpace: "nowrap" }}>{t.reminderCta} →</span>
        </Link>
      )}

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
        <div style={{ fontFamily: "var(--font-space)", fontSize: 19, fontWeight: 700, marginBottom: 8, color: "var(--text-strong)" }}>
          {t.dayLabel} {lastDay}
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 18px" }}>
          {user.dir ?? t.roadmapSub}
        </p>
        <Link
          href={`/dashboard/day/${lastDay}`}
          className="uv-btn"
          style={{ ...styles.primaryBtn, justifyContent: "center", display: "inline-flex", textDecoration: "none" }}
        >
          <Play size={18} /> {t.startLesson}
        </Link>
      </div>

      <div id="roadmap" className="uv-rise" style={{ ...styles.infoCard, marginTop: 20, animationDelay: "0.15s" }}>
        <div style={styles.infoHead}>{t.roadmapTitle}</div>
        <p style={{ color: "var(--text-muted)", fontSize: 13.5, margin: "-12px 0 18px" }}>{t.roadmapSub}</p>
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
            const cellStyle = {
              aspectRatio: "1",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              fontSize: 12.5,
              fontWeight: 700,
              textDecoration: "none",
              background: done ? `${C.emerald}14` : unlocked ? `${C.primary}12` : "var(--surface-2)",
              border: `1.5px solid ${done ? C.emerald : unlocked ? C.primary : C.line}`,
              color: done ? C.emeraldDark : unlocked ? C.primary : "var(--text-muted)",
            };
            const content = done ? <Check size={14} /> : unlocked ? day : <Lock size={12} />;
            return unlocked ? (
              <Link key={day} href={`/dashboard/day/${day}`} title={`${t.dayLabel} ${day}`} style={cellStyle}>
                {content}
              </Link>
            ) : (
              <div key={day} title={t.locked} style={cellStyle}>
                {content}
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
          background: "var(--surface)",
          border: `1px solid var(--surface-border)`,
          fontSize: 12.5,
          color: "var(--text-muted)",
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
        background: "var(--surface)",
        borderRadius: 18,
        padding: "16px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 16px 40px rgba(23,20,60,0.25)",
        border: "1px solid var(--surface-border)",
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
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{label}</div>
        <div style={{ fontFamily: "var(--font-space)", fontSize: 19, fontWeight: 700, color: "var(--text-strong)" }}>{value}</div>
      </div>
    </div>
  );
}
