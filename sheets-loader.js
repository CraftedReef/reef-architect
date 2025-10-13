// === Google Sheets Loader (pure JS file) ===

// Build CSV URL from SOURCES + tab name
function csvUrl(sheetKey, sheetName){
  const sources = window.SHEETS_SOURCES || {};
  const id = sources[sheetName];
  if (!id) {
    throw new Error(`Missing SHEETS_SOURCES entry for tab "${sheetName}". Check sheets-config.js.`);
  }
  return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
}

// Fetch CSV text (with tiny cache-buster during debugging)
async function fetchCsv(url){
  const bust = Date.now() % (window.SHEETS_CACHE_MS || (5 * 60 * 1000));
  const res = await fetch(url + `&cache=${bust}`);
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  return await res.text();
}

// Convert first row to headers, return array of objects
function parseCsv(csv){
  const lines = csv.replace(/\r/g,'').split('\n').filter(l => l.length);
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const cells = [];
    let cur = '', inQ = false;
    for (let i=0;i<line.length;i++){
      const c = line[i];
      if (c === '"' ) {
        if (inQ && line[i+1] === '"'){ cur += '"'; i++; }
        else inQ = !inQ;
      } else if (c === ',' && !inQ){
        cells.push(cur); cur='';
      } else {
        cur += c;
      }
    }
    cells.push(cur);
    const obj = {};
    headers.forEach((h,idx) => obj[h] = (cells[idx] ?? '').trim());
    return obj;
  });
}
// ---- Normalizers ----
const toBool = v => String(v).trim().toLowerCase() === 'true';
const toNum  = v => (v===''||v==null) ? undefined : Number(String(v).replace(/[$,]/g,''));
const splitRange = v => {
  const m = String(v||'').match(/(-?\d+(?:\.\d+)?)\s*[-–]\s*(-?\d+(?:\.\d+)?)/);
  return m ? [Number(m[1]), Number(m[2])] : [0,0];
};

// CORALS: convert parRange -> par[], booleans to real booleans, lowercase types
function normalizeCoralRow(r){
  return {
    id: (r.id || r.ID || (r.name||'').toLowerCase().replace(/[^a-z0-9]+/g,'_')).trim(),
    name: r.name || r.Name || '',
    scientific: r.scientific || r.Scientific || '',
    par: splitRange(r.parRange || r.PAR || ''),
    aggression: (r.aggression||'').toLowerCase(),
    sweepers: toBool(r.sweepers),
    placement: (r.placement||'').toLowerCase(),
    beginner: toBool(r.beginner),
    coralType: (r.coralType || r.type || '').toLowerCase()
  };
}

// Generic number coercion for common equipment fields (keeps unknown fields as-is)
function normalizeEquipmentRow(r, numberKeys=[]){
  const out = { ...r };
  numberKeys.forEach(k => { if (k in out) out[k] = toNum(out[k]); });
  // common booleans
  if ('beginner' in out) out.beginner = toBool(out.beginner);
  return out;
}

async function loadTab(key){
  const tabName = (window.SHEETS_TABS || {})[key];
  if (!tabName) throw new Error(`Unknown key "${key}" in SHEETS_TABS`);
  const url = csvUrl(key, tabName);
  const csv = await fetchCsv(url);
  const rows = parseCsv(csv);

  switch (key) {
    case 'corals':
      return rows.map(normalizeCoralRow);

    case 'lights':
      return rows.map(r => normalizeEquipmentRow(r, ['coverageInches','parHigh','parMid','parLow','minG','maxG','priceUSD']));

    case 'returnPumps':
      return rows.map(r => normalizeEquipmentRow(r, ['maxGph','minG','maxG','priceUSD']));

    case 'powerheads':
      return rows.map(r => normalizeEquipmentRow(r, ['gph','minG','maxG','priceUSD']));

    case 'skimmers':
      // skimmer numbers commonly referenced by the app:
      return rows.map(r => normalizeEquipmentRow(r, ['lightRatingG','heavyRatingG','airLph','minG','maxG','priceUSD']));

    case 'heaters':
      return rows.map(r => normalizeEquipmentRow(r, ['watts','minG','maxG','priceUSD']));

    case 'uv':
    case 'ato':
    case 'reactors':
      return rows.map(r => normalizeEquipmentRow(r, ['priceUSD']));

    case 'tanks':
      return rows; // app doesn’t need coercion here

    case 'sumps':
      return rows; // app parses strings for display

    case 'fish':
      // basic cleanup so beginner filter works; minGallons used for label only
      return rows.map(r => ({ 
        ...r, 
        beginner: toBool(r.beginner), 
        minGallons: toNum(r.minGallons) ?? r.minGallons 
      }));

    default:
      return rows;
  }
}

// Load everything your app expects and expose globals so legacy code works
async function loadAllDataFromSheets(){
  const data = {};

  // ---- Equipment ----
data.LIGHTS        = await loadTab('lights');
data.RETURN_PUMPS  = await loadTab('returnPumps');
data.POWERHEADS    = await loadTab('powerheads');
data.SKIMMERS      = await loadTab('skimmers');
data.HEATERS       = await loadTab('heaters');
data.UV            = await loadTab('uv');
data.ATO           = await loadTab('ato');
data.REACTORS      = await loadTab('reactors');

// Legacy plural names expected by app.js
data.UVS  = data.UV;
data.ATOS = data.ATO;

// ---- Tanks ----
data.TANKS         = await loadTab('tanks');
data.SUMPS         = await loadTab('sumps');

// ---- Livestock ----
data.FISH          = await loadTab('fish');
data.CORALS        = await loadTab('corals');

  // Expose globals expected by app.js
  Object.assign(window, {
    LIGHTS:        data.LIGHTS,
    RETURN_PUMPS:  data.RETURN_PUMPS,
    POWERHEADS:    data.POWERHEADS,
    SKIMMERS:      data.SKIMMERS,
    HEATERS:       data.HEATERS,
    UVS:           data.UVS,
    ATOS:          data.ATOS,
    REACTORS:      data.REACTORS,
    TANKS:         data.TANKS,
    SUMPS:         data.SUMPS,
    FISH:          data.FISH,
    CORALS:        data.CORALS
  });

  // Keep combined object too
  window.REEF_DATA = data;
  return data;
}

// Optional helper for clearing our local cache namespace
window.clearReefCache = function(){
  Object.keys(localStorage)
    .filter(k => k.startsWith('reef:'))
    .forEach(k => localStorage.removeItem(k));
};

// Export the main loader
window.loadAllDataFromSheets = loadAllDataFromSheets;
