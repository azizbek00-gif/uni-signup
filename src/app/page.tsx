"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { GraduationCap } from "lucide-react";
import { styles } from "@/lib/styles";
import { C } from "@/lib/tokens";
import { T } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import GIcon from "@/components/GIcon";
import LangSwitch from "@/components/LangSwitch";

export default function AuthPage() {
  const router = useRouter();
  const { user, lang, setLang, ready } = useSession();
  const t = T[lang];

  useEffect(() => {
    if (!ready) return;
    if (user.onboarded) router.replace("/dashboard");
    else if (user.email) router.replace("/onboarding");
  }, [ready, user.onboarded, user.email, router]);

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

          <button
            className="uv-google"
            style={styles.googleBtn}
            onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
          >
            <GIcon />
            <span>{t.google}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
