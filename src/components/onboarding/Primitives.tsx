"use client";

import { ReactNode } from "react";
import { Search } from "lucide-react";
import { styles } from "@/lib/styles";
import { C } from "@/lib/tokens";

export function StepShell({
  icon,
  title,
  sub,
  children,
}: {
  icon: ReactNode;
  title: string;
  sub: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div style={styles.stepHead}>
        <span style={styles.stepIcon}>{icon}</span>
        <div>
          <h2 style={styles.stepTitle}>{title}</h2>
          <p style={styles.stepSub}>{sub}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div style={styles.searchWrap}>
      <Search size={18} color={C.muted} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.searchInput}
      />
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  return <div style={styles.empty}>{text}</div>;
}

export function Dots({ idx, total }: { idx: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          style={{
            width: i === idx ? 22 : 8,
            height: 8,
            borderRadius: 8,
            background: i <= idx ? C.primary : C.line,
            transition: "all .3s ease",
          }}
        />
      ))}
    </div>
  );
}
