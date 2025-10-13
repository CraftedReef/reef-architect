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

async function loadTab(key){
  const tabName = (window.SHEETS_TABS || {})[key];
  if (!tabName) throw new Error(`Unknown key "${key}" in SHEETS_TABS`);
  const url = csvUrl(key, tabName);
  const csv = await fetchCsv(url);
  return parseCsv(csv);
}

// Load everything your app expects and expose globals so legacy code works
async function loadAllDataFromSheets(){
  const data = {};

  // ---- Equipment ----
  data.LIGHTS        = await loadTab('Lights');
  data.RETURN_PUMPS  = await loadTab('ReturnPumps');
  data.POWERHEADS    = await loadTab('Powerheads');
  data.SKIMMERS      = await loadTab('Skimmers');
  data.HEATERS       = await loadTab('Heaters');
  data.UVS           = await loadTab('UV');       // plural alias used by app.js
  data.ATOS          = await loadTab('ATO');      // plural alias used by app.js
  data.REACTORS      = await loadTab('Reactors');
  data.UVS  = data.UV;
  data.ATOS = data.ATO;


  // ---- Tanks ----
  data.TANKS         = await loadTab('Tanks');
  data.SUMPS         = await loadTab('Sumps');

  // ---- Livestock ----
  data.FISH          = await loadTab('Fish');
  data.CORALS        = await loadTab('Corals');

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
