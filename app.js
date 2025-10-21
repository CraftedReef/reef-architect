// === Safe defaults so the app won’t crash if Sheets fail ===
let TANKS = [];
let SUMPS = [];

let LIGHTS = [];
let RETURN_PUMPS = [];
let POWERHEADS = [];
let SKIMMERS = [];
let HEATERS = [];
let UVS = [];
let ATOS = [];
let REACTORS = [];

let FISH = [];
let CORALS = [];
let INVERTS =[];

async function fetchCSV(url) {
  const res = await fetch(url);
  const text = await res.text();

  const [headerLine, ...lines] = text.trim().split("\n");
  // normalize all header names to lowercase so "Type", " type " → "type"
  const headers = headerLine.split(",").map(h => h.trim().toLowerCase());

  return lines.map(line => {
    const values = line.split(",").map(v => {
      const t = v.trim();
      // remove wrapping quotes if present
      return (t.startsWith('"') && t.endsWith('"')) ? t.slice(1, -1) : t;
    });
    const row = {};
    headers.forEach((h, i) => { row[h] = values[i]; });
    return row;
  });
}
// === Load data from Google Sheets and overwrite local data files ===
async function loadFromSheetsAndOverwriteGlobals() {
  const SHEETS = {
  // Tanks workbook: BOTH the Tanks tab CSV and the Sumps tab CSV
  tanksTabs: [
    // Tanks tab (published CSV URL)
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSaRvuIZk7vCsbmyRFmlYOX2fNyAdew8JZnRngpkJwbDy7CzmXZxlSUpAan1oQwBf2lE3IVVwjbQmd_/pub?gid=0&single=true&output=csv",
    // Sumps tab (published CSV URL — not an edit link)
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSaRvuIZk7vCsbmyRFmlYOX2fNyAdew8JZnRngpkJwbDy7CzmXZxlSUpAan1oQwBf2lE3IVVwjbQmd_/pub?gid=1826498009&single=true&output=csv"
  ],

  // Equipment workbook: one PUBLISHED CSV URL per equipment tab
   equipmentTabs: [
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMjaShzrYMRl0bAt0IJcbLaZsnlCUBijlXvgVpmmPOJ5n-fEbNtZ4EtXdv_CfXkboMX91yOYmT5QFQ/pub?gid=0&single=true&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMjaShzrYMRl0bAt0IJcbLaZsnlCUBijlXvgVpmmPOJ5n-fEbNtZ4EtXdv_CfXkboMX91yOYmT5QFQ/pub?gid=1764712152&single=true&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMjaShzrYMRl0bAt0IJcbLaZsnlCUBijlXvgVpmmPOJ5n-fEbNtZ4EtXdv_CfXkboMX91yOYmT5QFQ/pub?gid=643038263&single=true&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMjaShzrYMRl0bAt0IJcbLaZsnlCUBijlXvgVpmmPOJ5n-fEbNtZ4EtXdv_CfXkboMX91yOYmT5QFQ/pub?gid=1985034746&single=true&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMjaShzrYMRl0bAt0IJcbLaZsnlCUBijlXvgVpmmPOJ5n-fEbNtZ4EtXdv_CfXkboMX91yOYmT5QFQ/pub?gid=448098872&single=true&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMjaShzrYMRl0bAt0IJcbLaZsnlCUBijlXvgVpmmPOJ5n-fEbNtZ4EtXdv_CfXkboMX91yOYmT5QFQ/pub?gid=1240084232&single=true&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMjaShzrYMRl0bAt0IJcbLaZsnlCUBijlXvgVpmmPOJ5n-fEbNtZ4EtXdv_CfXkboMX91yOYmT5QFQ/pub?gid=642746149&single=true&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMjaShzrYMRl0bAt0IJcbLaZsnlCUBijlXvgVpmmPOJ5n-fEbNtZ4EtXdv_CfXkboMX91yOYmT5QFQ/pub?gid=1202596940&single=true&output=csv"
  ],

  // Species workbook: separate URLs for Fish tab and Coral tab (both PUBLISHED CSV)
  speciesFish:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vTYIOupQvGCyxoXTVflaq5vgLfOYnpcRyBuF_8NHAc9Gw2vIVId3SWoebQuQy967z3pB-YthzwrM3mV/pub?gid=0&single=true&output=csv",
  speciesCorals: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTYIOupQvGCyxoXTVflaq5vgLfOYnpcRyBuF_8NHAc9Gw2vIVId3SWoebQuQy967z3pB-YthzwrM3mV/pub?gid=764322512&single=true&output=csv"
};


// --- Tanks & sumps (merge all tank-related tabs) ---
// ✅ Use cache to avoid re-fetching every visit
let tanksArrays = await Promise.all(
  SHEETS.tanksTabs.map((url, i) => fetchCSVFromCache(url, `tanksTab${i}`))
);
if (!tanksArrays.length || !tanksArrays.some(a => a && a.length)) {
  console.warn("Cache returned empty Tanks/Sumps — retrying live fetch…");
  // live (uncached) retry
  tanksArrays = await Promise.all(SHEETS.tanksTabs.map(url => fetchCSV(url)));
}
const tankCombined = tanksArrays.flat();

// If your tabs include a "type" column, we use it. If not, we detect by columns present.
TANKS = tankCombined
  .filter(r => {
    const t = String(r.type || "").toLowerCase();
    // headers are all lowercase after parsing:
    const hasDims = r.l || r.w || r.h;
    const hasNet  = r.netgal || r.netgallons || r.gallons;
    return t === "tank" || (!t && (hasNet || hasDims));
  })
  .map(r => {
    const aioFlag = String(r.aio || "").toLowerCase() === "true";
    const typeStr = String(r.type || (aioFlag ? "aio" : "reef_ready")).toLowerCase();
    const net = Number(
      String(r.netgal ?? r.netgallons ?? r.gallons ?? 0).replace(/[^0-9.\-]/g, "")
    ) || 0;
    const L = Number(r.l || 0);
    const W = Number(r.w || 0);
    const H = Number(r.h || 0);

    return {
      id: String(r.id || r.slug || r.name || "").trim(),
      brand: String(r.brand || "").trim(),
      model: String(r.model || "").trim(),
      name: String(r.name || `${r.brand||""} ${r.model||""}`).trim(),
      type: typeStr,
      aio: aioFlag,
      dims: { L, W, H },
      netGal: net,
      priceUSD: Number(String(r.price ?? r.priceusd ?? "").replace(/[^0-9.\-]/g,"")) || undefined
    };
  });

SUMPS = tankCombined
  .filter(r => {
    const t = String(r.type || "").toLowerCase();
    const vol = r.volumegal ?? r.gallons;
    const net = r.netgal ?? r.netgallons;
    return t === "sump" || (!!vol && !net);
  })
  .map(r => ({
    id: String(r.id || r.slug || r.name || "").trim(),
    brand: String(r.brand || "").trim(),
    model: String(r.model || "").trim(),
    name: String(r.name || `${r.brand||""} ${r.model||""}`).trim(),
    volumeGal: Number(r.volumegal ?? r.gallons ?? 0),
    baffleDepthIn: Number(r.baffledepthin ?? r.skimmerwaterdepth ?? 0),
    skimmerChamber: {
      widthIn:  Number(r.skimmerchamberw ?? r.skimmerchamw ?? 0),
      lengthIn: Number(r.skimmerchamberl ?? r.skimmerchaml ?? 0)
    },
    priceUSD: Number(String(r.price ?? r.priceusd ?? "").replace(/[^0-9.\-]/g,"")) || undefined
  }));

// --- Equipment (merge all equipment tabs) ---
// ✅ Cache each equipment tab
let eqArrays = await Promise.all(
  SHEETS.equipmentTabs.map((url, i) => fetchCSVFromCache(url, `equipmentTab${i}`))
);
if (!eqArrays.length || !eqArrays.some(a => a && a.length)) {
  console.warn("Cache returned empty Equipment — retrying live fetch…");
  eqArrays = await Promise.all(SHEETS.equipmentTabs.map(url => fetchCSV(url)));
}
const eqRows = eqArrays.flat();

// Pre-normalize category once so picking is reliable
const eqNormalized = eqRows.map(r => ({
  ...r,
  _cat: (()=>{
    let s = String((r.category || r.type) || "").trim().toLowerCase();
    if (s.includes("light")) return "light";
    if (s.includes("return")) return "return";
    if (s.includes("power") || s.includes("wavemaker") || s.includes("gyre")) return "powerhead";
    if (s.includes("skimmer")) return "skimmer";
    if (s.includes("heater")) return "heater";
    if (s.includes("uv")) return "uv";
    if (s.includes("ato") || s.includes("auto top")) return "ato";
    if (s.includes("reactor")) return "reactor";
    return s;
  })()
}));

const num = (v)=> {
  const x = Number(String(v||"").replace(/[^0-9.\-]/g,""));
  return Number.isFinite(x) ? x : undefined;
};
const base = (r) => ({
  id: String(r.id || r.slug || r.name || "").trim(),
  brand: String(r.brand || "").trim(),
  model: String(r.model || "").trim(),
  name: String(r.name || `${r.brand||""} ${r.model||""}`).trim(),
  minG: num(r.ming ?? r.mingallons ?? r.minGallons ?? r.minG),
  maxG: num(r.maxg ?? r.maxgallons ?? r.maxGallons ?? r.maxG),
  // treat blank as "allowed"; only explicit "false" is excluded in Beginner
beginner: (()=>{
  const b = String(r.beginner ?? "").trim().toLowerCase();
  if (b === "") return undefined;       // blank → allowed
  if (b === "true") return true;
  if (b === "false") return false;
  return undefined;
})(),
  priceUSD: num(r.price ?? r.priceusd ?? r.priceUSD)
});
const catNormalize = (s) => {
  s = String(s || "").trim().toLowerCase();
  if (s.includes("light")) return "light";                // light, lighting, lights
  if (s.includes("return")) return "return";              // return, return pump
  if (s.includes("power") || s.includes("wavemaker") || s.includes("gyre")) return "powerhead";
  if (s.includes("skimmer")) return "skimmer";            // protein skimmer
  if (s.includes("heater")) return "heater";              // heater(s)
  if (s.includes("uv")) return "uv";                      // uv, uv sterilizer
  if (s.includes("ato") || s.includes("auto top")) return "ato"; // ato, auto top off
  if (s.includes("reactor")) return "reactor";            // media reactor, reactor
  return s; // fall-through (already normalized)
};

const pick = (cat) => eqNormalized.filter(r => r._cat === cat);

LIGHTS        = pick("light").map(r => ({
  ...base(r),
  coverageInches: num(r.coverageinches ?? r.coverage),
  parHigh: num(r.parhigh),
  parMid:  num(r.parmid),
  parLow:  num(r.parlow)
}));
RETURN_PUMPS  = pick("return").map(r => ({
  ...base(r),
  maxGph: num(r.maxgph ?? r.maxGph ?? r.gph)
}));
POWERHEADS    = pick("powerhead").map(r => ({ ...base(r), gph: num(r.gph) }));
SKIMMERS      = pick("skimmer").map(r => ({
  ...base(r),
  lightRatingG: num(r.lightratingg ?? r.lightRatingG ?? r.lightRating),
  heavyRatingG: num(r.heavyratingg ?? r.heavyRatingG ?? r.heavyRating)
}));
HEATERS       = pick("heater").map(r => ({ ...base(r), watts: num(r.watts) }));
UVS           = pick("uv").map(r => base(r));
ATOS          = pick("ato").map(r => base(r));
REACTORS      = pick("reactor").map(r => base(r));

// Optional: keep raw for debugging
EQUIPMENT = eqRows;   // (you can keep eqRows or switch to eqNormalized if you prefer)

// --- DEBUG: category and counts ---
// console.log("[Eq categories raw]", [...new Set(eqRows.map(r => String((r.category||r.type)||"").toLowerCase()))]);
// console.log("[Eq _cat counts]",
//  eqNormalized.reduce((acc,r)=>{ acc[r._cat]=(acc[r._cat]||0)+1; return acc; }, {})
// );
// console.log("[Eq counts]", {
//  lights: LIGHTS.length,
//  returns: RETURN_PUMPS.length,
//  powerheads: POWERHEADS.length,
//  skimmers: SKIMMERS.length,
//  heaters: HEATERS.length,
//  uvs: UVS.length,
//  atos: ATOS.length,
//  reactors: REACTORS.length
//});


// --- Species (fish + inverts + corals from two tabs) ---
// ✅ Cache species tabs as well
let fishRows  = await fetchCSVFromCache(SHEETS.speciesFish,   "speciesFish");
let coralRows = await fetchCSVFromCache(SHEETS.speciesCorals, "speciesCorals");
if ((!fishRows || !fishRows.length) || (!coralRows || !coralRows.length)) {
  console.warn("Cache returned empty Species — retrying live fetch…");
  fishRows  = await fetchCSV(SHEETS.speciesFish);
  coralRows = await fetchCSV(SHEETS.speciesCorals);
}

// console.log("[Debug] speciesFish rows:", fishRows.length);
// console.log("[Debug] speciesFish distinct types:", [...new Set(fishRows.map(r => String(r.type || "").trim().toLowerCase()))]);
// console.log("[Debug] first 2 fish rows:", fishRows.slice(0, 2));


// Map FISH rows ...
FISH = fishRows
  .filter(r => {
    const kind = String(r.type || "").trim().toLowerCase();
    return kind === "fish";
  })
  .map(r => ({
    id:          String(r.id || r.slug || r.name || "").trim(),
    name:        String(r.name || "").trim(),
    scientific:  String(r.scientific || r.sciname || "").trim(),
    minGallons:  num(r.mingallons ?? r.ming ?? r.gallons) ?? 0,
    bu:          num(r.bu || r.bioload || r.capacity) ?? 10,
    temperament: String(r.temperament || r.temp || "").trim().toLowerCase(),
    group:       String(r.group || r.family || "").trim(),
    beginner:    String(r.beginner || r.isBeginner || "").toLowerCase() === "true"
  }));

INVERTS = fishRows
  .filter(r => {
    const kind = String(r.type || "").trim().toLowerCase();
    return kind === "invert";
  })
  .map(r => ({
    id:       String(r.id || r.slug || r.name || "").trim(),
    name:     String(r.name || "").trim(),
    group:    "Invertebrates",
    beginner: String(r.beginner || "").toLowerCase() === "true",
    bu:       Number(r.bu ?? 1) || 1
  }));

// Map CORALS rows (expects: id, name, coralType, par [low,high], placement, beginner)
CORALS = coralRows.map(r => ({
  id:        String(r.id || r.slug || r.name || "").trim(),
  name:      String(r.name || "").trim(),
  coralType: String(r.coraltype ?? r.type ?? "").trim().toLowerCase(), // soft/lps/sps
  par:       [ num(r.parlow) ?? 0, num(r.parhigh) ?? 0 ],
  placement: String(r.placement ?? r.zone ?? "").trim(),
  beginner:  String(r.beginner || "").toLowerCase() === "true"
}));

// console.log("✅ Google Sheets data loaded:", {
//  tanks: TANKS.length,
//  equipment: EQUIPMENT.length,
//  fish: FISH.length,
//  inverts: INVERTS.length,
//  animals: FISH.length + INVERTS.length, // fish + inverts
//  corals: CORALS.length
// });
 setAnimalsBadge(); // ✅ update Stage-2 badge after all data loaded

}

