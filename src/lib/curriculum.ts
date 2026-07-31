// DTM 2026 format (tekshirilgan, infoedu.uz / ustabor.uz manbalari asosida):
// 90 savol, 189 ball. Majburiy fanlar bloki (Ona tili, Matematika, O'zbekiston tarixi) —
// har biridan 10 savol x 1.1 ball = 11 ball, jami 33 ball. Yo'nalish (mutaxassislik)
// fanlari: 1-fan 30 savol x 3.1 ball = 93 ball, 2-fan 30 savol x 2.1 ball = 63 ball, jami 156 ball.
export const DTM_FORMAT = {
  totalQuestions: 90,
  maxScore: 189,
  mandatory: [
    { subject: "Ona tili va adabiyoti", questions: 10, perQuestion: 1.1, max: 11 },
    { subject: "Matematika", questions: 10, perQuestion: 1.1, max: 11 },
    { subject: "O'zbekiston tarixi", questions: 10, perQuestion: 1.1, max: 11 },
  ],
  specialty: [
    { role: "1-mutaxassislik fani", questions: 30, perQuestion: 3.1, max: 93 },
    { role: "2-mutaxassislik fani", questions: 30, perQuestion: 2.1, max: 63 },
  ],
};

const MANDATORY_SUBJECTS = ["Ona tili va adabiyoti", "Matematika", "O'zbekiston tarixi"];

// Yo'nalish nomidan 2 ta mutaxassislik faniga taxminiy moslashtirish.
// Rasmiy DTM fanlar majmuasi har bir OTM/yo'nalish uchun alohida e'lon qilinadi —
// bu ro'yxat umumiy yo'naltiruvchi taxmin, aniq fanlar majmuasini DTM/OTM saytidan tekshiring.
const DIRECT_MAP: Record<string, [string, string]> = {
  "Amaliy matematika va informatika": ["Matematika", "Fizika"],
  "Fizika": ["Fizika", "Matematika"],
  "Kimyo": ["Kimyo", "Biologiya"],
  "Biologiya": ["Biologiya", "Kimyo"],
  "O'zbek tili va adabiyoti": ["Ona tili va adabiyoti", "Tarix"],
  "Ingliz filologiyasi": ["Ingliz tili", "Ona tili va adabiyoti"],
  "Tarix": ["Tarix", "Ona tili va adabiyoti"],
  "Iqtisodiyot": ["Matematika", "Iqtisodiyot asoslari"],
  "Psixologiya": ["Biologiya", "Ona tili va adabiyoti"],
  "Huquqshunoslik": ["Tarix", "Huquq asoslari"],

  "Kompyuter injiniringi": ["Matematika", "Fizika"],
  "Dasturiy injiniring": ["Matematika", "Fizika"],
  "Axborot xavfsizligi": ["Matematika", "Fizika"],
  "Sun'iy intellekt": ["Matematika", "Fizika"],
  "Telekommunikatsiya texnologiyalari": ["Matematika", "Fizika"],
  "Ma'lumotlar tahlili (Data Science)": ["Matematika", "Fizika"],
  "Axborot tizimlari": ["Matematika", "Fizika"],

  "Qurilish muhandisligi": ["Matematika", "Fizika"],
  "Arxitektura": ["Matematika", "Fizika"],
  "Elektr energetikasi": ["Fizika", "Matematika"],
  "Mexanika muhandisligi": ["Fizika", "Matematika"],
  "Neft-gaz ishi": ["Kimyo", "Fizika"],
  "Kimyoviy texnologiya": ["Kimyo", "Matematika"],
  "Transport tizimlari": ["Matematika", "Fizika"],

  "Davolash ishi": ["Biologiya", "Kimyo"],
  "Pediatriya": ["Biologiya", "Kimyo"],
  "Stomatologiya": ["Biologiya", "Kimyo"],
  "Farmatsevtika": ["Kimyo", "Biologiya"],
  "Tibbiy profilaktika": ["Biologiya", "Kimyo"],
  "Oliy hamshiralik ishi": ["Biologiya", "Kimyo"],

  "Buxgalteriya hisobi va audit": ["Matematika", "Iqtisodiyot asoslari"],
  "Bank ishi": ["Matematika", "Iqtisodiyot asoslari"],
  "Menejment": ["Matematika", "Iqtisodiyot asoslari"],
  "Marketing": ["Matematika", "Iqtisodiyot asoslari"],
  "Moliya va moliyaviy texnologiyalar": ["Matematika", "Iqtisodiyot asoslari"],
  "Turizm": ["Ingliz tili", "Tarix"],

  "Boshlang'ich ta'lim": ["Ona tili va adabiyoti", "Matematika"],
  "Maktabgacha ta'lim": ["Ona tili va adabiyoti", "Psixologiya"],
  "Ona tili va adabiyot": ["Ona tili va adabiyoti", "Tarix"],
  "Matematika o'qituvchisi": ["Matematika", "Fizika"],
  "Xorijiy til (ingliz)": ["Ingliz tili", "Ona tili va adabiyoti"],
  "Tarix o'qituvchisi": ["Tarix", "Ona tili va adabiyoti"],
  "Informatika o'qituvchisi": ["Matematika", "Fizika"],

  "Agronomiya": ["Biologiya", "Kimyo"],
  "Veterinariya meditsinasi": ["Biologiya", "Kimyo"],
  "Zootexniya": ["Biologiya", "Kimyo"],
  "Yer tuzish va kadastr": ["Matematika", "Geografiya"],
  "Oziq-ovqat texnologiyasi": ["Kimyo", "Biologiya"],
  "Qishloq xo'jaligini mexanizatsiyalash": ["Fizika", "Matematika"],

  "Roman-german filologiyasi": ["Ingliz tili", "Ona tili va adabiyoti"],
  "Tarjimonlik": ["Ingliz tili", "Ona tili va adabiyoti"],
  "Xorijiy til o'qituvchisi": ["Ingliz tili", "Ona tili va adabiyoti"],

  "Xalqaro huquq": ["Tarix", "Huquq asoslari"],
  "Sud-huquq faoliyati": ["Tarix", "Huquq asoslari"],
  "Biznes huquqi": ["Iqtisodiyot asoslari", "Huquq asoslari"],

  "Avtomobilsozlik muhandisligi": ["Fizika", "Matematika"],
  "Sanoat muhandisligi": ["Fizika", "Matematika"],
  "Mexatronika": ["Fizika", "Matematika"],
  "Energetika muhandisligi": ["Fizika", "Matematika"],

  "Sharq filologiyasi": ["Ingliz tili", "Ona tili va adabiyoti"],
  "Xalqaro munosabatlar": ["Tarix", "Ingliz tili"],
  "Mintaqashunoslik": ["Tarix", "Geografiya"],
};

