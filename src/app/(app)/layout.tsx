"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { GraduationCap, LogOut } from "lucide-react";
import { styles } from "@/lib/styles";
import { T } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import LangSwitch from "@/components/LangSwitch";

const TABS = [
  { key: "navHome", href: "/dashboard" },
  { key: "navUni", href: "/universities" },
  { key: "navGoals", href: "/goals" },
  { key: "navProfile", href: "/profile" },
] as const;

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, lang, setLang, ready } = useSession();
  const t = T[lang];

  useEffect(() => {
    if (!ready) return;
    if (!user.onboarded) router.replace("/");
  }, [ready, user.onboarded, router]);

  const onLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  if (!user.onboarded) return null;

  return (
    <div style={styles.homeStage} className="uv-fade">
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <span style={styles.logoBadge}>
            <GraduationCap size={18} color="#fff" />
          </span>
          <span style={styles.navBrandName}>{t.brand}</span>
        </div>
        <div style={styles.navLinks} className="uv-navlinks">
          {TABS.map((tab) => {
            const active = pathname === tab.href || pathname?.startsWith(tab.href + "/");
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className="uv-navlink"
                style={{ ...styles.navLink, ...(active ? styles.navLinkActive : {}), textDecoration: "none" }}
              >
                {t[tab.key]}
              </Link>
            );
          })}
        </div>
        <div style={styles.navRight}>
          <LangSwitch lang={lang} setLang={setLang} />
          <button className="uv-btn-ghost" style={styles.logoutBtn} onClick={onLogout}>
            <LogOut size={16} /> <span className="uv-hide-sm">{t.logout}</span>
          </button>
        </div>
      </nav>
      {children}
    </div>
  );
}
