import React, { useState, useEffect, useRef } from "react";
import { Home, Baby, ShoppingCart, MessageCircle, Calendar, Milk, Moon, Droplet, Heart, Plus, Check, X, Trash2, Refrigerator, Syringe, Clock, Settings, Quote, Edit3, CheckSquare, Utensils, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, FileText, Bell, Sparkles, Languages, Send, TrendingUp, Cloud, CloudOff } from "lucide-react";

const ACT = {
  feeding: { emoji: "🍼", cat: "food" }, breakfast: { emoji: "🥣", cat: "food" }, lunch: { emoji: "🍚", cat: "food" }, dinner: { emoji: "🍲", cat: "food" }, snack: { emoji: "🍪", cat: "food" },
  nap: { emoji: "💤", cat: "sleep" }, bed: { emoji: "🌙", cat: "sleep" }, wake: { emoji: "☀️", cat: "sleep" },
  diaper: { emoji: "💧", cat: "care" }, shower: { emoji: "🚿", cat: "care" }, bath: { emoji: "🛁", cat: "care" },
};
const CATS = [
  { id: "food", emoji: "🍽", chip: "bg-teal-50 text-teal-600 border-teal-100" },
  { id: "sleep", emoji: "😴", chip: "bg-violet-50 text-violet-600 border-violet-100" },
  { id: "care", emoji: "🧼", chip: "bg-amber-50 text-amber-700 border-amber-100" },
];
const CHORES = ["clean", "laundry", "dishes", "trash", "tidy"];
const DOC = { residencia: "🪪", passport: "🛂", visa: "✈️", license: "🚗", insurance: "🩺", contract: "📄" };
const DOCTYPES = Object.keys(DOC);
const MEAL_SEED = "@@meal";
const MEMBERS = ["mom", "dad", "family"];
const MEMBER_LANG = { mom: "ko", dad: "es", family: "en" };
const LANGNAME = { ko: "한국어", es: "스페인어", en: "영어" };
const TONES = ["soft", "thanks", "ask", "calm", "cheer"];
const REACTS = ["💛", "🙏", "🥹", "👏"];
const EMOJIS = ["📌", "🩺", "🎂", "🏠", "🎉", "💼", "✈️", "🎓", "💊", "🐾", "⚽", "🎵"];

// ===== C3 팔레트 =====
const TEAL = "#52B0B5"; const TEAL_D = "#3F8E92";
const BG_PAGE = "#FBF6F0"; const BG_CARD = "#FFFDFB";
const HEADER_GRAD = "linear-gradient(120deg,#5FC0BE,#79A6E2,#A38FD8)";
const HEART_GRAD = "linear-gradient(135deg,#EAF4F1,#F3EEF6)";
const HEART_BORDER = "#D9D2E4"; const HEART_TXT = "#3F7E84"; const HEART_ICON = "#5BA3B0";

const COLORS = [
  { id: "teal", text: "text-teal-500", chip: "bg-teal-400", bar: "border-l-teal-300" },
  { id: "sky", text: "text-sky-500", chip: "bg-sky-400", bar: "border-l-sky-300" },
  { id: "violet", text: "text-violet-500", chip: "bg-violet-400", bar: "border-l-violet-300" },
  { id: "amber", text: "text-amber-500", chip: "bg-amber-400", bar: "border-l-amber-300" },
  { id: "rose", text: "text-rose-500", chip: "bg-rose-400", bar: "border-l-rose-300" },
  { id: "indigo", text: "text-indigo-500", chip: "bg-indigo-400", bar: "border-l-indigo-300" },
  { id: "emerald", text: "text-emerald-500", chip: "bg-emerald-400", bar: "border-l-emerald-300" },
  { id: "cyan", text: "text-cyan-500", chip: "bg-cyan-400", bar: "border-l-cyan-300" },
];
const colorOf = (cid) => COLORS.find((c) => c.id === cid) || COLORS[0];

