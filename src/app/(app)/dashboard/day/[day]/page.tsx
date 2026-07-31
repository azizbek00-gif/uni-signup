"use client";

import { useEffect, useRef, useState, use as usePromise } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Volume2, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { styles } from "@/lib/styles";
import { C } from "@/lib/tokens";
import { T } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import AiAssistant from "@/components/AiAssistant";

type Quiz = { question: string; options: string[] };
type DayData = {
  day: number;
  subject: string;
  topic: string;
  lessonText: string;
  quiz: Quiz[];
  score: number | null;
  completed: boolean;
};

type CompleteResult = {
  correct: number;
  total: number;
  scorePct: number;
  earnedPoints: number;
  unlockedNextDay: boolean;
};

export default function DayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day: dayStr } = usePromise(params);
  const day = Number(dayStr);
  const router = useRouter();
  const { user, lang, ready, refresh } = useSession();
  const t = T[lang];

  const [data, setData] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<CompleteResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!user.onboarded) {
      router.replace("/dashboard");
      return;
    }
    if (day > user.lastDay) {
      router.replace("/dashboard");
      return;
    }
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicks off async fetch driven by route params
    setLoading(true);
    fetch(`/api/day/${day}?lang=${lang}`)
      .then((r) => {
        if (!r.ok) throw new Error("failed");
        return r.json();
      })
      .then((json) => {
        if (cancelled) return;
        setData(json);
        if (json.completed) setResult({ correct: 0, total: json.quiz.length, scorePct: json.score, earnedPoints: 0, unlockedNextDay: false });
      })
      .catch(() => !cancelled && setError("failed"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [ready, user.onboarded, user.lastDay, day, lang, router]);

  const playAudio = async () => {
    if (!data) return;
    setAudioLoading(true);
    try {
      const res = await fetch("/api/ai/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.lessonText }),
      });
      if (!res.ok) throw new Error("failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch {
      // ignore playback errors
    } finally {
      setAudioLoading(false);
    }
  };

  const submitQuiz = async () => {
    if (!data || submitting) return;
    setSubmitting(true);
    try {
      const ordered = data.quiz.map((_, i) => answers[i] ?? -1);
      const res = await fetch(`/api/day/${day}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: ordered }),
      });
      const json = await res.json();
      setResult(json);
      refresh();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.homeInner}>
        <div style={{ ...styles.infoCard, textAlign: "center", color: "var(--text-muted)" }}>
          <Loader2 className="uv-pop" size={22} /> {t.loadingLesson}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={styles.homeInner}>
        <div style={{ ...styles.infoCard, textAlign: "center", color: "var(--text-muted)" }}>{t.dayLocked}</div>
      </div>
    );
  }

  const allAnswered = data.quiz.every((_, i) => answers[i] !== undefined);

  return (
    <div style={styles.homeInner}>
      <button
        onClick={() => router.push("/dashboard")}
        className="uv-btn-ghost"
        style={{ ...styles.ghostBtn, marginBottom: 16 }}
      >
        <ArrowLeft size={16} /> {t.backToDashboard}
      </button>

      <div className="uv-rise" style={styles.infoCard}>
        <div
          style={{
            display: "inline-flex",
            padding: "5px 13px",
            borderRadius: 30,
            background: `${C.primary}12`,
            color: C.primary,
            fontWeight: 700,
            fontSize: 12.5,
            marginBottom: 12,
          }}
        >
          {t.dayLabel} {data.day} · {data.subject}
        </div>
        <div style={{ fontFamily: "var(--font-space)", fontSize: 22, fontWeight: 700, marginBottom: 14, color: "var(--text-strong)" }}>
          {data.topic}
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-strong)", whiteSpace: "pre-wrap" }}>{data.lessonText}</p>

        <button
          onClick={playAudio}
          disabled={audioLoading}
          className="uv-btn"
          style={{ ...styles.primaryBtn, marginTop: 18, ...(audioLoading ? styles.btnDisabled : {}) }}
        >
          <Volume2 size={18} /> {audioLoading ? t.generatingAudio : t.listenAudio}
        </button>
        <audio ref={audioRef} style={{ display: "none" }} />
      </div>

      <div className="uv-rise" style={{ ...styles.infoCard, marginTop: 16 }}>
        <div style={styles.infoHead}>{t.quizTitle}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {data.quiz.map((q, qi) => (
            <div key={qi}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text-strong)", marginBottom: 10 }}>
                {qi + 1}. {q.question}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {q.options.map((opt, oi) => {
                  const selected = answers[qi] === oi;
                  return (
                    <button
                      key={oi}
                      onClick={() => !result && setAnswers((a) => ({ ...a, [qi]: oi }))}
                      className="uv-row"
                      style={{
                        ...styles.row,
                        ...(selected ? styles.rowActive : {}),
                        cursor: result ? "default" : "pointer",
                      }}
                    >
                      <span style={styles.rowText}>{opt}</span>
                      {selected && <CheckCircle2 size={18} color={C.emerald} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!result && (
          <button
            onClick={submitQuiz}
            disabled={!allAnswered || submitting}
            className="uv-btn"
            style={{ ...styles.primaryBtn, marginTop: 18, justifyContent: "center", width: "100%", ...(!allAnswered || submitting ? styles.btnDisabled : {}) }}
          >
            {t.submitQuiz}
          </button>
        )}

        {result && (
          <div
            className="uv-pop"
            style={{
              marginTop: 18,
              padding: "16px 18px",
              borderRadius: 15,
              background: result.scorePct >= 60 ? `${C.emerald}12` : `${C.amber}12`,
              border: `1.5px solid ${result.scorePct >= 60 ? C.emerald : C.amber}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {result.scorePct >= 60 ? (
              <CheckCircle2 size={24} color={C.emerald} />
            ) : (
              <XCircle size={24} color={C.amber} />
            )}
            <div>
              <div style={{ fontWeight: 700, color: "var(--text-strong)" }}>
                {t.quizResult}: {result.scorePct}% ({result.correct}/{result.total} {t.correctOf})
              </div>
              {result.earnedPoints > 0 && (
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  +{result.earnedPoints} {t.pointsEarned}
                  {result.unlockedNextDay ? ` · ${t.nextDayUnlocked}` : ""}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <AiAssistant topic={`${data.subject}: ${data.topic}`} />
      </div>
    </div>
  );
}
