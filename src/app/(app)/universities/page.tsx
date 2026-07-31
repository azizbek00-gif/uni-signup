"use client";

import { GraduationCap, CalendarDays, Award, FileText, Building2, MapPin, Info } from "lucide-react";
import { styles } from "@/lib/styles";
import { C } from "@/lib/tokens";
import { T } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import { ALL_UNIS, REGION_BY_ID, tierOf, type UniTier } from "@/lib/data";
import AiAssistant from "@/components/AiAssistant";

// 2024/2025 o'quv yili uchun DTM milliy minimal ko'rsatkichlari (tasdiqlangan):
// grant — 68.0 ball (189 balldan 36%), kontrakt — 56.7 ball (30%). Manba: regimtihon.uz, ustabor.uz.
// Har bir OTM/yo'nalish uchun ANIQ ball rasmiy DTM/UZBMB va tegishli OTM sayti orqali e'lon qilinadi —
// quyidagi qiymatlar shu milliy minimumdan boshlab, OTMning umumiy tanilganlik darajasiga (toifasiga)
// ko'ra hisoblangan TAXMIN, rasmiy natija emas.
const GRANT_FLOOR = 68.0;
const CONTRACT_FLOOR = 56.7;

const TIER_RANGE: Record<UniTier, [number, number]> = {
  elite: [150, 186],
  high: [110, 155],
  mid: [80, 118],
  regional: [68, 92],
};

function mockStats(name: string) {
  const tier = tierOf(name);
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 100000;
  const [min, max] = TIER_RANGE[tier];
  const grant = Math.max(GRANT_FLOOR, min + (h % (max - min)));
  const contract = Math.max(CONTRACT_FLOOR, grant - 15 - (h % 15));
  const students = 800 + (h % 6200);
  return { grant: Math.round(grant), contract: Math.round(contract), students, tier };
}

export default function UniversitiesPage() {
  const { user, lang } = useSession();
  const t = T[lang];

  const selectedUni = user.uniName ? ALL_UNIS.find((u) => u.name === user.uniName) : null;
  const selectedStats = selectedUni ? mockStats(selectedUni.name) : null;

  const ranked = [...ALL_UNIS]
    .map((u) => ({ u, stats: mockStats(u.name) }))
    .sort((a, b) => b.stats.grant - a.stats.grant);

  return (
    <div style={styles.homeInner}>
      {selectedUni && selectedStats && (
        <div className="uv-rise" style={{ ...styles.infoCard, marginBottom: 20 }}>
          <div style={styles.infoHead}>
            <GraduationCap size={18} color={C.primary} /> {t.uniInfoTitle}
          </div>
          <div style={{ fontFamily: "var(--font-space)", fontSize: 18, fontWeight: 700, marginBottom: 4, color: "var(--text-strong)" }}>
            {selectedUni.name}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 18, display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin size={13} /> {REGION_BY_ID[selectedUni.regionId][lang]} · {user.dir}
          </div>
          <div style={styles.infoGrid}>
            <InfoBlock icon={<CalendarDays size={18} />} label={t.examDate} value={t.examDateValue} wide />
            <InfoBlock icon={<Award size={18} />} label={t.grantScore} value={`${selectedStats.grant} ball`} />
            <InfoBlock icon={<Award size={18} />} label={t.contractScore} value={`${selectedStats.contract} ball`} />
            <InfoBlock icon={<FileText size={18} />} label={t.howToApply} value={t.howToApplyValue} wide />
          </div>
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            {t.scoreDisclaimer}
          </div>
        </div>
      )}

      <div className="uv-rise" style={{ ...styles.infoCard, animationDelay: "0.1s" }}>
        <div style={styles.infoHead}>
          <Building2 size={18} color={C.primary} /> {t.rankingTitle}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ranked.map(({ u, stats }, idx) => (
            <div
              key={u.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "13px 14px",
                borderRadius: 13,
                border: `1.5px solid var(--surface-border)`,
                background: "var(--surface)",
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  fontWeight: 700,
                  fontSize: 13,
                  background: idx < 3 ? `${C.amber}22` : `${C.primary}12`,
                  color: idx < 3 ? "#B45309" : C.primary,
                }}
              >
                {idx + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)" }}>{u.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {REGION_BY_ID[u.regionId][lang]} · {stats.students.toLocaleString()} {t.students}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.emerald }}>{stats.grant}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.grantScore}</div>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          {t.scoreDisclaimer}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <AiAssistant topic={`Universitetlar va qabul jarayoni, foydalanuvchi tanlagan: ${user.uniName ?? "hali tanlanmagan"}`} />
      </div>
    </div>
  );
}

function InfoBlock({ icon, label, value, wide }: { icon: React.ReactNode; label: string; value: string; wide?: boolean }) {
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
