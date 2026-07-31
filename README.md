# UniStep

O'zbekiston abituriyentlari uchun DTMga tayyorgarlik + motivatsion platforma.
Next.js 15+ (App Router, TypeScript), Tailwind CSS, indigo/violet glassmorphism dizayn.

## Oqim

Google (email) → ism/familiya → yosh → viloyat → universitet → yo'nalish → tabrik (2s tasdiq) → bosh sahifa.

Navbar: **Bosh sahifa · Universitetlar · Maqsadlar · Profil**

## Holat

- [x] NextAuth (Google) — real autentifikatsiya
- [x] Neon Postgres + Prisma — foydalanuvchi ma'lumotlarini bazaga saqlash
- [x] Gemini API — AI yordamchi (mavzu-doirali chat) va TTS audio infratuzilmasi
- [x] 31 kunlik darslik: DTM 2026 formati (90 savol, 189 ball) asosida, yo'nalishga mos
      fanlar bo'yicha AI tomonidan generatsiya qilingan dars matni + audio + 5 savolli test
- [x] Universitetlar bo'limida real DTM milliy minimal ballari + OTM toifasiga ko'ra taxminiy ball,
      rasmiy qabul jarayoni (my.uzbmb.uz) ma'lumoti bilan
- [x] Maqsadlar lentasi — Postgres'da saqlanadi, 6 soniyada avtomatik yangilanadi (near-realtime)
- [x] Profil: Google avatar, maqsad matni (saqlanadi), daraja/streak/ball, yutuq nishonlari,
      umumiy va OTM bo'yicha reyting (leaderboard)
- [x] Kunlik eslatma banneri (dashboard) — hali dars boshlanmagan bo'lsa ko'rinadi
- [x] Dark/Light rejim — ilova qismida (dashboard/universitetlar/maqsadlar/profil) almashtiriladi;
      ro'yxatdan o'tish oqimi dizayni har doim o'zgarmas saqlanadi

## Ishga tushirish

```bash
npm install
npm run dev
```

http://localhost:3000

## Build

```bash
npm run build
npm start
```

## Muhit o'zgaruvchilari (`.env`)

`.env.example` faylini `.env` ga nusxalab, kalitlarni to'ldiring:

| O'zgaruvchi | Qayerdan olinadi |
| --- | --- |
| `DATABASE_URL` | [Neon](https://console.neon.tech) — yangi loyiha yarating, "Connection string" (pooled) ni ko'chiring |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` buyrug'i bilan o'zingiz generatsiya qilasiz |
| `NEXTAUTH_URL` | Lokal: `http://localhost:3000`, prod: Vercel domeningiz |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → OAuth 2.0 Client ID → "Web application", Authorized redirect URI: `https://<domen>/api/auth/callback/google` |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) |

## Tuzilma

- `src/app/page.tsx` — auth (Google) ekrani
- `src/app/onboarding/` — bosqichma-bosqich ro'yxatdan o'tish
- `src/app/(app)/` — navbar bilan asosiy ilova: dashboard, universities, goals, profile
- `src/lib/` — dizayn tokenlari, tarjimalar (UZ/EN/RU), ma'lumotlar, sessiya
- `src/components/` — umumiy UI komponentlari
