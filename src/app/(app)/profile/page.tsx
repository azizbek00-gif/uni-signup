"use client";

import { useState } from "react";
import {
  Flame, Trophy, MapPin, Building2, BookOpen, CalendarDays,
  Award, Medal, Star, Zap, Crown,
} from "lucide-react";
import { styles } from "@/lib/styles";
import { C } from "@/lib/tokens";
import { T } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import { REGION_BY_ID, type RegionId } from "@/lib/data";

const LEVELS = [
  { name: "Boshlovchi", min: 0 },
  { name: "Intiluvchi", min: 150 },
  { name: "Faol", min: 400 },
  { name: "Ustoz", min: 800 },
  { name: "Chempion", min: 1500 },
];

function levelFor(points: number) {
  let current = LEVELS[0];
  for (const l of LEVELS) if (points >= l.min) current = l;
  return current;
}

const BADGES = [
  { id: "streak3", icon: Flame, label: "3 kunlik streak", color: C.amber },
  { id: "first", icon: Star, label: "Birinchi dars", color: C.violet },
  { id: "quiz", icon: Zap, label: "5 ta test topshirdi", color: C.primary },
  { id: "goal", icon: Medal, label: "Maqsad qo'ydi", color: C.emerald },
  { id: "champion", icon: Crown, label: "Reyting TOP-10", color: "#EC4899" },
  { id: "perfect", icon: Award, label: "100% to'g'ri javob", color: "#0EA5E9" },
];

export default function ProfilePage() {
  const { user, lang } = useSession();
  const t = T[lang];
  const [goal, setGoal] = useState("");

  const fullName = `${user.firstName} ${user.lastName}`.trim() || "Talaba";
  const level = levelFor(user.points);
  const earnedBadges = BADGES.slice(0, 2 + (user.streak >= 3 ? 1 : 0) + (user.points >= 200 ? 1 : 0));
  const region = user.regionId ? REGION_BY_ID[user.regionId as RegionId] : null;

  return (
    <div style={styles.homeInner}>
      <div className="uv-rise" style={{ ...styles.infoCard, textAlign: "center" }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            margin: "0 auto 14px",
            display: "grid",
            placeItems: "center",
            background: `linear-gradient(135deg,${C.primary},${C.violet})`,
            color: "#fff",
            fontFamily: "var(--font-space)",
            fontWeight: 700,
            fontSize: 30,
            boxShadow: "0 14px 34px rgba(79,70,229,0.4)",
          }}
        >
          {fullName.slice(0, 1).toUpperCase()}
        </div>
        <div style={{ fontFamily: "var(--font-space)", fontSize: 21, fontWeight: 700 }}>{fullName}</div>
        <div style={{ color: C.muted, fontSize: 13.5, marginTop: 2 }}>{user.email}</div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 14,
            padding: "7px 15px",
            borderRadius: 30,
            background: `${C.primary}12`,
            color: C.primary,
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          <Trophy size={14} /> {t.level}: {level.name}
        </div>

        <div style={{ marginTop: 20 }}>
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder={t.editGoal}
            style={{
              width: "100%",
              border: `1.5px solid ${C.line}`,
              borderRadius: 13,
              padding: "12px 14px",
              fontSize: 14,
              outline: "none",
              background: "#F9FAFB",
              color: C.ink,
              textAlign: "center",
            }}
          />
        </div>
      </div>

      <div
        className="uv-rise"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginTop: 16, animationDelay: "0.05s" }}
      >
        <MiniStat icon={<Flame size={18} color="#fff" />} color={C.amber} label={t.streak} value={String(user.streak)} />
        <MiniStat icon={<Trophy size={18} color="#fff" />} color={C.violet} label={t.points} value={String(user.points)} />
      </div>

      <div className="uv-rise" style={{ ...styles.infoCard, marginTop: 16, animationDelay: "0.1s" }}>
        <div style={styles.infoHead}>{t.yourInfo}</div>
        <div style={styles.infoGrid}>
          <InfoItem icon={<CalendarDays size={18} />} label={t.lAge} value={user.age ? `${user.age} ${t.years}` : "—"} />
          <InfoItem icon={<MapPin size={18} />} label={t.lRegion} value={region ? region[lang] : "—"} />
          <InfoItem icon={<Building2 size={18} />} label={t.lUni} value={user.uniName ?? "—"} wide />
          <InfoItem icon={<BookOpen size={18} />} label={t.lDir} value={user.dir ?? "—"} wide />
        </div>
      </div>

      <div className="uv-rise" style={{ ...styles.infoCard, marginTop: 16, animationDelay: "0.15s" }}>
        <div style={styles.infoHead}>
          <Medal size={18} color={C.primary} /> {t.badges}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))", gap: 12 }}>
          {BADGES.map((b) => {
            const earned = earnedBadges.some((e) => e.id === b.id);
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 6px",
                  borderRadius: 14,
                  border: `1px solid ${C.line}`,
                  background: earned ? "#fff" : "#F7F7FD",
                  opacity: earned ? 1 : 0.4,
                }}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    background: earned ? b.color : C.muted,
                  }}
                >
                  <Icon size={19} color="#fff" />
                </span>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: C.ink, textAlign: "center", lineHeight: 1.25 }}>
                  {b.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon, color, label, value }: { icon: React.ReactNode; color: string; label: string; value: string }) {
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
      <span style={{ width: 42, height: 42, borderRadius: 13, display: "grid", placeItems: "center", background: color, flexShrink: 0 }}>
        {icon}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{label}</div>
        <div style={{ fontFamily: "var(--font-space)", fontSize: 19, fontWeight: 700, color: C.ink }}>{value}</div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, wide }: { icon: React.ReactNode; label: string; value: string; wide?: boolean }) {
  return (
    <div style={{ ...styles.infoItem, gridColumn: wide ? "1 / -1" : "auto" }}>
      <span style={styles.infoIcon}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={styles.infoLabel}>{label}</div>
        <div style={styles.infoValue}>{value}</div>
      </div>
    </div>
  );
}