const TR = {
  ko: {
    locale: "ko-KR", appName: "NoaFam", mom: "엄마", dad: "아빠", family: "가족",
    tabs: { home: "홈", baby: "육아", shop: "살림", board: "우리 이야기", cal: "일정" },
    settings: "설정", language: "언어", iAm: "나는", close: "닫기", logout: "로그아웃",
    homeWidgets: "홈 화면 구성 · 순서", reorderHint: "▲▼로 순서 변경 · 토글로 표시",
    saved: "저장됨", saving: "저장 중...", syncErr: "동기화 오류",
    w_heart: "마음한마디", w_quote: "오늘의 명언", w_baby: "아기 상태", w_schedule: "하루 일과표", w_upcoming: "다가오는 일정", w_docs: "문서 만료",
    heartTitle: "마음한마디", heartEmpty: "오늘 가족에게 전하고 싶은 마음을 남겨보세요", addNote: "마음 남기기", toLabel: "받는 사람", heartPh: "짧아도 괜찮아요. 마음을 적어보세요",
    soften: "AI로 다듬기", translateBtn: "번역 미리보기", aiBusy: "다듬는 중...", aiDone: "AI가 다듬었어요", revert: "되돌리기", showOrig: "원문", showTrans: "번역", aiErr: "AI 연결이 잠시 안 돼요", send: "남기기",
    tones: { soft: "더 부드럽게", thanks: "고마운 마음", ask: "부탁조로", calm: "안 싸우게", cheer: "응원되게" },
    quoteTitle: "오늘의 명언",
    last: "마지막", timeline: "타임라인", today: "오늘", health: "건강", quickLog: "기록 추가",
    growthTitle: "성장 기록", weight: "몸무게", height: "키",
    scheduleTitle: "하루 일과표", commentPlaceholder: "코멘트...",
    editTitle: "기록 수정", fType: "종류", fTime: "시간", fMemo: "메모", memoPh: "코멘트: 많이 먹음, 2시간 잠...", del: "삭제", save: "저장", edit: "수정", add: "추가",
    tasksTitle: "할 일 · 가사 분담", taskPh: "할 일 입력...", taskTitle: "할 일", noTasks: "등록된 할 일이 없어요", mealTitle: "이번 주 식단", mealPh: "메뉴...", ingSuffix: "재료",
    shoppingList: "장보기 리스트", addItem: "살 것 추가...", fridge: "냉장고 재고", addIng: "재료 추가...", toShop: "장보기로", low: "부족",
    evTitlePh: "일정 이름...", addCat: "카테고리", catName: "카테고리 이름", manageCat: "관리", delCatHint: "삭제 시 해당 일정은 다른 카테고리로 이동돼요",
    docsTitle: "중요 문서", docsHomeTitle: "만료 임박 문서", calTitle: "가족 일정", addDocPh: "문서 이름...", noItems: "등록된 내용이 없어요",
    weekdays: ["일", "월", "화", "수", "목", "금", "토"],
    justNow: "방금", noRec: "기록 없음", min: "분 전", hr: "시간 전", sleepCat: "수면",
    kinds: { vaccine: "건강", anniversary: "기념일", home: "집안" },
    chore: { clean: "청소", laundry: "빨래", dishes: "설거지", trash: "분리수거", tidy: "정리정돈" },
    dt: { residencia: "거주증", passport: "여권", visa: "비자", license: "운전면허", insurance: "보험", contract: "계약서" },
    sc: { wake: "기상", breakfast: "아침 식사", play: "놀이 시간", lunch: "점심", nap: "낮잠", snack: "간식", walk: "산책", dinner: "저녁", bath: "목욕", bed: "취침" },
    cat: { food: "식사", sleep: "수면", care: "위생" },
    act: { feeding: "수유", breakfast: "아침", lunch: "점심", dinner: "저녁", snack: "간식", nap: "낮잠", bed: "취침", wake: "기상", diaper: "기저귀", shower: "샤워", bath: "목욕" },
  },
  es: {
    locale: "es-DO", appName: "NoaFam", mom: "Mamá", dad: "Papá", family: "Familia",
    tabs: { home: "Inicio", baby: "Bebé", shop: "Casa", board: "Nosotros", cal: "Agenda" },
    settings: "Ajustes", language: "Idioma", iAm: "Soy", close: "Cerrar", logout: "Salir",
    homeWidgets: "Inicio · orden", reorderHint: "▲▼ para ordenar · toca para mostrar",
    saved: "Guardado", saving: "Guardando...", syncErr: "Error de sync",
    w_heart: "Nota de cariño", w_quote: "Frase del día", w_baby: "Estado del bebé", w_schedule: "Rutina diaria", w_upcoming: "Próximos eventos", w_docs: "Documentos",
    heartTitle: "Nota de cariño", heartEmpty: "Deja una nota de cariño para tu familia hoy", addNote: "Dejar una nota", toLabel: "Para", heartPh: "Unas palabras bastan",
    soften: "Suavizar con IA", translateBtn: "Vista de traducción", aiBusy: "Procesando...", aiDone: "Suavizado por IA", revert: "Deshacer", showOrig: "Original", showTrans: "Traducción", aiErr: "IA no disponible por ahora", send: "Enviar",
    tones: { soft: "Más suave", thanks: "Con gratitud", ask: "Como petición", calm: "Sin discutir", cheer: "Con ánimo" },
    quoteTitle: "Frase del día",
    last: "Último", timeline: "Cronología", today: "Hoy", health: "Salud", quickLog: "Agregar registro",
    growthTitle: "Crecimiento", weight: "Peso", height: "Estatura",
    scheduleTitle: "Rutina diaria", commentPlaceholder: "Comentario...",
    editTitle: "Editar registro", fType: "Tipo", fTime: "Hora", fMemo: "Nota", memoPh: "Nota: comió mucho, durmió 2h...", del: "Eliminar", save: "Guardar", edit: "Editar", add: "Agregar",
    tasksTitle: "Tareas · reparto", taskPh: "Escribe una tarea...", taskTitle: "Tarea", noTasks: "No hay tareas", mealTitle: "Menú de la semana", mealPh: "Menú...", ingSuffix: "ingredientes",
    shoppingList: "Lista de compras", addItem: "Agregar...", fridge: "Nevera", addIng: "Agregar ingrediente...", toShop: "A la lista", low: "poco",
    evTitlePh: "Nombre del evento...", addCat: "Categoría", catName: "Nombre de categoría", manageCat: "Gestionar", delCatHint: "Al eliminar, sus eventos pasan a otra categoría",
    docsTitle: "Documentos", docsHomeTitle: "Documentos por vencer", calTitle: "Agenda familiar", addDocPh: "Nombre del documento...", noItems: "Nada registrado",
    weekdays: ["D", "L", "M", "M", "J", "V", "S"],
    justNow: "ahora", noRec: "sin registro", min: "min", hr: "h", sleepCat: "Sueño",
    kinds: { vaccine: "Salud", anniversary: "Especial", home: "Hogar" },
    chore: { clean: "Limpiar", laundry: "Lavar ropa", dishes: "Platos", trash: "Reciclaje", tidy: "Ordenar" },
    dt: { residencia: "Residencia", passport: "Pasaporte", visa: "Visa", license: "Licencia", insurance: "Seguro", contract: "Contrato" },
    sc: { wake: "Despertar", breakfast: "Desayuno", play: "Juego", lunch: "Almuerzo", nap: "Siesta", snack: "Merienda", walk: "Paseo", dinner: "Cena", bath: "Baño", bed: "Dormir" },
    cat: { food: "Comidas", sleep: "Sueño", care: "Higiene" },
    act: { feeding: "Toma", breakfast: "Desayuno", lunch: "Almuerzo", dinner: "Cena", snack: "Merienda", nap: "Siesta", bed: "A dormir", wake: "Despertar", diaper: "Pañal", shower: "Ducha", bath: "Baño" },
  },
  en: {
    locale: "en-US", appName: "NoaFam", mom: "Mom", dad: "Dad", family: "Family",
    tabs: { home: "Home", baby: "Baby", shop: "House", board: "Us", cal: "Agenda" },
    settings: "Settings", language: "Language", iAm: "I am", close: "Close", logout: "Log out",
    homeWidgets: "Home · order", reorderHint: "▲▼ to reorder · tap to show",
    saved: "Saved", saving: "Saving...", syncErr: "Sync error",
    w_heart: "Heart Note", w_quote: "Daily quote", w_baby: "Baby status", w_schedule: "Daily routine", w_upcoming: "Upcoming events", w_docs: "Documents",
    heartTitle: "Heart Note", heartEmpty: "Leave a note from the heart for your family today", addNote: "Leave a note", toLabel: "To", heartPh: "A few words are enough",
    soften: "Soften with AI", translateBtn: "Translate preview", aiBusy: "Working...", aiDone: "Softened by AI", revert: "Undo", showOrig: "Original", showTrans: "Translation", aiErr: "AI unavailable right now", send: "Send",
    tones: { soft: "Softer", thanks: "Grateful", ask: "As a request", calm: "No fighting", cheer: "Encouraging" },
    quoteTitle: "Quote of the day",
    last: "Last", timeline: "Timeline", today: "Today", health: "Health", quickLog: "Add record",
    growthTitle: "Growth", weight: "Weight", height: "Height",
    scheduleTitle: "Daily routine", commentPlaceholder: "Comment...",
    editTitle: "Edit entry", fType: "Type", fTime: "Time", fMemo: "Note", memoPh: "Note: ate a lot, slept 2h...", del: "Delete", save: "Save", edit: "Edit", add: "Add",
    tasksTitle: "Tasks · chore split", taskPh: "Write a task...", taskTitle: "Task", noTasks: "No tasks yet", mealTitle: "This week's meals", mealPh: "Meal...", ingSuffix: "ingredients",
    shoppingList: "Shopping list", addItem: "Add item...", fridge: "Fridge stock", addIng: "Add ingredient...", toShop: "To list", low: "low",
    evTitlePh: "Event name...", addCat: "Category", catName: "Category name", manageCat: "Manage", delCatHint: "Deleting moves its events to another category",
    docsTitle: "Documents", docsHomeTitle: "Expiring documents", calTitle: "Family agenda", addDocPh: "Document name...", noItems: "Nothing yet",
    weekdays: ["S", "M", "T", "W", "T", "F", "S"],
    justNow: "just now", noRec: "no record", min: "min ago", hr: "hr ago", sleepCat: "Sleep",
    kinds: { vaccine: "Health", anniversary: "Special", home: "Home" },
    chore: { clean: "Cleaning", laundry: "Laundry", dishes: "Dishes", trash: "Recycling", tidy: "Tidy up" },
    dt: { residencia: "Residency", passport: "Passport", visa: "Visa", license: "License", insurance: "Insurance", contract: "Contract" },
    sc: { wake: "Wake up", breakfast: "Breakfast", play: "Playtime", lunch: "Lunch", nap: "Nap", snack: "Snack", walk: "Walk", dinner: "Dinner", bath: "Bath", bed: "Bedtime" },
    cat: { food: "Meals", sleep: "Sleep", care: "Care" },
    act: { feeding: "Feeding", breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack", nap: "Nap", bed: "Bedtime", wake: "Wake up", diaper: "Diaper", shower: "Shower", bath: "Bath" },
  },
};

const QUOTES = [
  { ko: "사랑은 두 몸에 깃든 하나의 영혼이다.", es: "El amor es una sola alma que habita dos cuerpos.", en: "Love is a single soul inhabiting two bodies.", author: "Aristoteles" },
  { ko: "인생에서 가장 붙잡아야 할 것은 서로다.", es: "Lo mejor a lo que aferrarse es el uno al otro.", en: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
  { ko: "가족은 중요한 게 아니다. 전부다.", es: "La familia no es importante. Lo es todo.", en: "Family is not an important thing. It's everything.", author: "Michael J. Fox" },
  { ko: "사랑은 가정에서 시작된다.", es: "El amor comienza en casa.", en: "Love begins at home.", author: "Teresa de Calcuta" },
  { ko: "깊이 사랑받으면 힘이 생기고, 깊이 사랑하면 용기가 생긴다.", es: "Ser amado da fuerza; amar da valor.", en: "Being loved gives strength; loving gives courage.", author: "Lao Tse" },
  { ko: "사랑은 서로 바라보는 게 아니라 같은 곳을 함께 보는 것이다.", es: "Amar es mirar juntos en la misma direccion.", en: "Love is looking together in the same direction.", author: "A. de Saint-Exupery" },
  { ko: "빨리 가려면 혼자, 멀리 가려면 함께 가라.", es: "Si quieres llegar lejos, ve acompanado.", en: "If you want to go far, go together.", author: "Proverbio africano" },
];

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ===== 서버 state(JSONB) <-> 앱 구조 정규화 =====
// 백엔드 state.js 기본 포맷과 호환되게 보정. 누락 필드는 기본값 채움.
function normalize(s) {
  s = s || {};
  return {
    familyName: s.familyName || "NoaFam",
    lang: s.lang || "ko",
    user: s.user || "mom",
    homeOrder: s.homeOrder || [
      { key: "heart", on: true }, { key: "quote", on: true }, { key: "baby", on: true }, { key: "docs", on: true }, { key: "upcoming", on: true }, { key: "schedule", on: false },
    ],
    kinds: s.kinds || [
      { id: "vaccine", tkey: "vaccine", color: "teal", emoji: "🩺" },
      { id: "anniversary", tkey: "anniversary", color: "violet", emoji: "🎂" },
      { id: "home", tkey: "home", color: "sky", emoji: "🏠" },
    ],
    heartNotes: (s.heartNotes || []).map((n) => ({
      id: n.id || uid(), from: n.from, to: n.to, text: n.text || "",
      translation: n.translation || "", showT: false,
      react: n.react || n.reactions || {}, ts: n.ts || n.createdAt || Date.now(),
    })),
    babyLogs: (s.babyLogs || []).map((l) => ({
      id: l.id || uid(), type: (l.type === "milk" ? "feeding" : l.type) || "feeding",
      ts: l.ts || l.createdAt || Date.now(), by: l.by || "mom", memo: l.memo || "",
    })),
    growth: s.growth || [],
    schedule: s.schedule || [
      { id: 1, time: "07:00", key: "wake", custom: "", comment: "", done: false }, { id: 2, time: "08:00", key: "breakfast", custom: "", comment: "", done: false },
      { id: 3, time: "10:00", key: "play", custom: "", comment: "", done: false }, { id: 4, time: "12:00", key: "lunch", custom: "", comment: "", done: false },
      { id: 5, time: "13:30", key: "nap", custom: "", comment: "", done: false }, { id: 6, time: "15:30", key: "snack", custom: "", comment: "", done: false },
      { id: 7, time: "17:00", key: "walk", custom: "", comment: "", done: false }, { id: 8, time: "19:00", key: "dinner", custom: "", comment: "", done: false },
      { id: 9, time: "20:00", key: "bath", custom: "", comment: "", done: false }, { id: 10, time: "21:00", key: "bed", custom: "", comment: "", done: false },
    ],
    tasks: (s.tasks || []).map((tk) => ({ id: tk.id || uid(), text: tk.text || "", by: tk.by || "family", due: tk.due || "", done: !!tk.done })),
    mealPlan: s.mealPlan || {},
    shopping: (s.shopping || []).map((x) => ({ id: x.id || uid(), name: x.name || x.text || "", done: !!x.done })),
    fridge: (s.fridge || []).map((x) => ({ id: x.id || uid(), name: x.name || x.text || "", low: !!x.low })),
    events: (s.events || []).map((e) => ({ id: e.id || uid(), title: e.title || "", date: e.date, kind: e.kind || "home", by: e.by || "family", comment: e.comment || "" })),
    documents: (s.documents || []).map((d) => ({ id: d.id || uid(), name: d.name || d.title || "", dtype: d.dtype || "passport", date: d.date, by: d.by || "family" })),
    updatedAt: s.updatedAt || Date.now(),
  };
}

export default function FamilyHub({ serverState, onUpdate, status, aiCall }) {
  // 로컬 미러: 서버에서 새 데이터 오면 동기화 (단, 내가 방금 바꾼 직후는 보호)
  const [data, setData] = useState(() => normalize(serverState));
  const localTouch = useRef(0);
  useEffect(() => {
    if (Date.now() - localTouch.current < 1500) return; // 내 입력 직후 덮어쓰기 방지
    setData(normalize(serverState));
    // eslint-disable-next-line
  }, [serverState]);

  // 변경 헬퍼: 로컬 갱신 + 서버 저장
  const commit = (patch) => {
    localTouch.current = Date.now();
    setData((prev) => {
      const next = { ...prev, ...patch };
      onUpdate(next);
      return next;
    });
  };
  const setField = (key, valueOrFn) => commit({ [key]: typeof valueOrFn === "function" ? valueOrFn(data[key]) : valueOrFn });

  const lang = data.lang; const t = TR[lang] || TR.ko;
  const user = data.user;
  const setLang = (l) => commit({ lang: l });
  const setUser = (u) => commit({ user: u });

  const [tab, setTab] = useState("home");
  const [showSettings, setShowSettings] = useState(false);

  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const roleName = (u) => (u === "mom" ? t.mom : u === "dad" ? t.dad : t.family);
  const nextRole = (u) => (u === "mom" ? "dad" : u === "dad" ? "family" : "mom");
  const dateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const isSameDay = (a, b) => a.toDateString() === b.toDateString();

  // homeOrder
  const homeOrder = data.homeOrder;
  const toggleHome = (k) => setField("homeOrder", (o) => o.map((w) => (w.key === k ? { ...w, on: !w.on } : w)));
  const moveHome = (i, dir) => { const j = i + dir; if (j < 0 || j >= homeOrder.length) return; const a = [...homeOrder]; [a[i], a[j]] = [a[j], a[i]]; setField("homeOrder", a); };
  const wLabel = { heart: t.w_heart, quote: t.w_quote, baby: t.w_baby, schedule: t.w_schedule, upcoming: t.w_upcoming, docs: t.w_docs };

  // kinds
  const kinds = data.kinds;
  const kindOf = (kid) => kinds.find((k) => k.id === kid) || kinds[0];
  const kindLabel = (k) => (k.tkey ? t.kinds[k.tkey] : k.label);
  const nextKind = (kid) => { const i = kinds.findIndex((k) => k.id === kid); return kinds[(i + 1) % kinds.length].id; };
  const delKind = (id) => {
    if (kinds.length <= 1) return;
    const fallback = kinds.find((k) => k.id !== id).id;
    commit({ kinds: kinds.filter((k) => k.id !== id), events: data.events.map((e) => (e.kind === id ? { ...e, kind: fallback } : e)) });
    setNevKind((cur) => (cur === id ? fallback : cur));
  };
  const updKind = (id, patch) => setField("kinds", (ks) => ks.map((k) => (k.id === id ? { ...k, ...patch, tkey: undefined } : k)));
  const [manageKinds, setManageKinds] = useState(false);
  const [kindEditId, setKindEditId] = useState(null);

  // ---- 마음한마디 ----
  const heartNotes = data.heartNotes;
  const setHeartNotes = (fn) => setField("heartNotes", fn);
  const [composeOpen, setComposeOpen] = useState(false);
  const [heartEditId, setHeartEditId] = useState(null);
  const [heartInput, setHeartInput] = useState("");
  const [heartTo, setHeartTo] = useState("dad");
  const recipientOpts = MEMBERS.filter((m) => m !== user);
  const curTo = recipientOpts.includes(heartTo) ? heartTo : recipientOpts[0];
  const [aiBusy, setAiBusy] = useState(false); const [aiPrev, setAiPrev] = useState(null); const [tPreview, setTPreview] = useState(""); const [aiErr, setAiErr] = useState("");
  const todayNotes = heartNotes.filter((n) => isSameDay(new Date(n.ts), now)).sort((a, b) => b.ts - a.ts);
  const heartGroups = (() => { const g = []; [...heartNotes].sort((a, b) => b.ts - a.ts).forEach((n) => { const d = new Date(n.ts); const k = dateKey(d); let grp = g.find((x) => x.k === k); if (!grp) { grp = { k, label: isSameDay(d, now) ? t.today : d.toLocaleDateString(t.locale, { month: "long", day: "numeric" }), notes: [] }; g.push(grp); } grp.notes.push(n); }); return g; })();
  const applyTone = async (tone) => {
    if (!heartInput.trim() || aiBusy) return; setAiBusy(true); setAiErr("");
    const out = await aiCall({ mode: "soften", tone, text: heartInput });
    if (out) { setAiPrev(heartInput); setHeartInput(out); setTPreview(""); } else setAiErr(t.aiErr);
    setAiBusy(false);
  };
  const previewTranslate = async () => {
    if (!heartInput.trim() || aiBusy) return; setAiBusy(true); setAiErr("");
    const out = await aiCall({ mode: "translate", text: heartInput, targetLang: MEMBER_LANG[curTo] });
    if (out) setTPreview(out); else setAiErr(t.aiErr);
    setAiBusy(false);
  };
  const sendHeart = () => {
    if (!heartInput.trim()) return;
    if (heartEditId) setHeartNotes((ns) => ns.map((n) => (n.id === heartEditId ? { ...n, text: heartInput.trim(), translation: tPreview, to: curTo } : n)));
    else setHeartNotes((ns) => [{ id: uid(), from: user, to: curTo, text: heartInput.trim(), translation: tPreview, showT: false, react: {}, ts: Date.now() }, ...ns]);
    setHeartInput(""); setTPreview(""); setAiPrev(null); setAiErr(""); setComposeOpen(false); setHeartEditId(null);
  };
  const openCompose = () => { setHeartEditId(null); setHeartInput(""); setTPreview(""); setAiPrev(null); setAiErr(""); setComposeOpen(true); };
  const openEditHeart = (n) => { setHeartEditId(n.id); setHeartInput(n.text); setHeartTo(n.to); setTPreview(n.translation || ""); setAiPrev(null); setAiErr(""); setComposeOpen(true); };
  const delHeart = (id) => setHeartNotes((ns) => ns.filter((n) => n.id !== id));
  const toggleNoteT = (id) => setHeartNotes((ns) => ns.map((n) => (n.id === id ? { ...n, showT: !n.showT } : n)));
  const reactNote = (id, e) => setHeartNotes((ns) => ns.map((n) => (n.id === id ? { ...n, react: { ...n.react, [e]: (n.react[e] || 0) + 1 } } : n)));

  const dayIdx = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000) % QUOTES.length;
  const quote = QUOTES[dayIdx];

  // ---- 육아 기록 ----
  const babyLogs = data.babyLogs;
  const setBabyLogs = (fn) => setField("babyLogs", fn);
  const addLog = (type) => setBabyLogs((ls) => [{ id: uid(), type, ts: Date.now(), by: user, memo: "" }, ...ls]);
  const [logPick, setLogPick] = useState(false);
  const pickLog = (type) => { addLog(type); setLogPick(false); };
  const updLog = (id, patch) => setBabyLogs((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const delLog = (id) => { setBabyLogs((ls) => ls.filter((l) => l.id !== id)); setEditLogId(null); };
  const sortedLogs = [...babyLogs].sort((a, b) => b.ts - a.ts);
  const lastOfTypes = (types) => sortedLogs.find((l) => types.includes(l.type));
  const logGroups = (() => { const g = []; sortedLogs.forEach((l) => { const d = new Date(l.ts); const k = dateKey(d); let grp = g.find((x) => x.k === k); if (!grp) { grp = { k, label: isSameDay(d, now) ? t.today : d.toLocaleDateString(t.locale, { month: "short", day: "numeric" }), logs: [] }; g.push(grp); } grp.logs.push(l); }); return g; })();
  const [editLogId, setEditLogId] = useState(null);
  const editingLog = babyLogs.find((l) => l.id === editLogId);
  const toTimeInput = (ts) => { const d = new Date(ts); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  const setLogTime = (id, val) => { const [h, m] = val.split(":"); const d = new Date(babyLogs.find((l) => l.id === id).ts); d.setHours(+h, +m); updLog(id, { ts: d.getTime() }); };
  const sinceText = (ts) => { if (!ts) return t.noRec; const m = Math.floor((Date.now() - ts) / 60000); if (m < 1) return t.justNow; if (m < 60) return `${m}${lang === "ko" ? "" : " "}${t.min}`; return `${Math.floor(m / 60)}${lang === "ko" ? "" : " "}${t.hr}`; };
  const timeText = (ts) => new Date(ts).toLocaleTimeString(t.locale, { hour: "2-digit", minute: "2-digit" });

  // ---- 성장 기록 ----
  const growth = data.growth;
  const [gDate, setGDate] = useState(""); const [gW, setGW] = useState(""); const [gH, setGH] = useState("");
  const addGrowth = () => { if (gDate && (gW || gH)) { setField("growth", (g) => [...g, { id: uid(), date: gDate, weight: gW, height: gH }]); setGDate(""); setGW(""); setGH(""); } };
  const updGrowth = (id, patch) => setField("growth", (g) => g.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const delGrowth = (id) => setField("growth", (g) => g.filter((x) => x.id !== id));
  const sortedGrowth = [...growth].sort((a, b) => new Date(b.date) - new Date(a.date));

  // ---- 일과표 ----
  const schedule = data.schedule;
  const [editId, setEditId] = useState(null);
  const scLabel = (it) => it.custom || t.sc[it.key];
  const updSc = (id, patch) => setField("schedule", (sc) => sc.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  // ---- 할 일 ----
  const tasks = data.tasks;
  const taskName = (tk) => tk.text;
  const sortedTasks = [...tasks].sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0));
  const updTask = (id, patch) => setField("tasks", (ts2) => ts2.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const delTask = (id) => { setField("tasks", (ts2) => ts2.filter((x) => x.id !== id)); setTaskModal(null); };
  const [taskModal, setTaskModal] = useState(null);
  const [tmText, setTmText] = useState(""); const [tmBy, setTmBy] = useState("mom"); const [tmDue, setTmDue] = useState("");
  const openAddTask = () => { setTmText(""); setTmBy(user); setTmDue(""); setTaskModal({ mode: "add" }); };
  const openEditTask = (tk) => { setTmText(taskName(tk)); setTmBy(tk.by); setTmDue(tk.due); setTaskModal({ mode: "edit", id: tk.id }); };
  const saveTask = () => { if (!tmText.trim()) return; if (taskModal.mode === "add") setField("tasks", (ts2) => [...ts2, { id: uid(), text: tmText.trim(), by: tmBy, due: tmDue, done: false }]); else updTask(taskModal.id, { text: tmText.trim(), by: tmBy, due: tmDue }); setTaskModal(null); };

  const weekDays = (() => { const b = new Date(); const mon = new Date(b); mon.setDate(b.getDate() - ((b.getDay() + 6) % 7)); return [...Array(7)].map((_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return d; }); })();
  const mealPlan = data.mealPlan;
  const mealVal = (k) => mealPlan[k] || "";
  const setMeal = (k, v) => setField("mealPlan", (mp) => ({ ...mp, [k]: v }));

  // ---- 장보기 / 냉장고 ----
  const shopping = data.shopping;
  const [shopInput, setShopInput] = useState("");
  const sortedShopping = [...shopping].sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0));
  const addShop = () => { if (shopInput.trim()) { setField("shopping", (sh) => [...sh, { id: uid(), name: shopInput.trim(), done: false }]); setShopInput(""); } };
  const pushShop = (name) => setField("shopping", (sh) => [...sh, { id: uid(), name, done: false }]);
  const updShop = (id, patch) => setField("shopping", (sh) => sh.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const delShop = (id) => setField("shopping", (sh) => sh.filter((s) => s.id !== id));
  const fridge = data.fridge;
  const [fridgeInput, setFridgeInput] = useState("");
  const addFridge = () => { if (fridgeInput.trim()) { setField("fridge", (fr) => [...fr, { id: uid(), name: fridgeInput.trim(), low: false }]); setFridgeInput(""); } };
  const updFridge = (id, patch) => setField("fridge", (fr) => fr.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const delFridge = (id) => setField("fridge", (fr) => fr.filter((f) => f.id !== id));

  // ---- 일정 + 문서 ----
  const eventList = data.events;
  const evTitle = (e) => e.title;
  const updEvent = (id, patch) => setField("events", (es) => es.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const delEvent = (id) => setField("events", (es) => es.filter((e) => e.id !== id));
  const sortedEvents = [...eventList].sort((a, b) => new Date(a.date) - new Date(b.date));
  const documents = data.documents;
  const docName = (d) => d.name;
  const sortedDocs = [...documents].sort((a, b) => new Date(a.date) - new Date(b.date));
  const updDoc = (id, patch) => setField("documents", (ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  const delDoc = (id) => setField("documents", (ds) => ds.filter((d) => d.id !== id));
  const nextDocType = (dt) => DOCTYPES[(DOCTYPES.indexOf(dt) + 1) % DOCTYPES.length];
  const dayDiff = (ds) => { const d = new Date(ds + "T00:00:00"); const td = new Date(); td.setHours(0, 0, 0, 0); return Math.round((d - td) / 86400000); };
  const docColor = (ds) => { const n = dayDiff(ds); return n <= 30 ? "text-rose-500" : n <= 90 ? "text-amber-500" : "text-teal-500"; };
  const dday = (ds) => { const diff = dayDiff(ds); if (diff === 0) return lang === "ko" ? "D-DAY" : lang === "es" ? "Hoy" : "Today"; if (diff > 0) return lang === "ko" ? `D-${diff}` : lang === "es" ? `en ${diff}d` : `in ${diff}d`; return lang === "ko" ? `D+${-diff}` : lang === "es" ? `hace ${-diff}d` : `${-diff}d ago`; };

  // 달력
  const [calMonth, setCalMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [dayModal, setDayModal] = useState(null);
  const calCells = (() => { const y = calMonth.getFullYear(), m = calMonth.getMonth(); const start = new Date(y, m, 1).getDay(); const dim = new Date(y, m + 1, 0).getDate(); const arr = []; for (let i = 0; i < start; i++) arr.push(null); for (let d = 1; d <= dim; d++) arr.push(new Date(y, m, d)); return arr; })();
  const eventsOn = (ds) => eventList.filter((e) => e.date === ds);
  const docsOn = (ds) => documents.filter((d) => d.date === ds);
  const dotColorsOn = (ds) => [...new Set(eventsOn(ds).map((e) => kindOf(e.kind).color))];
  const [nevTitle, setNevTitle] = useState(""); const [nevKind, setNevKind] = useState("home");
  const [ndocName, setNdocName] = useState(""); const [ndocType, setNdocType] = useState("residencia");
  const [addingKind, setAddingKind] = useState(false); const [newKindName, setNewKindName] = useState(""); const [newKindColor, setNewKindColor] = useState("emerald"); const [newKindEmoji, setNewKindEmoji] = useState("📌");
  const addEvOnDay = () => { if (nevTitle.trim() && dayModal) { setField("events", (es) => [...es, { id: uid(), title: nevTitle.trim(), date: dayModal, kind: nevKind, by: user, comment: "" }]); setNevTitle(""); } };
  const addDocOnDay = () => { if (ndocName.trim() && dayModal) { setField("documents", (ds) => [...ds, { id: uid(), name: ndocName.trim(), dtype: ndocType, date: dayModal, by: user }]); setNdocName(""); } };
  const saveKind = () => { if (newKindName.trim()) { const id = "k" + uid(); setField("kinds", (ks) => [...ks, { id, label: newKindName.trim(), color: newKindColor, emoji: newKindEmoji }]); setNevKind(id); setNewKindName(""); setNewKindColor("emerald"); setNewKindEmoji("📌"); setAddingKind(false); } };
  const openDay = (ds) => { setNevTitle(""); setNdocName(""); setAddingKind(false); setManageKinds(false); setKindEditId(null); setDayModal(ds); };
  const jumpToDay = (ds) => { const d = new Date(ds + "T00:00:00"); setCalMonth(new Date(d.getFullYear(), d.getMonth(), 1)); setTab("cal"); openDay(ds); };

  const tabs = [{ id: "home", icon: Home }, { id: "baby", icon: Baby }, { id: "shop", icon: ShoppingCart }, { id: "board", icon: MessageCircle }, { id: "cal", icon: Calendar }];
  const ByTag = ({ by }) => { const c = by === "mom" ? "bg-teal-100 text-teal-700" : by === "dad" ? "bg-sky-100 text-sky-700" : "bg-amber-100 text-amber-700"; return <span className={`text-xs px-2 py-0.5 rounded-full ${c}`}>{roleName(by)}</span>; };
  const ownerBar = (by) => (by === "mom" ? "border-l-teal-300" : by === "dad" ? "border-l-sky-300" : "border-l-amber-300");
  const Section = ({ children }) => <div className="border border-gray-100 rounded-2xl p-4 shadow-sm" style={{ background: BG_CARD }}>{children}</div>;
  const homeCards = [{ types: ["feeding"], icon: Milk, c: "bg-teal-100 text-teal-600", label: t.act.feeding }, { types: ["nap", "bed"], icon: Moon, c: "bg-violet-100 text-violet-500", label: t.sleepCat }, { types: ["diaper"], icon: Droplet, c: "bg-amber-100 text-amber-600", label: t.act.diaper }];

  const NoteCard = ({ n, big }) => (
    <div className="border rounded-2xl p-3.5" style={{ background: "rgba(255,255,255,0.85)", borderColor: HEART_BORDER }}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5"><ByTag by={n.from} /><span className="text-gray-300 text-xs">→</span><ByTag by={n.to} /></div>
        <div className="flex items-center gap-2.5 text-gray-300"><button onClick={() => openEditHeart(n)}><Edit3 size={13} /></button><button onClick={() => delHeart(n.id)}><Trash2 size={13} /></button></div>
      </div>
      <p className={`text-gray-800 ${big ? "text-[15px] leading-relaxed" : "text-sm"}`}>{n.showT && n.translation ? n.translation : n.text}</p>
      {n.translation && <button onClick={() => toggleNoteT(n.id)} className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#7E6FB0" }}><Languages size={11} /> {n.showT ? t.showOrig : t.showTrans}</button>}
      <div className="flex gap-1.5 mt-2.5">{REACTS.map((e) => (<button key={e} onClick={() => reactNote(n.id, e)} className="text-sm rounded-full px-2 py-0.5 bg-white border active:scale-95" style={{ borderColor: HEART_BORDER }}>{e}{n.react[e] ? <span className="text-xs text-gray-400 ml-0.5">{n.react[e]}</span> : ""}</button>))}</div>
    </div>
  );

  const ScheduleList = () => (
    <Section>
      <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1 ff-title"><Clock size={16} style={{ color: TEAL }} /> {t.scheduleTitle}</p>
      <div className="space-y-1.5">
        {schedule.map((it) => (
          <div key={it.id} className={`rounded-xl border ${it.done ? "bg-teal-50 border-teal-100" : "border-gray-100"} p-2.5`}>
            <div className="flex items-center gap-2">
              <button onClick={() => updSc(it.id, { done: !it.done })} className="w-5 h-5 rounded-md border flex items-center justify-center shrink-0" style={it.done ? { background: TEAL, borderColor: TEAL } : { borderColor: "#cbd5d8" }}>{it.done && <Check size={13} className="text-white" />}</button>
              <span className="text-xs font-bold text-gray-400 w-11 shrink-0">{it.time}</span>
              <span className={`text-sm flex-1 ${it.done ? "line-through text-gray-400" : "text-gray-700"}`}>{scLabel(it)}</span>
              <button onClick={() => setEditId(editId === it.id ? null : it.id)} className="text-gray-300 shrink-0"><Edit3 size={15} /></button>
            </div>
            {it.comment && editId !== it.id && <p className="text-xs text-amber-600 mt-1 ml-7">💬 {it.comment}</p>}
            {editId === it.id && (<div className="mt-2 ml-7 space-y-1.5"><input value={it.custom || ""} onChange={(e) => updSc(it.id, { custom: e.target.value })} placeholder={t.sc[it.key]} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-teal-300" /><input value={it.comment} onChange={(e) => updSc(it.id, { comment: e.target.value })} placeholder={t.commentPlaceholder} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-amber-300" /></div>)}
          </div>
        ))}
      </div>
    </Section>
  );

  const renderWidget = (key) => {
    if (key === "heart") return (
      <div style={{ backgroundImage: HEART_GRAD, border: `1px solid ${HEART_BORDER}`, borderRadius: 24, padding: 16 }}>
        <div className="flex items-center justify-between mb-3"><p className="text-sm font-bold flex items-center gap-1.5 ff-title" style={{ color: HEART_TXT }}><Heart size={16} color={HEART_ICON} fill={HEART_ICON} /> {t.heartTitle}</p><button onClick={openCompose} className="w-7 h-7 rounded-full flex items-center justify-center text-white active:scale-95" style={{ background: TEAL }}><Plus size={16} /></button></div>
        {todayNotes.length ? <div className="space-y-2.5">{todayNotes.map((n) => <NoteCard key={n.id} n={n} big />)}</div>
          : <button onClick={openCompose} className="w-full text-center py-6 rounded-2xl bg-white/60 active:scale-[0.99]"><Heart size={22} className="mx-auto mb-2" style={{ color: HEART_ICON }} /><p className="text-sm" style={{ color: "#7E908E" }}>{t.heartEmpty}</p></button>}
      </div>
    );
    if (key === "quote") return (<div className="bg-violet-50 border border-violet-100 rounded-2xl p-4"><p className="text-xs font-bold text-violet-400 mb-1 flex items-center gap-1 ff-title"><Quote size={13} /> {t.quoteTitle}</p><p className="text-sm text-gray-700 italic">"{quote[lang]}"</p><p className="text-xs text-gray-400 text-right mt-1">— {quote.author}</p></div>);
    if (key === "baby") return (<div className="grid grid-cols-3 gap-3">{homeCards.map((c, i) => (<div key={i} className="border border-gray-100 rounded-2xl p-3 text-center shadow-sm" style={{ background: BG_CARD }}><div className={`w-9 h-9 ${c.c} rounded-full flex items-center justify-center mx-auto mb-1`}><c.icon size={18} /></div><p className="text-xs text-gray-400">{t.last} {c.label}</p><p className="text-sm font-bold text-gray-700">{sinceText(lastOfTypes(c.types)?.ts)}</p></div>))}</div>);
    if (key === "schedule") return <ScheduleList />;
    if (key === "docs") { const urgent = sortedDocs.filter((d) => dayDiff(d.date) <= 90); return urgent.length ? (<Section><p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1 ff-title"><Bell size={15} className="text-amber-500" /> {t.docsHomeTitle}</p>{urgent.map((d) => (<button key={d.id} onClick={() => jumpToDay(d.date)} className="w-full flex items-center justify-between py-1.5"><span className="text-sm text-gray-600 flex items-center gap-1.5"><span>{DOC[d.dtype]}</span> {docName(d)}</span><span className={`text-xs font-bold ${docColor(d.date)}`}>{dday(d.date)}</span></button>))}</Section>) : null; }
    if (key === "upcoming") return (<Section><p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1 ff-title"><Clock size={16} style={{ color: TEAL }} /> {t.w_upcoming}</p>{sortedEvents.slice(0, 3).map((e) => (<button key={e.id} onClick={() => jumpToDay(e.date)} className="w-full flex items-center justify-between py-1.5"><span className="text-sm text-gray-600">{evTitle(e)}</span><span className={`text-xs font-bold ${colorOf(kindOf(e.kind).color).text}`}>{dday(e.date)}</span></button>))}{sortedEvents.length === 0 && <p className="text-xs text-gray-400 text-center py-2">{t.noItems}</p>}</Section>);
    return null;
  };

  const SyncBadge = () => (
    <span className="flex items-center gap-1 text-[11px]" style={{ color: status === "error" ? "#e05f70" : "rgba(255,255,255,0.85)" }}>
      {status === "error" ? <CloudOff size={12} /> : <Cloud size={12} />}
      {status === "saving" ? t.saving : status === "error" ? t.syncErr : t.saved}
    </span>
  );

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#EDE6DD" }}>
      <div className="fh-app w-full max-w-md min-h-screen flex flex-col shadow-xl relative" style={{ background: BG_PAGE }}>
        <div className="text-white px-5 pt-4 pb-4" style={{ backgroundImage: HEADER_GRAD }}>
          <div className="flex items-center justify-between">
            <div><div className="flex items-center gap-2"><p className="text-xs opacity-90">{t.appName}</p><SyncBadge /></div><h1 className="text-base font-bold ff-title">{now.toLocaleDateString(t.locale, { month: "long", day: "numeric", weekday: "long" })}</h1></div>
            <div className="flex items-center gap-1">{["ko", "es", "en"].map((l) => (<button key={l} onClick={() => setLang(l)} className={`text-xs px-2 py-1 rounded-md uppercase font-bold transition ${lang === l ? "bg-white" : "bg-white/20 text-white"}`} style={lang === l ? { color: TEAL_D } : {}}>{l === "ko" ? "한" : l}</button>))}<button onClick={() => setShowSettings(true)} className="ml-1 bg-white/20 rounded-md p-1.5"><Settings size={16} /></button></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
          {tab === "home" && homeOrder.filter((w) => w.on).map((w) => { const el = renderWidget(w.key); return el ? <div key={w.key}>{el}</div> : null; })}

          {/* 육아 */}
          {tab === "baby" && (<>
            <Section>
              <div className="flex items-center justify-between mb-3"><p className="text-sm font-bold text-gray-700 ff-title">{t.timeline}</p><button onClick={() => setLogPick(true)} className="w-7 h-7 rounded-full text-white flex items-center justify-center active:scale-95" style={{ background: TEAL }}><Plus size={16} /></button></div>
              <div className="space-y-3">
                {logGroups.map((grp) => (
                  <div key={grp.k}>
                    <p className="text-xs font-bold text-gray-400 mb-1.5 px-0.5">{grp.label}</p>
                    <div className="space-y-2">
                      {grp.logs.map((l) => (
                        <div key={l.id} className="rounded-xl border border-gray-100 p-2.5">
                          <div className="flex items-center justify-between">
                            <button onClick={() => setEditLogId(l.id)} className="flex items-center gap-2 min-w-0"><span>{(ACT[l.type] || ACT.feeding).emoji}</span><span className="text-sm text-gray-700">{t.act[l.type] || l.type}</span><ByTag by={l.by} /></button>
                            <div className="flex items-center gap-2 shrink-0 ml-2"><span className="text-xs text-gray-400">{timeText(l.ts)} · {sinceText(l.ts)}</span><button onClick={() => setEditLogId(l.id)} className="text-gray-300"><Edit3 size={14} /></button></div>
                          </div>
                          <input value={l.memo} onChange={(e) => updLog(l.id, { memo: e.target.value })} placeholder={t.memoPh} className="w-full mt-1.5 text-xs text-gray-600 outline-none bg-transparent border-b border-transparent focus:border-teal-200 py-0.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {logGroups.length === 0 && <p className="text-xs text-gray-400 text-center py-3">{t.noRec}</p>}
              </div>
            </Section>

            <Section>
              <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1 ff-title"><Syringe size={16} style={{ color: TEAL }} /> {t.health}</p>
              {sortedEvents.filter((e) => e.kind === "vaccine").map((e) => (<button key={e.id} onClick={() => jumpToDay(e.date)} className="w-full flex items-center justify-between py-1.5"><span className="text-sm text-gray-600 flex items-center gap-1.5"><Syringe size={13} /> {evTitle(e)}</span><span className="text-xs font-bold text-teal-500">{dday(e.date)}</span></button>))}
              {sortedEvents.filter((e) => e.kind === "vaccine").length === 0 && <p className="text-xs text-gray-400 text-center py-2">{t.noItems}</p>}
            </Section>

            <Section>
              <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1 ff-title"><TrendingUp size={16} style={{ color: TEAL }} /> {t.growthTitle}</p>
              <div className="flex gap-1.5 mb-3">
                <input type="date" value={gDate} onChange={(e) => setGDate(e.target.value)} className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-500 outline-none focus:border-teal-300" />
                <input value={gW} onChange={(e) => setGW(e.target.value)} placeholder={t.weight} inputMode="decimal" className="w-14 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center outline-none focus:border-teal-300" />
                <input value={gH} onChange={(e) => setGH(e.target.value)} placeholder={t.height} inputMode="decimal" className="w-14 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center outline-none focus:border-teal-300" />
                <button onClick={addGrowth} className="text-white rounded-lg px-3 active:scale-95" style={{ background: TEAL }}><Plus size={18} /></button>
              </div>
              <div className="space-y-1.5">
                {sortedGrowth.length === 0 && <p className="text-xs text-gray-400 text-center py-2">{t.noRec}</p>}
                {sortedGrowth.map((g) => (
                  <div key={g.id} className="flex items-center gap-2 rounded-xl border border-gray-100 p-2">
                    <input type="date" value={g.date} onChange={(e) => updGrowth(g.id, { date: e.target.value })} className="text-xs text-gray-500 bg-transparent outline-none flex-1 min-w-0" />
                    <div className="flex items-baseline gap-0.5"><input value={g.weight} onChange={(e) => updGrowth(g.id, { weight: e.target.value })} className="w-11 text-sm text-right text-gray-700 bg-transparent outline-none border-b border-transparent focus:border-teal-200" /><span className="text-xs text-gray-400">kg</span></div>
                    <div className="flex items-baseline gap-0.5"><input value={g.height} onChange={(e) => updGrowth(g.id, { height: e.target.value })} className="w-11 text-sm text-right text-gray-700 bg-transparent outline-none border-b border-transparent focus:border-teal-200" /><span className="text-xs text-gray-400">cm</span></div>
                    <button onClick={() => delGrowth(g.id)} className="text-gray-300 shrink-0"><X size={16} /></button>
                  </div>
                ))}
              </div>
            </Section>
          </>)}

          {/* 살림 */}
          {tab === "shop" && (<>
            <Section>
              <div className="flex items-center justify-between mb-3"><p className="text-sm font-bold text-gray-700 flex items-center gap-1 ff-title"><CheckSquare size={16} style={{ color: TEAL }} /> {t.tasksTitle}</p><button onClick={openAddTask} className="w-7 h-7 rounded-full text-white flex items-center justify-center active:scale-95" style={{ background: TEAL }}><Plus size={16} /></button></div>
              {sortedTasks.length === 0 && <p className="text-xs text-gray-400 text-center py-3">{t.noTasks}</p>}
              <div className="space-y-1">{sortedTasks.map((tk) => (<div key={tk.id} className="flex items-center gap-2 py-1"><button onClick={() => updTask(tk.id, { done: !tk.done })} className="w-5 h-5 rounded-md border flex items-center justify-center shrink-0" style={tk.done ? { background: TEAL, borderColor: TEAL } : { borderColor: "#cbd5d8" }}>{tk.done && <Check size={13} className="text-white" />}</button><button onClick={() => openEditTask(tk)} className={`flex-1 text-left text-sm ${tk.done ? "line-through text-gray-300" : "text-gray-700"}`}>{taskName(tk)}</button>{tk.due && <span className="text-xs font-bold text-teal-500 shrink-0">{dday(tk.due)}</span>}<button onClick={() => updTask(tk.id, { by: nextRole(tk.by) })} className="shrink-0"><ByTag by={tk.by} /></button><button onClick={() => openEditTask(tk)} className="text-gray-300 shrink-0"><Edit3 size={14} /></button></div>))}</div>
            </Section>

            <Section>
              <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1 ff-title"><Utensils size={16} className="text-amber-500" /> {t.mealTitle}</p>
              <div className="space-y-1">{weekDays.map((d) => { const k = dateKey(d); const today = isSameDay(d, now); return (<div key={k} className={`flex items-center gap-2 rounded-lg px-2 py-1 ${today ? "bg-teal-50" : ""}`}><span className={`text-xs font-bold w-9 shrink-0 ${today ? "text-teal-600" : "text-gray-400"}`}>{d.toLocaleDateString(t.locale, { weekday: "short" })}</span><input value={mealVal(k)} onChange={(e) => setMeal(k, e.target.value)} placeholder={t.mealPh} className="flex-1 text-sm outline-none bg-transparent border-b border-transparent focus:border-amber-200 py-0.5" />{mealVal(k) && <button onClick={() => pushShop(`${mealVal(k)} ${t.ingSuffix}`)} className="text-gray-300 shrink-0"><ShoppingCart size={14} /></button>}</div>); })}</div>
            </Section>

            <Section>
              <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1 ff-title"><ShoppingCart size={16} style={{ color: TEAL }} /> {t.shoppingList}</p>
              <div className="flex gap-2 mb-3"><input value={shopInput} onChange={(e) => setShopInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addShop()} placeholder={t.addItem} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-300" /><button onClick={addShop} className="text-white rounded-lg px-3 active:scale-95" style={{ background: TEAL }}><Plus size={18} /></button></div>
              <div className="space-y-1">{sortedShopping.map((s) => (<div key={s.id} className="flex items-center gap-2 py-1"><button onClick={() => updShop(s.id, { done: !s.done })} className="w-5 h-5 rounded-md border flex items-center justify-center shrink-0" style={s.done ? { background: TEAL, borderColor: TEAL } : { borderColor: "#cbd5d8" }}>{s.done && <Check size={13} className="text-white" />}</button><input value={s.name} onChange={(e) => updShop(s.id, { name: e.target.value })} className={`flex-1 text-sm outline-none bg-transparent ${s.done ? "line-through text-gray-300" : "text-gray-700"}`} /><button onClick={() => delShop(s.id)} className="text-gray-300"><X size={16} /></button></div>))}</div>
            </Section>

            <Section>
              <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1 ff-title"><Refrigerator size={16} className="text-sky-400" /> {t.fridge}</p>
              <div className="flex gap-2 mb-3"><input value={fridgeInput} onChange={(e) => setFridgeInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addFridge()} placeholder={t.addIng} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-300" /><button onClick={addFridge} className="bg-sky-400 text-white rounded-lg px-3 active:scale-95"><Plus size={18} /></button></div>
              <div className="space-y-1">{fridge.map((f) => (<div key={f.id} className="flex items-center gap-2 py-1"><button onClick={() => updFridge(f.id, { low: !f.low })} className={`w-2.5 h-2.5 rounded-full shrink-0 ${f.low ? "bg-amber-400" : "bg-gray-200"}`} /><input value={f.name} onChange={(e) => updFridge(f.id, { name: e.target.value })} className={`flex-1 text-sm outline-none bg-transparent ${f.low ? "text-amber-600 font-medium" : "text-gray-700"}`} /><button onClick={() => pushShop(f.name)} className="text-xs bg-teal-50 text-teal-600 rounded-full px-2 py-0.5 shrink-0">{t.toShop}</button><button onClick={() => delFridge(f.id)} className="text-gray-300 shrink-0"><X size={16} /></button></div>))}</div>
            </Section>
          </>)}

          {/* 우리 이야기 */}
          {tab === "board" && (<>
            <button onClick={openCompose} className="w-full flex items-center justify-center gap-1.5 text-white rounded-2xl py-3 font-bold active:scale-[0.99] ff-title" style={{ background: TEAL }}><Plus size={17} /> {t.addNote}</button>
            {heartGroups.map((grp) => (
              <div key={grp.k} className="space-y-2">
                <p className="text-xs font-bold text-gray-400 px-1">{grp.label}</p>
                {grp.notes.map((n) => <NoteCard key={n.id} n={n} />)}
              </div>
            ))}
            {heartGroups.length === 0 && <p className="text-xs text-gray-400 text-center py-6">{t.heartEmpty}</p>}
          </>)}

          {/* 일정 */}
          {tab === "cal" && (<>
            <Section>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1))} className="text-gray-400 p-1"><ChevronLeft size={22} /></button>
                <span className="text-base font-bold text-gray-700 ff-title">{calMonth.toLocaleDateString(t.locale, { year: "numeric", month: "long" })}</span>
                <button onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1))} className="text-gray-400 p-1"><ChevronRight size={22} /></button>
              </div>
              <div className="grid grid-cols-7 mb-1.5">{t.weekdays.map((w, i) => (<span key={i} className={`text-center text-xs font-bold ${i === 0 ? "text-rose-300" : "text-gray-400"}`}>{w}</span>))}</div>
              <div className="grid grid-cols-7 gap-1">
                {calCells.map((c, i) => {
                  if (!c) return <div key={i} />;
                  const ds = dateKey(c); const cols = dotColorsOn(ds); const dc = docsOn(ds); const today = isSameDay(c, now);
                  return (
                    <button key={i} onClick={() => openDay(ds)} className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 active:scale-95 ${today ? "bg-teal-50 ring-1 ring-teal-300" : "hover:bg-gray-50"}`}>
                      <span className={`text-base ${today ? "font-bold text-teal-600" : "text-gray-700"}`}>{c.getDate()}</span>
                      <div className="flex gap-0.5 h-1.5">{cols.slice(0, 3).map((cl, idx) => <span key={idx} className={`w-1.5 h-1.5 rounded-full ${colorOf(cl).chip}`} />)}{dc.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}</div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-4 justify-center flex-wrap">{kinds.map((k) => (<span key={k.id} className="flex items-center gap-1 text-[11px] text-gray-400"><span className={`w-1.5 h-1.5 rounded-full ${colorOf(k.color).chip}`} /> {kindLabel(k)}</span>))}<span className="flex items-center gap-1 text-[11px] text-gray-400"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {t.docsTitle}</span></div>
            </Section>

            {(() => {
              const agenda = [
                ...eventList.map((e) => { const k = kindOf(e.kind); return { k: "e" + e.id, date: e.date, name: evTitle(e), by: e.by, isDoc: false, emoji: k.emoji, col: colorOf(k.color).text }; }),
                ...documents.map((d) => ({ k: "d" + d.id, date: d.date, name: docName(d), by: d.by, isDoc: true, emoji: DOC[d.dtype], col: docColor(d.date) })),
              ].filter((x) => dayDiff(x.date) >= 0).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 10);
              return (
                <Section>
                  <p className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1 ff-title"><Clock size={16} style={{ color: TEAL }} /> {t.w_upcoming}</p>
                  {agenda.length ? agenda.map((x) => (
                    <button key={x.k} onClick={() => jumpToDay(x.date)} className="w-full flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2.5 min-w-0"><span className="text-lg shrink-0">{x.emoji}</span><div className="text-left min-w-0"><p className="text-sm text-gray-700 truncate">{x.name}</p><p className="text-xs text-gray-400">{new Date(x.date + "T00:00:00").toLocaleDateString(t.locale, { month: "short", day: "numeric" })}</p></div></div>
                      <div className="flex items-center gap-2 shrink-0"><ByTag by={x.by} /><span className={`text-sm font-bold ${x.col}`}>{dday(x.date)}</span></div>
                    </button>
                  )) : <p className="text-xs text-gray-400 text-center py-3">{t.noItems}</p>}
                </Section>
              );
            })()}
          </>)}
        </div>

        {/* ===== 모달들 ===== */}

        {logPick && (
          <div className="absolute inset-0 bg-black/30 flex items-end z-40" onClick={() => setLogPick(false)}>
            <div className="w-full rounded-t-3xl p-5 space-y-3" style={{ background: BG_CARD }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between"><h2 className="text-base font-bold text-gray-800 flex items-center gap-2 ff-title"><Plus size={17} /> {t.quickLog}</h2><button onClick={() => setLogPick(false)} className="text-gray-400"><X size={20} /></button></div>
              {CATS.map((cat) => (<div key={cat.id}><p className="text-xs font-bold text-gray-400 mb-1.5">{cat.emoji} {t.cat[cat.id]}</p><div className="flex flex-wrap gap-2 mb-2">{Object.keys(ACT).filter((k) => ACT[k].cat === cat.id).map((k) => (<button key={k} onClick={() => pickLog(k)} className={`${cat.chip} border rounded-full px-3 py-2 text-sm font-medium flex items-center gap-1 active:scale-95 transition`}><span>{ACT[k].emoji}</span> {t.act[k]}</button>))}</div></div>))}
            </div>
          </div>
        )}

        {composeOpen && (
          <div className="absolute inset-0 bg-black/30 flex items-end z-40" onClick={() => setComposeOpen(false)}>
            <div className="w-full rounded-t-3xl p-5" style={{ backgroundImage: "linear-gradient(135deg,#EFF6F4,#F4EFF7)" }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3"><h2 className="text-base font-bold flex items-center gap-1.5 ff-title" style={{ color: HEART_TXT }}><Heart size={17} color={HEART_ICON} fill={HEART_ICON} /> {t.heartTitle}</h2><button onClick={() => setComposeOpen(false)} className="text-gray-400"><X size={20} /></button></div>
              <div className="flex items-center gap-2 mb-2"><span className="text-xs" style={{ color: "#7E908E" }}>{t.toLabel}</span>{recipientOpts.map((r) => (<button key={r} onClick={() => setHeartTo(r)} className={`text-xs px-2.5 py-1 rounded-full font-bold ${curTo === r ? "text-white" : "text-gray-500 bg-white/70"}`} style={curTo === r ? { background: TEAL } : {}}>{roleName(r)}</button>))}</div>
              <textarea value={heartInput} onChange={(e) => setHeartInput(e.target.value)} placeholder={t.heartPh} rows={3} autoFocus className="w-full bg-white/85 border rounded-xl px-3 py-2 text-sm outline-none resize-none" style={{ borderColor: HEART_BORDER }} />
              <div className="flex items-center gap-1 mt-2 mb-1.5"><Sparkles size={12} color={TEAL} /><span className="text-xs font-bold" style={{ color: HEART_TXT }}>{t.soften}</span></div>
              <div className="flex flex-wrap gap-1.5 mb-2">{TONES.map((tn) => (<button key={tn} onClick={() => applyTone(tn)} disabled={aiBusy} className="text-xs px-2.5 py-1 rounded-full bg-white/85 border disabled:opacity-40 active:scale-95" style={{ borderColor: HEART_BORDER, color: HEART_TXT }}>{t.tones[tn]}</button>))}</div>
              {aiPrev != null && <div className="flex items-center gap-2 mb-2 text-xs" style={{ color: HEART_TXT }}><Sparkles size={11} /> {t.aiDone} <button onClick={() => { setHeartInput(aiPrev); setAiPrev(null); }} className="underline">{t.revert}</button></div>}
              {aiErr && <p className="text-xs text-rose-400 mb-2">{aiErr}</p>}
              {tPreview && <div className="bg-white/85 border rounded-xl px-3 py-2 mb-2 text-sm text-gray-600" style={{ borderColor: "#D9D2E4" }}><span className="text-[10px] font-bold text-violet-400 flex items-center gap-1 mb-0.5"><Languages size={11} /> {LANGNAME[MEMBER_LANG[curTo]]}</span>{tPreview}</div>}
              <div className="flex gap-2 mt-1">
                <button onClick={previewTranslate} disabled={aiBusy} className="flex-1 flex items-center justify-center gap-1 bg-white/85 border rounded-xl py-2.5 text-xs font-bold disabled:opacity-40 active:scale-95" style={{ borderColor: "#D9D2E4", color: "#7E6FB0" }}><Languages size={14} /> {aiBusy ? t.aiBusy : t.translateBtn}</button>
                <button onClick={sendHeart} className="flex items-center justify-center gap-1 text-white rounded-xl px-6 py-2.5 text-sm font-bold active:scale-95 ff-title" style={{ background: TEAL }}><Send size={14} /> {heartEditId ? t.save : t.send}</button>
              </div>
            </div>
          </div>
        )}

        {taskModal && (
          <div className="absolute inset-0 bg-black/30 flex items-end z-40" onClick={() => setTaskModal(null)}>
            <div className="w-full rounded-t-3xl p-5 space-y-3" style={{ background: BG_CARD }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between"><h2 className="text-base font-bold text-gray-800 flex items-center gap-2 ff-title"><CheckSquare size={17} /> {t.taskTitle}</h2><button onClick={() => setTaskModal(null)} className="text-gray-400"><X size={20} /></button></div>
              <input value={tmText} onChange={(e) => setTmText(e.target.value)} placeholder={t.taskPh} autoFocus className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-300" />
              {taskModal.mode === "add" && <div className="flex flex-wrap gap-1.5">{CHORES.map((k) => (<button key={k} onClick={() => setTmText(t.chore[k])} className="bg-teal-50 text-teal-600 border border-teal-100 rounded-full px-2.5 py-1 text-xs active:scale-95">{t.chore[k]}</button>))}</div>}
              <div className="flex gap-2"><div className="flex bg-gray-100 rounded-lg p-0.5">{["mom", "dad", "family"].map((u) => (<button key={u} onClick={() => setTmBy(u)} className={`text-xs px-2.5 py-1.5 rounded-md ${tmBy === u ? "bg-white shadow font-bold text-teal-600" : "text-gray-500"}`}>{roleName(u)}</button>))}</div><input type="date" value={tmDue} onChange={(e) => setTmDue(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none text-gray-500" /></div>
              <div className="flex gap-2 pt-1">{taskModal.mode === "edit" && <button onClick={() => delTask(taskModal.id)} className="flex items-center gap-1 text-rose-500 border border-rose-200 rounded-xl px-4 py-3 text-sm font-bold"><Trash2 size={15} /> {t.del}</button>}<button onClick={saveTask} className="flex-1 text-white rounded-xl py-3 font-bold ff-title" style={{ background: TEAL }}>{t.save}</button></div>
            </div>
          </div>
        )}

        {dayModal && (
          <div className="absolute inset-0 bg-black/30 flex items-end z-40" onClick={() => setDayModal(null)}>
            <div className="w-full rounded-t-3xl p-5 space-y-4 max-h-[88%] overflow-y-auto" style={{ background: BG_CARD }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between"><h2 className="text-base font-bold text-gray-800 ff-title">{new Date(dayModal + "T00:00:00").toLocaleDateString(t.locale, { month: "long", day: "numeric", weekday: "long" })}</h2><button onClick={() => setDayModal(null)} className="text-gray-400"><X size={20} /></button></div>

              <div>
                <p className="text-xs font-bold text-teal-600 mb-2 flex items-center gap-1"><Calendar size={13} /> {t.calTitle}</p>
                <div className="space-y-2">
                  {eventsOn(dayModal).map((e) => { const k = kindOf(e.kind); return (
                    <div key={e.id} className={`border border-l-4 ${colorOf(k.color).bar} border-gray-100 rounded-xl p-2.5 flex items-center gap-2`}>
                      <button onClick={() => updEvent(e.id, { kind: nextKind(e.kind) })} className="text-base shrink-0">{k.emoji}</button>
                      <input value={evTitle(e)} onChange={(ev) => updEvent(e.id, { title: ev.target.value })} className="flex-1 text-sm outline-none bg-transparent text-gray-700 min-w-0" />
                      <button onClick={() => updEvent(e.id, { by: nextRole(e.by) })}><ByTag by={e.by} /></button>
                      <button onClick={() => delEvent(e.id)} className="text-gray-300 shrink-0"><X size={15} /></button>
                    </div>
                  ); })}
                  {eventsOn(dayModal).length === 0 && <p className="text-xs text-gray-300">{t.noItems}</p>}
                </div>
                <div className="mt-2 space-y-1.5">
                  <input value={nevTitle} onChange={(e) => setNevTitle(e.target.value)} placeholder={t.evTitlePh} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-teal-300" />
                  <div className="flex gap-1.5 flex-wrap items-center">
                    {kinds.map((k) => (<button key={k.id} onClick={() => setNevKind(k.id)} className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1 ${nevKind === k.id ? `${colorOf(k.color).chip} text-white border-transparent` : "bg-gray-50 text-gray-500 border-gray-100"}`}><span>{k.emoji}</span> {kindLabel(k)}</button>))}
                    <button onClick={() => { setAddingKind(!addingKind); setManageKinds(false); }} className="text-xs px-2.5 py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-400 flex items-center gap-1 active:scale-95"><Plus size={12} /> {t.addCat}</button>
                    {kinds.length > 1 && <button onClick={() => { setManageKinds(!manageKinds); setAddingKind(false); }} className={`text-xs px-2 py-1.5 rounded-lg border flex items-center gap-1 active:scale-95 ${manageKinds ? "bg-gray-700 text-white border-gray-700" : "border-gray-200 text-gray-400"}`}><Edit3 size={12} /> {t.manageCat}</button>}
                    <button onClick={addEvOnDay} className="text-white rounded-lg px-3 py-1.5 active:scale-95 ml-auto" style={{ background: TEAL }}><Plus size={16} /></button>
                  </div>
                  {addingKind && (
                    <div className="bg-gray-50 rounded-xl p-2.5 space-y-2">
                      <input value={newKindName} onChange={(e) => setNewKindName(e.target.value)} placeholder={t.catName} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-teal-300 bg-white" />
                      <div className="flex gap-1 flex-wrap">{EMOJIS.map((em) => (<button key={em} onClick={() => setNewKindEmoji(em)} className={`w-7 h-7 rounded-lg text-base flex items-center justify-center ${newKindEmoji === em ? "bg-teal-100 ring-1 ring-teal-300" : "bg-white"}`}>{em}</button>))}</div>
                      <div className="flex gap-1.5 flex-wrap">{COLORS.map((c) => (<button key={c.id} onClick={() => setNewKindColor(c.id)} className={`w-6 h-6 rounded-full ${c.chip} ${newKindColor === c.id ? "ring-2 ring-offset-1 ring-gray-400" : ""}`} />))}</div>
                      <div className="flex gap-2"><button onClick={() => setAddingKind(false)} className="flex-1 text-xs py-2 rounded-lg bg-white border border-gray-200 text-gray-500">{t.close}</button><button onClick={saveKind} className="flex-1 text-xs py-2 rounded-lg text-white font-bold" style={{ background: TEAL }}>{t.save}</button></div>
                    </div>
                  )}
                  {manageKinds && (
                    <div className="bg-gray-50 rounded-xl p-2.5 space-y-1.5">
                      <p className="text-[11px] text-gray-400 mb-1">{t.delCatHint}</p>
                      {kinds.map((k) => (
                        <div key={k.id} className="bg-white rounded-lg px-2.5 py-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${colorOf(k.color).chip} shrink-0`} />
                            <span className="text-sm text-gray-600 flex-1">{k.emoji} {kindLabel(k)}</span>
                            <button onClick={() => setKindEditId(kindEditId === k.id ? null : k.id)} className={kindEditId === k.id ? "text-teal-500" : "text-gray-300"}><Edit3 size={15} /></button>
                            <button onClick={() => delKind(k.id)} disabled={kinds.length <= 1} className="text-gray-300 disabled:opacity-30 active:scale-95"><Trash2 size={15} /></button>
                          </div>
                          {kindEditId === k.id && (
                            <div className="mt-2 space-y-2">
                              <input value={kindLabel(k)} onChange={(e) => updKind(k.id, { label: e.target.value })} placeholder={t.catName} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-teal-300" />
                              <div className="flex gap-1 flex-wrap">{EMOJIS.map((em) => (<button key={em} onClick={() => updKind(k.id, { emoji: em })} className={`w-7 h-7 rounded-lg text-base flex items-center justify-center ${k.emoji === em ? "bg-teal-100 ring-1 ring-teal-300" : "bg-gray-50"}`}>{em}</button>))}</div>
                              <div className="flex gap-1.5 flex-wrap">{COLORS.map((c) => (<button key={c.id} onClick={() => updKind(k.id, { color: c.id })} className={`w-6 h-6 rounded-full ${c.chip} ${k.color === c.id ? "ring-2 ring-offset-1 ring-gray-400" : ""}`} />))}</div>
                              <button onClick={() => setKindEditId(null)} className="w-full text-xs py-2 rounded-lg text-white font-bold active:scale-95" style={{ background: TEAL }}>{t.save}</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-amber-500 mb-2 flex items-center gap-1"><FileText size={13} /> {t.docsTitle}</p>
                <div className="space-y-2">
                  {docsOn(dayModal).map((d) => (
                    <div key={d.id} className={`border border-l-4 ${ownerBar(d.by)} border-gray-100 rounded-xl p-2.5 flex items-center gap-2`}>
                      <button onClick={() => updDoc(d.id, { dtype: nextDocType(d.dtype) })} className="text-lg shrink-0">{DOC[d.dtype]}</button>
                      <input value={docName(d)} onChange={(e) => updDoc(d.id, { name: e.target.value })} className="flex-1 text-sm outline-none bg-transparent text-gray-700 min-w-0" />
                      <button onClick={() => updDoc(d.id, { by: nextRole(d.by) })}><ByTag by={d.by} /></button>
                      <button onClick={() => delDoc(d.id)} className="text-gray-300 shrink-0"><X size={15} /></button>
                    </div>
                  ))}
                  {docsOn(dayModal).length === 0 && <p className="text-xs text-gray-300">{t.noItems}</p>}
                </div>
                <div className="mt-2 space-y-1.5">
                  <input value={ndocName} onChange={(e) => setNdocName(e.target.value)} placeholder={t.addDocPh} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-amber-300" />
                  <div className="flex gap-1.5 flex-wrap">{DOCTYPES.map((dk) => (<button key={dk} onClick={() => setNdocType(dk)} className={`text-xs px-2 py-1 rounded-lg border ${ndocType === dk ? "bg-amber-400 text-white border-amber-400" : "bg-gray-50 text-gray-500 border-gray-100"}`}>{DOC[dk]} {t.dt[dk]}</button>))}<button onClick={addDocOnDay} className="bg-amber-400 text-white rounded-lg px-3 active:scale-95"><Plus size={16} /></button></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {editingLog && (<div className="absolute inset-0 bg-black/30 flex items-end z-40" onClick={() => setEditLogId(null)}><div className="w-full rounded-t-3xl p-5 space-y-4" style={{ background: BG_CARD }} onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between"><h2 className="text-base font-bold text-gray-800 flex items-center gap-2 ff-title"><Edit3 size={17} /> {t.editTitle}</h2><button onClick={() => setEditLogId(null)} className="text-gray-400"><X size={20} /></button></div><div><p className="text-xs font-bold text-gray-400 mb-2">{t.fType}</p><div className="flex flex-wrap gap-2">{Object.keys(ACT).map((k) => (<button key={k} onClick={() => updLog(editingLog.id, { type: k })} className={`rounded-full px-3 py-1.5 text-sm border flex items-center gap-1 ${editingLog.type === k ? "text-white border-transparent" : "bg-gray-50 text-gray-600 border-gray-100"}`} style={editingLog.type === k ? { background: TEAL } : {}}><span>{ACT[k].emoji}</span> {t.act[k]}</button>))}</div></div><div className="grid grid-cols-2 gap-3"><div><p className="text-xs font-bold text-gray-400 mb-2">{t.fTime}</p><input type="time" value={toTimeInput(editingLog.ts)} onChange={(e) => setLogTime(editingLog.id, e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-300" /></div><div><p className="text-xs font-bold text-gray-400 mb-2">{roleName(editingLog.by)}</p><div className="flex bg-gray-100 rounded-lg p-1">{["mom", "dad"].map((u) => (<button key={u} onClick={() => updLog(editingLog.id, { by: u })} className={`flex-1 text-xs py-1.5 rounded-md ${editingLog.by === u ? "bg-white shadow font-bold text-teal-600" : "text-gray-500"}`}>{roleName(u)}</button>))}</div></div></div><div><p className="text-xs font-bold text-gray-400 mb-2">{t.fMemo}</p><input value={editingLog.memo} onChange={(e) => updLog(editingLog.id, { memo: e.target.value })} placeholder={t.memoPh} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-300" /></div><div className="flex gap-2 pt-1"><button onClick={() => delLog(editingLog.id)} className="flex items-center gap-1 text-rose-500 border border-rose-200 rounded-xl px-4 py-3 text-sm font-bold"><Trash2 size={15} /> {t.del}</button><button onClick={() => setEditLogId(null)} className="flex-1 text-white rounded-xl py-3 font-bold ff-title" style={{ background: TEAL }}>{t.save}</button></div></div></div>)}

        {showSettings && (<div className="absolute inset-0 bg-black/30 flex items-end z-40" onClick={() => setShowSettings(false)}><div className="w-full rounded-t-3xl p-5 space-y-5 max-h-[88%] overflow-y-auto" style={{ background: BG_CARD }} onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between"><h2 className="text-base font-bold text-gray-800 flex items-center gap-2 ff-title"><Settings size={18} /> {t.settings}</h2><button onClick={() => setShowSettings(false)} className="text-gray-400"><X size={20} /></button></div>
          <div><p className="text-xs font-bold text-gray-400 mb-2">{t.iAm}</p><div className="grid grid-cols-2 gap-2">{["mom", "dad"].map((u) => (<button key={u} onClick={() => setUser(u)} className={`py-3 rounded-xl text-sm font-medium ${user === u ? "text-white" : "bg-gray-100 text-gray-600"}`} style={user === u ? { background: TEAL } : {}}>{roleName(u)}</button>))}</div></div>
          <div><p className="text-xs font-bold text-gray-400 mb-2">{t.language}</p><div className="grid grid-cols-3 gap-2">{[{ id: "ko", n: "한국어" }, { id: "es", n: "Español" }, { id: "en", n: "English" }].map((l) => (<button key={l.id} onClick={() => setLang(l.id)} className={`py-2 rounded-xl text-sm font-medium ${lang === l.id ? "text-white" : "bg-gray-100 text-gray-600"}`} style={lang === l.id ? { background: TEAL } : {}}>{l.n}</button>))}</div></div>
          <div><p className="text-xs font-bold text-gray-400 mb-1">{t.homeWidgets}</p><p className="text-[11px] text-gray-300 mb-2">{t.reorderHint}</p><div className="space-y-1">{homeOrder.map((w, i) => (<div key={w.key} className="flex items-center gap-2 py-2 px-3 rounded-xl bg-gray-50"><div className="flex flex-col"><button onClick={() => moveHome(i, -1)} disabled={i === 0} className={i === 0 ? "text-gray-200" : "text-gray-500"}><ChevronUp size={15} /></button><button onClick={() => moveHome(i, 1)} disabled={i === homeOrder.length - 1} className={i === homeOrder.length - 1 ? "text-gray-200" : "text-gray-500"}><ChevronDown size={15} /></button></div><span className="text-sm text-gray-700 flex-1">{wLabel[w.key]}</span><button onClick={() => toggleHome(w.key)}><span className={`w-10 h-6 rounded-full flex items-center px-0.5 transition ${w.on ? "justify-end" : "bg-gray-300 justify-start"}`} style={w.on ? { background: TEAL } : {}}><span className="w-5 h-5 bg-white rounded-full shadow" /></span></button></div>))}</div></div>
          <button onClick={() => { localStorage.removeItem("familyhub.pin"); location.reload(); }} className="w-full border border-gray-200 text-gray-500 rounded-xl py-2.5 text-sm font-medium">{t.logout}</button>
          <button onClick={() => setShowSettings(false)} className="w-full text-white rounded-xl py-3 font-bold ff-title" style={{ background: TEAL }}>{t.close}</button></div></div>)}

        <div className="absolute bottom-0 w-full border-t border-gray-100 flex justify-around py-2" style={{ background: BG_CARD }}>{tabs.map(({ id, icon: Icon }) => (<button key={id} onClick={() => setTab(id)} className="flex flex-col items-center gap-0.5 px-2 py-1" style={tab === id ? { color: TEAL } : { color: "#9ca3af" }}><Icon size={20} /><span className="text-[10px]">{t.tabs[id]}</span></button>))}</div>
      </div>
    </div>
  );
}
