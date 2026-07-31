import { GoogleGenAI } from "@google/genai";

const TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || "gemini-3.6-flash";
const TTS_MODEL = process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts";

let client: GoogleGenAI | null = null;

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY sozlanmagan");
  }
  if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

const BASE_INSTRUCTION = `Sen UniStep platformasidagi AI yordamchisan — O'zbekistonda DTM (Davlat Test Markazi)
imtihoniga tayyorlanayotgan abituriyentlarga yordam berasan.

Qat'iy qoidalar:
- Faqat berilgan mavzu doirasida, ta'lim va DTMga tayyorgarlik bilan bog'liq savollarga javob ber.
- Agar foydalanuvchi mavzudan chetga chiqsa (masalan, umuman aloqasiz narsa so'rasa), qisqa va do'stona tarzda
  buni aytib, uni asosiy maqsadga — o'qishga tayyorgarlikka — ohista qaytar.
- Javoblaring qisqa, aniq va tushunarli bo'lsin. Talabani rag'batlantir, lekin qabul kafolatini va'da qilma.
- Foydalanuvchi qaysi tilda yozsa (o'zbek, rus yoki ingliz), o'sha tilda javob ber.`;

export async function askAssistant({
  topic,
  message,
  history,
}: {
  topic: string;
  message: string;
  history: { role: "user" | "model"; text: string }[];
}) {
  const ai = getClient();
  const systemInstruction = `${BASE_INSTRUCTION}\n\nJoriy mavzu: ${topic}`;

  const contents = [
    ...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
    { role: "user" as const, parts: [{ text: message }] },
  ];

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents,
    config: { systemInstruction },
  });

  return response.text ?? "";
}

export async function generateLessonText({
  subject,
  topic,
  lang,
}: {
  subject: string;
  topic: string;
  lang: string;
}) {
  const ai = getClient();
  const prompt = `Sen DTM (O'zbekiston Davlat Test Markazi) imtihoniga tayyorgarlik dasturi uchun dars matni yozuvchi
muallifsan. Fan: "${subject}". Mavzu: "${topic}".

Shu mavzu bo'yicha 300-400 so'zli, aniq va tushunarli dars matni yoz, ${lang} tilida. Talablar:
- Avval mavzuni sodda tilda tushuntir.
- Keyin 2-3 ta aniq misol yoki masala yechimi bilan ko'rsat.
- Oxirida 2-3 gapli qisqa xulosa.
- Faqat oddiy matn qaytar (markdown belgilar, sarlavha belgilari ishlatma).`;

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
  });

  return response.text ?? "";
}

export type QuizQuestion = {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
};

export async function generateQuiz({
  subject,
  topic,
  lang,
}: {
  subject: string;
  topic: string;
  lang: string;
}): Promise<QuizQuestion[]> {
  const ai = getClient();
  const prompt = `"${subject}" fanidan "${topic}" mavzusida DTM uslubida 5 ta test savoli tuz, ${lang} tilida.
Har bir savolda aniq 4 ta variant bo'lsin, ulardan faqat bittasi to'g'ri.
Matematik ifodalarni oddiy matn ko'rinishida yoz (LaTeX yoki $ belgilarisiz, masalan "x kvadrat - 5x + 6 = 0").
Faqat quyidagi JSON formatida javob ber, boshqa hech narsa yozma:
[{"question": "...", "options": ["...", "...", "...", "..."], "correctIndex": 0}, ...]`;

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  const raw = response.text ?? "[]";
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const match = raw.match(/\[[\s\S]*\]/);
    parsed = match ? JSON.parse(match[0]) : [];
  }

  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(
      (q): q is QuizQuestion =>
        q &&
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctIndex === "number"
    )
    .slice(0, 5);
}

export async function generateSpeech(text: string): Promise<Buffer> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: TTS_MODEL,
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } },
      },
    },
  });

  const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!audioData) throw new Error("Gemini audio qaytarmadi");

  return Buffer.from(audioData, "base64");
}

export function pcmToWav(pcm: Buffer, channels = 1, sampleRate = 24000, bitDepth = 16): Buffer {
  const byteRate = (sampleRate * channels * bitDepth) / 8;
  const blockAlign = (channels * bitDepth) / 8;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}