function inferSubjects(direction: string): [string, string] {
  if (DIRECT_MAP[direction]) return DIRECT_MAP[direction];
  const d = direction.toLowerCase();
  if (d.includes("huquq")) return ["Tarix", "Huquq asoslari"];
  if (d.includes("tili") || d.includes("filologiya") || d.includes("tarjimon")) return ["Ingliz tili", "Ona tili va adabiyoti"];
  if (d.includes("tibbiyot") || d.includes("hamshira") || d.includes("farmatsevt") || d.includes("veterinar")) return ["Biologiya", "Kimyo"];
  if (d.includes("iqtisod") || d.includes("moliya") || d.includes("bank") || d.includes("menejment") || d.includes("marketing")) return ["Matematika", "Iqtisodiyot asoslari"];
  if (d.includes("muhandis") || d.includes("texnolog") || d.includes("energet") || d.includes("qurilish")) return ["Matematika", "Fizika"];
  if (d.includes("tarix")) return ["Tarix", "Ona tili va adabiyoti"];
  return ["Matematika", "Ona tili va adabiyoti"];
}

const TOPICS: Record<string, string[]> = {
  "Matematika": [
    "Sonlar va amallar", "Chiziqli tenglama va tengsizliklar", "Kvadrat tenglamalar",
    "Funksiya va grafiklar", "Progressiyalar", "Trigonometriya asoslari",
    "Logarifm va daraja", "Planimetriya: uchburchak va to'rtburchaklar",
    "Stereometriya asoslari", "Ehtimollar nazariyasi va statistika",
  ],
  "Fizika": [
    "Kinematika: tekis va tezlanuvchan harakat", "Dinamika, Nyuton qonunlari",
    "Ish, energiya va quvvat", "Impuls saqlanish qonuni", "Molekulyar fizika asoslari",
    "Termodinamika qonunlari", "Elektr maydon va tok", "Magnit maydon",
    "Tebranishlar va to'lqinlar", "Optika asoslari",
  ],
  "Kimyo": [
    "Atom tuzilishi va davriy sistema", "Kimyoviy bog'lanish turlari",
    "Kimyoviy reaksiyalar va tenglamalar", "Eritmalar va konsentratsiya",
    "Kislotalar, asoslar, tuzlar", "Oksidlanish-qaytarilish reaksiyalari",
    "Organik kimyo: uglevodorodlar", "Spirtlar va karbon kislotalar",
    "Metallar kimyosi", "Kimyoviy hisoblashlar",
  ],
  "Biologiya": [
    "Hujayra tuzilishi va funksiyalari", "Genetika asoslari", "Fotosintez jarayoni",
    "Inson anatomiyasi: tayanch-harakat tizimi", "Yurak-qon tomir tizimi",
    "Nafas olish va ovqat hazm qilish tizimi", "Asab tizimi va gormonlar",
    "Ekologiya va biosfera", "Evolyutsiya nazariyasi", "O'simliklar va hayvonlar tizimi",
  ],
  "Ona tili va adabiyoti": [
    "Fonetika va orfoepiya", "So'z turkumlari: ot, sifat, son",
    "So'z turkumlari: fe'l va ravish", "Gap bo'laklari", "Qo'shma gaplar",
    "Imlo qoidalari", "Alisher Navoiy ijodi", "XX asr o'zbek adabiyoti",
    "Badiiy asar tahlili", "Nutq madaniyati",
  ],
  "O'zbekiston tarixi": [
    "Qadimgi O'zbekiston davlatlari", "Amir Temur va Temuriylar davri",
    "XVI-XVIII asr xonliklar", "Chor Rossiyasi bosqinchiligi",
    "Jadidchilik harakati", "Sovet davri O'zbekistonda",
    "Mustaqillik yillari", "O'zbekiston Respublikasi Konstitutsiyasi",
    "Yangi O'zbekiston taraqqiyot strategiyasi", "O'zbekiston xalqaro munosabatlarda",
  ],
  "Ingliz tili": [
    "Present tenses", "Past va Future tenses", "Modal verbs",
    "Conditionals", "Passive voice", "Reported speech",
    "Prepositions va Articles", "Vocabulary: everyday topics",
    "Reading comprehension strategies", "Writing: formal va informal",
  ],
  "Huquq asoslari": [
    "Konstitutsiyaviy huquq asoslari", "Fuqarolik huquqi asoslari",
    "Mehnat huquqi", "Oila huquqi", "Ma'muriy huquqbuzarliklar",
    "Jinoyat huquqi asoslari", "Inson huquqlari", "Yoshlar huquqi",
  ],
  "Iqtisodiyot asoslari": [
    "Talab va taklif", "Bozor iqtisodiyoti asoslari", "Pul va inflyatsiya",
    "Davlat byudjeti va soliqlar", "Xalqaro savdo asoslari",
    "Tadbirkorlik asoslari", "Moliyaviy savodxonlik", "Makroiqtisodiy ko'rsatkichlar",
  ],
  "Geografiya": [
    "O'zbekiston geografik joylashuvi", "Iqlim va tabiiy zonalar",
    "Aholi va demografiya", "Sanoat geografiyasi", "Qishloq xo'jaligi geografiyasi",
    "Jahon geografiyasi asoslari",
  ],
  "Psixologiya": [
    "Shaxs psixologiyasi asoslari", "Diqqat va xotira", "Emotsiya va motivatsiya",
    "Yosh davrlari psixologiyasi", "Muloqot psixologiyasi",
  ],
};

export type DayPlanItem = { day: number; subject: string; topic: string };

export function buildPlan(direction: string | null): DayPlanItem[] {
  const [s1, s2] = direction ? inferSubjects(direction) : ["Matematika", "Ona tili va adabiyoti"];
  // Yo'nalish fanlariga ko'proq, majburiy fanlarga kamroq vazn — DTM ball ulushiga taxminan mos.
  const pattern = [s1, s2, s1, MANDATORY_SUBJECTS[0], s2, s1, MANDATORY_SUBJECTS[1], s2, s1, MANDATORY_SUBJECTS[2]];
  const counters: Record<string, number> = {};

  const plan: DayPlanItem[] = [];
  for (let day = 1; day <= 31; day++) {
    const subject = pattern[(day - 1) % pattern.length];
    const topics = TOPICS[subject] ?? TOPICS["Matematika"];
    const idx = counters[subject] ?? 0;
    counters[subject] = idx + 1;
    plan.push({ day, subject, topic: topics[idx % topics.length] });
  }
  return plan;
}