// Reef Architect v11.4 — volume-aware equipment, Beginner/Experienced modes, grouped species,
// compatibility in summary, Welcome+QuickStart fixes, Glossary modal fix,
// Stage-1 layout usability, Theme label fix.

const $ = (s)=>document.querySelector(s);
const $$ = (s)=>Array.from(document.querySelectorAll(s));
const el = (t, c)=>{ const n=document.createElement(t); if(c) n.className=c; return n; };
// --- Sheets cache settings ---
const CACHE_VERSION = 'v2';                 // bump to invalidate all cached tabs
const CACHE_TTL_MS  = 6 * 60 * 60 * 1000;   // 6 hours

function cacheKey(key){ return `reef:${CACHE_VERSION}:${key}`; }

// Treat empty/HTML/error-y strings as "bad"
function looksBadText(txt){
  if (!txt) return true;
  const s = String(txt).trim();
  if (s.length < 20) return true;                  // too small to be a CSV
  const head = s.slice(0, 200).toLowerCase();
  if (head.includes('<html') || head.includes('<!doctype')) return true; // HTML error page
  return false;
}

function getCachedText(key){
  try{
    const raw = localStorage.getItem(cacheKey(key));
    if(!raw) return null;
    const obj = JSON.parse(raw);
    if(!obj || !obj.data || !obj.ts) return null;
    if(Date.now() - obj.ts > CACHE_TTL_MS) return null; // expired
    if(looksBadText(obj.data)) return null;             // ignore junk
    return obj.data;
  }catch(e){ return null; }
}

function setCachedText(key, text){
  try{
    if (looksBadText(text)) return;   // never cache junk
    localStorage.setItem(cacheKey(key), JSON.stringify({ ts: Date.now(), data: text }));
  }catch(e){ /* ignore quota/blocked */ }
}

