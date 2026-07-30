export type RegionId =
  | "tashkent_city" | "tashkent_region" | "samarkand" | "bukhara" | "andijan"
  | "fergana" | "namangan" | "kashkadarya" | "surkhandarya" | "jizzakh"
  | "syrdarya" | "navoi" | "khorezm" | "karakalpakstan";

export type Region = { id: RegionId; uz: string; en: string; ru: string };

export const REGIONS: Region[] = [
  { id: "tashkent_city", uz: "Toshkent shahri", en: "Tashkent city", ru: "город Ташкент" },
  { id: "tashkent_region", uz: "Toshkent viloyati", en: "Tashkent region", ru: "Ташкентская область" },
  { id: "samarkand", uz: "Samarqand", en: "Samarkand", ru: "Самарканд" },
  { id: "bukhara", uz: "Buxoro", en: "Bukhara", ru: "Бухара" },
  { id: "andijan", uz: "Andijon", en: "Andijan", ru: "Андижан" },
  { id: "fergana", uz: "Farg'ona", en: "Fergana", ru: "Фергана" },
  { id: "namangan", uz: "Namangan", en: "Namangan", ru: "Наманган" },
  { id: "kashkadarya", uz: "Qashqadaryo", en: "Kashkadarya", ru: "Кашкадарья" },
  { id: "surkhandarya", uz: "Surxondaryo", en: "Surkhandarya", ru: "Сурхандарья" },
  { id: "jizzakh", uz: "Jizzax", en: "Jizzakh", ru: "Джизак" },
  { id: "syrdarya", uz: "Sirdaryo", en: "Syrdarya", ru: "Сырдарья" },
  { id: "navoi", uz: "Navoiy", en: "Navoi", ru: "Навои" },
  { id: "khorezm", uz: "Xorazm", en: "Khorezm", ru: "Хорезм" },
  { id: "karakalpakstan", uz: "Qoraqalpog'iston", en: "Karakalpakstan", ru: "Каракалпакстан" },
];

const D = {
  classic: ["Amaliy matematika va informatika", "Fizika", "Kimyo", "Biologiya", "O'zbek tili va adabiyoti", "Ingliz filologiyasi", "Tarix", "Iqtisodiyot", "Psixologiya", "Huquqshunoslik"],
  it: ["Kompyuter injiniringi", "Dasturiy injiniring", "Axborot xavfsizligi", "Sun'iy intellekt", "Telekommunikatsiya texnologiyalari", "Ma'lumotlar tahlili (Data Science)", "Axborot tizimlari"],
  tech: ["Qurilish muhandisligi", "Arxitektura", "Elektr energetikasi", "Mexanika muhandisligi", "Neft-gaz ishi", "Kimyoviy texnologiya", "Transport tizimlari"],
  med: ["Davolash ishi", "Pediatriya", "Stomatologiya", "Farmatsevtika", "Tibbiy profilaktika", "Oliy hamshiralik ishi"],
  econ: ["Iqtisodiyot", "Buxgalteriya hisobi va audit", "Bank ishi", "Menejment", "Marketing", "Moliya va moliyaviy texnologiyalar", "Turizm"],
  ped: ["Boshlang'ich ta'lim", "Maktabgacha ta'lim", "Ona tili va adabiyot", "Matematika o'qituvchisi", "Xorijiy til (ingliz)", "Tarix o'qituvchisi", "Informatika o'qituvchisi"],
  agro: ["Agronomiya", "Veterinariya meditsinasi", "Zootexniya", "Yer tuzish va kadastr", "Oziq-ovqat texnologiyasi", "Qishloq xo'jaligini mexanizatsiyalash"],
  lang: ["Ingliz filologiyasi", "Roman-german filologiyasi", "Tarjimonlik", "Xorijiy til o'qituvchisi"],
  law: ["Huquqshunoslik", "Xalqaro huquq", "Sud-huquq faoliyati", "Biznes huquqi"],
};
const mix = (...keys: (keyof typeof D)[]) => [...new Set(keys.flatMap((k) => D[k]))];

export type University = { name: string; dirs: string[]; regionId: RegionId };

