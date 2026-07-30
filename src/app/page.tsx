"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ChevronRight, GraduationCap } from "lucide-react";
import { styles } from "@/lib/styles";
import { C } from "@/lib/tokens";
import { T } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import GIcon from "@/components/GIcon";
import LangSwitch from "@/components/LangSwitch";

export default function AuthPage() {
  const router = useRouter();
  const { user, setUser, lang, setLang, ready } = useSession();
  const [email, setEmail] = useState("");
  const [showChooser, setShowChooser] = useState(false);
  const t = T[lang];

  useEffect(() => {
    if (!ready) return;
    if (user.onboarded) router.replace("/dashboard");
    else if (user.email) router.replace("/onboarding");
  }, [ready, user.onboarded, user.email, router]);

  const onContinue = () => {
    if (!email.trim()) return;
    setUser({ email: email.trim() });
    router.push("/onboarding");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans)",
        color: C.ink,
      }}
    >
      <LangSwitch lang={lang} setLang={setLang} floating />
      <div style={styles.stage}>
        <div style={{ ...styles.card, maxWidth: 440 }} className="uv-card">
          <div style={styles.brandRow}>
            <span style={styles.logoBadge}>
              <GraduationCap size={20} color="#fff" />
            </span>
            <div>
              <div style={styles.brandName}>{t.brand}</div>
              <div style={styles.brandTag}>{t.tagline}</div>
            </div>
          </div>

          <h1 style={styles.authTitle}>{t.authTitle}</h1>
          <p style={styles.authSub}>{t.authSub}</p>

          {!showChooser ? (
            <button
              className="uv-google"
              style={styles.googleBtn}
              onClick={() => setShowChooser(true)}
            >
              <GIcon />
              <span>{t.google}</span>
            </button>
          ) : (
            <div className="uv-chooser" style={styles.chooser}>
              <div style={styles.chooserHead}>
                <GIcon size={20} />
                <span style={styles.chooserTitle}>{t.chooser}</span>
              </div>
              <div style={styles.inputWrap}>
                <Mail size={18} color={C.muted} />
                <input
                  autoFocus
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPh}
                  style={styles.emailInput}
                  onKeyDown={(e) => e.key === "Enter" && onContinue()}
                />
              </div>
              <button
                className="uv-btn"
                style={{ ...styles.primaryBtn, width: "100%", justifyContent: "center" }}
                onClick={onContinue}
                disabled={!email.trim()}
              >
                {t.next} <ChevronRight size={18} />
              </button>
            </div>
          )}

          <div style={styles.demoNote}>
            <span style={styles.demoDot} /> {t.demoNote}
          </div>
        </div>
      </div>
    </div>
  );
}