async function fetchTextWithCache(url, key){
  const cached = getCachedText(key);
  if(cached) return cached;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Fetch failed (${res.status}) for ${key}`);

  const txt = await res.text();
  if (looksBadText(txt)) {
    // don't cache — force live on next attempt too
    throw new Error(`Received non-CSV content for ${key}`);
  }
  setCachedText(key, txt);
  return txt;
}

// Clear this version's cache; expose to Console for quick use
function clearSheetsCache(){
  const prefix = `reef:${CACHE_VERSION}:`;
  const toDelete = [];
  for(let i=0;i<localStorage.length;i++){
    const k = localStorage.key(i);
    if(k && k.startsWith(prefix)) toDelete.push(k);
  }
  toDelete.forEach(k => localStorage.removeItem(k));
}
window.clearSheetsCache = clearSheetsCache;   // ← add this line so you can run it in Console
// Parse CSV text (from cache or live) into row-objects (lowercased headers)
async function fetchCSVFromCache(url, key){
  const text = await fetchTextWithCache(url, key);
  const trimmed = (text || "").trim();
  if (!trimmed) return [];

  const [headerLine, ...lines] = trimmed.split("\n");
  const headers = headerLine.split(",").map(h => h.trim().toLowerCase());

  return lines
    .filter(l => l.trim().length)
    .map(line => {
      const values = line.split(",").map(v => {
        const t = v.trim();
        return (t.startsWith('"') && t.endsWith('"')) ? t.slice(1, -1) : t;
      });
      const row = {};
      headers.forEach((h, i) => { row[h] = values[i]; });
      return row;
    });
}

// --- Auto-hide Topbar on scroll (down hides, up shows) ---
function setupTopbarAutoHide(){
  const header = document.querySelector('.topbar');
  if (!header) return;

  let lastY = window.scrollY;
  const THRESH = 8; // pixels before we react

  function setOffset(){
    const hidden = header.classList.contains('topbar--hidden');
    // measure current header height (fallback 58)
    const h = header.getBoundingClientRect().height || 58;
    document.documentElement.style.setProperty('--topbar-offset', hidden ? '0px' : `${h}px`);
  }

  function onScroll(){
    const y = window.scrollY;
    const dy = y - lastY;
    lastY = y;

    // always show near top
    if (y < 10) {
      header.classList.remove('topbar--hidden');
      setOffset();
      return;
    }
    if (Math.abs(dy) < THRESH) return;

    if (dy > 0) header.classList.add('topbar--hidden');    // scrolling down
    else        header.classList.remove('topbar--hidden'); // scrolling up

    setOffset();
  }

  // initial measure + listeners
  setOffset();
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', setOffset);
}

function setAnimalsBadge(){
  const badge = document.getElementById("animalsBadge");
  if (!badge) return;

  // Count all fish & inverts in the current build
  const total = (state.fish || []).reduce((sum, x) => sum + (parseInt(x.qty) || 0), 0);
  badge.textContent = String(total);
}
const galFromInches = (L,W,H,D)=> (L*W*H/231) * (1 - (D||0)/100);

const BUILD_TARGETS = {
  mixed:{label:"Mixed Reef", flow:[20,40], par:[120,250]},
  sps:{label:"SPS-dominant", flow:[30,60], par:[250,350]},
  lps:{label:"LPS-dominant", flow:[15,25], par:[100,200]},
  softie:{label:"Softie/Zoas", flow:[10,20], par:[60,120]},
  fowlr:{label:"FOWLR", flow:[5,15], par:[0,60]}
};

// --- Pricing helpers ---
const CURRENCY = "$";
const money = n => CURRENCY + (n||0).toFixed(2);

function findById(list, id){ return list?.find?.(x=>x.id===id) || null; }
function priceFrom(list, id){ const x = findById(list, id); return x?.priceUSD || 0; }

// ------- State -------
const state = {
  beginner:true, // Beginner=true, Experienced=false
  meta:{ buildName:"" },
  buildType:"mixed",
  tank:{ lengthIn:24, widthIn:18, heightIn:18, displacementPct:10, gallons:0 },
  tankPresetId:null,
  aio:false,
  sump:{ use:true, gallons:20, chamberDepthIn:8, chamW:10, chamL:12, sumpModelId:null },
  equipment:{
    lighting:"ai_prime_16hd", lightCount:1,
    returnPump:"sicce_syncra_3",
    powerhead:"ai_nero3", powerheadCount:1,
    skimmer:"ro_classic_110int",
    heater:"eheim_150", heaterCount:1,
    uv:null, ato:"tunze_3155", reactor:null
  },
  fish:[], corals:[]
};
window.state = state;


// ------- Theme -------
function preferredTheme(){
  const saved=localStorage.getItem('theme');
  if(saved==='light'||saved==='dark') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light';
}
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  const btn = $('#themeToggle');
  if(btn){
    // Show CURRENT theme clearly (fix: no mismatched labels)
    btn.setAttribute('aria-pressed', theme==='dark'?'true':'false');
    btn.textContent = theme==='dark' ? '🌙 Dark' : '🌞 Light';
  }
}

function resetAll(){
  // experience
  state.beginner = true;
  document.getElementById('expBeginner')?.click(); // toggles UI + handlers

  // meta / build
  state.meta.buildName = "";
  document.getElementById('buildName').value = "";

  // tank
  state.tankPresetId = null;
  state.tank = { lengthIn:24, widthIn:18, heightIn:18, displacementPct:10, gallons:0 };
  document.getElementById('tankPreset').value = "";
  document.getElementById('lenIn').value = 24;
  document.getElementById('widIn').value = 18;
  document.getElementById('heiIn').value = 18;
  document.getElementById('displacementPct').value = 10;

  // build type
  state.buildType = "mixed";
  document.getElementById('buildType').value = "mixed";

  // sump
  state.aio = false;
  state.sump = { use:true, gallons:20, chamberDepthIn:8, chamW:10, chamL:12, sumpModelId:null };
  document.getElementById('useSump').value = "yes";
  document.getElementById('sumpModel').value = "";
  document.getElementById('sumpGallons').value = 20;
  document.getElementById('skimmerWaterDepth').value = 8;
  document.getElementById('skimmerChamW').value = 10;
  document.getElementById('skimmerChamL').value = 12;

  // equipment — clear everything to placeholders/zero
  state.equipment = {
    lighting: null,      lightCount: 0,
    returnPump: null,
    powerhead: null,     powerheadCount: 0,
    skimmer: null,
    heater: null,        heaterCount: 0,
    uv: null,
    ato: null,
    reactor: null
  };

  // Clear UI selects to blank (placeholder) and qty inputs to 0
  const selIds = [
    'lighting','returnPump','powerhead','skimmer','heater',
    'uvSterilizer','atoSystem','mediaReactor'
  ];
  selIds.forEach(id=>{
    const el = document.getElementById(id);
    if (el) { el.value = ''; el.dispatchEvent(new Event('change')); }
  });

  const qtyIds = ['lightCount','powerheadCount','heaterCount'];
  qtyIds.forEach(id=>{
    const el = document.getElementById(id);
    if (el) { el.value = 0; el.dispatchEvent(new Event('input')); }
  });

  // livestock
  state.fish = [];
  state.corals = [];
  renderFish(); renderCorals();

  // refresh UI + go to Welcome
  populateAll(); updateTank(); renderBudgetNow(); renderSummary();
  window.location.href = "welcome.html";
}

// ------- Init -------
function init(){
  // NEW: enable auto-hide header behavior
  setupTopbarAutoHide();

  // Tabs
  $$('#stage-tabs .tab').forEach(btn=>{
    btn.addEventListener('click',()=>switchStage(btn.dataset.stage));
  });

  // Start button on Welcome
  $('#startBtn')?.addEventListener('click', ()=> switchStage('1'));
  // Back buttons
  $$('.back-btn').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      const prevStage = e.currentTarget.dataset.prev;
      if(!prevStage) return;
      switchStage(prevStage);
    });
  });
  // Next buttons (attach on init to ensure they bind)
  $$('.next-btn').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      const nextStage=e.currentTarget.dataset.next;
      if(!nextStage) return;
      switchStage(nextStage);
      if(nextStage==='4') renderSummary();
    });
  });

  // ✅ Restart buttons (attach event listener)
  $$('.restart-btn').forEach(btn=>{
    btn.addEventListener('click', resetAll);
  });
  // ✅ Visualizer navigation
  document.getElementById('goViz')?.addEventListener('click', ()=> {
    switchStage('5');          // go from Summary → Visualizer
  });

  document.getElementById('vizBack')?.addEventListener('click', ()=> {
    switchStage('4');          // go from Visualizer → Summary
  });

  // existing code continues…
  bindInputs();
  updateTank();
  populateAll();
  renderFish(); renderCorals(); renderSummary();

  initGlossary();
  initExport();
  runQuickStartFromURL();
}

function bindInputs(){
  // Inputs & selects
  ["buildName","lenIn","widIn","heiIn","displacementPct","lightCount","powerheadCount","heaterCount","sumpGallons","skimmerWaterDepth","skimmerChamW","skimmerChamL"].forEach(id=>{
    $("#"+id)?.addEventListener("input", ()=> onChange(id));
  });
  ["buildType","lighting","returnPump","powerhead","skimmer","heater","uvSterilizer","atoSystem","mediaReactor","useSump","tankPreset","sumpModel"].forEach(id=>{
    $("#"+id)?.addEventListener("change", ()=> onChange(id));
  });
  // Experience radios
  $("#expBeginner")?.addEventListener("change", ()=> onChange("experience"));
  $("#expExperienced")?.addEventListener("change", ()=> onChange("experience"));

  $("#addFish")?.addEventListener("click", addFish);
  $("#addInvert")?.addEventListener("click", addInvert);
  $("#addCoral")?.addEventListener("click", addCoral);
}

function onChange(id){
  if(id==="experience"){
    const isBeginner = $("#expBeginner")?.checked ?? true;
    state.beginner = isBeginner;
    toggleBeginnerAdvanced();
    populateAll();
    renderSummary();
    renderBudgetNow();
    renderVizEquipment(); 
    return;
  }
  if(id==="buildName"){
  state.meta.buildName = $("#buildName").value;
  updateTank(); // <- refreshes the Stage 1 "Tank & Equipment" calc box
}
  if(id==="buildType"){ state.buildType=$("#buildType").value; updateFit(); renderSummary(); }
  if(id==="tankPreset"){ applyTankPreset($("#tankPreset").value); return; }
  if(id==="sumpModel"){ applySumpModel($("#sumpModel").value); return; }

  if(["lenIn","widIn","heiIn","displacementPct"].includes(id)){ state.tank[id]=parseFloat($("#"+id).value)||0; updateTank(); }
  if(id==="useSump"){ state.sump.use = $("#useSump").value==="yes"; updateFit(); }
  if(id==="sumpGallons"){ state.sump.gallons = Math.max(0, parseFloat($("#sumpGallons").value)||0); updateFit(); }
  if(id==="skimmerWaterDepth"){ state.sump.chamberDepthIn = Math.max(0, parseFloat($("#skimmerWaterDepth").value)||0); updateFit(); }
  if(id==="skimmerChamW"){ state.sump.chamW = Math.max(0, parseFloat($("#skimmerChamW").value)||0); updateFit(); }
  if(id==="skimmerChamL"){ state.sump.chamL = Math.max(0, parseFloat($("#skimmerChamL").value)||0); updateFit(); }

  if(["lightCount","powerheadCount","heaterCount"].includes(id)){ state.equipment[id]=Math.max(0, parseInt($("#"+id).value)||0); updateFit(); }
  if(["lighting","returnPump","powerhead","skimmer","heater"].includes(id)){ state.equipment[id]=$("#"+id).value||null; updateFit(); }
  if(id==="uvSterilizer"){ state.equipment.uv = $("#uvSterilizer").value || null; }
  if(id==="atoSystem"){ state.equipment.ato = $("#atoSystem").value || null; }
  if(id==="mediaReactor"){ state.equipment.reactor = $("#mediaReactor").value || null; }
  if(id==="lighting" || id==="lightCount") updateParMeter();


  renderSummary();
  renderBudgetNow();
}

// ------- Beginner hides or disables advanced UV/Reactors -------
function toggleBeginnerAdvanced() {
  const beginner = state.beginner;
  const uv = $("#uvSterilizer"), rn = $("#mediaReactor");
  const uvNote = $("#uvNote"), rNote = $("#reactorNote");
  const uvRow = uv ? uv.closest(".row") : null;
  const rnRow = rn ? rn.closest(".row") : null;

  if (beginner) {
    // disable selects + apply locked style
    if (uv) { uv.disabled = true; uv.value = ""; }
    if (rn) { rn.disabled = true; rn.value = ""; }
    if (uvRow) uvRow.classList.add("disabled-row");
    if (rnRow) rnRow.classList.add("disabled-row");
    state.equipment.uv = null;
    state.equipment.reactor = null;
    if (uvNote) uvNote.textContent = "";
    if (rNote) rNote.textContent = "";
  } else {
    // re-enable + remove locked style
    if (uv) uv.disabled = false;
    if (rn) rn.disabled = false;
    if (uvRow) uvRow.classList.remove("disabled-row");
    if (rnRow) rnRow.classList.remove("disabled-row");
    if (uvNote) uvNote.textContent = "";
    if (rNote) rNote.textContent = "";
  }
}

// ------- Population helpers (volume-aware) -------
function tankGallons(){ return state.tank.gallons||0; }
function byVolume(list){
  const g = tankGallons();

  // If no gallons yet (nothing selected / first load), don't filter by volume.
  // Still respect Beginner mode (hide items explicitly marked beginner:false).
  if (!g) {
    return list.filter(x => state.beginner ? (x.beginner !== false) : true);
  }

  // Normal volume filtering once we know gallons.
  return list.filter(x => {
    const beginnerOK = state.beginner ? (x.beginner !== false) : true;
    const volOK =
      (x.minG == null || g >= x.minG) &&
      (x.maxG == null || g <= x.maxG);
    return beginnerOK && volOK;
  });
}


function displayFishGroupLabel(raw){
  if(!raw) return "Other";
  const s = raw.toLowerCase();
  if(s.includes("tang") || s.includes("surgeon")) return "Tangs";
  if(s.includes("wrasse")) return "Wrasses";
  if(s.includes("goby")) return "Gobies";
  if(s.includes("blenn")) return "Blennies";
  if(s.includes("damsel")) return "Damsels";
  if(s.includes("chromis")) return "Chromis";
  if(s.includes("basslet")) return "Basslets";
  if(s.includes("dottyback")) return "Dottybacks";
  if(s.includes("cardinal")) return "Cardinals";
  if(s.includes("rabbit")) return "Rabbitfish";
  if(s.includes("angel")) return "Angelfish";
  if(s.includes("invert")) return "Invertebrates";
  if(s.includes("dartfish")) return "Dartfish";
  if(s.includes("dragonet")) return "Dragonets";
  return raw;
}
function displayCoralGroupLabel(rawType){
  if(!rawType) return "Other";
  const t = rawType.toLowerCase();
  if(t==="soft") return "Soft Corals";
  if(t==="lps")  return "LPS Corals";
  if(t==="sps")  return "SPS Corals";
  return rawType;
}

function populateSelect(id, list, labelFn, allowNone=false, placeholderText=null){
  const sel = $("#"+id); 
  if (!sel || !list) return;

  const items = byVolume(list).slice().sort((a,b)=>{
    const pa = a.priceUSD ?? Infinity, pb = b.priceUSD ?? Infinity;
    if (pa !== pb) return pa - pb;
    return (a.name || "").localeCompare(b.name || "");
  });

  sel.innerHTML = "";

  // If a placeholder is provided, show it as the first blank option
  if (placeholderText) {
    const def = document.createElement("option");
    def.value = "";
    def.textContent = placeholderText;
    def.selected = true;
    sel.appendChild(def);
  } else if (allowNone) {
    // Fallback "None" option if caller requested it explicitly
    const none = document.createElement("option");
    none.value = "";
    none.textContent = "— None —";
    sel.appendChild(none);
  }

  items.forEach(x=>{
    const label = labelFn ? labelFn(x) : x.name;
    const priced = x.priceUSD != null ? `${label} — ${money(x.priceUSD)}` : label;
    const o = document.createElement("option");
    o.value = x.id;
    o.textContent = priced;
    sel.appendChild(o);
  });

  // Keep current selection if it exists; otherwise stay on the placeholder (blank)
  const keyMap = { uvSterilizer:'uv', atoSystem:'ato', mediaReactor:'reactor' };
  const equipKey = keyMap[id] || id;
  const wanted = state.equipment[equipKey];

  if (wanted) {
    const exists = items.find(i => i.id === wanted);
    sel.value = exists ? exists.id : "";
  } else {
    sel.value = ""; // stay on placeholder
  }

  // Mirror back to state.equipment
  state.equipment[equipKey] = sel.value || null;
}

function populateSpecies(){
  // FISH grouped by common family/group, alphabetized within each group
  const fsel=$("#fishSelect");
  if(fsel){
    fsel.innerHTML="";
    const src = state.beginner ? FISH.filter(f=>f.beginner) : FISH.slice();
    const groups = {};
    src.forEach(f=>{
      const label = displayFishGroupLabel(f.group);
      groups[label] ||= [];
      groups[label].push(f);
    });
    Object.keys(groups).sort((a,b)=>a.localeCompare(b)).forEach(label=>{
      const og = document.createElement("optgroup"); og.label = label;
      groups[label].sort((a,b)=>a.name.localeCompare(b.name)).forEach(f=>{
        const o=document.createElement("option");
        o.value=f.id;
        o.textContent=`${f.name} — min ${f.minGallons}g`;
        og.appendChild(o);
      });
      fsel.appendChild(og);
    });
  }
  // INVERTS grouped into a single "Clean-Up Crew" list
  const invertSel = document.getElementById("invertSelect");
  if(invertSel){
    invertSel.innerHTML="";
    const src = state.beginner ? INVERTS.filter(i=>i.beginner) : INVERTS.slice();
    const og = document.createElement("optgroup");
    og.label = "Clean-Up Crew";
    src.sort((a,b)=>a.name.localeCompare(b.name)).forEach(i=>{
      const o=document.createElement("option");
      o.value=i.id;
      o.textContent=`${i.name}`;
      og.appendChild(o);
    });
    invertSel.appendChild(og);
  }

  // CORALS grouped by Soft/LPS/SPS, alphabetized within each group
  const csel=$("#coralSelect");
  if(csel){
    csel.innerHTML="";
    const src = state.beginner ? CORALS.filter(c=>c.beginner) : CORALS.slice();
    const groups = {};
    src.forEach(c=>{
      const label = displayCoralGroupLabel(c.coralType);
      groups[label] ||= [];
      groups[label].push(c);
    });
  // INVERTS (Clean-Up Crew), simple A–Z
  const isel = $("#invertSelect");
  if (isel) {
    isel.innerHTML = "";
    const src = state.beginner ? INVERTS.filter(i => i.beginner) : INVERTS.slice();
    src.sort((a, b) => a.name.localeCompare(b.name)).forEach(i => {
      const o = document.createElement("option");
      o.value = i.id;
      o.textContent = i.name;
      isel.appendChild(o);
    });
}
    Object.keys(groups).sort((a,b)=>a.localeCompare(b)).forEach(label=>{
      const og = document.createElement("optgroup"); og.label = label;
      groups[label].sort((a,b)=>a.name.localeCompare(b.name)).forEach(c=>{
        const o=document.createElement("option");
        o.value=c.id;
        o.textContent=`${c.name} — PAR ${c.par[0]}–${c.par[1]} — ${c.placement}`;
        og.appendChild(o);
      });
      csel.appendChild(og);
    });
  }

 setAnimalsBadge(); // ✅ refresh badge whenever species list is rebuilt
}

function populateTanks(){
  const tsel=$("#tankPreset"); if(!tsel) return;
  tsel.innerHTML="";
  const def=document.createElement("option"); def.value=""; def.textContent="— None (Custom Build) —"; def.selected=true; tsel.appendChild(def);
  const groups={
    "Nano / Pico (≤ 40g)": TANKS.filter(t=>t.netGal<=40),
    "Midrange Reef (41–100g)": TANKS.filter(t=>t.netGal>40 && t.netGal<=100),
    "Large (101–200g)": TANKS.filter(t=>t.netGal>100 && t.netGal<=200),
    "Massive / Custom (200g+)": TANKS.filter(t=>t.netGal>200)
  };
  Object.entries(groups).forEach(([label,arr])=>{
    if(!arr.length) return;
    const og=document.createElement("optgroup"); og.label=label;
    arr.forEach(t=>{ const o=document.createElement("option"); o.value=t.id; o.textContent=`${t.name} — ${t.netGal}g`; og.appendChild(o); });
    tsel.appendChild(og);
  });

 // ✅ Keep current selection visible
  tsel.value = state.tankPresetId || "";
}
function populateSumps(){
  const ssel=$("#sumpModel"); if(!ssel) return;
  ssel.innerHTML=""; const def=document.createElement("option");
  def.value=""; def.textContent="— Select a sump preset —"; def.selected=true; ssel.appendChild(def);
  (state.beginner ? SUMPS.filter(s => s.beginner !== false) : SUMPS).forEach(s=>{
    const o=document.createElement("option"); o.value=s.id; o.textContent=`${s.name} — ${s.volumeGal}g (baffle ${s.baffleDepthIn}" · chamber ${s.skimmerChamber.widthIn}×${s.skimmerChamber.lengthIn}")`; ssel.appendChild(o);
  });
}
function populateAll(){
  // Equipment (with placeholders)
  populateSelect("lighting",      LIGHTS,      x=>x.name, false, "— Select lighting —");
  populateSelect("returnPump",    RETURN_PUMPS,x=>x.name, false, "— Select return pump —");
  populateSelect("powerhead",     POWERHEADS,  x=>x.name, false, "— Select powerhead —");

  const allowNone = state.aio || tankGallons() <= 40; // your existing rule for skimmer optionality
  populateSelect("skimmer",       SKIMMERS,    x=>`${x.name} (L:${x.lightRatingG}/H:${x.heavyRatingG}g)`, allowNone, "— Select skimmer —");
  populateSelect("heater",        HEATERS,     x=>x.name, false, "— Select heater —");

  // advanced
  populateSelect("uvSterilizer",  UVS,         x=>x.name, true,  "— Select UV —");
  populateSelect("atoSystem",     ATOS,        x=>x.name, false, "— Select ATO —");
  populateSelect("mediaReactor",  REACTORS,    x=>x.name, true,  "— Select reactor —");

  // existing population for species/tanks/sumps (leave as-is)
  populateSpecies(); 
  populateTanks(); 
  populateSumps();
  toggleBeginnerAdvanced(); 
  updateFit();
}

// ------- Apply tank preset + Red Sea pairing -------
function applyTankPreset(id){
  state.tankPresetId = id||null;
  const t=TANKS.find(x=>x.id===id);
  if(!t){ $("#useSump").value="yes"; state.aio=false; updateTank(); populateAll(); return; }

  $("#lenIn").value=t.dims.L; $("#widIn").value=t.dims.W; $("#heiIn").value=t.dims.H;
  Object.assign(state.tank,{ lengthIn:t.dims.L, widthIn:t.dims.W, heightIn:t.dims.H });
  state.aio=!!t.aio;
  if(t.aio){
    $("#useSump").value="no"; state.sump.use=false; state.equipment.skimmer=null;
  }else{
    $("#useSump").value="yes"; state.sump.use=true;
    if(t.sump){
      $("#sumpGallons").value=t.sump.volumeGal; state.sump.gallons=t.sump.volumeGal;
      $("#skimmerWaterDepth").value=t.sump.skimmerChamber.depthIn; state.sump.chamberDepthIn=t.sump.skimmerChamber.depthIn;
      $("#skimmerChamW").value=t.sump.skimmerChamber.widthIn; state.sump.chamW=t.sump.skimmerChamber.widthIn;
      $("#skimmerChamL").value=t.sump.skimmerChamber.lengthIn; state.sump.chamL=t.sump.skimmerChamber.lengthIn;
    }
  }
  state.tank.gallons=t.netGal;
 populateAll();
  updateTank();
 renderBudgetNow();

  // Red Sea ecosystem defaults
  if((t.brand||"").toLowerCase()==="red sea" || (t.id||"").startsWith("redsea_")){
    const g=t.netGal;
    state.equipment.lighting = g<=75 ? "redsea_reefled_90" : "redsea_reefled_160s";
    $("#lighting") && ($("#lighting").value=state.equipment.lighting);
    state.equipment.returnPump = g<=100 ? "redsea_reefrun_5500" : (g<=180 ? "redsea_reefrun_7000" : "redsea_reefrun_9000");
    $("#returnPump") && ($("#returnPump").value=state.equipment.returnPump);
    state.equipment.powerhead = g<=70 ? "redsea_reefwave25" : "redsea_reefwave45";
    $("#powerhead") && ($("#powerhead").value = state.equipment.powerhead);
    state.equipment.powerheadCount = g<=90 ? 1 : 2;
    $("#powerheadCount") && ($("#powerheadCount").value=state.equipment.powerheadCount);
    state.equipment.skimmer = g<=100 ? "redsea_rsk300" : (g<=200 ? "redsea_rsk600" : "redsea_rsk900");
    $("#skimmer") && ($("#skimmer").value=state.equipment.skimmer);
    if(g<=60){ state.equipment.heater="eheim_150"; state.equipment.heaterCount=1; }
    else if(g<=120){ state.equipment.heater="eheim_200"; state.equipment.heaterCount=2; }
    else { state.equipment.heater="eheim_300"; state.equipment.heaterCount=2; }
    $("#heater") && ($("#heater").value=state.equipment.heater);
    $("#heaterCount") && ($("#heaterCount").value=state.equipment.heaterCount);
    state.equipment.ato="redsea_reefato"; $("#atoSystem") && ($("#atoSystem").value="redsea_reefato");
  }

  populateAll(); updateTank(); renderBudgetNow();
}

function applySumpModel(id){
  state.sump.sumpModelId=id||null;
  const s=SUMPS.find(x=>x.id===id); if(!s) return;
  $("#useSump").value="yes"; state.sump.use=true;
  $("#sumpGallons").value=s.volumeGal; state.sump.gallons=s.volumeGal;
  $("#skimmerWaterDepth").value=s.baffleDepthIn; state.sump.chamberDepthIn=s.baffleDepthIn;
  $("#skimmerChamW").value=s.skimmerChamber.widthIn; state.sump.chamW=s.skimmerChamber.widthIn;
  $("#skimmerChamL").value=s.skimmerChamber.lengthIn; state.sump.chamL=s.skimmerChamber.lengthIn;
  updateFit();
  renderBudgetNow();
}

// ------- Stages -------
function switchStage(n){
  // 1) If we are LEAVING the Visualizer (Stage 5), stop it first
  const currentlyVisible = document.querySelector(".stage.visible");
  if (currentlyVisible && currentlyVisible.id === "stage-5") {
    try { window.destroyVisualizer && window.destroyVisualizer(); } catch(e){}
  }

  // 2) Standard stage switching (unchanged behavior)
  document.querySelectorAll(".stage").forEach(s => s.classList.remove("visible"));
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  $("#stage-" + n).classList.add("visible");
  document.querySelector(`.tab[data-stage='${n}']`).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });

  // 3) Stage-specific hooks
  if (n === "4") renderSummary();         // keep your existing Summary refresh
  if (n === "5") {
            try { window.initVisualizer && window.initVisualizer(); } catch(e){}
            renderVizEquipment(); // ← NEW
       }
}


// ------- Tank + Fit -------
function updateTank(){
  const L = parseFloat($("#lenIn").value) || 0;
  const W = parseFloat($("#widIn").value) || 0;
  const H = parseFloat($("#heiIn").value) || 0;
  const D = parseFloat($("#displacementPct").value) || 0;

  const preset = TANKS.find(x => x.id === state.tankPresetId);
  const gallons = state.tank.gallons = preset ? preset.netGal : galFromInches(L, W, H, D);

  // ✅ Update the small gallons note in the Tank card
  const gNote = document.getElementById("tankGallonsNote");
  if (gNote) gNote.textContent = `Gallons: ${gallons.toFixed(1)}g`;

  $("#calcResults").innerHTML = `
    <div>Build: <b>${state.meta.buildName || "Untitled Build"}</b> — <b>${BUILD_TARGETS[state.buildType].label}</b> ${state.beginner ? '(Beginner)' : '(Experienced)'}</div>
    <div>Net display volume: <b>${gallons.toFixed(1)}g</b>${preset ? " (preset)" : ""}</div>
    <div>System volume (est.): <b>${(gallons + (state.sump.use ? state.sump.gallons * 0.8 : 0)).toFixed(1)}g</b></div>
  `;

  populateAll();
  updateFit();
}
function fitNote(text, level="good", tip=""){
  const cls = level==="bad"?"bad":(level==="warn"?"warn":"good");
  const info = tip ? ` <button class="info" type="button" aria-label="What does this mean?" data-tip="${tip}"></button>` : "";
  return `<div class="${cls}">• ${text}${info}</div>`;
}
function currentParTarget(){
  const t=BUILD_TARGETS[state.buildType].par;
  const ids=state.corals.map(x=>x.id);
  if(ids.includes("acropora")) return Math.max(t[1],300);
  return (t[0]+t[1])/2;
}
function updateFit(){
  const g = state.tank.gallons||0;
  const targets=BUILD_TARGETS[state.buildType];
  const light=LIGHTS.find(x=>x.id===state.equipment.lighting);
  const lightCount=state.equipment.lightCount||0;
  const ret=RETURN_PUMPS.find(x=>x.id===state.equipment.returnPump);
  const ph=POWERHEADS.find(x=>x.id===state.equipment.powerhead);
  const phCount=state.equipment.powerheadCount||0;
  const sk=SKIMMERS.find(x=>x.id===state.equipment.skimmer);
  const heater=HEATERS.find(x=>x.id===state.equipment.heater);
  const heaterCount=state.equipment.heaterCount||0;

  const notes=[];

  // Return turnover
  const returnGph=(ret?.maxGph||0)*0.6;
  const turnover=returnGph/(g||1);
  if(turnover<3) notes.push(fitNote(`Return turnover low (~${turnover.toFixed(1)}×). Aim 3–5×.`,"warn","Return turnover = (return pump flow ÷ tank volume) per hour. 3–5×/hr is a typical target for most reefs."));
  else if(turnover>7) notes.push(fitNote(`Return turnover high (~${turnover.toFixed(1)}×). Throttle or bypass.`,"warn","Very high return turnover can be noisy/inefficient. Consider 3–5×/hr and use powerheads for in-tank flow."));
  else notes.push(fitNote(`Return turnover OK (~${turnover.toFixed(1)}×).`,"good","Return turnover looks within the common 3–5×/hr guideline."));

  // Total flow
  const circGph=returnGph+(ph?.gph||0)*phCount;
  const circX=circGph/(g||1); const [flowLow,flowHigh]=targets.flow;
  if(circX<flowLow) notes.push(fitNote(`Flow low (~${circX.toFixed(1)}×). Target ${flowLow}–${flowHigh}×.`,"warn","Total flow = (return + powerheads) ÷ tank volume. Softies/LPS often 10–30×; SPS tanks may need more."));
  else if(circX>Math.max(flowHigh*1.5,60)) notes.push(fitNote(`Flow very high (~${circX.toFixed(1)}×). Reduce/diffuse.`,"warn","Excessive flow can stress fish and corals. Aim for a gentle, varied current rather than a constant blast."));
  else notes.push(fitNote(`Flow OK (~${circX.toFixed(1)}×).`,"good","Overall water movement looks appropriate for your selected build type."));
// NEW: coverage-style guard for powerheads on long reefs
if (ph && (state.buildType !== 'fowlr')) {
  const gyre = isGyrePump(ph);
  const L = state.tank.lengthIn || 24;
  // On 48"+ reefs, a single puck-style powerhead is likely to leave dead spots.
  if (!gyre && L >= 48 && phCount < 2) {
    notes.push(
      fitNote(
        `Single powerhead on 48″ reef may leave dead spots.`,
        "warn",
        "Use two opposing puck-style powerheads (or a single gyre) for better crossflow and polyp movement."
      )
    );
  }
}


  // Heaters
  const totalW=(heater?.watts||0)*heaterCount;
  const wpg=totalW/(g||1);
  if(wpg<3) notes.push(fitNote(`Heater low (~${wpg.toFixed(1)} W/gal). Aim 3–5 W/gal.`,"warn","Rule of thumb to hold ~78–80°F. Cooler rooms need more wattage; warmer rooms need less."));
  else if(wpg>6) notes.push(fitNote(`Heater high (~${wpg.toFixed(1)} W/gal). Consider lower wattage or controller.`,"warn","Very high heater wattage can overshoot. Two smaller heaters with a controller is often safer."));
  else notes.push(fitNote(`Heater OK (~${wpg.toFixed(1)} W/gal).`,"good","Your watts-per-gallon falls in a typical range for reef tanks."));

  // Skimmer
  if(sk){
    if(g>sk.heavyRatingG) notes.push(fitNote(`Skimmer undersized for this tank.`,"bad","Skimmer ratings are optimistic. The ‘heavy’ rating is closer to real-world. Consider a size up."));
    else if(g>sk.lightRatingG) notes.push(fitNote(`Skimmer near its limit.`,"warn","Approaching the manufacturer’s rating. Performance may be marginal if you stock heavily."));
    else notes.push(fitNote(`Skimmer size OK.`,"good","Skimmer capacity looks appropriate for your tank volume."));
  }else if(state.aio || g<=40){
    notes.push(fitNote(`No skimmer selected — acceptable for many AIO/nano softie setups.`,"good","Small, lightly-stocked tanks with regular water changes can run skimmerless."));
  }

  // Lighting (cube/nano aware)
  if (light) {
    const gNow = state.tank.gallons || 0;
    const L = state.tank.lengthIn || 0, W = state.tank.widthIn || 0;
    const isCube = Math.abs(L - W) < 4 && L <= 24;
    const smallNano = state.aio || (gNow <= 32);
  const bar = isBarLight(light);

// For bar lights, trust the sheet coverage (bars legitimately span more length).
// For puck lights, clamp to a realistic 20–24" per unit.
const effectiveSpan = bar
  ? Math.max(24, (light.coverageInches || 48))   // bars often cover 36–48"+
  : Math.max(20, Math.min(24, (light.coverageInches || 24)));

const needed = (smallNano || isCube)
  ? 1
  : Math.max(1, Math.ceil(L / effectiveSpan));

// LPS guardrail: if 48" long and not a bar, require at least 2
const lpsGuard = (!bar && state.buildType === 'lps' && L >= 48) ? 2 : 1;
const requiredCount = Math.max(needed, lpsGuard);

    const parTarget = currentParTarget();
    const estHigh = (light.parHigh || 200) * (lightCount / requiredCount);

    if (isCube) {
      notes.push(
        fitNote(
          `Cube tank override active: one centered puck typically covers ≤24″ cubes.`,
          "good",
          "Cube-style tanks (e.g., 20g Nano Cube, 32g BioCube) spread light efficiently, so a single AI Prime 16HD or similar is usually sufficient for softies/LPS and many mixed reefs."
        )
      );
    }

    if (lightCount < requiredCount) {
  notes.push(
    fitNote(
      `Lighting coverage may be low for tank length.`,
      "warn",
      "Puck fixtures typically cover ~24″ each; 48″ LPS builds usually need at least two pucks unless you're using bar lights."
    )
  );
} else {
  notes.push(
    fitNote(
      `Lighting coverage OK.`,
      "good",
      "Fixture count should provide even coverage across the tank."
    )
  );
}

    if (state.buildType !== "fowlr") {
      if (estHigh < parTarget) {
        notes.push(
          fitNote(
            `Light output may be low for ${targets.label}.`,
            "warn",
            "PAR = light intensity at coral height. Mixed reefs ~100–250; SPS often 250–350+."
          )
        );
      } else {
        notes.push(
          fitNote(
            `Light output OK for ${targets.label}.`,
            "good",
            "Estimated PAR output matches the target range for your build type."
          )
        );
      }
    } else {
      notes.push(fitNote(`FOWLR: coral light not required.`,"good","Fish-only systems do not require coral PAR levels."));
    }
  }

  $("#fitResults").innerHTML = notes.join("");
  updateParMeter();
  updateCapacity();
  updateFlowMeter();
  updateRangesTable();
}

// ------- Fish & Corals -------
function addFish(){ const id=$("#fishSelect").value; const qty=parseInt($("#fishQty").value)||1; const spec=FISH.find(f=>f.id===id); if(!spec) return; const ex=state.fish.find(x=>x.id===id); if(ex) ex.qty+=qty; else state.fish.push({id,qty}); renderFish(); }
 function addInvert(){
  const id  = $("#invertSelect").value;
  const qty = parseInt($("#invertQty").value) || 1;
  const spec = INVERTS.find(i => i.id === id);
  if (!spec) return;
  const ex = state.fish.find(x => x.id === id);
  if (ex) ex.qty += qty;
  else state.fish.push({ id, qty });
  renderFish();
}

function removeFish(id){
  state.fish = state.fish.filter(x => x.id !== id);
  renderFish();
}

function renderFish(){
  const ul = $("#stockList");
  if (!ul) return;
  ul.innerHTML = "";
  state.fish.forEach(item => {
    const spec = FISH.find(f => f.id === item.id) || INVERTS.find(i => i.id === item.id);
    if (!spec) return;
    const li = el("li");
    li.innerHTML = `
      <div><b>${spec.name}</b> × ${item.qty}</div>
      <div><button class="secondary" onclick="removeFish('${item.id}')">Remove</button></div>
    `;
    ul.appendChild(li);
  });
  updateCapacity();
  setAnimalsBadge();
}

function addCoral(){ const id=$("#coralSelect").value; const qty=parseInt($("#coralQty").value)||1; const spec=CORALS.find(c=>c.id===id); if(!spec) return; const ex=state.corals.find(x=>x.id===id); if(ex) ex.qty+=qty; else state.corals.push({id,qty}); renderCorals(); }
function removeCoral(id){ state.corals=state.corals.filter(x=>x.id!==id); renderCorals(); }
function renderCorals(){
  const ul=$("#coralList"); if(!ul) return; ul.innerHTML="";
  state.corals.forEach(item=>{ const spec=CORALS.find(x=>x.id===item.id); if(!spec) return; const li=el("li"); li.innerHTML=`<div><b>${spec.name}</b> × ${item.qty}</div><div><button class="secondary" onclick="removeCoral('${item.id}')">Remove</button></div>`; ul.appendChild(li); });
  const t=BUILD_TARGETS[state.buildType]; $("#coralMetrics").innerHTML=`Build Type: <b>${t.label}</b> — Flow ${t.flow[0]}–${t.flow[1]}×, PAR ${t.par[0]}–${t.par[1]}${state.buildType==='fowlr'?' (not required)':''}`;
  updateFit();
  updateParMeter();
}

// ------- Quick Starts (unchanged content + jump to Stage 1) -------
function setStock(fishArr, coralArr){ state.fish=fishArr.filter(Boolean); state.corals=coralArr.filter(Boolean); renderFish(); renderCorals(); }
function suggestFor(key){
  switch(key){
    case 'nano20':   return { buildType:"softie", fish:[{id:"ocellaris_clown",qty:1},{id:"yellow_watchman",qty:1},{id:"trochus_snail",qty:3},{id:"cleaner_shrimp",qty:1}], corals:[{id:"zoanthids",qty:2},{id:"mushroom_coral",qty:2},{id:"toadstool_leather",qty:1}] };
    case 'biocube32':return { buildType:"softie", fish:[{id:"ocellaris_clown",qty:2},{id:"tailspot_blenny",qty:1},{id:"trochus_snail",qty:4},{id:"cleaner_shrimp",qty:1}], corals:[{id:"zoanthids",qty:3},{id:"green_star_polyps",qty:1},{id:"duncan",qty:1},{id:"hammer_coral",qty:1}] };
    case 'mixed40':  return { buildType:"mixed",  fish:[{id:"ocellaris_clown",qty:2},{id:"royal_gramma",qty:1},{id:"diamond_goby",qty:1},{id:"emerald_crab",qty:1},{id:"trochus_snail",qty:6}], corals:[{id:"hammer_coral",qty:1},{id:"frogspawn",qty:1},{id:"candy_cane",qty:1},{id:"zoanthids",qty:2}] };
    case 'fowlr75':  return { buildType:"fowlr", fish:[{id:"kole_tang",qty:1},{id:"foxface",qty:1},{id:"royal_gramma",qty:1},{id:"firefish",qty:2},{id:"cleaner_shrimp",qty:1}], corals:[] };
    case 'lps90':    return { buildType:"lps",   fish:[{id:"ocellaris_clown",qty:2},{id:"kole_tang",qty:1},{id:"melanurus_wrasse",qty:1},{id:"royal_gramma",qty:1},{id:"trochus_snail",qty:8},{id:"cleaner_shrimp",qty:1}], corals:[{id:"hammer_coral",qty:2},{id:"frogspawn",qty:1},{id:"duncan",qty:2},{id:"candy_cane",qty:2},{id:"blastomussa",qty:1},{id:"trachyphyllia",qty:1}] };
    default:         return { buildType:state.buildType, fish:[], corals:[] };
  }
}
function pickBudget(list){
  const items = byVolume(list).filter(x => state.beginner ? x.beginner !== false : true)
                              .filter(x => x.priceUSD != null);
  return items.sort((a,b) => (a.priceUSD ?? 9e9) - (b.priceUSD ?? 9e9))[0] || null;
}
function isBarLight(light){
  if (!light) return false;
  const s = [light.id, light.brand, light.model, light.name]
    .map(x => String(x||"").toLowerCase()).join(" ");
  return (
    s.includes("blade") ||  // AI Blade
    s.includes("xho")   ||  // ReefBrite XHO
    s.includes("bar")   ||  // generic "bar/reefbar/led bar"
    s.includes("strip") ||  // generic strip
    s.includes("orbit") ||  // Current USA Orbit
    s.includes("fluval 3.0")
  );
}
function isGyrePump(pump){
  if (!pump) return false;
  const s = [pump.id, pump.brand, pump.model, pump.name]
    .map(x => String(x||"").toLowerCase()).join(" ");
  // Common gyre / crossflow identifiers (add more models if you use them)
  return (
    s.includes("gyre") ||      // Maxspect Gyre, IceCap Gyre
    s.includes("xf")   ||      // e.g., "XF 330"
    s.includes("crossflow")    // generic descriptor
  );
}

function cheapestLightCountForLength(light, lengthIn, widthIn = 0){
  const cov = light?.coverageInches || 24;
  const L = lengthIn || 0;
  const W = widthIn || 0;

  // Treat near-square “cubes” (≤24") as 1-light builds by default.
  const isCube = Math.abs(L - W) < 4 && L <= 24;
  if (isCube) return 1;

  return Math.max(1, Math.ceil(L / cov));
}

function isBarLight(light){
  if(!light) return false;
  const s = [
    light.id, light.brand, light.model, light.name
  ].map(x => String(x||"").toLowerCase()).join(" ");

  // Common bar/strip identifiers – expand if needed
  return (
    s.includes("blade") ||  // AI Blade
    s.includes("xho")   ||  // ReefBrite XHO
    s.includes("bar")   ||  // generic "bar"/"reefbar"/"led bar"
    s.includes("strip") ||  // generic strip lights
    s.includes("orbit") ||  // Current USA Orbit
    s.includes("fluval 3.0")
  );
}

function applyQuickStart(key){
  // Preset: tank + build + starter stocking
  const preset = suggestFor(key);
  if(key==='nano20'){ $("#tankPreset").value="im_nuvo_20"; }
  if(key==='biocube32'){ $("#tankPreset").value="biocube_32"; }
  if(key==='mixed40'){ $("#tankPreset").value="wb_marinex_60_2"; }
  if(key==='fowlr75'){ $("#tankPreset").value="standard_75"; }
  if(key==='lps90'){ $("#tankPreset").value="standard_90"; }

  applyTankPreset($("#tankPreset").value);

  // Beginner-safe mode for budget picking
  state.beginner = true;
  $("#expBeginner").checked = true;

  // Build type + stocking
  state.buildType = preset.buildType || state.buildType;
  $("#buildType").value = state.buildType;
  setStock(preset.fish, preset.corals);

  // Budget-friendly equipment (volume-aware)
  const g = state.tank.gallons || 0;
  const L = state.tank.lengthIn || 24;

  const ret = pickBudget(RETURN_PUMPS);
  if(ret){ state.equipment.returnPump = ret.id; $("#returnPump").value = ret.id; }

  const ph = pickBudget(POWERHEADS);
if (ph) {
  state.equipment.powerhead = ph.id;
  $("#powerhead").value = ph.id;

  // Aim for mid target turnover
  const targetX = (BUILD_TARGETS[state.buildType].flow[0] + BUILD_TARGETS[state.buildType].flow[1]) / 2;
  const returnGph = (ret?.maxGph || 0) * 0.6;
  const need = Math.max(0, targetX * g - returnGph);

  // Base count by pump rated GPH
  const count = Math.max(1, Math.ceil(need / (ph.gph || 1000)));

  // NEW: 48"+ reef tanks (e.g., 90g LPS) need at least 2 puck-style powerheads
  // unless the unit is a true gyre/crossflow.
  const L = state.tank.lengthIn || 24;
  const reef = state.buildType !== 'fowlr';
  const gyre = isGyrePump(ph);
  const phMin = (reef && !gyre && L >= 48) ? 2 : 1;

  state.equipment.powerheadCount = Math.max(phMin, Math.min(3, count));
  $("#powerheadCount").value = state.equipment.powerheadCount;
}


  const light = pickBudget(LIGHTS);
if (light) {
  state.equipment.lighting = light.id;
  $("#lighting").value = light.id;

  // Base count from coverage
  let lc = cheapestLightCountForLength(light, L, state.tank.widthIn);

  // Nano-softie override (unchanged)
  const gNow = state.tank.gallons || 0;
  const isNanoSoft = (state.aio || gNow <= 32) && state.buildType !== 'sps';
  if (isNanoSoft) lc = 1;

  // --- NEW RULES ---
  // For reef tanks (anything except FOWLR) that are ≥ 36" long and NOT using bar lights,
  // enforce a more realistic minimum for pucks.
  const isReef = state.buildType !== 'fowlr';
  const bar    = isBarLight(light);

  if (isReef && !bar) {
    // Treat puck-style fixtures as ~24" effective coverage.
    const neededByLength = Math.max(1, Math.ceil(L / Math.max(20, (light.coverageInches || 24))));
    // Specific guard for our 48" LPS preset: minimum two pucks.
    const lpsGuard = (L >= 48 && state.buildType === 'lps') ? 2 : 1;

    lc = Math.max(lc, neededByLength, lpsGuard);
  }

  state.equipment.lightCount = lc;
  $("#lightCount").value = lc;
}


  const heat = pickBudget(HEATERS);
  if(heat){
    state.equipment.heater = heat.id; $("#heater").value = heat.id;
    const minW = 3 * g; // 3 W/gal baseline
    const count = Math.max(1, Math.ceil(minW / (heat.watts || 50)));
    state.equipment.heaterCount = Math.min(3, count);
    $("#heaterCount").value = state.equipment.heaterCount;
  }

    // Skimmer/sump: not needed for small AIO; otherwise choose by **heavy** rating for reefs
  if (state.aio || g <= 40) {
    state.equipment.skimmer = null;
    $("#skimmer").value = "";
    state.sump.use = false;
    $("#useSump").value = "no";
  } else {
    const reefBuild = state.buildType !== "fowlr";   // reef builds must meet heavy rating
    const targetG   = g;

    // Filter skimmers that meet capacity (heavy for reef, light for FOWLR)
    const candidates = (SKIMMERS || []).filter(x => {
      if (!x) return false;
      const capacity = reefBuild ? (x.heavyRatingG || 0) : (x.lightRatingG || 0);
      return capacity >= targetG;
    });

    // Choose the cheapest among the capable ones; if none are capable, choose the highest heavy rating fallback
    const ski = candidates.length
      ? candidates.slice().sort((a, b) => (a.priceUSD ?? 9e9) - (b.priceUSD ?? 9e9))[0]
      : (SKIMMERS || []).slice().sort((a, b) => (b.heavyRatingG || 0) - (a.heavyRatingG || 0))[0];

    if (ski) {
      state.equipment.skimmer = ski.id;
      $("#skimmer").value = ski.id;
    }

    const sumpPick = pickBudget(SUMPS);
    if (sumpPick) { applySumpModel(sumpPick.id); }
  }

  populateAll(); updateTank(); renderSummary(); renderBudgetNow();

  // Jump straight to Summary
  switchStage('4');
}


// ------- Capacity (renamed from Bioload) & Summary -------
function updateCapacity(){
  const g=state.tank.gallons||0;
  const cap=Math.max(10, g*5);
  const used=state.fish.reduce((s,x)=>{ const f=FISH.find(y=>y.id===x.id); return s + (f? f.bu * x.qty : 0); },0);
  const pct=Math.min(100, Math.round((used/cap)*100));
  $("#capacityBar").style.width=pct+"%";
  const note = used>cap ? "Over capacity — reduce stocking." : (pct>80? "Near capacity — add slowly." : "Plenty of room.");
  $("#capacityNote").textContent = `Stocking: ${used}/${Math.round(cap)} BU — ${note}`;
  $("#fishMetrics").innerHTML = `Capacity usage: <b>${used} BU</b> of ~<b>${Math.round(cap)} BU</b>`;
}

function updateParMeter(){
  const bar = $("#parBar"), note = $("#parNote");
  if(!bar || !note) return;

  const light = LIGHTS.find(x=>x.id===state.equipment.lighting);
  const count = state.equipment.lightCount || 0;

  if(!light){
    bar.style.width = "0%";
    note.textContent = "Select a light to see PAR.";
    return;
  }

  const L = state.tank.lengthIn || 0, W = state.tank.widthIn || 0;
const isCube = Math.abs(L - W) < 4 && L <= 24;
const needed = isCube ? 1 : Math.max(1, Math.ceil(L / (light.coverageInches || 24)));
  const estPar  = (light.parMid ?? light.parHigh ?? 0) * (count/needed);

  const required = (state.buildType==="fowlr") ? 0 : currentParTarget();
  const pct = required ? Math.max(0, Math.min(100, Math.round((estPar/required)*100))) : 100;

  bar.style.width = pct + "%";

  let noteText;
  if(required===0){
    noteText = "FOWLR: corals not required.";
  } else if(pct >= 110){
    noteText = `PAR ample (~${Math.round(estPar)} vs ~${Math.round(required)}). Consider diffusing if bleaching.`;
  } else if(pct >= 85){
    noteText = `PAR OK (~${Math.round(estPar)} vs ~${Math.round(required)}).`;
  } else if(pct >= 60){
    noteText = `PAR borderline (~${Math.round(estPar)} vs ~${Math.round(required)}). Add a fixture, raise output, or place corals higher.`;
  } else {
    noteText = `PAR low (~${Math.round(estPar)} vs ~${Math.round(required)}). Increase light count/output or choose lower-PAR corals.`;
  }
  note.textContent = `PAR adequacy: ${pct}% — ${noteText}`;
}
function updateFlowMeter(){
  const bar = $("#flowBar"), note = $("#flowNote");
  if(!bar || !note) return;

  const g = state.tank.gallons || 0;
  const ret = RETURN_PUMPS.find(x=>x.id===state.equipment.returnPump);
  const ph  = POWERHEADS.find(x=>x.id===state.equipment.powerhead);
  const phCount = state.equipment.powerheadCount || 0;

  const returnGph = (ret?.maxGph || 0) * 0.6; // realistic plumbing loss
  const circGph   = returnGph + (ph?.gph || 0) * phCount;
  const circX     = circGph / (g || 1);

  const [low, high] = BUILD_TARGETS[state.buildType].flow;
  const required = (low + high) / 2;

  const pct = Math.max(0, Math.min(100, Math.round((circX / (required || 1)) * 100)));
  bar.style.width = pct + "%";

  let msg;
  if(required === 0){
    msg = "FOWLR: flow target minimal.";
  } else if(pct >= 110){
    msg = `Flow ample (~${circX.toFixed(1)}× vs need ~${required}×). Diffuse if polyps retract.`;
  } else if(pct >= 85){
    msg = `Flow OK (~${circX.toFixed(1)}× vs ~${required}×).`;
  } else if(pct >= 60){
    msg = `Flow borderline (~${circX.toFixed(1)}× vs ~${required}×). Add a powerhead or adjust aim.`;
  } else {
    msg = `Flow low (~${circX.toFixed(1)}× vs ~${required}×). Increase flow or reduce obstructions.`;
  }
  note.textContent = `Flow adequacy: ${pct}% — ${msg}`;
}

function updateRangesTable(){
  const body = $("#reefRangesBody");
  if(!body) return;
  body.innerHTML = "";
  Object.entries(BUILD_TARGETS).forEach(([key, v])=>{
    const tr = document.createElement("tr");
    const isCur = key === state.buildType;
    tr.innerHTML = `
      <td>${isCur?'<b>':''}${v.label}${isCur?'</b>':''}</td>
      <td>${v.flow[0]}–${v.flow[1]}×</td>
      <td>${v.par[0]}–${v.par[1]}</td>`;
    body.appendChild(tr);
  });
}

function renderCompatibilityNotes(){
  const items = state.fish.map(itm=>{
    const f=FISH.find(x=>x.id===itm.id); return f? {id:itm.id, name:f.name, group:f.group, qty:itm.qty}:null;
  }).filter(Boolean);

  const notes=[];
  // Pairwise fish/invert compatibility
  for(let i=0;i<items.length;i++){
    for(let j=i+1;j<items.length;j++){
      const a=items[i], b=items[j];
      const res = (window.getSpeciesCompatibilityByIds? getSpeciesCompatibilityByIds(a.id,b.id) : {flag:"Y",reason:""});
      const flag = res.flag || "Y";
      const reason = res.reason || "";
      if(flag==="Y") notes.push(`<li class="ok">✅ OK: <b>${a.name}</b> with <b>${b.name}</b> — ${reason || "No issues known."}</li>`);
      if(flag==="C") notes.push(`<li class="caution">⚠️ Caution: <b>${a.name}</b> ↔ <b>${b.name}</b> — ${reason}. <i>Suggestion:</i> add hiding spots, introduce together, monitor aggression.</li>`);
      if(flag==="N") notes.push(`<li class="bad">⛔ Incompatible: <b>${a.name}</b> ↔ <b>${b.name}</b> — ${reason}. <i>Suggestion:</i> choose one, increase tank length, or stagger additions.</li>`);
    }
  }

  // Coral family interactions (Soft/LPS/SPS)
  const coralTypes = [...new Set(state.corals.map(c=>{
    const spec=CORALS.find(x=>x.id===c.id); return spec?.coralType;
  }).filter(Boolean))];

  const typeLabel = (t)=> t==="soft"?"Softie":t?.toUpperCase();

  for(let i=0;i<coralTypes.length;i++){
    for(let j=i+1;j<coralTypes.length;j++){
      const A = typeLabel(coralTypes[i]);
      const B = typeLabel(coralTypes[j]);
      const res = (window.getCompatibility? getCompatibility(A, B) : {flag:"Y",reason:""});
      const flag=res.flag||"Y", reason=res.reason||"";
      if(flag==="Y") notes.push(`<li class="ok">✅ OK: <b>${A}</b> with <b>${B}</b> — ${reason || "Compatible with spacing."}</li>`);
      if(flag==="C") notes.push(`<li class="caution">⚠️ Caution: <b>${A}</b> ↔ <b>${B}</b> — ${reason}. <i>Suggestion:</i> keep distance, manage flow/chemical warfare.</li>`);
      if(flag==="N") notes.push(`<li class="bad">⛔ Incompatible: <b>${A}</b> ↔ <b>${B}</b> — ${reason}. <i>Suggestion:</i> avoid mixing these families in close proximity.</li>`);
    }
  }

  if(!notes.length){
    return `<p class="muted">No compatibility concerns detected with current selections.</p>`;
  }
  return `<ul class="compat-list">${notes.join("")}</ul>`;
}

function renderSuggestions(){
  // Simple stocking suggestions based on tank size & choices
  const g = state.tank.gallons||0;
  const hasTang = state.fish.some(f=> (FISH.find(x=>x.id===f.id)?.group||"").toLowerCase().includes("tang"));
  const suggestions=[];
  if(g<70 && hasTang){
    suggestions.push(`Consider postponing tangs until ≥70–75g (swimming length matters more than volume).`);
  }
  const hasShrimp = state.fish.some(f=> (FISH.find(x=>x.id===f.id)?.name||"").toLowerCase().includes("shrimp"));
  const hasWrasse = state.fish.some(f=> (FISH.find(x=>x.id===f.id)?.group||"").toLowerCase().includes("wrasse"));
  if(hasShrimp && hasWrasse){
    suggestions.push(`Wrasses may pick at small shrimps: add shrimp first, provide caves, and feed well.`);
  }
  if(!suggestions.length) return `<p class="muted">No extra suggestions at this time.</p>`;
  return `<ul>${suggestions.map(s=>`<li>${s}</li>`).join("")}</ul>`;
}

function currentBudgetBreakdown(){
  const tPreset = state.tankPresetId ? TANKS.find(x=>x.id===state.tankPresetId) : null;
  const sumpPreset = state.sump?.sumpModelId ? SUMPS.find(x=>x.id===state.sump.sumpModelId) : null;

  const parts = [
    { label:"Display Tank",  cost: tPreset ? (tPreset.priceUSD||0) : 0 },
    { label:"Sump",          cost: (state.sump.use && sumpPreset) ? (sumpPreset.priceUSD||0) : 0 },
    { label:"Lighting",      cost: (LIGHTS.find(x=>x.id===state.equipment.lighting)?.priceUSD||0) * (state.equipment.lightCount||0) },
    { label:"Return Pump",   cost: (RETURN_PUMPS.find(x=>x.id===state.equipment.returnPump)?.priceUSD||0) },
    { label:"Powerheads",    cost: (POWERHEADS.find(x=>x.id===state.equipment.powerhead)?.priceUSD||0) * (state.equipment.powerheadCount||0) },
    { label:"Skimmer",       cost: state.equipment.skimmer ? (SKIMMERS.find(x=>x.id===state.equipment.skimmer)?.priceUSD||0) : 0 },
    { label:"Heaters",       cost: (HEATERS.find(x=>x.id===state.equipment.heater)?.priceUSD||0) * (state.equipment.heaterCount||0) },
    { label:"UV Sterilizer", cost: state.equipment.uv ? (UVS.find(x=>x.id===state.equipment.uv)?.priceUSD||0) : 0 },
    { label:"ATO System",    cost: state.equipment.ato ? (ATOS.find(x=>x.id===state.equipment.ato)?.priceUSD||0) : 0 },
    { label:"Media Reactor", cost: state.equipment.reactor ? (REACTORS.find(x=>x.id===state.equipment.reactor)?.priceUSD||0) : 0 },
  ];
  const subtotal = parts.reduce((s,p)=>s+(p.cost||0),0);
  return { parts, subtotal };
}

function renderBudgetNow(){
  const host = $("#budgetNow"); if(!host) return;
  const { parts, subtotal } = currentBudgetBreakdown();
  host.innerHTML = `
    <div class="small muted">Running equipment subtotal</div>
    <ul class="list" style="margin-top:6px">
      ${parts.filter(p=>p.cost>0).map(p=>`<li><span>${p.label}</span><b>$${(p.cost||0).toFixed(2)}</b></li>`).join("") || `<li><span>No priced items selected yet</span><b>$0.00</b></li>`}
    </ul>
    <hr class="muted"/>
    <div style="display:flex;justify-content:space-between"><b>Total</b><b>$${(subtotal||0).toFixed(2)}</b></div>
  `;
}
function renderVizEquipment(){
  const host = document.getElementById('vizEquip');
  if (!host) return;

  const eq = state.equipment;
  const nameOf = (list, id) => (list?.find?.(x => x.id === id) || {}).name || "—";

  const parts = [
    `Lighting: <b>${nameOf(LIGHTS, eq.lighting)}</b> × ${eq.lightCount || 0}`,
    `Return: <b>${nameOf(RETURN_PUMPS, eq.returnPump)}</b>`,
    `Powerheads: <b>${nameOf(POWERHEADS, eq.powerhead)}</b> × ${eq.powerheadCount || 0}`,
    `Skimmer: <b>${eq.skimmer ? nameOf(SKIMMERS, eq.skimmer) : 'None'}</b>`,
    `Heaters: <b>${nameOf(HEATERS, eq.heater)}</b> × ${eq.heaterCount || 0}`
  ];

  host.innerHTML = `<div class="small muted">Selected Equipment</div>
    <ul class="list" style="margin-top:6px">
      ${parts.map(p=>`<li>${p}</li>`).join("")}
    </ul>`;
}

function renderBudgetSummary(){
  const host = $("#budgetSummary"); if(!host) return;
  const { parts, subtotal } = currentBudgetBreakdown();
  host.innerHTML = `
    <ul class="list">
      ${parts.map(p=>`<li><span>${p.label}</span><b>$${(p.cost||0).toFixed(2)}</b></li>`).join("")}
    </ul>
    <hr class="muted"/>
    <div style="display:flex;justify-content:space-between;font-size:1.05rem"><b>Grand Total</b><b>$${(subtotal||0).toFixed(2)}</b></div>
    <div class="muted small" style="margin-top:6px">Note: prices are ballpark street prices and exclude tax/shipping.</div>
  `;
}

function renderSummary(){
  // ✅ Always refresh Fit notes before building summary
  updateFit();

  const t = state.tank, s = state.sump, eq = state.equipment;
  const nameOf = (list, id) => (list?.find?.(x => x.id === id) || {}).name || "—";
  const fishLines = state.fish.map(x => (FISH.find(y => y.id === x.id)?.name || x.id) + " × " + x.qty).join("<br>");
  const coralLines = state.corals.map(x => (CORALS.find(y => y.id === x.id)?.name || x.id) + " × " + x.qty).join("<br>");

  const compatHTML = renderCompatibilityNotes();
  const suggestHTML = renderSuggestions();

  // ✅ Grab current Fit & Sizing notes (includes info tooltips)
  const fitHTML = document.getElementById("fitResults")?.innerHTML || "<p class='muted'>No fit checks yet.</p>";

  // ✅ Build the summary layout
  $("#summary").innerHTML = `
    <h3>Build</h3>
    <div>Name: <b>${state.meta.buildName || "Untitled Build"}</b> — <b>${BUILD_TARGETS[state.buildType].label}</b> ${state.beginner ? '(Beginner)' : '(Experienced)'}</div>

    <h3>Tank</h3>
    <div>${t.lengthIn}" × ${t.widthIn}" × ${t.heightIn}" — Net <b>${(t.gallons || 0).toFixed(1)}g</b></div>
    <div>Sump: <b>${s.use ? (s.gallons + 'g @ ' + s.chamberDepthIn + '" depth, chamber ' + s.chamW + '×' + s.chamL + '"') : 'None'}</b></div>

    <h3>Equipment</h3>
    <div>Lighting: <b>${nameOf(LIGHTS, eq.lighting)}</b> × ${eq.lightCount}</div>
    <div>Return: <b>${nameOf(RETURN_PUMPS, eq.returnPump)}</b></div>
    <div>Powerheads: <b>${nameOf(POWERHEADS, eq.powerhead)}</b> × ${eq.powerheadCount}</div>
    <div>Skimmer: <b>${eq.skimmer ? nameOf(SKIMMERS, eq.skimmer) : 'None'}</b></div>
    <div>Heaters: <b>${nameOf(HEATERS, eq.heater)}</b> × ${eq.heaterCount}</div>
    <div>UV: <b>${eq.uv ? nameOf(UVS, eq.uv) : (state.beginner ? 'Hidden in Beginner mode' : 'None')}</b></div>
    <div>ATO: <b>${nameOf(ATOS, eq.ato)}</b></div>
    <div>Reactor: <b>${eq.reactor ? nameOf(REACTORS, eq.reactor) : (state.beginner ? 'Hidden in Beginner mode' : 'None')}</b></div>

    <h3>Fit & Sizing Check</h3>
    <div class="fit-notes">
      ${fitHTML}
    </div>

    <h3>Livestock</h3>
    <div>${fishLines || "<span class='muted'>No fish</span>"}</div>

    <h3>Corals</h3>
    <div>${coralLines || (state.buildType === 'fowlr' ? "<span class='muted'>FOWLR — no corals planned</span>" : "<span class='muted'>No corals</span>")}</div>

    <h3>Compatibility</h3>
    ${compatHTML}

    <h3>Suggestions</h3>
    ${suggestHTML}
  `;

  // ✅ Include the running cost summary at the bottom
  renderBudgetSummary();
}

// ------- Tooltips / Glossary / Export -------
function initTips(){ /* no-op */ }
function initGlossary(){
  $("#openGlossary")?.addEventListener("click", ()=> $("#glossaryModal").classList.remove("hidden"));
  $("#closeGlossary")?.addEventListener("click", ()=> $("#glossaryModal").classList.add("hidden"));
}

function initExport(){
  const setOrientation = (mode)=>{
    let tag = document.getElementById('print-orientation');
    if(!tag){
      tag = document.createElement('style');
      tag.id = 'print-orientation';
      document.head.appendChild(tag);
    }
    tag.textContent = `@media print { @page { size: ${mode}; margin: 8mm; } }`;
  };

  const doPrint = (mode)=>{
    setOrientation(mode);
    switchStage('4');
    requestAnimationFrame(()=>{
      window.print();
      const tag = document.getElementById('print-orientation');
      if(tag) setTimeout(()=> tag.remove(), 250);
    });
  };

  document.getElementById('exportPortrait')?.addEventListener('click', ()=> doPrint('portrait'));
  document.getElementById('exportLandscape')?.addEventListener('click', ()=> doPrint('landscape'));
  window.addEventListener('afterprint', ()=>{
    document.getElementById('print-orientation')?.remove();
  });
}
// --- Handle Welcome → Builder deep-links (#start, #quick=slug) ---
function runQuickStartFromURL(){
  const hash = (location.hash || "").slice(1); // strip leading '#'
  if (!hash) return;

  // Open Stage 1
  if (hash === "start") {
    switchStage('1');
    return;
  }

  // Quick-start presets (e.g., index.html#quick=lps90)
  if (hash.startsWith("quick=")) {
    const slug = decodeURIComponent(hash.split("=").slice(1).join("="));

    // Prefer your existing quick start function if present
    if (typeof window.applyQuickStart === "function") {
      window.applyQuickStart(slug);
      return;
    }

    // Fallback: if no handler exists, just open Stage 1
    switchStage('1');
  }
}

// ---- Boot: wait for Google Sheets before starting ----
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadFromSheetsAndOverwriteGlobals();  // fetch all live data
  } catch (err) {
    console.warn("⚠️ Google Sheets failed to load. Using built-in data instead.", err);
  }

  // Now start the normal app
  init();

  // Re-add the “Next →” button handler (same logic as before)
  document.querySelectorAll(".next-btn").forEach(btn=>{
    btn.addEventListener("click",(e)=>{
      const nextStage=e.target.dataset.next;
      if(!nextStage) return;
      document.querySelectorAll(".stage").forEach(s=>s.classList.remove("visible"));
      const next=document.querySelector("#stage-"+nextStage); if(next) next.classList.add("visible");
      document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
      const nextTab=document.querySelector(`.tab[data-stage='${nextStage}']`); if(nextTab) nextTab.classList.add("active");
      window.scrollTo({ top:0, behavior:"smooth" });
      if(nextStage==="4") renderSummary();
    });
  });
document.querySelectorAll(".back-btn").forEach(btn=>{
  btn.addEventListener("click",(e)=>{
    const prevStage = e.target.dataset.prev;
    if(!prevStage) return;
    document.querySelectorAll(".stage").forEach(s=>s.classList.remove("visible"));
    const prev = document.querySelector("#stage-"+prevStage); 
    if(prev) prev.classList.add("visible");
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    const prevTab = document.querySelector(`.tab[data-stage='${prevStage}']`); 
    if(prevTab) prevTab.classList.add("active");
    window.scrollTo({ top:0, behavior:"smooth" });
  });
});
});
