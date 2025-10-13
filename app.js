// Reef Architect v11 — volume-aware equipment, Beginner/Experienced modes, grouped species,
// compatibility in summary, Welcome+QuickStart fixes, Glossary modal fix,
// Stage-1 layout usability, Theme label fix.

const $ = (s)=>document.querySelector(s);
const $$ = (s)=>Array.from(document.querySelectorAll(s));
const el = (t, c)=>{ const n=document.createElement(t); if(c) n.className=c; return n; };
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
function initTheme(){
  // 1) Apply saved/system theme now
  applyTheme(preferredTheme());

  // 2) Toggle + persist
  document.getElementById('themeToggle')?.addEventListener('click', ()=>{
    const cur  = document.documentElement.getAttribute('data-theme') || 'light';
    const next = (cur === 'dark') ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch(e){}
  });

  // 3) If user hasn’t chosen a theme yet, follow OS changes
  if (!localStorage.getItem('theme') && window.matchMedia) {
    try {
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e)=> applyTheme(e.matches ? 'dark' : 'light'));
    } catch(e){}
  }

  // 4) Re-apply on back/forward cache restore (fixes "stuck" theme on Back)
  window.addEventListener('pageshow', () => {
    applyTheme(preferredTheme());
  });
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

  // equipment (budget-friendly, beginner-safe defaults)
  state.equipment = {
    lighting:"ai_prime_16hd", lightCount:1,
    returnPump:"sicce_syncra_3",
    powerhead:"ai_nero3", powerheadCount:1,
    skimmer:"ro_classic_110int",
    heater:"eheim_150", heaterCount:1,
    uv:null, ato:"tunze_3155", reactor:null
  };
  document.getElementById('lighting').value = "ai_prime_16hd";
  document.getElementById('lightCount').value = 1;
  document.getElementById('returnPump').value = "sicce_syncra_3";
  document.getElementById('powerhead').value = "ai_nero3";
  document.getElementById('powerheadCount').value = 1;
  document.getElementById('skimmer').value = "ro_classic_110int";
  document.getElementById('heater').value = "eheim_150";
  document.getElementById('heaterCount').value = 1;
  document.getElementById('uvSterilizer').value = "";
  document.getElementById('atoSystem').value = "tunze_3155";
  document.getElementById('mediaReactor').value = "";

  // livestock
  state.fish = [];
  state.corals = [];
  renderFish(); renderCorals();

  // refresh UI + go to Welcome
  populateAll(); updateTank(); renderBudgetNow(); renderSummary();
  switchStage('0');
}

