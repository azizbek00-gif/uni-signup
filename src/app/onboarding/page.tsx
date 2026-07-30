"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  MapPin,
  CalendarDays,
  Check,
  CheckCircle2,
  Building2,
  BookOpen,
  UserRound,
} from "lucide-react";
import { styles, rowIcon } from "@/lib/styles";
import { C } from "@/lib/tokens";
import { T } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import { REGIONS, REGION_BY_ID, ALL_UNIS, type Region, type University } from "@/lib/data";
import { StepShell, SearchBox, Empty, Dots } from "@/components/onboarding/Primitives";
import LangSwitch from "@/components/LangSwitch";

const STEPS = ["name", "age", "region", "university", "direction"] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser, lang, setLang, ready } = useSession();
  const t = T[lang];

  const [stepIdx, setStepIdx] = useState(0);
  const [anim, setAnim] = useState("in");
  const [query, setQuery] = useState("");

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age);
  const [region, setRegion] = useState<Region | null>(
    user.regionId ? REGION_BY_ID[user.regionId as keyof typeof REGION_BY_ID] : null
  );
  const [uni, setUni] = useState<University | null>(
    user.uniName ? ALL_UNIS.find((u) => u.name === user.uniName) ?? null : null
  );
  const [dir, setDir] = useState<string | null>(user.dir);

  useEffect(() => {
    if (!ready) return;
    if (!user.email) router.replace("/");
  }, [ready, user.email, router]);

  const step: Step = STEPS[stepIdx];
  const filteredUnis = ALL_UNIS.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()));
  const dirList = uni ? uni.dirs : [];
  const filteredDirs = dirList.filter((d) => d.toLowerCase().includes(query.toLowerCase()));

  const rlabel = (r: Region | null) => (r ? r[lang] : "");

  const canNext = useMemo(() => {
    if (step === "name") return firstName.trim().length > 0 && lastName.trim().length > 0;
    if (step === "age") return Number(age) >= 10 && Number(age) <= 99;
    if (step === "region") return !!region;
    if (step === "university") return !!uni;
    if (step === "direction") return !!dir;
    return false;
  }, [step, firstName, lastName, age, region, uni, dir]);

  const go = (direction: "next" | "prev") => {
    setAnim(direction === "next" ? "out-left" : "out-right");
    setTimeout(() => {
      setStepIdx((i) => Math.max(0, Math.min(STEPS.length - 1, i + (direction === "next" ? 1 : -1))));
      setQuery("");
      setAnim(direction === "next" ? "in-right" : "in-left");
    }, 220);
  };

  const finish = () => {
    setUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age,
      regionId: region?.id ?? null,
      uniName: uni?.name ?? null,
      dir,
    });
    router.push("/onboarding/success");
  };

  const onNext = () => {
    if (!canNext) return;
    if (step === "direction") finish();
    else go("next");
  };

  const onBack = () => {
    if (stepIdx === 0) router.push("/");
    else go("prev");
  };

  return (
    <div style={styles.stage}>
      <LangSwitch lang={lang} setLang={setLang} floating />
      <div style={styles.card} className="uv-card">
        <div style={styles.progressWrap}>
          <div style={styles.progressHead}>
            <span style={styles.progressLabel}>
              {t.step} {stepIdx + 1} / {STEPS.length}
            </span>
            <Dots idx={stepIdx} total={STEPS.length} />
          </div>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${((stepIdx + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        <div key={step + anim} className={`uv-step uv-${anim}`}>
          {step === "name" && (
            <StepShell icon={<UserRound size={22} />} title={t.nameTitle} sub={t.nameSub}>
              <div style={styles.nameGrid}>
                <input
                  autoFocus
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t.firstNamePh}
                  style={styles.nameInput}
                />
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t.lastNamePh}
                  style={styles.nameInput}
                  onKeyDown={(e) => e.key === "Enter" && onNext()}
                />
              </div>
            </StepShell>
          )}

          {step === "age" && (
            <StepShell icon={<CalendarDays size={22} />} title={t.ageTitle} sub={t.ageSub}>
              <input
                autoFocus
                type="number"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value.slice(0, 2))}
                placeholder={t.agePh}
                style={styles.ageInput}
                onKeyDown={(e) => e.key === "Enter" && onNext()}
              />
            </StepShell>
          )}

          {step === "region" && (
            <StepShell icon={<MapPin size={22} />} title={t.regionTitle} sub={t.regionSub}>
              <div style={styles.regionGrid}>
                {REGIONS.map((r) => {
                  const active = region?.id === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setRegion(r);
                        setUni(null);
                        setDir(null);
                      }}
                      className="uv-chip"
                      style={{ ...styles.regionChip, ...(active ? styles.regionChipActive : {}) }}
                    >
                      <span>{rlabel(r)}</span>
                      {active && <Check size={16} style={{ flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </StepShell>
          )}

          {step === "university" && (
            <StepShell icon={<Building2 size={22} />} title={t.uniTitle} sub={t.uniSub}>
              <SearchBox value={query} onChange={setQuery} placeholder={t.searchPh} />
              <div style={styles.list}>
                {filteredUnis.length === 0 && <Empty text={t.noRes} />}
                {filteredUnis.map((u) => {
                  const active = uni?.name === u.name;
                  return (
                    <button
                      key={u.name}
                      onClick={() => {
                        setUni(u);
                        setDir(null);
                      }}
                      className="uv-row"
                      style={{ ...styles.row, ...(active ? styles.rowActive : {}) }}
                    >
                      <span style={rowIcon(active)}>
                        <Building2 size={18} />
                      </span>
                      <span style={styles.rowText}>
                        {u.name}
                        <span style={styles.rowSub}>
                          <MapPin size={11} /> {REGION_BY_ID[u.regionId][lang]}
                        </span>
                      </span>
                      {active ? (
                        <CheckCircle2 size={20} color={C.emerald} style={{ flexShrink: 0 }} />
                      ) : (
                        <ChevronRight size={18} color={C.muted} style={{ flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </StepShell>
          )}

          {step === "direction" && (
            <StepShell icon={<BookOpen size={22} />} title={t.dirTitle} sub={`${uni?.name ?? ""} ${t.dirSub}`}>
              <SearchBox value={query} onChange={setQuery} placeholder={t.searchPh} />
              <div style={styles.list}>
                {filteredDirs.length === 0 && <Empty text={t.noRes} />}
                {filteredDirs.map((d) => {
                  const active = dir === d;
                  return (
                    <button
                      key={d}
                      onClick={() => setDir(d)}
                      className="uv-row"
                      style={{ ...styles.row, ...(active ? styles.rowActive : {}) }}
                    >
                      <span style={rowIcon(active)}>
                        <BookOpen size={16} />
                      </span>
                      <span style={styles.rowText}>{d}</span>
                      {active ? (
                        <CheckCircle2 size={20} color={C.emerald} style={{ flexShrink: 0 }} />
                      ) : (
                        <span style={{ width: 18 }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </StepShell>
          )}
        </div>

        <div style={styles.navRow}>
          <button onClick={onBack} className="uv-btn-ghost" style={styles.ghostBtn}>
            <ChevronLeft size={18} /> {t.back}
          </button>
          <button
            onClick={onNext}
            disabled={!canNext}
            className="uv-btn"
            style={{ ...styles.primaryBtn, ...(!canNext ? styles.btnDisabled : {}) }}
          >
            {step === "direction" ? t.finish : t.next}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
