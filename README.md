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
- [ ] 31 kunlik darslik (DTM formatiga mos, real kontent)
- [ ] Universitetlar bo'limida real qabul ballari (hozir mock)
- [ ] Maqsadlar lentasi — hozircha localStorage, realtime emas
- [ ] Dark/Light rejim

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