// ------- Init -------
function init(){
  initTheme();

  // Tabs
  $$('#stage-tabs .tab').forEach(btn=>{
    btn.addEventListener('click',()=>switchStage(btn.dataset.stage));
  });

  // Start button on Welcome
  $('#startBtn')?.addEventListener('click', ()=> switchStage('1'));

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

  bindInputs();
  updateTank();
  populateAll();
  renderFish(); renderCorals(); renderSummary();

  initGlossary();
  initExport();
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

function populateSelect(id, list, labelFn, allowNone=false){
  const sel = $("#"+id); if(!sel || !list) return;
  const items = byVolume(list).slice().sort((a,b)=>{
    const pa=a.priceUSD??Infinity, pb=b.priceUSD??Infinity;
    if(pa!==pb) return pa-pb;
    return (a.name||"").localeCompare(b.name||"");
  });

  sel.innerHTML="";
  if(allowNone){ const o=document.createElement("option"); o.value=""; o.textContent="— None —"; sel.appendChild(o); }

  items.forEach(x=>{
    const label = labelFn ? labelFn(x) : x.name;
    const priced = x.priceUSD!=null ? `${label} — ${money(x.priceUSD)}` : label;
    const o=document.createElement("option");
    o.value=x.id; o.textContent=priced;
    sel.appendChild(o);
  });

  // keep current selection if possible, else first option
  const wanted = state.equipment[id];
  const exists = items.find(i=>i.id===wanted);
  sel.value = exists ? exists.id : (items[0]?.id ?? sel.value);
  if (['lighting','returnPump','powerhead','skimmer','heater','uvSterilizer','atoSystem','mediaReactor'].includes(id)) {
  const keyMap = { uvSterilizer:'uv', atoSystem:'ato', mediaReactor:'reactor' };
  const key = keyMap[id] || id;
  state.equipment[key] = sel.value || null;
}
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
  (state.beginner? SUMPS.filter(s=>s.beginner):SUMPS).forEach(s=>{
    const o=document.createElement("option"); o.value=s.id; o.textContent=`${s.name} — ${s.volumeGal}g (baffle ${s.baffleDepthIn}" · chamber ${s.skimmerChamber.widthIn}×${s.skimmerChamber.lengthIn}")`; ssel.appendChild(o);
  });
}
function populateAll(){
  populateSelect("lighting", LIGHTS, x=>x.name);
  populateSelect("returnPump", RETURN_PUMPS, x=>x.name);
  populateSelect("powerhead", POWERHEADS, x=>x.name);
  const allowNone = state.aio || tankGallons()<=40;
  populateSelect("skimmer", SKIMMERS, x=>`${x.name} (L:${x.lightRatingG}/H:${x.heavyRatingG}g)`, allowNone);
  populateSelect("heater", HEATERS, x=>x.name);
  populateSelect("uvSterilizer", UVS, x=>x.name, true);
  populateSelect("atoSystem", ATOS, x=>x.name);
  populateSelect("mediaReactor", REACTORS, x=>x.name, true);

  populateSpecies(); populateTanks(); populateSumps();
  toggleBeginnerAdvanced(); updateFit();
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
  document.querySelectorAll(".stage").forEach(s=>s.classList.remove("visible"));
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  $("#stage-"+n).classList.add("visible");
  document.querySelector(`.tab[data-stage='${n}']`).classList.add("active");
  window.scrollTo({ top:0, behavior:"smooth" });
  if(n==="4") renderSummary();
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
    const needed = (smallNano || isCube)
      ? 1
      : Math.max(1, Math.ceil(L / (light.coverageInches || 24)));

    const parTarget = currentParTarget();
    const estHigh = (light.parHigh || 200) * (lightCount / needed);

    if (isCube) {
      notes.push(
        fitNote(
          `Cube tank override active: one centered puck typically covers ≤24″ cubes.`,
          "good",
          "Cube-style tanks (e.g., 20g Nano Cube, 32g BioCube) spread light efficiently, so a single AI Prime 16HD or similar is usually sufficient for softies/LPS and many mixed reefs."
        )
      );
    }

    if (lightCount < needed) {
      notes.push(
        fitNote(
          `Lighting coverage may be low for tank length.`,
          "warn",
          "Coverage = number of fixtures needed to evenly light the tank length (many pucks cover ~24in)."
        )
      );
    } else {
      notes.push(
        fitNote(
          `Lighting coverage OK.`,
          "good",
          "Number of fixtures should provide even coverage across the tank."
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
function removeFish(id){ state.fish=state.fish.filter(x=>x.id!==id); renderFish(); }
function renderFish(){
  const ul=$("#stockList"); if(!ul) return; ul.innerHTML="";
  state.fish.forEach(item=>{ const spec=FISH.find(f=>f.id===item.id); if(!spec) return; const li=el("li"); li.innerHTML=`<div><b>${spec.name}</b> × ${item.qty}</div><div><button class="secondary" onclick="removeFish('${item.id}')">Remove</button></div>`; ul.appendChild(li); });
  updateCapacity();
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
function cheapestLightCountForLength(light, lengthIn, widthIn = 0){
  const cov = light?.coverageInches || 24;
  const L = lengthIn || 0;
  const W = widthIn || 0;

  // Treat near-square “cubes” (≤24") as 1-light builds by default.
  const isCube = Math.abs(L - W) < 4 && L <= 24;
  if (isCube) return 1;

  return Math.max(1, Math.ceil(L / cov));
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
  if(ph){
    state.equipment.powerhead = ph.id; $("#powerhead").value = ph.id;
    // aim for mid target flow
    const targetX = (BUILD_TARGETS[state.buildType].flow[0] + BUILD_TARGETS[state.buildType].flow[1]) / 2;
    const returnGph = (ret?.maxGph || 0) * 0.6;
    const need = Math.max(0, targetX * g - returnGph);
    const count = Math.max(1, Math.ceil(need / (ph.gph || 1000)));
    state.equipment.powerheadCount = Math.min(3, count);
    $("#powerheadCount").value = state.equipment.powerheadCount;
  }

  const light = pickBudget(LIGHTS);
  if(light){
  state.equipment.lighting = light.id; $("#lighting").value = light.id;
  let lc = cheapestLightCountForLength(light, L, state.tank.widthIn);

  // 🔒 Nano override: small AIOs or ≤32g (non-SPS) should default to ONE puck
  const gNow = state.tank.gallons || 0;
  const isNanoSoft = (state.aio || gNow <= 32) && state.buildType !== 'sps';
  if (isNanoSoft) lc = 1;

  state.equipment.lightCount = lc; $("#lightCount").value = lc;
}

  const heat = pickBudget(HEATERS);
  if(heat){
    state.equipment.heater = heat.id; $("#heater").value = heat.id;
    const minW = 3 * g; // 3 W/gal baseline
    const count = Math.max(1, Math.ceil(minW / (heat.watts || 50)));
    state.equipment.heaterCount = Math.min(3, count);
    $("#heaterCount").value = state.equipment.heaterCount;
  }

  // Skimmer/sump: not needed for small AIO; otherwise pick a cheap compatible option
  if(state.aio || g <= 40){
    state.equipment.skimmer = null; $("#skimmer").value = "";
    state.sump.use = false; $("#useSump").value = "no";
  } else {
    const ski = pickBudget(SKIMMERS);
    if(ski){ state.equipment.skimmer = ski.id; $("#skimmer").value = ski.id; }
    const sumpPick = pickBudget(SUMPS);
    if(sumpPick){ applySumpModel(sumpPick.id); }
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

// Boot
document.addEventListener("DOMContentLoaded", init);

// Also keep the progressive Next → handler for any dynamically added buttons
document.querySelectorAll(".next-btn").forEach(btn=>{
  btn.addEventListener("click",(e)=>{
    const nextStage=e.target.dataset.next;
    if(!nextStage) return;
    document.querySelectorAll(".stage").forEach(s=>s.classList.remove("visible"));
    const next=$("#stage-"+nextStage); if(next) next.classList.add("visible");
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    const nextTab=document.querySelector(`.tab[data-stage='${nextStage}']`); if(nextTab) nextTab.classList.add("active");
    window.scrollTo({ top:0, behavior:"smooth" });
    if(nextStage==="4") renderSummary();
  });
});
