"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useSession as useNextAuthSession } from "next-auth/react";
import type { Lang } from "./i18n";

export type UserData = {
  email: string;
  firstName: string;
  lastName: string;
  image: string | null;
  age: number | null;
  regionId: string | null;
  uniName: string | null;
  dir: string | null;
  onboarded: boolean;
  streak: number;
  points: number;
  lastDay: number;
  goal: string | null;
  lastActiveAt: string | null;
};

const EMPTY: UserData = {
  email: "",
  firstName: "",
  lastName: "",
  image: null,
  age: null,
  regionId: null,
  uniName: null,
  dir: null,
  onboarded: false,
  streak: 0,
  points: 0,
  lastDay: 1,
  goal: null,
  lastActiveAt: null,
};

const LANG_KEY = "unistep.lang";

type Ctx = {
  user: UserData;
  lang: Lang;
  setLang: (l: Lang) => void;
  ready: boolean;
  refresh: () => void;
};

const LangSessionContext = createContext<Ctx | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const { data: authSession, status } = useNextAuthSession();
  const [user, setUser] = useState<UserData>(EMPTY);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [lang, setLangState] = useState<Lang>("uz");
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANG_KEY) as Lang | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from browser-only storage
      if (savedLang) setLangState(savedLang);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      if (status === "unauthenticated") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reset derived from external auth status change
        setUser(EMPTY);
        setProfileLoaded(true);
      }
      return;
    }
    let cancelled = false;
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setUser({
          email: data.email ?? authSession?.user?.email ?? "",
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          image: data.image ?? authSession?.user?.image ?? null,
          age: data.age,
          regionId: data.regionId,
          uniName: data.uniName,
          dir: data.dir,
          onboarded: !!data.onboarded,
          streak: data.streak ?? 0,
          points: data.points ?? 0,
          lastDay: data.lastDay ?? 1,
          goal: data.goal ?? null,
          lastActiveAt: data.lastActiveAt ?? null,
        });
      })
      .finally(() => {
        if (!cancelled) setProfileLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [status, authSession?.user?.email, authSession?.user?.image, refreshTick]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      // ignore
    }
  };

  const ready = status !== "loading" && profileLoaded;

  const value = useMemo(
    () => ({ user, lang, setLang, ready, refresh: () => setRefreshTick((t) => t + 1) }),
    [user, lang, ready]
  );

  return <LangSessionContext.Provider value={value}>{children}</LangSessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(LangSessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
