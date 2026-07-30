"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Lang } from "./i18n";

export type UserData = {
  email: string;
  firstName: string;
  lastName: string;
  age: string;
  regionId: string | null;
  uniName: string | null;
  dir: string | null;
  onboarded: boolean;
  streak: number;
  points: number;
  lastDay: number;
};

const EMPTY: UserData = {
  email: "",
  firstName: "",
  lastName: "",
  age: "",
  regionId: null,
  uniName: null,
  dir: null,
  onboarded: false,
  streak: 3,
  points: 240,
  lastDay: 1,
};

const STORAGE_KEY = "unistep.session";
const LANG_KEY = "unistep.lang";

type Ctx = {
  user: UserData;
  setUser: (u: Partial<UserData>) => void;
  resetUser: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  ready: boolean;
};

const SessionContext = createContext<Ctx | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData>(EMPTY);
  const [lang, setLangState] = useState<Lang>("uz");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUserState({ ...EMPTY, ...JSON.parse(raw) });
      const savedLang = localStorage.getItem(LANG_KEY) as Lang | null;
      if (savedLang) setLangState(savedLang);
    } catch {
      // ignore corrupt storage
    }
    setReady(true);
  }, []);

  const setUser = (patch: Partial<UserData>) => {
    setUserState((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const resetUser = () => {
    setUserState(EMPTY);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      // ignore
    }
  };

  const value = useMemo(
    () => ({ user, setUser, resetUser, lang, setLang, ready }),
    [user, lang, ready]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
