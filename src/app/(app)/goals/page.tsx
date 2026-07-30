"use client";

import { useEffect, useState } from "react";
import { Heart, MessageCircle, Send, Target } from "lucide-react";
import { styles } from "@/lib/styles";
import { C } from "@/lib/tokens";
import { T } from "@/lib/i18n";
import { useSession } from "@/lib/session";

type Comment = { id: string; author: string; text: string };
type Post = { id: string; author: string; text: string; likes: number; liked: boolean; comments: Comment[] };

const SEED: Post[] = [
  {
    id: "seed-1",
    author: "Madina",
    text: "DTMdan 189+ ball olib, TATUga grantga o'taman!",
    likes: 12,
    liked: false,
    comments: [{ id: "c1", author: "Sardor", text: "Omad! Sen uddalaysan 💪" }],
  },
  {
    id: "seed-2",
    author: "Jasur",
    text: "Har kuni 2 soat matematika, 1 soat ingliz tili — 31 kunlik rejamni tugataman.",
    likes: 8,
    liked: false,
    comments: [],
  },
];

const STORAGE_KEY = "unistep.posts";

export default function GoalsPage() {
  const { user, lang } = useSession();
  const t = T[lang];
  const [posts, setPosts] = useState<Post[]>(SEED);
  const [draft, setDraft] = useState("");
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPosts(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const persist = (next: Post[]) => {
    setPosts(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const addPost = () => {
    if (!draft.trim()) return;
    const post: Post = {
      id: `p-${Date.now()}`,
      author: user.firstName || "Siz",
      text: draft.trim(),
      likes: 0,
      liked: false,
      comments: [],
    };
    persist([post, ...posts]);
    setDraft("");
  };

  const toggleLike = (id: string) => {
    persist(
      posts.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p))
    );
  };

  const addComment = (id: string) => {
    const text = (commentDraft[id] || "").trim();
    if (!text) return;
    persist(
      posts.map((p) =>
        p.id === id
          ? { ...p, comments: [...p.comments, { id: `c-${Date.now()}`, author: user.firstName || "Siz", text }] }
          : p
      )
    );
    setCommentDraft((d) => ({ ...d, [id]: "" }));
  };

  return (
    <div style={styles.homeInner}>
      <div className="uv-rise" style={{ textAlign: "center", padding: "18px 10px 22px", color: "#fff" }}>
        <h1 style={{ ...styles.heroTitle, fontSize: 30 }}>{t.goalsTitle}</h1>
        <p style={styles.heroSub}>{t.goalsSub}</p>
      </div>

      <div className="uv-rise" style={{ ...styles.infoCard, marginBottom: 16 }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t.postPh}
          rows={3}
          style={{
            width: "100%",
            border: `1.5px solid ${C.line}`,
            borderRadius: 13,
            padding: "12px 14px",
            fontSize: 14.5,
            fontFamily: "var(--font-sans)",
            resize: "vertical",
            outline: "none",
            background: "#F9FAFB",
            color: C.ink,
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <button
            className="uv-btn"
            style={{ ...styles.primaryBtn, ...(!draft.trim() ? styles.btnDisabled : {}) }}
            onClick={addPost}
            disabled={!draft.trim()}
          >
            <Send size={16} /> {t.postBtn}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {posts.map((post) => (
          <div key={post.id} className="uv-rise" style={styles.infoCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: `linear-gradient(135deg,${C.primary},${C.violet})`,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {post.author.slice(0, 1).toUpperCase()}
              </span>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: C.ink }}>{post.author}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 15, color: C.ink, marginBottom: 14, lineHeight: 1.5 }}>
              <Target size={16} color={C.violet} style={{ marginTop: 3, flexShrink: 0 }} />
              {post.text}
            </div>
            <div style={{ display: "flex", gap: 16, borderTop: `1px solid ${C.line}`, paddingTop: 10 }}>
              <button
                onClick={() => toggleLike(post.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: post.liked ? "#EC4899" : C.muted,
                }}
              >
                <Heart size={16} fill={post.liked ? "#EC4899" : "none"} /> {post.likes} {t.like}
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: C.muted }}>
                <MessageCircle size={16} /> {post.comments.length} {t.comment}
              </div>
            </div>

            {post.comments.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {post.comments.map((c) => (
                  <div key={c.id} style={{ fontSize: 13, background: "#F7F7FD", borderRadius: 10, padding: "8px 12px" }}>
                    <span style={{ fontWeight: 700, color: C.ink }}>{c.author}: </span>
                    <span style={{ color: C.muted }}>{c.text}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <input
                value={commentDraft[post.id] || ""}
                onChange={(e) => setCommentDraft((d) => ({ ...d, [post.id]: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && addComment(post.id)}
                placeholder={t.commentPh}
                style={{
                  flex: 1,
                  border: `1.5px solid ${C.line}`,
                  borderRadius: 11,
                  padding: "9px 12px",
                  fontSize: 13.5,
                  outline: "none",
                  background: "#F9FAFB",
                  color: C.ink,
                }}
              />
              <button
                onClick={() => addComment(post.id)}
                style={{
                  border: "none",
                  borderRadius: 11,
                  padding: "0 14px",
                  background: `${C.primary}14`,
                  color: C.primary,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {t.send}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
