"use client";

import { GraduationCap, CalendarDays, Award, FileText, Building2, MapPin } from "lucide-react";
import { styles } from "@/lib/styles";
import { C } from "@/lib/tokens";
import { T } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import { ALL_UNIS, REGION_BY_ID } from "@/lib/data";

// Deterministic mock scores until real DTM admission data is wired in (see task: universities research).
function mockStats(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 100000;
  const grant = 165 + (h % 45);
  const contract = grant - 20 - (h % 15);
  const students = 800 + (h % 6200);
  return { grant, contract, students };
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
          <div style={{ fontFamily: "var(--font-space)", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            {selectedUni.name}
          </div>
          <div style={{ color: C.muted, fontSize: 14, marginBottom: 18, display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin size={13} /> {REGION_BY_ID[selectedUni.regionId][lang]} · {user.dir}
          </div>
          <div style={styles.infoGrid}>
            <InfoBlock icon={<CalendarDays size={18} />} label={t.examDate} value="2027-yil iyun-avgust" />
            <InfoBlock icon={<Award size={18} />} label={t.grantScore} value={`${selectedStats.grant} ball`} />
            <InfoBlock icon={<Award size={18} />} label={t.contractScore} value={`${selectedStats.contract} ball`} />
            <InfoBlock icon={<FileText size={18} />} label={t.howToApply} value="my.gov.uz orqali onlayn ariza" wide />
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
                border: `1.5px solid ${C.line}`,
                background: "#fff",
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
                <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{u.name}</div>
                <div style={{ fontSize: 12, color: C.muted }}>
                  {REGION_BY_ID[u.regionId][lang]} · {stats.students.toLocaleString()} {t.students}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.emerald }}>{stats.grant}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{t.grantScore}</div>
              </div>
            </div>
          ))}
        </div>
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