const UNIS: Record<RegionId, { name: string; dirs: string[] }[]> = {
  tashkent_city: [
    { name: "O'zbekiston Milliy universiteti (Mirzo Ulug'bek)", dirs: mix("classic", "it") },
    { name: "Toshkent axborot texnologiyalari universiteti (TATU)", dirs: D.it },
    { name: "Toshkent davlat texnika universiteti", dirs: mix("tech", "it") },
    { name: "Toshkent davlat iqtisodiyot universiteti", dirs: D.econ },
    { name: "Toshkent tibbiyot akademiyasi", dirs: D.med },
    { name: "Toshkent davlat yuridik universiteti", dirs: D.law },
    { name: "Nizomiy nomidagi TDPU", dirs: D.ped },
    { name: "Inha universiteti (Toshkent)", dirs: D.it },
    { name: "Westminster xalqaro universiteti (WIUT)", dirs: mix("econ", "it") },
    { name: "Turin politexnika universiteti", dirs: ["Avtomobilsozlik muhandisligi", "Sanoat muhandisligi", "Mexatronika", "Energetika muhandisligi"] },
    { name: "Toshkent davlat sharqshunoslik universiteti", dirs: ["Sharq filologiyasi", "Xalqaro munosabatlar", "Tarjimonlik", "Mintaqashunoslik"] },
  ],
  tashkent_region: [
    { name: "Chirchiq davlat pedagogika universiteti", dirs: D.ped },
    { name: "Toshkent davlat agrar universiteti", dirs: D.agro },
    { name: "Toshkent kimyo-texnologiya instituti", dirs: mix("tech") },
  ],
  samarkand: [
    { name: "Samarqand davlat universiteti", dirs: mix("classic", "it") },
    { name: "Samarqand davlat tibbiyot universiteti", dirs: D.med },
    { name: "Samarqand davlat chet tillar instituti", dirs: D.lang },
    { name: "Samarqand davlat arxitektura-qurilish universiteti", dirs: D.tech },
    { name: "Samarqand veterinariya meditsinasi universiteti", dirs: D.agro },
  ],
  bukhara: [
    { name: "Buxoro davlat universiteti", dirs: D.classic },
    { name: "Buxoro davlat tibbiyot instituti", dirs: D.med },
    { name: "Buxoro muhandislik-texnologiya instituti", dirs: D.tech },
  ],
  andijan: [
    { name: "Andijon davlat universiteti", dirs: D.classic },
    { name: "Andijon davlat tibbiyot instituti", dirs: D.med },
    { name: "Andijon mashinasozlik instituti", dirs: D.tech },
    { name: "Andijon qishloq xo'jaligi va agrotexnologiyalar instituti", dirs: D.agro },
  ],
  fergana: [
    { name: "Farg'ona davlat universiteti", dirs: D.classic },
    { name: "Farg'ona politexnika instituti", dirs: mix("tech", "it") },
    { name: "Qo'qon universiteti", dirs: D.econ },
  ],
  namangan: [
    { name: "Namangan davlat universiteti", dirs: D.classic },
    { name: "Namangan muhandislik-texnologiya instituti", dirs: D.tech },
    { name: "Namangan davlat chet tillar instituti", dirs: D.lang },
  ],
  kashkadarya: [
    { name: "Qarshi davlat universiteti", dirs: D.classic },
    { name: "Qarshi muhandislik-iqtisodiyot instituti", dirs: mix("tech", "econ") },
  ],
  surkhandarya: [
    { name: "Termiz davlat universiteti", dirs: D.classic },
    { name: "Termiz iqtisodiyot va servis universiteti", dirs: D.econ },
  ],
  jizzakh: [
    { name: "Jizzax davlat pedagogika universiteti", dirs: D.ped },
    { name: "Jizzax politexnika instituti", dirs: D.tech },
  ],
  syrdarya: [{ name: "Guliston davlat universiteti", dirs: D.classic }],
  navoi: [
    { name: "Navoiy davlat universiteti", dirs: D.classic },
    { name: "Navoiy davlat konchilik va texnologiyalar universiteti", dirs: D.tech },
  ],
  khorezm: [
    { name: "Urganch davlat universiteti", dirs: D.classic },
    { name: "Urganch innovatsion universiteti", dirs: mix("it", "econ") },
  ],
  karakalpakstan: [
    { name: "Qoraqalpoq davlat universiteti", dirs: D.classic },
    { name: "Nukus davlat pedagogika instituti", dirs: D.ped },
    { name: "Qoraqalpog'iston tibbiyot instituti", dirs: D.med },
  ],
};

export const REGION_BY_ID: Record<RegionId, Region> = Object.fromEntries(
  REGIONS.map((r) => [r.id, r])
) as Record<RegionId, Region>;

export const ALL_UNIS: University[] = (Object.entries(UNIS) as [RegionId, { name: string; dirs: string[] }[]][])
  .flatMap(([rid, list]) => list.map((u) => ({ ...u, regionId: rid })));
