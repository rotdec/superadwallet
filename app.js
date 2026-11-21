// v28 Sat Nov 21 23:05:17 CET 2026
(function(){
const{useState,useEffect,useCallback,useMemo,useRef}=React;
const uid = () => Math.random().toString(36).slice(2, 10);
const todayStr = () => (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
const monthStart = () => new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1).toISOString().split("T")[0];
const weekStart = () => {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - (d.getDay() + 6) % 7);
  return d.toISOString().split("T")[0];
};
const yearStart = () => new Date((/* @__PURE__ */ new Date()).getFullYear(), 0, 1).toISOString().split("T")[0];
const fmt = (n) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }).format(n);
const fmtS = (n) => Math.abs(n) >= 1e3 ? `\u20AC${(n / 1e3).toFixed(1)}k` : fmt(n);
const fmtD = (d) => (/* @__PURE__ */ new Date(d + "T00:00:00")).toLocaleDateString("it-IT", { day: "2-digit", month: "short" });
const fmtDF = (d) => (/* @__PURE__ */ new Date(d + "T00:00:00")).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
function ld(k, def) {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : def;
  } catch (e) {
    return def;
  }
}
function sv(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {
  }
}
const SB_URL = "https://assiuotoaplmuuhfzebm.supabase.co";
const SB_KEY = "sb_publishable_NHZ1qamnq2dr_Ik117eayg_jMuEI-Zq";
const sb = typeof window !== "undefined" && window.supabase ? window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, autoRefreshToken: true } }) : null;
const TABLES = { tx: "wallet_transactions", cat: "wallet_categories", rec: "wallet_recurrings" };
const KINDS = ["tx", "cat", "rec"];
const CATS = [
  { id: "c-affitto", n: "Affitto/Mutuo", i: "\u{1F3E0}", c: "#007AFF" },
  { id: "c-util", n: "Utenze", i: "\u26A1", c: "#FFCC00" },
  { id: "c-gas", n: "Gas", i: "\u{1F525}", c: "#FF9500" },
  { id: "c-internet", n: "Internet", i: "\u{1F4E1}", c: "#5AC8FA" },
  { id: "c-tel", n: "Telefono", i: "\u{1F4F1}", c: "#30B0C7" },
  { id: "c-spesa", n: "Spesa", i: "\u{1F6D2}", c: "#34C759" },
  { id: "c-rist", n: "Ristorante", i: "\u{1F37D}\uFE0F", c: "#FF6B35" },
  { id: "c-caffe", n: "Bar/Caff\xE8", i: "\u2615", c: "#FF9500" },
  { id: "c-take", n: "Takeaway", i: "\u{1F355}", c: "#FF3B30" },
  { id: "c-abbigl", n: "Abbigliamento", i: "\u{1F457}", c: "#AF52DE" },
  { id: "c-elett", n: "Elettronica", i: "\u{1F5A5}\uFE0F", c: "#007AFF" },
  { id: "c-auto", n: "Auto/Moto", i: "\u{1F697}", c: "#FF9500" },
  { id: "c-benzina", n: "Carburante", i: "\u26FD", c: "#FF3B30" },
  { id: "c-trp", n: "Trasporto", i: "\u{1F68C}", c: "#34C759" },
  { id: "c-taxi", n: "Taxi/Uber", i: "\u{1F695}", c: "#FFCC00" },
  { id: "c-farm", n: "Farmacia", i: "\u{1F48A}", c: "#FF2D55" },
  { id: "c-medico", n: "Medico", i: "\u{1F3E5}", c: "#FF3B30" },
  { id: "c-sport", n: "Sport/Palestra", i: "\u{1F3CB}\uFE0F", c: "#34C759" },
  { id: "c-ass", n: "Assicurazione", i: "\u{1F6E1}\uFE0F", c: "#5AC8FA" },
  { id: "c-cinema", n: "Cinema/Teatro", i: "\u{1F3AC}", c: "#C77DFF" },
  { id: "c-stream", n: "Streaming", i: "\u{1F3B5}", c: "#AF52DE" },
  { id: "c-giochi", n: "Videogiochi", i: "\u{1F3AE}", c: "#007AFF" },
  { id: "c-libri", n: "Libri", i: "\u{1F4DA}", c: "#FF9500" },
  { id: "c-voli", n: "Voli", i: "\u2708\uFE0F", c: "#007AFF" },
  { id: "c-hotel", n: "Hotel", i: "\u{1F3E8}", c: "#5AC8FA" },
  { id: "c-vacanze", n: "Vacanze", i: "\u{1F3D6}\uFE0F", c: "#FFCC00" },
  { id: "c-istr", n: "Istruzione", i: "\u{1F393}", c: "#AF52DE" },
  { id: "c-animali", n: "Animali", i: "\u{1F43E}", c: "#FF9500" },
  { id: "c-stip", n: "Stipendio", i: "\u{1F4B0}", c: "#34C759" },
  { id: "c-free", n: "Freelance", i: "\u{1F4BC}", c: "#007AFF" },
  { id: "c-inv", n: "Investimenti", i: "\u{1F4C8}", c: "#34C759" },
  { id: "c-rimb", n: "Rimborso", i: "\u{1F4B8}", c: "#4CD964" },
  { id: "c-regali", n: "Regali", i: "\u{1F381}", c: "#FF2D55" },
  { id: "c-abbon", n: "Abbonamenti", i: "\u{1F504}", c: "#C77DFF" },
  { id: "c-altro", n: "Altro", i: "\u{1F4E6}", c: "#8E8E93" }
];
const KWDS = {
  "c-affitto": ["affitto", "mutuo", "condominio"],
  "c-internet": ["internet", "wifi", "fibra", "tim", "fastweb", "windtre"],
  "c-tel": ["telefono", "cellulare", "sim", "ricarica"],
  "c-spesa": ["spesa", "esselunga", "lidl", "coop", "conad", "carrefour", "supermercato"],
  "c-rist": ["ristorante", "pizzeria", "sushi", "cena", "pranzo", "pizza", "hamburger"],
  "c-caffe": ["bar", "caff\xE8", "caffe", "cappuccino", "colazione", "aperitivo"],
  "c-take": ["takeaway", "deliveroo", "glovo", "asporto", "domino"],
  "c-benzina": ["benzina", "gasolio", "distributore", "eni", "q8", "shell"],
  "c-trp": ["metro", "treno", "autobus", "trenitalia", "italo", "bus"],
  "c-farm": ["farmacia", "medicinale", "vitamina", "integratore"],
  "c-stream": ["spotify", "netflix", "disney", "prime video", "streaming", "dazn"],
  "c-giochi": ["playstation", "xbox", "nintendo", "steam"],
  "c-voli": ["volo", "ryanair", "easyjet", "aereo", "aeroporto"],
  "c-hotel": ["hotel", "airbnb", "booking", "albergo"],
  "c-stip": ["stipendio", "salario", "accredito", "paga"],
  "c-ass": ["assicurazione", "polizza", "allarme"]
};
function suggest(desc, cats) {
  if (!desc || desc.length < 2) return null;
  const l = desc.toLowerCase();
  let best = null, bs = 0;
  for (const [id, kws] of Object.entries(KWDS))
    for (const kw of kws)
      if (l.includes(kw) && kw.length > bs) {
        bs = kw.length;
        best = id;
      }
  return best ? cats.find((c) => c.id === best) || null : null;
}
const METODI = ["Carta", "Contanti", "Bonifico", "PayPal", "Satispay"];
const AVATAR_EMOJIS = ["\u{1F60A}", "\u{1F60E}", "\u{1F9D1}", "\u{1F468}", "\u{1F469}", "\u{1F9D4}", "\u{1F466}", "\u{1F467}", "\u{1F9B8}", "\u{1F43B}", "\u{1F98A}", "\u{1F42F}", "\u{1F43C}", "\u{1F981}", "\u{1F438}"];
const AVATAR_BG = ["#007AFF", "#34C759", "#FF3B30", "#FF9500", "#AF52DE", "#FF2D55", "#00C7BE", "#FFCC00"];
const CAT_COLORS = ["#007AFF", "#34C759", "#FF3B30", "#FF9500", "#AF52DE", "#00C7BE", "#FF2D55", "#5AC8FA", "#FFCC00", "#FF6B35", "#30B0C7", "#C77DFF"];
const pad2 = (n) => String(n).padStart(2, "0");
const localStr = (y, m, d) => `${y}-${pad2(m + 1)}-${pad2(d)}`;
function processRecurring(recs, txs) {
  const newTx = [];
  const today = todayStr();
  recs.forEach((r) => {
    if (!r.enabled || !r.startDate) return;
    const existing = new Set(txs.filter((t) => t.recurringId === r.id).map((t) => t.date));
    const skipped = new Set(r.skipped || []);
    const [sy, sm, sd] = r.startDate.split("-").map(Number);
    for (let i = 0; i < 600; i++) {
      let y = sy, m = sm - 1;
      if (r.frequency === "mensile") {
        m += i;
        y += Math.floor(m / 12);
        m = (m % 12 + 12) % 12;
      } else {
        y += i;
      }
      const dim = new Date(y, m + 1, 0).getDate();
      const ds = localStr(y, m, Math.min(sd, dim));
      if (ds > today) break;
      if (existing.has(ds) || skipped.has(ds)) continue;
      if (txs.some((t) => t.description === r.name && Math.round(t.amount * 100) === Math.round(r.amount * 100) && t.categoryId === r.categoryId && dayDiff(t.date, ds) <= 1)) continue;
      existing.add(ds);
      newTx.push({ id: `a_${r.id}_${ds}`, date: ds, amount: r.amount, type: "uscita", categoryId: r.categoryId, description: r.name, paymentMethod: "Bonifico", notes: "", tag: "", recurringId: r.id, auto: true });
    }
  });
  return newTx;
}
const dayDiff = (a, b) => Math.abs((/* @__PURE__ */ new Date(a + "T00:00:00") - /* @__PURE__ */ new Date(b + "T00:00:00")) / 864e5);
const fuzzyKey = (t) => `${(t.description || "").trim().toLowerCase()}|${Math.round(t.amount * 100)}|${t.type}|${t.categoryId}`;
function dedupTxs(txs) {
  const sig = (t) => `${t.date}|${fuzzyKey(t)}`;
  const seenR = /* @__PURE__ */ new Set();
  const pass1 = [];
  txs.forEach((t) => {
    if (t.recurringId) {
      const k = t.recurringId + "|" + t.date;
      if (seenR.has(k)) return;
      seenR.add(k);
    }
    pass1.push(t);
  });
  const best = /* @__PURE__ */ new Map();
  pass1.forEach((t) => {
    const k = sig(t);
    const c = best.get(k);
    if (!c || !c.recurringId && t.recurringId) best.set(k, t);
  });
  const pass2 = pass1.filter((t) => best.get(sig(t)) === t);
  const kept = [];
  const byKey = /* @__PURE__ */ new Map();
  const drop = /* @__PURE__ */ new Set();
  [...pass2].sort((x, y) => x.date < y.date ? -1 : 1).forEach((t) => {
    if (!(t.auto || t.recurringId || t.paymentMethod === "Bonifico")) {
      kept.push(t);
      return;
    }
    const k = fuzzyKey(t);
    const list = byKey.get(k) || [];
    const hit = list.find((o) => dayDiff(o.date, t.date) <= 1);
    if (hit) {
      if (!hit.recurringId && t.recurringId) {
        drop.add(hit);
        list[list.indexOf(hit)] = t;
      } else drop.add(t);
    } else list.push(t);
    byKey.set(k, list);
  });
  return pass2.filter((t) => !drop.has(t));
}
const S = {
  phone: { width: "100%", height: "100svh", background: "#F2F2F7", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, fontFamily: "system-ui,-apple-system,sans-serif", paddingTop: "env(safe-area-inset-top, 0px)", touchAction: "pan-y" },
  scroll: { flex: 1, overflowY: "scroll", WebkitOverflowScrolling: "touch", paddingBottom: 110, minHeight: 0 },
  nav: { display: "flex", paddingBottom: "env(safe-area-inset-bottom, 8px)", background: "rgba(242,242,247,.96)", borderTop: "0.5px solid rgba(60,60,67,.18)", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 49 },
  ni: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "7px 0 2px", gap: 3, background: "none", border: "none", cursor: "pointer" },
  niIcon: { width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 },
  card: { margin: "10px 14px", background: "linear-gradient(145deg,#007AFF,#5AC8FA)", borderRadius: 20, padding: 18 },
  pill: { flex: 1, background: "rgba(255,255,255,.18)", borderRadius: 10, padding: "8px 10px" },
  row: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "0.5px solid rgba(60,60,67,.12)", cursor: "pointer" },
  rowIcon: { width: 34, height: 34, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 100, display: "flex", alignItems: "flex-end" },
  sheet: { background: "#fff", borderRadius: "18px 18px 0 0", width: "100%", maxHeight: "88vh", overflowY: "auto" },
  inp: { width: "100%", background: "#F2F2F7", border: "none", borderRadius: 10, color: "#1C1C1E", fontSize: 15, padding: "11px 13px", fontFamily: "inherit", outline: "none", WebkitAppearance: "none", boxSizing: "border-box" },
  btn: { display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: 13, borderRadius: 12, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "inherit", marginTop: 4 },
  group: { background: "#fff", borderRadius: 12, overflow: "hidden" },
  seg: { display: "flex", background: "rgba(120,120,128,.12)", borderRadius: 8, padding: 2, margin: "0 14px 10px" },
  segBtn: { flex: 1, padding: "6px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", background: "transparent", color: "#8E8E93", fontFamily: "inherit" },
  fab: { position: "fixed", bottom: 80, right: 16, width: 50, height: 50, borderRadius: 15, background: "#007AFF", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,122,255,.45)", zIndex: 50, fontSize: 24, color: "#fff" },
  obScreen: { position: "fixed", inset: 0, background: "linear-gradient(160deg,#007AFF,#5AC8FA 60%,#34C759)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "28px 24px 40px" },
  sectionLabel: { fontSize: 12, fontWeight: 600, color: "#8E8E93", textTransform: "uppercase", letterSpacing: ".05em", padding: "0 3px", marginBottom: 6, marginTop: 16 }
};
function PieSVG({ data }) {
  const [tip, setTip] = useState(null);
  if (!data || data.length === 0) return null;
  const SIZE = 200;
  const cx = SIZE / 2, cy = SIZE / 2, R = 72, r = 44;
  const tot = data.reduce((s, d) => s + d.value, 0);
  if (tot === 0) return null;
  let a = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const sw = d.value / tot * 2 * Math.PI * 0.98;
    const cos1 = Math.cos(a), sin1 = Math.sin(a);
    const cos2 = Math.cos(a + sw), sin2 = Math.sin(a + sw);
    const x1 = cx + R * cos1, y1 = cy + R * sin1;
    const x2 = cx + R * cos2, y2 = cy + R * sin2;
    const ix1 = cx + r * cos1, iy1 = cy + r * sin1;
    const ix2 = cx + r * cos2, iy2 = cy + r * sin2;
    const lg = sw > Math.PI ? 1 : 0;
    const path = "M" + x1 + "," + y1 + " A" + R + "," + R + ",0," + lg + ",1," + x2 + "," + y2 + " L" + ix2 + "," + iy2 + " A" + r + "," + r + ",0," + lg + ",0," + ix1 + "," + iy1 + " Z";
    const midA = a + sw / 2;
    const pct = Math.round(d.value / tot * 100);
    a += sw + 0.02;
    return { path, color: d.color, value: d.value, name: d.name, pct, midA, sw, i };
  });
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 " + SIZE + " " + SIZE, style: { display: "block", width: "100%", maxWidth: SIZE, margin: "0 auto" } }, slices.map((s, i) => /* @__PURE__ */ React.createElement("g", { key: i, onClick: () => setTip(tip === i ? null : i), style: { cursor: "pointer" } }, /* @__PURE__ */ React.createElement("path", { d: s.path, fill: s.color, opacity: tip !== null && tip !== i ? 0.5 : 1 }), s.sw > 0.3 && /* @__PURE__ */ React.createElement(
    "text",
    {
      x: cx + (R + 14) * Math.cos(s.midA),
      y: cy + (R + 14) * Math.sin(s.midA),
      textAnchor: "middle",
      dominantBaseline: "middle",
      fontSize: "9",
      fontWeight: "700",
      fill: s.color
    },
    s.pct,
    "%"
  ))), tip === null && /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("text", { x: cx, y: cy - 4, textAnchor: "middle", fontSize: "9", fill: "#8E8E93" }, "Totale"), /* @__PURE__ */ React.createElement("text", { x: cx, y: cy + 11, textAnchor: "middle", fontSize: "12", fontWeight: "700", fill: "#1C1C1E" }, fmt(tot))), tip !== null && /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("text", { x: cx, y: cy - 8, textAnchor: "middle", fontSize: "9", fill: "#1C1C1E" }, slices[tip].name), /* @__PURE__ */ React.createElement("text", { x: cx, y: cy + 8, textAnchor: "middle", fontSize: "13", fontWeight: "700", fill: "#1C1C1E" }, fmt(slices[tip].value)), /* @__PURE__ */ React.createElement("text", { x: cx, y: cy + 22, textAnchor: "middle", fontSize: "9", fill: "#8E8E93" }, slices[tip].pct, "%")));
}
function LineSVG({ data }) {
  const [tip, setTip] = useState(null);
  if (!data || data.length < 2) return null;
  const W = 320, H = 120, pL = 8, pR = 8, pT = 8, pB = 20;
  const vals = data.map((d) => d.v), maxV = Math.max(...vals, 1);
  const xs = data.map((_, i) => pL + i / (data.length - 1) * (W - pL - pR));
  const ys = vals.map((v) => pT + (1 - v / maxV) * (H - pT - pB));
  const pts = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  return /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${W} ${H}`, style: { width: "100%", height: "100%" } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "lg2", x1: "0", y1: "0", x2: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: "#FF3B30", stopOpacity: ".18" }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: "#FF3B30", stopOpacity: "0" }))), /* @__PURE__ */ React.createElement("path", { d: `M${xs[0]},${ys[0]} ` + xs.slice(1).map((x, i) => `L${x},${ys[i + 1]}`).join(" ") + ` L${xs[xs.length - 1]},${H - pB} L${xs[0]},${H - pB} Z`, fill: "url(#lg2)" }), /* @__PURE__ */ React.createElement("polyline", { points: pts, fill: "none", stroke: "#FF3B30", strokeWidth: "2.5", strokeLinejoin: "round", strokeLinecap: "round" }), xs.map((x, i) => /* @__PURE__ */ React.createElement("g", { key: i, onMouseEnter: () => setTip(i), onMouseLeave: () => setTip(null), style: { cursor: "pointer" } }, /* @__PURE__ */ React.createElement("circle", { cx: x, cy: ys[i], r: 10, fill: "transparent" }), /* @__PURE__ */ React.createElement("circle", { cx: x, cy: ys[i], r: 3.5, fill: "#FF3B30", stroke: "#fff", strokeWidth: "1.5" }))), data.map((d, i) => /* @__PURE__ */ React.createElement("text", { key: i, x: xs[i], y: H - 4, textAnchor: "middle", fontSize: 9, fill: "#8E8E93" }, d.label)), tip !== null && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: Math.min(xs[tip] - 25, W - 60), y: ys[tip] - 26, width: 56, height: 18, rx: 5, fill: "#1C1C1E", opacity: 0.85 }), /* @__PURE__ */ React.createElement("text", { x: Math.min(xs[tip] + 3, W - 31), y: ys[tip] - 13, textAnchor: "middle", fontSize: 10, fill: "#fff", fontWeight: "700" }, fmt(vals[tip]))));
}
function Sheet({ title, onClose, onSave, saveLabel = "Salva", children }) {
  return /* @__PURE__ */ React.createElement("div", { style: S.overlay, onClick: (e) => e.target === e.currentTarget && onClose() }, /* @__PURE__ */ React.createElement("div", { style: S.sheet }, /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 4, borderRadius: 2, background: "rgba(60,60,67,.18)", margin: "10px auto 0" } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px 10px" } }, /* @__PURE__ */ React.createElement("button", { onClick: onClose, style: { background: "none", border: "none", fontSize: 15, color: "#FF3B30", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 } }, "Annulla"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 17, fontWeight: 800, color: "#1C1C1E" } }, title), onSave ? /* @__PURE__ */ React.createElement("button", { onClick: onSave, style: { background: "none", border: "none", fontSize: 15, color: "#007AFF", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 } }, saveLabel) : /* @__PURE__ */ React.createElement("div", { style: { width: 60 } })), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 18px 40px" } }, children)));
}
function Lbl({ children }) {
  return /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: "#8E8E93", marginBottom: 5, paddingLeft: 3 } }, children);
}
function Inp(props) {
  return /* @__PURE__ */ React.createElement("input", { ...props, style: { ...S.inp, ...props.style || {} } });
}
function Toggle({ checked, onChange }) {
  return /* @__PURE__ */ React.createElement("div", { onClick: () => onChange(!checked), style: { width: 48, height: 28, borderRadius: 14, background: checked ? "#34C759" : "#E5E5EA", position: "relative", cursor: "pointer", transition: ".2s", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 2, left: checked ? 22 : 2, width: 24, height: 24, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)", transition: "left .2s" } }));
}
function TxRow({ tx, cats, onClick }) {
  const cat = cats.find((c) => c.id === tx.categoryId) || CATS[CATS.length - 1];
  const isI = tx.type === "entrata";
  return /* @__PURE__ */ React.createElement("div", { style: S.row, onClick: () => onClick(tx) }, /* @__PURE__ */ React.createElement("div", { style: { ...S.rowIcon, background: cat.c + "22" } }, cat.i), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "#1C1C1E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, tx.description, tx.auto && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, background: "rgba(0,122,255,.12)", color: "#007AFF", borderRadius: 4, padding: "1px 5px", marginLeft: 5 } }, "AUTO")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#8E8E93", marginTop: 1 } }, fmtD(tx.date), " \xB7 ", cat.n, tx.tag ? /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 5, background: "rgba(175,82,222,.12)", color: "#AF52DE", borderRadius: 6, padding: "1px 6px", fontSize: 10 } }, "\u{1F3F7}\uFE0F ", tx.tag) : "")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, flexShrink: 0, color: isI ? "#34C759" : "#FF3B30" } }, isI ? "+" : "\u2212", fmt(tx.amount)));
}
function TxSheet({ tx, cats, allTags, onSave, onDelete, onClose }) {
  var _a, _b;
  const [f, setF] = useState({ amount: ((_a = tx == null ? void 0 : tx.amount) == null ? void 0 : _a.toString()) || "", type: (tx == null ? void 0 : tx.type) || "uscita", categoryId: (tx == null ? void 0 : tx.categoryId) || ((_b = cats[0]) == null ? void 0 : _b.id) || "", date: (tx == null ? void 0 : tx.date) || todayStr(), paymentMethod: (tx == null ? void 0 : tx.paymentMethod) || "Carta", description: (tx == null ? void 0 : tx.description) || "", tag: (tx == null ? void 0 : tx.tag) || "" });
  const [cs, setCs] = useState("");
  const [sug, setSug] = useState(null);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const handleDesc = (val) => {
    set("description", val);
    const s = suggest(val, cats);
    setSug(s && s.id !== f.categoryId ? s : null);
  };
  const handleSave = () => {
    var _a2;
    const amt = parseFloat(f.amount.replace(",", "."));
    if (!amt || amt <= 0) return alert("Importo non valido");
    const selCatName = ((_a2 = cats.find((c) => c.id === f.categoryId)) == null ? void 0 : _a2.n) || "Transazione";
    const description = f.description.trim() || selCatName;
    onSave({ ...f, description, amount: amt, id: (tx == null ? void 0 : tx.id) || uid() });
  };
  const selCat = cats.find((c) => c.id === f.categoryId);
  const filtCats = cs ? cats.filter((c) => c.n.toLowerCase().includes(cs.toLowerCase())) : cats;
  return /* @__PURE__ */ React.createElement(Sheet, { title: tx ? "Modifica" : "Nuova Transazione", onClose, onSave: handleSave }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => set("type", "uscita"), style: { flex: 1, padding: 11, borderRadius: 12, border: `.5px solid ${f.type === "uscita" ? "rgba(255,59,48,.3)" : "rgba(60,60,67,.18)"}`, background: f.type === "uscita" ? "rgba(255,59,48,.08)" : "#F2F2F7", fontSize: 14, fontWeight: 700, cursor: "pointer", color: f.type === "uscita" ? "#FF3B30" : "#8E8E93", fontFamily: "inherit" } }, "\u2193 Uscita"), /* @__PURE__ */ React.createElement("button", { onClick: () => set("type", "entrata"), style: { flex: 1, padding: 11, borderRadius: 12, border: `.5px solid ${f.type === "entrata" ? "rgba(52,199,89,.3)" : "rgba(60,60,67,.18)"}`, background: f.type === "entrata" ? "rgba(52,199,89,.08)" : "#F2F2F7", fontSize: 14, fontWeight: 700, cursor: "pointer", color: f.type === "entrata" ? "#34C759" : "#8E8E93", fontFamily: "inherit" } }, "\u2191 Entrata")), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 20, fontWeight: 600, color: "#AEAEB2" } }, "\u20AC"), /* @__PURE__ */ React.createElement(Inp, { type: "number", inputMode: "decimal", placeholder: "0,00", value: f.amount, onChange: (e) => set("amount", e.target.value), style: { paddingLeft: 30, fontSize: 24, fontWeight: 700 } })), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Lbl, null, "Descrizione"), /* @__PURE__ */ React.createElement(Inp, { type: "text", placeholder: "Descrizione (opzionale)", value: f.description, onChange: (e) => handleDesc(e.target.value) })), sug && /* @__PURE__ */ React.createElement("div", { onClick: () => {
    set("categoryId", sug.id);
    setSug(null);
  }, style: { display: "flex", alignItems: "center", gap: 8, background: "rgba(0,122,255,.08)", border: "1px solid rgba(0,122,255,.2)", borderRadius: 10, padding: "8px 11px", marginBottom: 10, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 30, height: 30, borderRadius: 8, background: sug.c + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 } }, sug.i), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#007AFF", fontWeight: 700 } }, "\u2728 Categoria suggerita"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#1C1C1E" } }, sug.n)), /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
    e.stopPropagation();
    set("categoryId", sug.id);
    setSug(null);
  }, style: { fontSize: 11, fontWeight: 700, color: "#007AFF", background: "rgba(0,122,255,.12)", borderRadius: 6, padding: "3px 8px", border: "none", cursor: "pointer", fontFamily: "inherit" } }, "Usa")), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 5 } }, /* @__PURE__ */ React.createElement(Lbl, null, "Categoria ", selCat && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 5, background: selCat.c + "22", color: selCat.c, borderRadius: 6, padding: "1px 6px", fontSize: 10 } }, selCat.i, " ", selCat.n)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "#8E8E93" } }, filtCats.length)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, background: "rgba(120,120,128,.14)", borderRadius: 9, padding: "6px 10px", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "#AEAEB2" } }, "\u{1F50D}"), /* @__PURE__ */ React.createElement("input", { style: { flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: "#1C1C1E", fontFamily: "inherit" }, placeholder: "Cerca categoria...", value: cs, onChange: (e) => setCs(e.target.value) }), cs && /* @__PURE__ */ React.createElement("span", { style: { cursor: "pointer", color: "#AEAEB2", fontSize: 12 }, onClick: () => setCs("") }, "\u2715")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 } }, filtCats.map((c) => {
    const isA = f.categoryId === c.id;
    return /* @__PURE__ */ React.createElement("button", { key: c.id, onClick: () => {
      set("categoryId", c.id);
      setSug(null);
    }, style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: "8px 4px", borderRadius: 12, border: `${isA ? "2px" : "1.5px"} solid ${isA ? c.c : "rgba(60,60,67,.12)"}`, background: isA ? c.c : "rgba(120,120,128,.1)", cursor: "pointer", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20 } }, c.i), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, fontWeight: 700, color: isA ? "#fff" : "#8E8E93", lineHeight: 1.2 } }, c.n));
  }))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Lbl, null, "Data"), /* @__PURE__ */ React.createElement(Inp, { type: "date", value: f.date, onChange: (e) => set("date", e.target.value) })), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Lbl, null, "Metodo"), /* @__PURE__ */ React.createElement("select", { style: { ...S.inp }, value: f.paymentMethod, onChange: (e) => set("paymentMethod", e.target.value) }, METODI.map((m) => /* @__PURE__ */ React.createElement("option", { key: m }, m)))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12, position: "relative" } }, /* @__PURE__ */ React.createElement(Lbl, null, "\u{1F3F7}\uFE0F Tag (opzionale)"), /* @__PURE__ */ React.createElement(
    Inp,
    {
      type: "text",
      placeholder: "es. Vacanza Grecia 2025...",
      value: f.tag,
      onChange: (e) => set("tag", e.target.value),
      onFocus: () => set("_tagOpen", true),
      onBlur: () => setTimeout(() => set("_tagOpen", false), 150)
    }
  ), f._tagOpen && allTags.filter((t) => t && t.toLowerCase().includes((f.tag || "").toLowerCase()) && t !== f.tag).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 0, right: 0, top: "100%", background: "#fff", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,.15)", zIndex: 50, overflow: "hidden", marginTop: 4 } }, allTags.filter((t) => t && t.toLowerCase().includes((f.tag || "").toLowerCase()) && t !== f.tag).slice(0, 5).map((tag) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: tag,
      onMouseDown: () => set("tag", tag),
      style: { padding: "10px 14px", fontSize: 14, fontWeight: 600, color: "#1C1C1E", borderBottom: "0.5px solid rgba(60,60,67,.1)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }
    },
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, background: "rgba(175,82,222,.12)", color: "#AF52DE", borderRadius: 6, padding: "1px 7px" } }, "\u{1F3F7}\uFE0F"),
    tag
  )))), /* @__PURE__ */ React.createElement("button", { onClick: handleSave, style: { ...S.btn, background: "#007AFF", color: "#fff" } }, tx ? "Salva Modifiche" : "Aggiungi Transazione"), tx && /* @__PURE__ */ React.createElement("button", { onClick: () => onDelete(tx.id), style: { ...S.btn, background: "rgba(255,59,48,.1)", color: "#FF3B30", marginTop: 8 } }, "Elimina", tx.auto ? " (solo questo mese)" : ""));
}
function RecSheet({ rec, cats, onSave, onDelete, onClose }) {
  var _a, _b;
  const [f, setF] = useState({ name: (rec == null ? void 0 : rec.name) || "", amount: ((_a = rec == null ? void 0 : rec.amount) == null ? void 0 : _a.toString()) || "", frequency: (rec == null ? void 0 : rec.frequency) || "mensile", startDate: (rec == null ? void 0 : rec.startDate) || todayStr(), categoryId: (rec == null ? void 0 : rec.categoryId) || ((_b = cats[0]) == null ? void 0 : _b.id) || "", enabled: (rec == null ? void 0 : rec.enabled) !== false });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const handleSave = () => {
    const amt = parseFloat(f.amount.replace(",", "."));
    if (!amt || amt <= 0) return alert("Importo non valido");
    if (!f.name.trim()) return alert("Inserisci un nome");
    onSave({ ...f, amount: amt, id: (rec == null ? void 0 : rec.id) || uid() });
  };
  return /* @__PURE__ */ React.createElement(Sheet, { title: rec ? "Modifica Ricorrente" : "Nuova Spesa Ricorrente", onClose, onSave: handleSave }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Lbl, null, "Nome"), /* @__PURE__ */ React.createElement(Inp, { type: "text", placeholder: "es. Affitto, Netflix, Palestra...", value: f.name, onChange: (e) => set("name", e.target.value) })), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Lbl, null, "Importo"), /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "#AEAEB2" } }, "\u20AC"), /* @__PURE__ */ React.createElement(Inp, { type: "number", inputMode: "decimal", placeholder: "0,00", value: f.amount, onChange: (e) => set("amount", e.target.value), style: { paddingLeft: 30, fontSize: 22, fontWeight: 700 } }))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Lbl, null, "Frequenza"), /* @__PURE__ */ React.createElement("div", { style: S.seg }, ["mensile", "annuale"].map((v) => /* @__PURE__ */ React.createElement("button", { key: v, onClick: () => set("frequency", v), style: { ...S.segBtn, ...f.frequency === v ? { background: "#fff", color: "#1C1C1E", boxShadow: "0 1px 3px rgba(0,0,0,.1)" } : {}, textTransform: "capitalize" } }, v)))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Lbl, null, "Data Inizio"), /* @__PURE__ */ React.createElement(Inp, { type: "date", value: f.startDate, onChange: (e) => set("startDate", e.target.value) })), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Lbl, null, "Categoria"), /* @__PURE__ */ React.createElement("select", { style: { ...S.inp }, value: f.categoryId, onChange: (e) => set("categoryId", e.target.value) }, cats.map((c) => /* @__PURE__ */ React.createElement("option", { key: c.id, value: c.id }, c.i, " ", c.n)))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, background: "#F2F2F7", borderRadius: 10, padding: "12px 14px" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 15, fontWeight: 600, color: "#1C1C1E" } }, "Attivo"), /* @__PURE__ */ React.createElement(Toggle, { checked: f.enabled, onChange: (v) => set("enabled", v) })), /* @__PURE__ */ React.createElement("button", { onClick: handleSave, style: { ...S.btn, background: "#007AFF", color: "#fff" } }, rec ? "Salva" : "Aggiungi"), rec && /* @__PURE__ */ React.createElement("button", { onClick: () => onDelete(rec.id), style: { ...S.btn, background: "rgba(255,59,48,.1)", color: "#FF3B30", marginTop: 8 } }, "Elimina"));
}
function AuthScreen({ onSkip }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [mode, setMode] = useState("login");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const inp = { width: "100%", background: "rgba(255,255,255,.2)", border: "1.5px solid rgba(255,255,255,.4)", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 600, padding: "12px 16px", fontFamily: "inherit", outline: "none", marginBottom: 10, WebkitAppearance: "none", boxSizing: "border-box" };
  const go = async () => {
    if (!email.trim() || pw.length < 6) {
      setMsg("Inserisci email e una password di almeno 6 caratteri.");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      if (mode === "login") {
        const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password: pw });
        if (error) setMsg(error.message === "Invalid login credentials" ? "Email o password non corretti." : error.message);
      } else {
        const { data, error } = await sb.auth.signUp({ email: email.trim(), password: pw });
        if (error) setMsg(error.message);
        else if (!data.session) setMsg("Account creato. Controlla la posta e conferma l'email, poi accedi.");
      }
    } catch (e) {
      setMsg("Errore di rete: " + e.message);
    }
    setBusy(false);
  };
  return /* @__PURE__ */ React.createElement("div", { style: S.obScreen }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.7 } }, "Super"), "AD", /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.7 } }, "Wallet")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "rgba(255,255,255,.85)", marginBottom: 24, textAlign: "center" } }, mode === "login" ? "Accedi per sincronizzare i tuoi dati" : "Crea il tuo account"), /* @__PURE__ */ React.createElement("input", { style: inp, type: "email", placeholder: "Email", autoCapitalize: "none", autoCorrect: "off", value: email, onChange: (e) => setEmail(e.target.value) }), /* @__PURE__ */ React.createElement("input", { style: inp, type: "password", placeholder: "Password (min. 6 caratteri)", value: pw, onChange: (e) => setPw(e.target.value), onKeyDown: (e) => e.key === "Enter" && go() }), msg && /* @__PURE__ */ React.createElement("div", { style: { color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 10, textAlign: "center", background: "rgba(0,0,0,.2)", padding: "8px 12px", borderRadius: 10, width: "100%", boxSizing: "border-box" } }, msg), /* @__PURE__ */ React.createElement("button", { onClick: go, disabled: busy, style: { width: "100%", padding: 14, borderRadius: 14, background: "#fff", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 800, color: "#007AFF", fontFamily: "inherit", marginTop: 4, opacity: busy ? 0.6 : 1 } }, busy ? "..." : mode === "login" ? "Accedi" : "Crea account"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setMode(mode === "login" ? "signup" : "login");
    setMsg("");
  }, style: { background: "none", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, marginTop: 16, cursor: "pointer", fontFamily: "inherit" } }, mode === "login" ? "Non hai un account? Registrati" : "Hai gi\xE0 un account? Accedi"), /* @__PURE__ */ React.createElement("button", { onClick: onSkip, style: { background: "none", border: "none", color: "rgba(255,255,255,.8)", fontSize: 13, marginTop: 10, cursor: "pointer", fontFamily: "inherit" } }, "Continua senza account"));
}
function Onboarding({ onComplete }) {
  const [nome, setNome] = useState("");
  const [emoji, setEmoji] = useState("\u{1F60A}");
  const [bg, setBg] = useState("#007AFF");
  const [step, setStep] = useState(1);
  const go = () => {
    if (!nome.trim()) return alert("Inserisci il tuo nome");
    setStep(2);
  };
  return /* @__PURE__ */ React.createElement("div", { style: S.obScreen }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.7 } }, "Super"), "AD", /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.7 } }, "Wallet")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "rgba(255,255,255,.8)", marginBottom: 28 } }, step === 1 ? "Benvenuto! Come ti chiami?" : "Scegli il tuo avatar"), /* @__PURE__ */ React.createElement("div", { style: { width: 80, height: 80, borderRadius: "50%", background: bg, border: "3px solid rgba(255,255,255,.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, marginBottom: 22 } }, emoji), step === 1 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("input", { style: { width: "100%", background: "rgba(255,255,255,.2)", border: "1.5px solid rgba(255,255,255,.4)", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 600, padding: "12px 16px", fontFamily: "inherit", outline: "none", marginBottom: 10, WebkitAppearance: "none", boxSizing: "border-box" }, placeholder: "Il tuo nome...", value: nome, onChange: (e) => setNome(e.target.value), onKeyDown: (e) => e.key === "Enter" && go(), autoFocus: true }), /* @__PURE__ */ React.createElement("button", { onClick: go, style: { width: "100%", padding: 14, borderRadius: 14, background: "#fff", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 800, color: "#007AFF", fontFamily: "inherit", marginTop: 6 } }, "Continua \u2192")), step === 2 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 12, width: "100%" } }, AVATAR_EMOJIS.map((em) => /* @__PURE__ */ React.createElement("div", { key: em, onClick: () => setEmoji(em), style: { width: 46, height: 46, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, cursor: "pointer", border: emoji === em ? "2.5px solid #fff" : "2.5px solid transparent", background: bg + "33" } }, em))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", justifyContent: "center" } }, AVATAR_BG.map((c) => /* @__PURE__ */ React.createElement("div", { key: c, onClick: () => setBg(c), style: { width: 26, height: 26, borderRadius: "50%", background: c, cursor: "pointer", border: bg === c ? "2.5px solid #fff" : "2.5px solid transparent" } }))), /* @__PURE__ */ React.createElement("button", { onClick: () => onComplete({ nome: nome.trim(), emoji, bg }), style: { width: "100%", padding: 14, borderRadius: 14, background: "#fff", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 800, color: "#007AFF", fontFamily: "inherit" } }, "Inizia \u2713")));
}
function Dashboard({ txs, cats, profile, onOpenTx, onEditProfile }) {
  const [period, setPeriod] = useState("mese");
  const [offset, setOffset] = useState(0);
  const [view, setView] = useState("uscite");
  const now = /* @__PURE__ */ new Date();
  const { start, end, label } = useMemo(() => {
    if (period === "giorno") {
      const d = new Date(now);
      d.setDate(d.getDate() + offset);
      const ds = d.toISOString().split("T")[0];
      const lbl = d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
      return { start: ds, end: ds, label: lbl.charAt(0).toUpperCase() + lbl.slice(1) };
    }
    if (period === "settimana") {
      const d = new Date(now);
      d.setDate(d.getDate() + offset * 7);
      const mon = new Date(d);
      mon.setDate(d.getDate() - (d.getDay() + 6) % 7);
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      const ds = (s) => s.toISOString().split("T")[0];
      const fD = (s) => s.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
      return { start: ds(mon), end: ds(sun), label: fD(mon) + " \u2013 " + fD(sun) };
    }
    if (period === "mese") {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      const y = d.getFullYear(), m = d.getMonth();
      const s = y + "-" + String(m + 1).padStart(2, "0") + "-01";
      const e = y + "-" + String(m + 1).padStart(2, "0") + "-31";
      const lbl = d.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
      return { start: s, end: e, label: lbl.charAt(0).toUpperCase() + lbl.slice(1) };
    }
    if (period === "anno") {
      const y = now.getFullYear() + offset;
      return { start: y + "-01-01", end: y + "-12-31", label: String(y) };
    }
    return { start: todayStr(), end: todayStr(), label: "Oggi" };
  }, [period, offset]);
  const filtered = useMemo(
    () => txs.filter((t) => t.date >= start && t.date <= end),
    [txs, start, end]
  );
  const totI = filtered.filter((t) => t.type === "entrata").reduce((s, t) => s + t.amount, 0);
  const totE = filtered.filter((t) => t.type === "uscita").reduce((s, t) => s + t.amount, 0);
  const bal = txs.filter((t) => t.type === "entrata").reduce((s, t) => s + t.amount, 0) - txs.filter((t) => t.type === "uscita").reduce((s, t) => s + t.amount, 0);
  const pieData = useMemo(() => {
    const m = {};
    filtered.filter((t) => view === "uscite" ? t.type === "uscita" : t.type === "entrata").forEach((t) => {
      m[t.categoryId] = (m[t.categoryId] || 0) + t.amount;
    });
    const tot = Object.values(m).reduce((s, v) => s + v, 0);
    if (tot === 0) return [];
    return Object.entries(m).map(([id, v]) => {
      const cat = cats.find((c) => c.id === id) || CATS[CATS.length - 1];
      return { name: cat.n, value: Math.round(v * 100) / 100, color: cat.c, pct: Math.round(v / tot * 100) };
    }).sort((a, b) => b.value - a.value);
  }, [filtered, cats, view]);
  const lineData = useMemo(() => {
    if (period === "giorno") {
      const days = [];
      const endD = /* @__PURE__ */ new Date(end + "T00:00:00");
      for (let i = 6; i >= 0; i--) {
        const d = new Date(endD);
        d.setDate(d.getDate() - i);
        const ds = d.toISOString().split("T")[0];
        days.push({
          label: d.toLocaleDateString("it-IT", { weekday: "short" }),
          v: txs.filter((t) => t.date === ds && t.type === view).reduce((s, t) => s + t.amount, 0)
        });
      }
      return days;
    }
    if (period === "settimana") {
      const days = [];
      const startD = /* @__PURE__ */ new Date(start + "T00:00:00");
      for (let i = 0; i < 7; i++) {
        const d = new Date(startD);
        d.setDate(d.getDate() + i);
        const ds = d.toISOString().split("T")[0];
        days.push({
          label: d.toLocaleDateString("it-IT", { weekday: "short" }),
          v: txs.filter((t) => t.date === ds && t.type === view).reduce((s, t) => s + t.amount, 0)
        });
      }
      return days;
    }
    if (period === "mese") {
      const days = [];
      const startD = /* @__PURE__ */ new Date(start + "T00:00:00");
      const endD = /* @__PURE__ */ new Date(end.replace("-31", "-28") + "T00:00:00");
      const lastDay = new Date(startD.getFullYear(), startD.getMonth() + 1, 0);
      const weeks = [];
      let cur = new Date(startD);
      while (cur <= lastDay) {
        const weekEnd = new Date(cur);
        weekEnd.setDate(cur.getDate() + 6);
        if (weekEnd > lastDay) weekEnd.setTime(lastDay.getTime());
        const ws = cur.toISOString().split("T")[0];
        const we = weekEnd.toISOString().split("T")[0];
        const v = txs.filter((t) => t.date >= ws && t.date <= we && t.type === view).reduce((s, t) => s + t.amount, 0);
        weeks.push({ label: cur.getDate() + "/" + (cur.getMonth() + 1), v });
        cur.setDate(cur.getDate() + 7);
      }
      return weeks;
    }
    if (period === "anno") {
      const months = [];
      const y = parseInt(start.slice(0, 4));
      for (let m = 0; m < 12; m++) {
        const ms = y + "-" + String(m + 1).padStart(2, "0") + "-01";
        const me = y + "-" + String(m + 1).padStart(2, "0") + "-31";
        const v = txs.filter((t) => t.date >= ms && t.date <= me && t.type === view).reduce((s, t) => s + t.amount, 0);
        months.push({ label: new Date(y, m, 1).toLocaleDateString("it-IT", { month: "short" }), v });
      }
      return months;
    }
    return [];
  }, [txs, period, start, end, view]);
  const periodTxs = useMemo(
    () => filtered.filter((t) => view === "uscite" ? t.type === "uscita" : t.type === "entrata").sort((a, b) => b.date.localeCompare(a.date)),
    [filtered, view]
  );
  const h = (/* @__PURE__ */ new Date()).getHours();
  const gr = h < 12 ? "Buongiorno" : h < 18 ? "Buon pomeriggio" : "Buonasera";
  const pillStyle = (active) => ({
    flex: 1,
    padding: "8px 6px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: active ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.12)",
    outline: active ? "1.5px solid rgba(255,255,255,.6)" : "none",
    transition: ".15s"
  });
  return /* @__PURE__ */ React.createElement("div", { style: S.scroll }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "4px 16px 12px" } }, /* @__PURE__ */ React.createElement("div", { onClick: onEditProfile, style: { width: 42, height: 42, borderRadius: "50%", background: (profile == null ? void 0 : profile.bg) || "#007AFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer", flexShrink: 0 } }, (profile == null ? void 0 : profile.emoji) || "\u{1F60A}"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#8E8E93", fontWeight: 500 } }, gr, ","), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: "#1C1C1E", letterSpacing: "-.3px" } }, (profile == null ? void 0 : profile.nome) || "Utente", " \u{1F44B}")), /* @__PURE__ */ React.createElement("button", { onClick: onEditProfile, style: { background: "rgba(120,120,128,.12)", border: "none", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 15 } }, "\u270F\uFE0F")), /* @__PURE__ */ React.createElement("div", { style: S.card }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.75)" } }, "Saldo Totale"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: "-1px", margin: "3px 0 14px", lineHeight: 1 } }, fmt(bal)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: pillStyle(view === "entrate"), onClick: () => setView("entrate") }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,.7)" } }, "\u2191 ENTRATE"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#fff", marginTop: 2 } }, fmtS(totI)), view === "entrate" && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "rgba(255,255,255,.8)", marginTop: 2 } }, "\u25CF attivo")), /* @__PURE__ */ React.createElement("div", { style: pillStyle(view === "uscite"), onClick: () => setView("uscite") }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,.7)" } }, "\u2193 USCITE"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#fff", marginTop: 2 } }, fmtS(totE)), view === "uscite" && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "rgba(255,255,255,.8)", marginTop: 2 } }, "\u25CF attivo")))), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 10 } }, [["giorno", "Giorno"], ["settimana", "Sett."], ["mese", "Mese"], ["anno", "Anno"]].map(([v, l]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: v,
      onClick: () => {
        setPeriod(v);
        setOffset(0);
      },
      style: {
        flex: 1,
        padding: "6px 4px",
        borderRadius: 10,
        fontSize: 11,
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
        background: period === v ? "#007AFF" : "#fff",
        color: period === v ? "#fff" : "#8E8E93"
      }
    },
    l
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setOffset((o) => o - 1),
      style: { width: 34, height: 34, borderRadius: 10, border: "none", background: "#fff", fontSize: 18, cursor: "pointer", color: "#007AFF", display: "flex", alignItems: "center", justifyContent: "center" }
    },
    "\u2039"
  ), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#1C1C1E", textAlign: "center", flex: 1 } }, label), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setOffset((o) => Math.min(0, o + 1)),
      style: {
        width: 34,
        height: 34,
        borderRadius: 10,
        border: "none",
        background: "#fff",
        fontSize: 18,
        cursor: "pointer",
        color: offset >= 0 ? "#AEAEB2" : "#007AFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    },
    "\u203A"
  ))), /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 8px" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 12, padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#1C1C1E", marginBottom: 10 } }, view === "uscite" ? "Uscite" : "Entrate", " per Categoria \xB7 ", label), pieData.length > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(PieSVG, { data: pieData }), pieData.map((e) => /* @__PURE__ */ React.createElement("div", { key: e.name, style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 7 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 7, height: 7, borderRadius: "50%", background: e.color } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12 } }, e.name)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "#8E8E93", fontWeight: 600 } }, e.pct, "%"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 600, color: "#8E8E93" } }, fmt(e.value)))))) : /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "20px 0", color: "#8E8E93" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, marginBottom: 6 } }, "\u{1F4CA}"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13 } }, "Nessuna ", view === "uscite" ? "uscita" : "entrata", " in questo periodo")))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { ...S.sectionLabel, display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", null, "Transazioni \xB7 ", label), /* @__PURE__ */ React.createElement("span", { style: { color: "#8E8E93", fontWeight: 600 } }, periodTxs.length)), periodTxs.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "24px 16px", color: "#8E8E93" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 32, marginBottom: 6 } }, "\u{1F4B8}"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#3C3C43" } }, "Nessuna transazione"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, marginTop: 3 } }, "Tocca + per aggiungere")) : /* @__PURE__ */ React.createElement("div", { style: S.group }, periodTxs.map((tx) => /* @__PURE__ */ React.createElement(TxRow, { key: tx.id, tx, cats, onClick: onOpenTx })))));
}
function Movimenti({ txs, cats, onOpenTx }) {
  const [search, setSearch] = useState("");
  const [ft, setFt] = useState("tutti");
  const filtered = useMemo(() => [...txs].filter((t) => {
    if (ft === "uscite" && t.type !== "uscita") return false;
    if (ft === "entrate" && t.type !== "entrata") return false;
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date)), [txs, ft, search]);
  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach((t) => {
      if (!g[t.date]) g[t.date] = [];
      g[t.date].push(t);
    });
    return Object.entries(g).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);
  return /* @__PURE__ */ React.createElement("div", { style: S.scroll }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, background: "rgba(120,120,128,.12)", borderRadius: 9, padding: "7px 11px", margin: "8px 14px" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "#AEAEB2" } }, "\u{1F50D}"), /* @__PURE__ */ React.createElement("input", { style: { flex: 1, background: "none", border: "none", outline: "none", fontSize: 14, color: "#1C1C1E", fontFamily: "inherit" }, placeholder: "Cerca...", value: search, onChange: (e) => setSearch(e.target.value) }), search && /* @__PURE__ */ React.createElement("span", { style: { cursor: "pointer", color: "#AEAEB2", fontSize: 13 }, onClick: () => setSearch("") }, "\u2715")), /* @__PURE__ */ React.createElement("div", { style: S.seg }, [["tutti", "Tutti"], ["uscite", "Uscite"], ["entrate", "Entrate"]].map(([v, l]) => /* @__PURE__ */ React.createElement("button", { key: v, onClick: () => setFt(v), style: { ...S.segBtn, ...ft === v ? { background: "#fff", color: "#1C1C1E", boxShadow: "0 1px 3px rgba(0,0,0,.1)" } : {} } }, l))), grouped.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "40px 16px", color: "#8E8E93" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 36, marginBottom: 8 } }, "\u{1F50D}"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: "#3C3C43" } }, "Nessun risultato")) : grouped.map(([date, txsList]) => /* @__PURE__ */ React.createElement("div", { key: date, style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { ...S.sectionLabel, display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", null, fmtDF(date)), /* @__PURE__ */ React.createElement("span", { style: { color: "#FF3B30" } }, fmt(txsList.filter((t) => t.type === "uscita").reduce((s, t) => s + t.amount, 0)))), /* @__PURE__ */ React.createElement("div", { style: S.group }, txsList.map((tx) => /* @__PURE__ */ React.createElement(TxRow, { key: tx.id, tx, cats, onClick: onOpenTx }))))));
}
function Ricorrenti({ recs, cats, onAdd, onEdit }) {
  const mensili = recs.filter((r) => r.frequency === "mensile");
  const annuali = recs.filter((r) => r.frequency === "annuale");
  const totM = mensili.filter((r) => r.enabled).reduce((s, r) => s + r.amount, 0);
  const totA = annuali.filter((r) => r.enabled).reduce((s, r) => s + r.amount, 0);
  const RecRow = ({ r }) => {
    const cat = cats.find((c) => c.id === r.categoryId) || CATS[CATS.length - 1];
    return /* @__PURE__ */ React.createElement("div", { style: { ...S.row, opacity: r.enabled ? 1 : 0.5 }, onClick: () => onEdit(r) }, /* @__PURE__ */ React.createElement("div", { style: { ...S.rowIcon, background: cat.c + "22" } }, cat.i), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "#1C1C1E" } }, r.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#8E8E93", marginTop: 1 } }, "Da ", fmtD(r.startDate), " \xB7 ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "1px 6px", background: r.frequency === "mensile" ? "rgba(0,122,255,.12)" : "rgba(52,199,89,.12)", color: r.frequency === "mensile" ? "#007AFF" : "#34C759" } }, r.frequency), !r.enabled && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "#8E8E93", marginLeft: 4 } }, "\xB7 disabilitato"))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#FF3B30", flexShrink: 0 } }, "\u2212", fmt(r.amount)), /* @__PURE__ */ React.createElement("div", { style: { color: "#AEAEB2", fontSize: 16, marginLeft: 4 } }, "\u203A"));
  };
  return /* @__PURE__ */ React.createElement("div", { style: S.scroll }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, padding: "0 14px 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, background: "#fff", borderRadius: 14, padding: "14px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#8E8E93", fontWeight: 600 } }, "MENSILE FISSO"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: "#FF3B30", marginTop: 4 } }, "\u2212", fmt(totM))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, background: "#fff", borderRadius: 14, padding: "14px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#8E8E93", fontWeight: 600 } }, "ANNUALE FISSO"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: "#FF9500", marginTop: 4 } }, "\u2212", fmt(totA)))), /* @__PURE__ */ React.createElement("div", { style: { margin: "0 14px 14px", background: "rgba(0,122,255,.07)", borderRadius: 12, padding: "12px 14px", fontSize: 13, color: "#8E8E93", lineHeight: 1.5 } }, "\u{1F504} Le spese ricorrenti vengono aggiunte automaticamente come transazioni ogni mese."), mensili.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: S.sectionLabel }, "Mensili"), /* @__PURE__ */ React.createElement("div", { style: S.group }, mensili.map((r) => /* @__PURE__ */ React.createElement(RecRow, { key: r.id, r })))), annuali.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: S.sectionLabel }, "Annuali"), /* @__PURE__ */ React.createElement("div", { style: S.group }, annuali.map((r) => /* @__PURE__ */ React.createElement(RecRow, { key: r.id, r })))), recs.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "48px 16px", color: "#8E8E93" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 44, marginBottom: 10 } }, "\u{1F501}"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: "#3C3C43", marginBottom: 4 } }, "Nessuna spesa ricorrente"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, lineHeight: 1.5 } }, "Aggiungi affitto, bollette,", /* @__PURE__ */ React.createElement("br", null), "abbonamenti e altre spese fisse")), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px" } }, /* @__PURE__ */ React.createElement("button", { onClick: onAdd, style: { ...S.btn, background: "#007AFF", color: "#fff" } }, "+ Aggiungi Spesa Ricorrente")));
}
function Rapporti({ txs, cats }) {
  const [period, setPeriod] = useState("mese");
  const [offset, setOffset] = useState(0);
  const [selectedCat, setSelectedCat] = useState(null);
  const now = /* @__PURE__ */ new Date();
  const { start, end, label } = useMemo(() => {
    if (period === "giorno") {
      const d = new Date(now);
      d.setDate(d.getDate() + offset);
      const ds = d.toISOString().split("T")[0];
      const lbl = d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
      return { start: ds, end: ds, label: lbl.charAt(0).toUpperCase() + lbl.slice(1) };
    }
    if (period === "settimana") {
      const d = new Date(now);
      d.setDate(d.getDate() + offset * 7);
      const mon = new Date(d);
      mon.setDate(d.getDate() - (d.getDay() + 6) % 7);
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      const ds = (s) => s.toISOString().split("T")[0];
      const fmtS2 = (s) => s.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
      return { start: ds(mon), end: ds(sun), label: `${fmtS2(mon)} \u2013 ${fmtS2(sun)}` };
    }
    if (period === "mese") {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      const y = d.getFullYear(), m = d.getMonth();
      const s = `${y}-${String(m + 1).padStart(2, "0")}-01`;
      const e = `${y}-${String(m + 1).padStart(2, "0")}-31`;
      const lbl = d.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
      return { start: s, end: e, label: lbl.charAt(0).toUpperCase() + lbl.slice(1) };
    }
    if (period === "anno") {
      const y = now.getFullYear() + offset;
      return { start: `${y}-01-01`, end: `${y}-12-31`, label: `${y}` };
    }
    return { start: todayStr(), end: todayStr(), label: "Oggi" };
  }, [period, offset]);
  const filtered = txs.filter((t) => t.date >= start && t.date <= end);
  const totE = filtered.filter((t) => t.type === "uscita").reduce((s, t) => s + t.amount, 0);
  const totI = filtered.filter((t) => t.type === "entrata").reduce((s, t) => s + t.amount, 0);
  const bycat = useMemo(() => {
    const m = {};
    filtered.filter((t) => t.type === "uscita").forEach((t) => {
      m[t.categoryId] = (m[t.categoryId] || 0) + t.amount;
    });
    return Object.entries(m).map(([id, amt]) => {
      const cat = cats.find((c) => c.id === id) || CATS[CATS.length - 1];
      return { ...cat, amt, pct: totE > 0 ? Math.round(amt / totE * 100) : 0 };
    }).sort((a, b) => b.amt - a.amt);
  }, [filtered, cats, totE]);
  return /* @__PURE__ */ React.createElement("div", { style: S.scroll }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, padding: "0 14px 8px" } }, [["giorno", "Giorno"], ["settimana", "Sett."], ["mese", "Mese"], ["anno", "Anno"]].map(([v, l]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: v,
      onClick: () => {
        setPeriod(v);
        setOffset(0);
      },
      style: { flex: 1, padding: "6px 4px", borderRadius: 10, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", background: period === v ? "#007AFF" : "#fff", color: period === v ? "#fff" : "#8E8E93" }
    },
    l
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px 10px" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setOffset((o) => o - 1),
      style: { width: 34, height: 34, borderRadius: 10, border: "none", background: "#fff", fontSize: 18, cursor: "pointer", color: "#007AFF", display: "flex", alignItems: "center", justifyContent: "center" }
    },
    "\u2039"
  ), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#1C1C1E", textAlign: "center" } }, label), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setOffset((o) => Math.min(0, o + 1)),
      style: { width: 34, height: 34, borderRadius: 10, border: "none", background: "#fff", fontSize: 18, cursor: "pointer", color: offset >= 0 ? "#AEAEB2" : "#007AFF", display: "flex", alignItems: "center", justifyContent: "center" }
    },
    "\u203A"
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, padding: "0 14px 10px" } }, [["Entrate", fmt(totI), "#34C759"], ["Uscite", fmt(totE), "#FF3B30"], ["Saldo", fmt(totI - totE), totI - totE >= 0 ? "#34C759" : "#FF3B30"]].map(
    ([l, v, c]) => /* @__PURE__ */ React.createElement("div", { key: l, style: { background: "#fff", borderRadius: 10, padding: "10px 8px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#8E8E93", fontWeight: 600 } }, l.toUpperCase()), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 800, color: c, marginTop: 3, wordBreak: "break-all" } }, v))
  )), bycat.length > 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: S.sectionLabel }, "Per Categoria \u2014 tocca per dettaglio"), /* @__PURE__ */ React.createElement("div", { style: S.group }, bycat.map((c) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: c.id,
      style: { padding: "10px 14px", borderBottom: "0.5px solid rgba(60,60,67,.12)", cursor: "pointer" },
      onClick: () => setSelectedCat(selectedCat === c.id ? null : c.id)
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 5 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600 } }, c.i, " ", c.n), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: c.c, background: c.c + "18", borderRadius: 6, padding: "1px 6px" } }, c.pct, "%"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700 } }, fmt(c.amt)), /* @__PURE__ */ React.createElement("span", { style: { color: "#AEAEB2", fontSize: 14, transition: ".2s", transform: selectedCat === c.id ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" } }, "\u203A"))),
    /* @__PURE__ */ React.createElement("div", { style: { background: "rgba(120,120,128,.16)", borderRadius: 3, height: 5, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { width: `${c.pct}%`, height: "100%", background: c.c, borderRadius: 3 } })),
    selectedCat === c.id && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, borderTop: "0.5px solid rgba(60,60,67,.1)", paddingTop: 8 } }, filtered.filter((t) => t.type === "uscita" && t.categoryId === c.id).sort((a, b) => b.date.localeCompare(a.date)).map((tx) => /* @__PURE__ */ React.createElement("div", { key: tx.id, style: { display: "flex", alignItems: "center", gap: 8, paddingBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "#1C1C1E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, tx.description), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#8E8E93" } }, fmtD(tx.date), tx.tag ? " \xB7 \u{1F3F7}\uFE0F " + tx.tag : "")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#FF3B30", flexShrink: 0 } }, "\u2212", fmt(tx.amount)))))
  )))) : /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "40px 16px", color: "#8E8E93" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 36, marginBottom: 8 } }, "\u{1F4CA}"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: "#3C3C43" } }, "Nessun dato"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, marginTop: 4 } }, "Nessuna spesa per questo periodo")));
}
function Impostazioni({ account, cats, txs, recs, onCatSave, onCatDelete, onImport, onImportCats, onImportRecs, onAddRec, onEditRec }) {
  const [editCat, setEditCat] = useState(null);
  const [showSheet, setShowSheet] = useState(false);
  const [form, setForm] = useState({ name: "", i: "\u{1F4E6}", c: "#007AFF" });
  const EMOJIS = [
    // Casa & Utenze
    "\u{1F3E0}",
    "\u{1F3E1}",
    "\u{1F3E2}",
    "\u26A1",
    "\u{1F4A1}",
    "\u{1F525}",
    "\u{1F4A7}",
    "\u{1F6BF}",
    "\u{1F6C1}",
    "\u{1F9F9}",
    "\u{1F9FA}",
    "\u{1F527}",
    "\u{1F528}",
    "\u{1FA9A}",
    "\u{1F6CB}\uFE0F",
    "\u{1FAB4}",
    // Cibo & Bevande
    "\u{1F6D2}",
    "\u{1F37D}\uFE0F",
    "\u2615",
    "\u{1F355}",
    "\u{1F354}",
    "\u{1F32E}",
    "\u{1F363}",
    "\u{1F35C}",
    "\u{1F957}",
    "\u{1F377}",
    "\u{1F37A}",
    "\u{1F964}",
    "\u{1F9C3}",
    "\u{1F382}",
    "\u{1F370}",
    "\u{1F9C1}",
    // Sport & Attività
    "\u{1F3CB}\uFE0F",
    "\u{1F3CA}",
    "\u{1F9D8}",
    "\u{1F6B4}",
    "\u{1F3C3}",
    "\u26F7\uFE0F",
    "\u{1F3BE}",
    "\u{1F3D0}",
    "\u{1F3D6}\uFE0F",
    "\u{1F3AF}",
    "\u{1F94A}",
    "\u26BD",
    "\u{1F3C0}",
    "\u{1F3BF}",
    "\u{1F3C4}",
    "\u{1F6F9}",
    // Trasporti
    "\u{1F697}",
    "\u26FD",
    "\u{1F68C}",
    "\u{1F695}",
    "\u2708\uFE0F",
    "\u{1F682}",
    "\u{1F6F5}",
    "\u{1F681}",
    "\u26F5",
    "\u{1F6A2}",
    "\u{1F17F}\uFE0F",
    "\u{1F6E3}\uFE0F",
    // Shopping & Moda
    "\u{1F457}",
    "\u{1F460}",
    "\u{1F454}",
    "\u{1F6CD}\uFE0F",
    "\u{1F484}",
    "\u{1F48D}",
    "\u231A",
    "\u{1F452}",
    "\u{1F9F4}",
    "\u{1FAA5}",
    "\u{1F9F8}",
    "\u{1F380}",
    // Salute
    "\u{1F48A}",
    "\u{1F3E5}",
    "\u{1FA7A}",
    "\u{1F9B7}",
    "\u{1F453}",
    "\u{1FA79}",
    "\u{1F489}",
    "\u{1F9EC}",
    "\u{1F321}\uFE0F",
    // Intrattenimento
    "\u{1F3AC}",
    "\u{1F3B5}",
    "\u{1F3AE}",
    "\u{1F4DA}",
    "\u{1F3AD}",
    "\u{1F3AA}",
    "\u{1F3A8}",
    "\u{1F3B8}",
    "\u{1F3B9}",
    "\u{1F3B2}",
    "\u{1F0CF}",
    "\u{1F3A4}",
    // Lavoro & Tech
    "\u{1F4BC}",
    "\u{1F5A5}\uFE0F",
    "\u{1F4F1}",
    "\u2328\uFE0F",
    "\u{1F5A8}\uFE0F",
    "\u{1F4F7}",
    "\u{1F52C}",
    "\u{1F4CA}",
    "\u{1F4CB}",
    "\u270F\uFE0F",
    "\u{1F4CE}",
    "\u{1F5C2}\uFE0F",
    // Animali
    "\u{1F43E}",
    "\u{1F436}",
    "\u{1F431}",
    "\u{1F420}",
    "\u{1F430}",
    "\u{1F99C}",
    "\u{1F434}",
    "\u{1F411}",
    // Natura & Sport Acqua
    "\u{1F30A}",
    "\u{1F3C4}",
    "\u{1F93D}",
    "\u{1F6A3}",
    "\u{1F3D5}\uFE0F",
    "\u26FA",
    "\u{1F332}",
    "\u{1F338}",
    "\u{1F33B}",
    "\u2600\uFE0F",
    "\u{1F319}",
    // Finanza
    "\u{1F4B0}",
    "\u{1F4B3}",
    "\u{1F3E6}",
    "\u{1F4C8}",
    "\u{1F4B8}",
    "\u{1F4B5}",
    "\u{1FA99}",
    "\u{1F911}",
    // Varie
    "\u{1F381}",
    "\u{1F504}",
    "\u{1F4E6}",
    "\u2708\uFE0F",
    "\u{1F3E8}",
    "\u{1F393}",
    "\u{1F389}",
    "\u{1F38A}",
    "\u{1F56F}\uFE0F",
    "\u{1FA91}",
    "\u{1F6CF}\uFE0F",
    "\u{1F6AA}",
    // Lavanderia & Pulizie
    "\u{1F9FA}",
    "\u{1F455}",
    "\u{1F45A}",
    "\u{1F9FD}",
    "\u{1FAA3}",
    "\u{1FAE7}"
  ];
  const openCat = (c = null) => {
    setEditCat(c);
    setForm(c ? { name: c.n, i: c.i, c: c.c } : { name: "", i: "\u{1F4E6}", c: "#007AFF" });
    setShowSheet(true);
  };
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const save = () => {
    if (!form.name.trim()) return alert("Inserisci un nome");
    onCatSave({ id: (editCat == null ? void 0 : editCat.id) || uid(), n: form.name, i: form.i, c: form.c });
    setShowSheet(false);
  };
  const exportExcel = () => {
    const BOM = "\uFEFF";
    const headers = ["Data", "Descrizione", "Categoria", "CategoriaID", "Tipo", "Importo", "Metodo", "Tag", "Note"];
    const rows = txs.map((t) => {
      const cat = cats.find((c) => c.id === t.categoryId);
      const esc = (s) => (s || "").replace(/"/g, "");
      return [t.date, esc(t.description), esc((cat == null ? void 0 : cat.n) || "Altro"), t.categoryId || "", t.type === "entrata" ? "Entrata" : "Uscita", t.amount.toString().replace(".", ","), esc(t.paymentMethod), esc(t.tag), esc(t.notes)].join(";");
    });
    const csv = BOM + [headers.join(";"), ...rows].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    a.download = "SuperADWallet_" + todayStr() + ".csv";
    a.click();
    setTimeout(() => {
      const backup = {
        version: 1,
        exportDate: todayStr(),
        categories: cats,
        recurrings: recs,
        transactions: txs
      };
      const b = document.createElement("a");
      b.href = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
      b.download = "SuperADWallet_backup_" + todayStr() + ".json";
      b.click();
    }, 500);
  };
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      var _a, _b, _c;
      try {
        const text = ev.target.result.replace(/^\uFEFF/, "");
        if (file.name.endsWith(".json")) {
          const backup = JSON.parse(text);
          if (!backup.version) return alert("File JSON non valido");
          if (!window.confirm("Ripristinare il backup completo?\n\nVerranno importati:\n\u2022 " + (backup.transactions || []).length + " transazioni\n\u2022 " + (backup.categories || []).length + " categorie\n\u2022 " + (backup.recurrings || []).length + " spese fisse\n\nAttenzione: i dati attuali NON verranno cancellati, verranno aggiunti.")) return;
          if ((_a = backup.categories) == null ? void 0 : _a.length) onImportCats(backup.categories);
          if ((_b = backup.recurrings) == null ? void 0 : _b.length) onImportRecs(backup.recurrings);
          if ((_c = backup.transactions) == null ? void 0 : _c.length) onImport(backup.transactions);
          alert("\u2705 Backup ripristinato!");
          e.target.value = "";
          return;
        }
        const lines = text.split(/\r?\n/).filter((l) => l.trim());
        const sep = lines[0].includes(";") ? ";" : ",";
        const headers = lines[0].split(sep).map((h) => h.replace(/^"|"$/g, "").toLowerCase().trim());
        const getCol = (row, names) => {
          for (const n of names) {
            const idx = headers.indexOf(n);
            if (idx >= 0) return (row[idx] || "").replace(/^"|"$/g, "").trim();
          }
          return "";
        };
        const imported = [];
        const newCats = [];
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(sep);
          const date = getCol(row, ["data", "date"]);
          const amtRaw = getCol(row, ["importo", "amount", "valore"]).replace(",", ".");
          const amt = parseFloat(amtRaw);
          if (!date || isNaN(amt) || amt <= 0) continue;
          const tipoRaw = getCol(row, ["tipo", "type"]).toLowerCase();
          const type = tipoRaw.includes("entr") ? "entrata" : "uscita";
          const catId = getCol(row, ["categoriaid"]);
          const catName = getCol(row, ["categoria", "category"]);
          const catById = catId ? cats.find((c) => c.id === catId) : null;
          const catByName = cats.find((c) => c.n.toLowerCase() === catName.toLowerCase());
          let resolvedCat = catById || catByName;
          if (!resolvedCat && catId && catName) {
            resolvedCat = newCats.find((c) => c.id === catId);
            if (!resolvedCat) {
              resolvedCat = { id: catId, n: catName.trim(), i: "\u{1F4E6}", c: "#8E8E93" };
              newCats.push(resolvedCat);
            }
          }
          imported.push({
            id: uid(),
            date,
            amount: amt,
            type,
            categoryId: (resolvedCat == null ? void 0 : resolvedCat.id) || "c-altro",
            description: getCol(row, ["descrizione", "description"]) || catName || "Importato",
            paymentMethod: getCol(row, ["metodo", "paymentmethod"]) || "Altro",
            tag: getCol(row, ["tag"]) || "",
            notes: "",
            auto: false
          });
        }
        if (imported.length === 0) return alert("Nessuna transazione trovata.");
        if (window.confirm("Importare " + imported.length + " transazioni?")) {
          if (newCats.length) onImportCats(newCats);
          onImport(imported);
          alert("\u2705 " + imported.length + " transazioni importate!" + (newCats.length ? "\n" + newCats.length + " categorie ricreate." : ""));
        }
      } catch (err) {
        alert("Errore: " + err.message);
      }
      e.target.value = "";
    };
    reader.readAsText(file, "UTF-8");
  };
  return /* @__PURE__ */ React.createElement("div", { style: S.scroll }, account && account.hasSb && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: S.sectionLabel }, "Account e sincronizzazione"), /* @__PURE__ */ React.createElement("div", { style: S.group }, /* @__PURE__ */ React.createElement("div", { style: { ...S.row, cursor: "default" } }, /* @__PURE__ */ React.createElement("div", { style: { ...S.rowIcon, background: "rgba(0,122,255,.12)" } }, account.email ? "\u2601\uFE0F" : "\u{1F4F1}"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "#1C1C1E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, account.email || "Solo su questo dispositivo"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: account.state === "err" ? "#FF3B30" : "#8E8E93", marginTop: 1 } }, !account.email ? "Accedi per sincronizzare" : account.state === "sync" ? "Sincronizzazione\u2026" : account.state === "ok" ? "Sincronizzato \u2713" : account.state === "err" ? "Errore: " + (account.msg || "sconosciuto") : "")), account.email ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { onClick: account.onSync, style: { background: "none", border: "none", color: "#007AFF", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "Aggiorna"), /* @__PURE__ */ React.createElement("button", { onClick: account.onLogout, style: { background: "none", border: "none", color: "#FF3B30", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "Esci")) : /* @__PURE__ */ React.createElement("button", { onClick: account.onLogin, style: { background: "none", border: "none", color: "#007AFF", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "Accedi")))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { ...S.sectionLabel, display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", null, "Categorie (", cats.length, ")"), /* @__PURE__ */ React.createElement("button", { onClick: () => openCat(), style: { background: "none", border: "none", color: "#007AFF", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "+ Nuova")), /* @__PURE__ */ React.createElement("div", { style: S.group }, cats.map((c) => /* @__PURE__ */ React.createElement("div", { key: c.id, style: S.row, onClick: () => openCat(c) }, /* @__PURE__ */ React.createElement("div", { style: { ...S.rowIcon, background: c.c + "22" } }, c.i), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 14, fontWeight: 500, color: "#1C1C1E" } }, c.n), /* @__PURE__ */ React.createElement("div", { style: { color: "#AEAEB2", fontSize: 16 } }, "\u203A"))))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { ...S.sectionLabel, display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", null, "Spese Fisse (", recs.length, ")"), /* @__PURE__ */ React.createElement("button", { onClick: onAddRec, style: { background: "none", border: "none", color: "#007AFF", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "+ Nuova")), recs.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "#8E8E93", padding: "0 3px 8px" } }, "Aggiungi affitto, bollette, abbonamenti..."), recs.length > 0 && /* @__PURE__ */ React.createElement("div", { style: S.group }, recs.map((r) => {
    const cat = cats.find((c) => c.id === r.categoryId) || CATS[CATS.length - 1];
    return /* @__PURE__ */ React.createElement("div", { key: r.id, style: { ...S.row, opacity: r.enabled ? 1 : 0.5 }, onClick: () => onEditRec(r) }, /* @__PURE__ */ React.createElement("div", { style: { ...S.rowIcon, background: cat.c + "22" } }, cat.i), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "#1C1C1E" } }, r.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#8E8E93", marginTop: 1 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "1px 6px", background: r.frequency === "mensile" ? "rgba(0,122,255,.12)" : "rgba(52,199,89,.12)", color: r.frequency === "mensile" ? "#007AFF" : "#34C759" } }, r.frequency), !r.enabled && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 5 } }, "\xB7 disabilitato"))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#FF3B30", flexShrink: 0 } }, "\u2212", fmt(r.amount)), /* @__PURE__ */ React.createElement("div", { style: { color: "#AEAEB2", fontSize: 16, marginLeft: 4 } }, "\u203A"));
  }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: S.sectionLabel }, "Esporta & Importa"), /* @__PURE__ */ React.createElement("div", { style: S.group }, /* @__PURE__ */ React.createElement("div", { style: S.row, onClick: exportExcel }, /* @__PURE__ */ React.createElement("div", { style: { ...S.rowIcon, background: "rgba(52,199,89,.15)" } }, "\u{1F4CA}"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "#1C1C1E" } }, "Esporta CSV + Backup JSON"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#8E8E93", marginTop: 1 } }, txs.length, " transazioni \xB7 include categorie e fissi")), /* @__PURE__ */ React.createElement("div", { style: { color: "#AEAEB2", fontSize: 16 } }, "\u203A")), /* @__PURE__ */ React.createElement("label", { style: { ...S.row, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { ...S.rowIcon, background: "rgba(0,122,255,.15)" } }, "\u{1F4E5}"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "#1C1C1E" } }, "Importa CSV o Backup JSON"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#8E8E93", marginTop: 1 } }, "CSV: transazioni \xB7 JSON: backup completo (categorie + fissi)")), /* @__PURE__ */ React.createElement("div", { style: { color: "#AEAEB2", fontSize: 16 } }, "\u203A"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".csv,.txt,.json", style: { display: "none" }, onChange: handleImport })))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "20px 0 8px", color: "#8E8E93", fontSize: 11 } }, "SuperADWallet \xB7 Dati salvati localmente"), showSheet && /* @__PURE__ */ React.createElement(Sheet, { title: editCat ? "Modifica" : "Nuova Categoria", onClose: () => setShowSheet(false), onSave: save }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14, background: "#F2F2F7", borderRadius: 10, padding: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 38, height: 38, borderRadius: 9, background: form.c + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 } }, form.i), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 15 } }, form.name || "Categoria")), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Lbl, null, "Nome"), /* @__PURE__ */ React.createElement(Inp, { type: "text", placeholder: "Nome categoria", value: form.name, onChange: (e) => set("name", e.target.value) })), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Lbl, null, "Emoji"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5, marginTop: 6 } }, EMOJIS.map((em) => /* @__PURE__ */ React.createElement("button", { key: em, onClick: () => set("i", em), style: { width: 36, height: 36, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", border: "none", background: form.i === em ? "rgba(0,122,255,.15)" : "rgba(120,120,128,.1)", outline: form.i === em ? "2px solid #007AFF" : "none" } }, em)))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Lbl, null, "Colore"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 7, marginTop: 6 } }, CAT_COLORS.map((col) => /* @__PURE__ */ React.createElement("div", { key: col, onClick: () => set("c", col), style: { width: 28, height: 28, borderRadius: "50%", background: col, cursor: "pointer", border: form.c === col ? "3px solid #1C1C1E" : "3px solid transparent" } })))), /* @__PURE__ */ React.createElement("button", { onClick: save, style: { ...S.btn, background: "#007AFF", color: "#fff" } }, editCat ? "Salva" : "Crea"), editCat && /* @__PURE__ */ React.createElement("button", { onClick: () => {
    onCatDelete(editCat.id);
    setShowSheet(false);
  }, style: { ...S.btn, background: "rgba(255,59,48,.1)", color: "#FF3B30", marginTop: 8 } }, "Elimina")));
}
function Tags({ txs, cats, onRenameTag }) {
  const [selected, setSelected] = useState(null);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const allTags = useMemo(() => [...new Set(txs.map((t) => t.tag).filter(Boolean))].sort(), [txs]);
  const tagEmoji = (name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("vacanz") || n.includes("viaggio") || n.includes("trip")) return "\u2708\uFE0F";
    if (n.includes("matrimon")) return "\u{1F492}";
    if (n.includes("trasloco")) return "\u{1F4E6}";
    if (n.includes("natale")) return "\u{1F384}";
    if (n.includes("compleanno")) return "\u{1F382}";
    if (n.includes("lavoro") || n.includes("business")) return "\u{1F4BC}";
    return "\u{1F3F7}\uFE0F";
  };
  if (allTags.length === 0) return /* @__PURE__ */ React.createElement("div", { style: S.scroll }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "60px 20px", color: "#8E8E93" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 44, marginBottom: 10 } }, "\u{1F3F7}\uFE0F"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: "#3C3C43", marginBottom: 6 } }, "Nessun tag ancora"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, lineHeight: 1.6 } }, 'Aggiungi un tag alle transazioni per raggruppare spese \u2014 es. "Vacanza Irlanda"')));
  const tagData = useMemo(() => {
    if (!selected) return null;
    const tagged = txs.filter((t) => t.tag === selected);
    const totE = tagged.filter((t) => t.type === "uscita").reduce((s, t) => s + t.amount, 0);
    const totI = tagged.filter((t) => t.type === "entrata").reduce((s, t) => s + t.amount, 0);
    const bycat = {};
    tagged.filter((t) => t.type === "uscita").forEach((t) => {
      bycat[t.categoryId] = (bycat[t.categoryId] || 0) + t.amount;
    });
    const breakdown = Object.entries(bycat).map(([id, amt]) => {
      const cat = cats.find((c) => c.id === id) || { n: "Altro", i: "\u{1F4E6}", c: "#8E8E93", id };
      return { ...cat, amt, pct: totE > 0 ? Math.round(amt / totE * 100) : 0 };
    }).sort((a, b) => b.amt - a.amt);
    const dates = tagged.map((t) => t.date).sort();
    return { tagged, totE, totI, breakdown, dates };
  }, [selected, txs, cats]);
  return /* @__PURE__ */ React.createElement("div", { style: S.scroll }, !selected && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: S.sectionLabel }, allTags.length, " Tag / Progetti"), /* @__PURE__ */ React.createElement("div", { style: S.group }, allTags.map((tag) => {
    const tagged = txs.filter((t) => t.tag === tag);
    const totE = tagged.filter((t) => t.type === "uscita").reduce((s, t) => s + t.amount, 0);
    const totIn = tagged.filter((t) => t.type === "entrata").reduce((s, t) => s + t.amount, 0);
    const saldo = totIn - totE;
    const dates = tagged.map((t) => t.date).sort();
    return /* @__PURE__ */ React.createElement("div", { key: tag, style: S.row, onClick: () => setSelected(tag) }, /* @__PURE__ */ React.createElement("div", { style: { ...S.rowIcon, background: "rgba(175,82,222,.12)", fontSize: 20 } }, tagEmoji(tag)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "#1C1C1E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, tag), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#8E8E93", marginTop: 1 } }, tagged.length, " transazioni", dates[0] ? " \xB7 " + fmtD(dates[0]) : "", dates.length > 1 ? " \u2192 " + fmtD(dates[dates.length - 1]) : "")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: saldo >= 0 ? "#34C759" : "#FF3B30", flexShrink: 0 } }, saldo >= 0 ? "+" : "\u2212", fmt(Math.abs(saldo))), /* @__PURE__ */ React.createElement("div", { style: { color: "#AEAEB2", fontSize: 16, marginLeft: 4 } }, "\u203A"));
  }))), selected && tagData && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 8px" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setSelected(null), style: { background: "none", border: "none", color: "#007AFF", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 0" } }, "\u2039 Tutti i tag"), renaming ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 6 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      style: { ...S.inp, flex: 1, fontSize: 16, fontWeight: 700 },
      value: newName,
      onChange: (e) => setNewName(e.target.value),
      autoFocus: true,
      onKeyDown: (e) => {
        if (e.key === "Enter" && newName.trim()) {
          onRenameTag(selected, newName.trim());
          setSelected(newName.trim());
          setRenaming(false);
        }
        if (e.key === "Escape") setRenaming(false);
      }
    }
  ), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    if (newName.trim()) {
      onRenameTag(selected, newName.trim());
      setSelected(newName.trim());
    }
    setRenaming(false);
  }, style: { padding: "8px 14px", borderRadius: 10, background: "#007AFF", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "inherit" } }, "OK"), /* @__PURE__ */ React.createElement("button", { onClick: () => setRenaming(false), style: { padding: "8px 14px", borderRadius: 10, background: "rgba(120,120,128,.12)", color: "#8E8E93", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "inherit" } }, "\u2715")) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: "#1C1C1E", flex: 1 } }, tagEmoji(selected), " ", selected), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setNewName(selected);
        setRenaming(true);
      },
      style: { background: "rgba(0,122,255,.1)", border: "none", borderRadius: 8, padding: "5px 10px", color: "#007AFF", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }
    },
    "\u270F\uFE0F Rinomina"
  )), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#8E8E93" } }, tagData.tagged.length, " transazioni", tagData.dates[0] ? " \xB7 " + fmtD(tagData.dates[0]) : "", tagData.dates.length > 1 ? " \u2192 " + fmtD(tagData.dates[tagData.dates.length - 1]) : "")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, padding: "0 14px 10px" } }, [["Uscite", fmt(tagData.totE), "#FF3B30"], ["Entrate", fmt(tagData.totI), "#34C759"], ["Saldo", fmt(tagData.totI - tagData.totE), tagData.totI - tagData.totE >= 0 ? "#34C759" : "#FF3B30"]].map(([l, v, c]) => /* @__PURE__ */ React.createElement("div", { key: l, style: { background: "#fff", borderRadius: 10, padding: "10px 8px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#8E8E93", fontWeight: 600 } }, l.toUpperCase()), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 800, color: c, marginTop: 3, wordBreak: "break-all" } }, v)))), tagData.breakdown.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: S.sectionLabel }, "Per Categoria"), /* @__PURE__ */ React.createElement("div", { style: S.group }, tagData.breakdown.map((c) => /* @__PURE__ */ React.createElement("div", { key: c.id || c.n, style: { padding: "10px 14px", borderBottom: "0.5px solid rgba(60,60,67,.12)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 5 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600 } }, c.i, " ", c.n), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: c.c, background: c.c + "18", borderRadius: 6, padding: "1px 6px" } }, c.pct, "%"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700 } }, fmt(c.amt)))), /* @__PURE__ */ React.createElement("div", { style: { background: "rgba(120,120,128,.16)", borderRadius: 3, height: 4, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { width: `${c.pct}%`, height: "100%", background: c.c, borderRadius: 3 } })))))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: S.sectionLabel }, "Transazioni"), /* @__PURE__ */ React.createElement("div", { style: S.group }, tagData.tagged.sort((a, b) => b.date.localeCompare(a.date)).map((tx) => {
    const cat = cats.find((c) => c.id === tx.categoryId) || { i: "\u{1F4E6}", c: "#8E8E93", n: "Altro" };
    const isI = tx.type === "entrata";
    return /* @__PURE__ */ React.createElement("div", { key: tx.id, style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "0.5px solid rgba(60,60,67,.12)" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 9, background: cat.c + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 } }, cat.i), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, tx.description), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#8E8E93" } }, fmtD(tx.date), " \xB7 ", cat.n)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: isI ? "#34C759" : "#FF3B30", flexShrink: 0 } }, isI ? "+" : "\u2212", fmt(tx.amount)));
  })))));
}
function App() {
  const [tab, setTab] = useState("dashboard");
  const [cats, setCats] = useState(() => ld("sadw_cats5", CATS));
  const [txs, setTxs] = useState(() => ld("sadw_tx5", []));
  const [recs, setRecs] = useState(() => ld("sadw_rec5", []));
  const [profile, setProfile] = useState(() => {
    try {
      const v = localStorage.getItem("sadw_profile5");
      const p = v ? JSON.parse(v) : null;
      return p && p.nome ? p : null;
    } catch (e) {
      return null;
    }
  });
  const [showTx, setShowTx] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [showRec, setShowRec] = useState(false);
  const [editRec, setEditRec] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  useEffect(() => {
    const migrate = (oldKey, newKey) => {
      try {
        if (!localStorage.getItem(newKey)) {
          const oldKeys = [oldKey, oldKey.replace("5", "4"), oldKey.replace("5", "3"), oldKey.replace("5", "2"), oldKey.replace("sadw_", "saw_")];
          for (const k of oldKeys) {
            const v = localStorage.getItem(k);
            if (v && v !== "null") {
              localStorage.setItem(newKey, v);
              console.log("Migrated", k, "\u2192", newKey);
              break;
            }
          }
        }
      } catch (e) {
      }
    };
    migrate("sadw_tx4", "sadw_tx5");
    migrate("sadw_cats4", "sadw_cats5");
    migrate("sadw_rec4", "sadw_rec5");
    migrate("sadw_profile4", "sadw_profile5");
    migrate("saw_tx", "sadw_tx5");
    migrate("saw_cats", "sadw_cats5");
    migrate("saw_profile", "sadw_profile5");
    if (!localStorage.getItem("sadw_migrated_v5")) {
      localStorage.setItem("sadw_migrated_v5", "1");
      window.location.reload();
    }
  }, []);
  const txRef = useRef(txs);
  useEffect(() => {
    txRef.current = txs;
  }, [txs]);
  useEffect(() => {
    const clean = dedupTxs(txRef.current);
    const newTx = processRecurring(recs, clean);
    if (clean.length !== txRef.current.length || newTx.length > 0) setTxs(() => {
      const u = [...clean, ...newTx];
      sv("sadw_tx5", u);
      return u;
    });
  }, [recs]);
  const [session, setSession] = useState(sb ? void 0 : null);
  const [skipAuth, setSkipAuth] = useState(() => ld("sadw_skip_auth", false));
  const [syncState, setSyncState] = useState("off");
  const [syncMsg, setSyncMsg] = useState("");
  const stateRef = useRef({});
  stateRef.current = { tx: txs, cat: cats, rec: recs };
  const syncedRef = useRef({ tx: /* @__PURE__ */ new Map(), cat: /* @__PURE__ */ new Map(), rec: /* @__PURE__ */ new Map() });
  const readyRef = useRef(false);
  const changeRef = useRef(0);
  const chainRef = useRef(Promise.resolve());
  const queue = (fn) => {
    const r = chainRef.current.then(fn);
    chainRef.current = r.catch(() => {
    });
    return r;
  };
  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setSession(data.session || null)).catch(() => setSession(null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, sess) => setSession(sess || null));
    return () => sub.subscription.unsubscribe();
  }, []);
  const fetchKind = async (kind) => {
    let all = [], from = 0;
    for (; ; ) {
      const { data, error } = await sb.from(TABLES[kind]).select("id,data").range(from, from + 999);
      if (error) throw error;
      all = all.concat(data.map((r) => r.data));
      if (data.length < 1e3) break;
      from += 1e3;
    }
    return all;
  };
  const pushKind = async (kind, userId) => {
    const cur = new Map((stateRef.current[kind] || []).map((o) => [o.id, JSON.stringify(o)]));
    const synced = syncedRef.current[kind];
    const up = [];
    cur.forEach((j, id) => {
      if (synced.get(id) !== j) up.push({ id, user_id: userId, data: JSON.parse(j), updated_at: (/* @__PURE__ */ new Date()).toISOString() });
    });
    const del = [...synced.keys()].filter((id) => !cur.has(id));
    for (let i = 0; i < up.length; i += 400) {
      const { error } = await sb.from(TABLES[kind]).upsert(up.slice(i, i + 400), { onConflict: "user_id,id" });
      if (error) throw error;
    }
    for (let i = 0; i < del.length; i += 100) {
      const { error } = await sb.from(TABLES[kind]).delete().in("id", del.slice(i, i + 100));
      if (error) throw error;
    }
    syncedRef.current[kind] = cur;
  };
  const pushAll = () => queue(async () => {
    if (!sb || !session || !readyRef.current) return;
    setSyncState("sync");
    try {
      for (const k of KINDS) await pushKind(k, session.user.id);
      setSyncState("ok");
    } catch (e) {
      console.error("sync push", e);
      {
        setSyncState("err");
        setSyncMsg(String(e && (e.message || e.details || e.code) || e));
      }
      ;
      throw e;
    }
  });
  const toMap = (arr) => new Map(arr.map((o) => [o.id, JSON.stringify(o)]));
  const initialSync = () => queue(async () => {
    setSyncState("sync");
    try {
      const [rt, rc, rr] = await Promise.all(KINDS.map(fetchKind));
      const union = (local, remote) => {
        const m = new Map(local.map((o) => [o.id, o]));
        remote.forEach((o) => m.set(o.id, o));
        return [...m.values()];
      };
      const mt = union(stateRef.current.tx, rt), mc = union(stateRef.current.cat, rc), mr = union(stateRef.current.rec, rr);
      syncedRef.current = { tx: toMap(rt), cat: toMap(rc), rec: toMap(rr) };
      stateRef.current = { tx: mt, cat: mc, rec: mr };
      setTxs(mt);
      setCats(mc);
      setRecs(mr);
      readyRef.current = true;
      for (const k of KINDS) await pushKind(k, session.user.id);
      setSyncState("ok");
    } catch (e) {
      console.error("sync init", e);
      {
        setSyncState("err");
        setSyncMsg(String(e && (e.message || e.details || e.code) || e));
      }
      ;
    }
  });
  const refreshFromCloud = () => {
    if (!sb || !session || !readyRef.current) return Promise.resolve();
    return queue(async () => {
      setSyncState("sync");
      try {
        for (const k of KINDS) await pushKind(k, session.user.id);
        const v0 = changeRef.current;
        const [rt, rc, rr] = await Promise.all(KINDS.map(fetchKind));
        if (changeRef.current !== v0) {
          setSyncState("ok");
          return;
        }
        const same = (a, b) => a.size === b.size && [...a].every(([k, v]) => b.get(k) === v);
        const nt = toMap(rt), nc = toMap(rc), nr = toMap(rr);
        if (!same(nt, syncedRef.current.tx) || !same(nc, syncedRef.current.cat) || !same(nr, syncedRef.current.rec)) {
          syncedRef.current = { tx: nt, cat: nc, rec: nr };
          stateRef.current = { tx: rt, cat: rc, rec: rr };
          setTxs(rt);
          setCats(rc);
          setRecs(rr);
        }
        setSyncState("ok");
      } catch (e) {
        console.error("sync refresh", e);
        {
          setSyncState("err");
          setSyncMsg(String(e && (e.message || e.details || e.code) || e));
        }
        ;
      }
    });
  };
  useEffect(() => {
    readyRef.current = false;
    if (sb && session) initialSync();
    else setSyncState("off");
  }, [session && session.user && session.user.id]);
  useEffect(() => {
    changeRef.current++;
    if (!sb || !session || !readyRef.current) return;
    const t = setTimeout(() => {
      pushAll().catch(() => {
      });
    }, 1500);
    return () => clearTimeout(t);
  }, [txs, cats, recs]);
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") refreshFromCloud();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [session]);
  useEffect(() => {
    if (ld("sadw_restore_cats_v1", false)) return;
    const CUSTOM = [
      ["85whviya", "Interessi", "\u{1F3E6}", "#34C759"],
      ["3jmd4jpr", "Caffe Capsule", "\u2615", "#FF9500"],
      ["wgy4uk9m", "Donna Pulizie", "\u{1F9F9}", "#5AC8FA"],
      ["vr5l89g6", "Lavanderia", "\u{1F9FA}", "#007AFF"],
      ["ca3d61bf", "Arredamento", "\u{1F6CB}\uFE0F", "#AF52DE"],
      ["11e7u5eh", "Souvenir", "\u{1F5FF}", "#FF2D55"],
      ["cp5m0l9x", "Ama", "\u{1F5D1}\uFE0F", "#8E8E93"],
      ["5dvjntfg", "Shopping Lux", "\u231A", "#FFCC00"],
      ["sgz2u4ig", "Attivit\xE0", "\u{1F39F}\uFE0F", "#FF6B35"],
      ["c82gyq52", "Parking", "\u{1F17F}\uFE0F", "#007AFF"],
      ["vh7ffazg", "Museo/eventi", "\u{1F3DB}\uFE0F", "#C77DFF"],
      ["psibfmzg", "Riscaldamento", "\u{1F321}\uFE0F", "#FF3B30"],
      ["hshgyc85", "Condominio", "\u{1F3E2}", "#30B0C7"],
      ["ue38v6vb", "Calcetto", "\u26BD", "#34C759"],
      ["9rr617qq", "Cecilia", "\u{1F464}", "#4CD964"],
      ["04w4w3dy", "Mare", "\u{1F30A}", "#5AC8FA"],
      ["717m7uys", "Lavori casa", "\u{1F528}", "#FF9500"],
      ["5u73vzpx", "Golf", "\u26F3", "#34C759"],
      ["cjysjks3", "Fantacalcio", "\u{1F3C6}", "#AF52DE"],
      ["nxbdedzf", "Dentista", "\u{1F9B7}", "#FF2D55"]
    ];
    const RENAME = { "c-affitto": "Mutuo", "c-take": "delivery", "c-sport": "Beach Volley", "c-util": "Luce" };
    setCats((prev) => {
      const out = prev.map((c) => RENAME[c.id] && (c.n === "Affitto/Mutuo" || c.n === "Takeaway" || c.n === "Sport/Palestra" || c.n === "Utenze") ? { ...c, n: RENAME[c.id] } : c);
      CUSTOM.forEach(([id, n, i, c]) => {
        if (!out.find((x) => x.id === id)) out.push({ id, n, i, c });
      });
      sv("sadw_cats5", out);
      sv("sadw_restore_cats_v1", true);
      return out;
    });
  }, []);
  useEffect(() => sv("sadw_cats5", cats), [cats]);
  useEffect(() => sv("sadw_tx5", txs), [txs]);
  useEffect(() => sv("sadw_rec5", recs), [recs]);
  const saveTx = useCallback((tx) => {
    setTxs((prev) => {
      const i = prev.findIndex((t) => t.id === tx.id);
      return i >= 0 ? prev.map((t) => t.id === tx.id ? tx : t) : [...prev, tx];
    });
    setShowTx(false);
    setEditTx(null);
  }, []);
  const delTx = useCallback((id) => {
    const t0 = txRef.current.find((t) => t.id === id);
    if (t0 && t0.recurringId) setRecs((prev) => prev.map((r) => r.id === t0.recurringId ? { ...r, skipped: [...r.skipped || [], t0.date] } : r));
    setTxs((prev) => prev.filter((t) => t.id !== id));
    setShowTx(false);
    setEditTx(null);
  }, []);
  const saveCat = useCallback((cat) => setCats((prev) => {
    const i = prev.findIndex((c) => c.id === cat.id);
    return i >= 0 ? prev.map((c) => c.id === cat.id ? cat : c) : [...prev, cat];
  }), []);
  const delCat = useCallback((id) => setCats((prev) => prev.filter((c) => c.id !== id)), []);
  const saveRec = useCallback((rec) => {
    setRecs((prev) => {
      const i = prev.findIndex((r) => r.id === rec.id);
      return i >= 0 ? prev.map((r) => r.id === rec.id ? rec : r) : [...prev, rec];
    });
    setShowRec(false);
    setEditRec(null);
  }, []);
  const delRec = useCallback((id) => {
    setRecs((prev) => prev.filter((r) => r.id !== id));
    setShowRec(false);
    setEditRec(null);
  }, []);
  const openTx = (tx) => {
    setEditTx(tx);
    setShowTx(true);
  };
  const allTags = useMemo(() => [...new Set(txs.map((t) => t.tag).filter(Boolean))].sort(), [txs]);
  const importTxs = useCallback((imported) => {
    setTxs((prev) => {
      const key = (t) => `${t.date}|${Math.round(t.amount * 100)}|${t.type}|${(t.description || "").trim().toLowerCase()}`;
      const map = /* @__PURE__ */ new Map();
      prev.forEach((t) => {
        if (!map.has(key(t))) map.set(key(t), t);
      });
      const fixed = /* @__PURE__ */ new Map();
      const fresh = [];
      imported.forEach((t) => {
        const ex = map.get(key(t));
        if (ex) {
          if (t.categoryId && t.categoryId !== "c-altro" && ex.categoryId !== t.categoryId) fixed.set(ex.id, { ...ex, categoryId: t.categoryId, tag: ex.tag || t.tag || "" });
        } else fresh.push(t);
      });
      const base = prev.map((t) => fixed.get(t.id) || t);
      const u = dedupTxs([...base, ...fresh]);
      sv("sadw_tx5", u);
      return u;
    });
  }, []);
  const importCats = useCallback((imported) => {
    setCats((prev) => {
      const merged = [...prev];
      imported.forEach((c) => {
        if (!merged.find((e) => e.id === c.id)) merged.push(c);
      });
      sv("sadw_cats5", merged);
      return merged;
    });
  }, []);
  const importRecs = useCallback((imported) => {
    setRecs((prev) => {
      const merged = [...prev];
      imported.forEach((r) => {
        if (!merged.find((e) => e.id === r.id)) merged.push(r);
      });
      sv("sadw_rec5", merged);
      return merged;
    });
  }, []);
  const NAV = [
    { id: "dashboard", l: "Home", i: "\u{1F3E0}" },
    { id: "movimenti", l: "Movimenti", i: "\u{1F4CB}" },
    { id: "tags", l: "Tag", i: "\u{1F3F7}\uFE0F" },
    { id: "rapporti", l: "Rapporti", i: "\u{1F4CA}" },
    { id: "impostazioni", l: "Impost.", i: "\u2699\uFE0F" }
  ];
  const titles = { movimenti: "Movimenti", tags: "Tag & Progetti", rapporti: "Rapporti", impostazioni: "Impostazioni" };
  if (sb && session === void 0) return /* @__PURE__ */ React.createElement("div", { style: S.phone }, /* @__PURE__ */ React.createElement("div", { style: { ...S.obScreen, color: "#fff", fontWeight: 700 } }, "Caricamento\u2026"));
  if (sb && !session && !skipAuth) return /* @__PURE__ */ React.createElement("div", { style: S.phone }, /* @__PURE__ */ React.createElement(AuthScreen, { onSkip: () => {
    setSkipAuth(true);
    sv("sadw_skip_auth", true);
  } }));
  if (!profile || !profile.nome) {
    return /* @__PURE__ */ React.createElement("div", { style: S.phone }, /* @__PURE__ */ React.createElement(Onboarding, { onComplete: (p) => {
      setProfile(p);
      sv("sadw_profile5", p);
    } }));
  }
  return /* @__PURE__ */ React.createElement("div", { style: S.phone }, tab !== "dashboard" && /* @__PURE__ */ React.createElement("div", { style: { padding: "2px 16px 8px", background: "#F2F2F7", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 900, color: "#1C1C1E" } }, titles[tab])), tab === "dashboard" && /* @__PURE__ */ React.createElement(Dashboard, { txs, cats, profile, onOpenTx: openTx, onEditProfile: () => setShowProfile(true) }), tab === "movimenti" && /* @__PURE__ */ React.createElement(Movimenti, { txs, cats, onOpenTx: openTx }), tab === "tags" && /* @__PURE__ */ React.createElement(Tags, { txs, cats, onRenameTag: (oldTag, newTag) => {
    setTxs((prev) => {
      const u = prev.map((t) => t.tag === oldTag ? { ...t, tag: newTag } : t);
      sv("sadw_tx5", u);
      return u;
    });
  } }), tab === "rapporti" && /* @__PURE__ */ React.createElement(Rapporti, { txs, cats }), tab === "impostazioni" && /* @__PURE__ */ React.createElement(Impostazioni, { cats, txs, recs, onCatSave: saveCat, onCatDelete: delCat, onImport: importTxs, onImportCats: importCats, onImportRecs: importRecs, onAddRec: () => {
    setEditRec(null);
    setShowRec(true);
  }, onEditRec: (r) => {
    setEditRec(r);
    setShowRec(true);
  }, account: { email: session && session.user && session.user.email, state: syncState, msg: syncMsg, hasSb: !!sb, onLogin: () => {
    setSkipAuth(false);
    sv("sadw_skip_auth", false);
  }, onLogout: async () => {
    if (window.confirm("Uscire dall'account? I dati restano su questo dispositivo.")) {
      readyRef.current = false;
      await sb.auth.signOut();
      setSkipAuth(true);
      sv("sadw_skip_auth", true);
    }
  }, onSync: () => refreshFromCloud() } }), /* @__PURE__ */ React.createElement("button", { style: S.fab, onClick: () => {
    setEditTx(null);
    setShowTx(true);
  } }, "+"), /* @__PURE__ */ React.createElement("nav", { style: S.nav }, NAV.map((n) => /* @__PURE__ */ React.createElement("button", { key: n.id, style: S.ni, onClick: () => setTab(n.id) }, /* @__PURE__ */ React.createElement("div", { style: { ...S.niIcon, ...tab === n.id ? { background: "rgba(0,122,255,.12)" } : {} } }, n.i), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, fontWeight: 600, color: tab === n.id ? "#007AFF" : "#8E8E93" } }, n.l)))), showTx && /* @__PURE__ */ React.createElement(TxSheet, { tx: editTx, cats, allTags, onSave: saveTx, onDelete: delTx, onClose: () => {
    setShowTx(false);
    setEditTx(null);
  } }), showRec && /* @__PURE__ */ React.createElement(RecSheet, { rec: editRec, cats, onSave: saveRec, onDelete: delRec, onClose: () => {
    setShowRec(false);
    setEditRec(null);
  } }), showProfile && /* @__PURE__ */ React.createElement(Sheet, { title: "Profilo", onClose: () => setShowProfile(false), onSave: () => setShowProfile(false) }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "10px 0 20px" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 70, height: 70, borderRadius: "50%", background: profile.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 10px" } }, profile.emoji), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 800, fontSize: 20, color: "#1C1C1E" } }, profile.nome), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    sv("sadw_profile5", null);
    localStorage.removeItem("sadw_profile5");
    setProfile(null);
  }, style: { marginTop: 20, padding: "10px 20px", borderRadius: 10, background: "rgba(255,59,48,.1)", color: "#FF3B30", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 14 } }, "Cambia profilo"))));
}
try{ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));}catch(e){document.getElementById('root').innerHTML='<div style="padding:20px;color:red;font-size:13px;background:#fff"><b>Errore:</b><br>'+e.message+'</div>';}
})();
