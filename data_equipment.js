// data_equipment.js — v12: prices added + still volume-aware + beginner flags

// ------------------------- LIGHTS -------------------------
const LIGHTS = [
  // AquaIllumination
  { id:"ai_prime_16hd", brand:"AquaIllumination", model:"Prime 16HD", name:"AI Prime 16HD", coverageInches:18, parHigh:250, parMid:150, parLow:80,  minG:5,  maxG:32,  beginner:true,  priceUSD:249 },
  { id:"ai_hydra_32hd", brand:"AquaIllumination", model:"Hydra 32HD", name:"AI Hydra 32HD", coverageInches:24, parHigh:300, parMid:180, parLow:90,  minG:20, maxG:75,  beginner:true,  priceUSD:419 },
  { id:"ai_hydra_64hd", brand:"AquaIllumination", model:"Hydra 64HD", name:"AI Hydra 64HD", coverageInches:30, parHigh:350, parMid:200, parLow:100, minG:40, maxG:120, beginner:false, priceUSD:699 },
  { id:"ai_blade_grow_39", brand:"AquaIllumination", model:"Blade Grow 39\"", name:"AI Blade Grow 39\"", coverageInches:36, parHigh:220, parMid:140, parLow:70,  minG:20, maxG:90,  beginner:true,  priceUSD:359 },
  { id:"ai_blade_glow_39", brand:"AquaIllumination", model:"Blade Glow 39\"", name:"AI Blade Glow 39\"", coverageInches:36, parHigh:220, parMid:140, parLow:70,  minG:20, maxG:90,  beginner:true,  priceUSD:359 },

  // Kessil
  { id:"kessil_a80",    brand:"Kessil", model:"A80 Tuna Blue",    name:"Kessil A80",    coverageInches:14, parHigh:150, parMid:90,  parLow:50,  minG:5,  maxG:20, beginner:true,  priceUSD:139 },
  { id:"kessil_a160we", brand:"Kessil", model:"A160WE Tuna Blue", name:"Kessil A160WE", coverageInches:18, parHigh:200, parMid:120, parLow:60,  minG:10, maxG:32, beginner:true,  priceUSD:239 },
  { id:"kessil_a360x",  brand:"Kessil", model:"A360X Tuna Blue",  name:"Kessil A360X",  coverageInches:24, parHigh:280, parMid:170, parLow:85,  minG:20, maxG:90, beginner:true,  priceUSD:449 },
  { id:"kessil_ap9x",   brand:"Kessil", model:"AP9X",             name:"Kessil AP9X",   coverageInches:36, parHigh:350, parMid:220, parLow:110, minG:60, maxG:150, beginner:false, priceUSD:899 },
  { id:"kessil_a500x",  brand:"Kessil", model:"A500X",            name:"Kessil A500X",  coverageInches:36, parHigh:400, parMid:260, parLow:120, minG:80, maxG:200, beginner:false, priceUSD:699 },

  // Red Sea ReefLED
  { id:"redsea_reefled_50",   brand:"Red Sea", model:"ReefLED 50",   name:"Red Sea ReefLED 50",   coverageInches:18, parHigh:220, parMid:140, parLow:70,  minG:5,  maxG:24,  beginner:true,  priceUSD:199 },
  { id:"redsea_reefled_90",   brand:"Red Sea", model:"ReefLED 90",   name:"Red Sea ReefLED 90",   coverageInches:24, parHigh:280, parMid:170, parLow:90,  minG:20, maxG:75,  beginner:true,  priceUSD:369 },
  { id:"redsea_reefled_160s", brand:"Red Sea", model:"ReefLED 160S", name:"Red Sea ReefLED 160S", coverageInches:30, parHigh:330, parMid:200, parLow:100, minG:60, maxG:140, beginner:true,  priceUSD:599 },

  // EcoTech Radion
  { id:"ecotech_xr15_g6b", brand:"EcoTech", model:"Radion XR15 G6 Blue", name:"Radion XR15 G6 Blue", coverageInches:24, parHigh:300, parMid:180, parLow:90,  minG:20, maxG:75,  beginner:false, priceUSD:449 },
  { id:"ecotech_xr30_g6b", brand:"EcoTech", model:"Radion XR30 G6 Blue", name:"Radion XR30 G6 Blue", coverageInches:30, parHigh:360, parMid:220, parLow:110, minG:50, maxG:150, beginner:false, priceUSD:799 },

  // Maxspect / Orphek / ReefBrite / Others
  { id:"maxspect_rsx200", brand:"Maxspect", model:"RSX 200",             name:"Maxspect RSX 200",             coverageInches:30, parHigh:320, parMid:200, parLow:110, minG:40,  maxG:140, beginner:true,  priceUSD:499 },
  { id:"maxspect_mj_l165", brand:"Maxspect", model:"MJ-L165 Blue",        name:"Maxspect MJ-L165 Blue",        coverageInches:24, parHigh:260, parMid:160, parLow:80,  minG:20,  maxG:75,  beginner:true,  priceUSD:329 },
  { id:"orphek_or3_blue_plus", brand:"Orphek", model:"OR3 Blue Plus 48\"", name:"Orphek OR3 Blue Plus 48\"",    coverageInches:48, parHigh:250, parMid:150, parLow:80,  minG:60,  maxG:180, beginner:true,  priceUSD:199 },
  { id:"reefbrite_xho_50", brand:"ReefBrite", model:"XHO Blue 50\"",      name:"ReefBrite XHO Blue 50\"",      coverageInches:50, parHigh:240, parMid:160, parLow:90,  minG:60,  maxG:200, beginner:false, priceUSD:259 },
];

// ------------------------- SKIMMERS -------------------------
const SKIMMERS = [
  // Reef Octopus
  { id:"ro_classic_110int", brand:"Reef Octopus", model:"Classic 110INT", name:"RO Classic 110INT", lightRatingG:75, heavyRatingG:40,  airLph:420, waterDepth:[6,8],  footprint:[8.3,10],  minG:30, maxG:80,  beginner:true,  priceUSD:249 },
  { id:"ro_classic_150int", brand:"Reef Octopus", model:"Classic 150INT", name:"RO Classic 150INT", lightRatingG:150,heavyRatingG:90,  airLph:600, waterDepth:[7,9],  footprint:[10,12],   minG:60, maxG:150, beginner:true,  priceUSD:349 },
  { id:"ro_classic_200int", brand:"Reef Octopus", model:"Classic 200INT", name:"RO Classic 200INT", lightRatingG:250,heavyRatingG:150, airLph:900, waterDepth:[7,9],  footprint:[12.4,15], minG:120,maxG:250, beginner:false, priceUSD:469 },
  { id:"ro_essence_s130",   brand:"Reef Octopus", model:"Essence S-130",  name:"RO Essence S-130",  lightRatingG:160,heavyRatingG:90,  airLph:550, waterDepth:[7,8],  footprint:[9,7],     minG:60, maxG:160, beginner:true,  priceUSD:329 },
  { id:"ro_regal_150int",   brand:"Reef Octopus", model:"Regal 150-INT",  name:"RO Regal 150-INT",  lightRatingG:250,heavyRatingG:125, airLph:900, waterDepth:[7,9],  footprint:[11.4,8.3],minG:120,maxG:250, beginner:false, priceUSD:599 },

  // Red Sea (RSK)
  { id:"redsea_rsk300", brand:"Red Sea", model:"RSK 300", name:"Red Sea RSK 300", lightRatingG:90,  heavyRatingG:65,  airLph:500, waterDepth:[8,9],  footprint:[9,10],   minG:40,  maxG:100, beginner:true,  priceUSD:329 },
  { id:"redsea_rsk600", brand:"Red Sea", model:"RSK 600", name:"Red Sea RSK 600", lightRatingG:180, heavyRatingG:120, airLph:900, waterDepth:[8,9],  footprint:[10.5,11],minG:80,  maxG:200, beginner:true,  priceUSD:479 },
  { id:"redsea_rsk900", brand:"Red Sea", model:"RSK 900", name:"Red Sea RSK 900", lightRatingG:240, heavyRatingG:180, airLph:1200,waterDepth:[8,9],  footprint:[13,12], minG:150, maxG:300, beginner:false, priceUSD:629 },

  // Nyos
  { id:"nyos_120", brand:"Nyos", model:"Quantum 120", name:"Nyos Quantum 120", lightRatingG:125, heavyRatingG:65,  airLph:500, waterDepth:[7,9],   footprint:[7.1,9.4],  minG:40,  maxG:120, beginner:true,  priceUSD:339 },
  { id:"nyos_160", brand:"Nyos", model:"Quantum 160", name:"Nyos Quantum 160", lightRatingG:250, heavyRatingG:100, airLph:1000,waterDepth:[8,10],  footprint:[9.6,11],   minG:90,  maxG:250, beginner:false, priceUSD:469 },
  { id:"nyos_220", brand:"Nyos", model:"Quantum 220", name:"Nyos Quantum 220", lightRatingG:500, heavyRatingG:250, airLph:1500,waterDepth:[8,10],  footprint:[12.6,14.5],minG:180, maxG:500, beginner:false, priceUSD:699 },

  // Simplicity
  { id:"simplicity_120dc", brand:"Simplicity", model:"120DC", name:"Simplicity 120DC", lightRatingG:120, heavyRatingG:60,  airLph:450, waterDepth:[6,9], footprint:[7.9,7.1], minG:40,  maxG:120, beginner:true,  priceUSD:199 },
  { id:"simplicity_240dc", brand:"Simplicity", model:"240DC", name:"Simplicity 240DC", lightRatingG:240, heavyRatingG:120, airLph:900, waterDepth:[7,9], footprint:[10,8.3], minG:90,  maxG:240, beginner:true,  priceUSD:279 },

  // Bubble Magus
  { id:"bm_curve5", brand:"Bubble Magus", model:"Curve 5", name:"Bubble Magus Curve 5", lightRatingG:140, heavyRatingG:75,  airLph:450, waterDepth:[9,11], footprint:[7.3,7.1], minG:40,  maxG:140, beginner:true,  priceUSD:229 },
  { id:"bm_curve7", brand:"Bubble Magus", model:"Curve 7", name:"Bubble Magus Curve 7", lightRatingG:240, heavyRatingG:140, airLph:700, waterDepth:[9,11], footprint:[9,9],   minG:90,  maxG:240, beginner:true,  priceUSD:299 },
  { id:"bm_curve9", brand:"Bubble Magus", model:"Curve 9", name:"Bubble Magus Curve 9", lightRatingG:300, heavyRatingG:180, airLph:900, waterDepth:[9,11], footprint:[9,9],   minG:120, maxG:300, beginner:true,  priceUSD:359 },

  // AquaMaxx
  { id:"am_cones_q1", brand:"AquaMaxx", model:"ConeS Q-1", name:"AquaMaxx ConeS Q-1", lightRatingG:120, heavyRatingG:70, airLph:450, waterDepth:[7,10], footprint:[7.3,9.4],  minG:40, maxG:120, beginner:true, priceUSD:259 },
  { id:"am_cones_q2", brand:"AquaMaxx", model:"ConeS Q-2", name:"AquaMaxx ConeS Q-2", lightRatingG:210, heavyRatingG:120,airLph:700, waterDepth:[7,10], footprint:[9.4,11.8], minG:80, maxG:210, beginner:true, priceUSD:329 },

  // Deltec
  { id:"deltec_600ix", brand:"Deltec", model:"600ix", name:"Deltec 600ix", lightRatingG:160, heavyRatingG:100, airLph:600, waterDepth:[6,8], footprint:[8.7,7.9],  minG:70, maxG:160, beginner:false, priceUSD:499 },
  { id:"deltec_1000",  brand:"Deltec", model:"1000i", name:"Deltec 1000i", lightRatingG:265, heavyRatingG:160, airLph:1000,waterDepth:[6,8], footprint:[10.4,9.1], minG:120,maxG:265, beginner:false, priceUSD:699 },

  // Royal Exclusiv
  { id:"bubble_king_200", brand:"Royal Exclusiv", model:"Bubble King 200", name:"Bubble King 200", lightRatingG:400, heavyRatingG:250, airLph:1500, waterDepth:[8,10], footprint:[12,14], minG:200, maxG:400, beginner:false, priceUSD:1599 },
];

// ------------------------- RETURN PUMPS -------------------------
const RETURN_PUMPS = [
  // Sicce Syncra / Micra
  { id:"sicce_micra",  brand:"Sicce", model:"Micra Plus",  name:"Sicce Micra Plus",  maxGph:158,  minG:5,  maxG:25,  beginner:true,  priceUSD:29 },
  { id:"sicce_syncra_05", brand:"Sicce", model:"Syncra 0.5", name:"Sicce Syncra 0.5", maxGph:185,  minG:10, maxG:30,  beginner:true,  priceUSD:49 },
  { id:"sicce_syncra_10", brand:"Sicce", model:"Syncra 1.0", name:"Sicce Syncra 1.0", maxGph:251,  minG:15, maxG:40,  beginner:true,  priceUSD:69 },
  { id:"sicce_syncra_1_5",brand:"Sicce", model:"Syncra 1.5", name:"Sicce Syncra 1.5", maxGph:357,  minG:20, maxG:60,  beginner:true,  priceUSD:79 },
  { id:"sicce_syncra_20", brand:"Sicce", model:"Syncra 2.0", name:"Sicce Syncra 2.0", maxGph:568,  minG:30, maxG:90,  beginner:true,  priceUSD:99 },
  { id:"sicce_syncra_25", brand:"Sicce", model:"Syncra 2.5", name:"Sicce Syncra 2.5", maxGph:660,  minG:35, maxG:110, beginner:true,  priceUSD:109 },
  { id:"sicce_syncra_3",  brand:"Sicce", model:"Syncra 3.0", name:"Sicce Syncra 3.0", maxGph:714,  minG:50, maxG:120, beginner:true,  priceUSD:129 },
  { id:"sicce_syncra_40", brand:"Sicce", model:"Syncra 4.0", name:"Sicce Syncra 4.0", maxGph:951,  minG:80, maxG:180, beginner:true,  priceUSD:149 },
  { id:"sicce_syncra_50", brand:"Sicce", model:"Syncra 5.0", name:"Sicce Syncra 5.0", maxGph:1321, minG:120,maxG:240, beginner:true,  priceUSD:199 },

  // Jebao DCP (budget DC)
  { id:"jebao_dcp_2000", brand:"Jebao", model:"DCP 2000", name:"Jebao DCP 2000", maxGph:528,  minG:20,  maxG:60,  beginner:true,  priceUSD:69 },
  { id:"jebao_dcp_3000", brand:"Jebao", model:"DCP 3000", name:"Jebao DCP 3000", maxGph:792,  minG:40,  maxG:100, beginner:true,  priceUSD:79 },
  { id:"jebao_dcp_5000", brand:"Jebao", model:"DCP 5000", name:"Jebao DCP 5000", maxGph:1320, minG:80,  maxG:180, beginner:true,  priceUSD:99 },
  { id:"jebao_dcp_6500", brand:"Jebao", model:"DCP 6500", name:"Jebao DCP 6500", maxGph:1716, minG:120, maxG:240, beginner:true,  priceUSD:119 },
  { id:"jebao_dcp_10000",brand:"Jebao", model:"DCP 10000",name:"Jebao DCP 10000",maxGph:2642, minG:180, maxG:400, beginner:false, priceUSD:139 },

  // EcoTech Vectra
  { id:"ecotech_vectra_s2", brand:"EcoTech", model:"Vectra S2", name:"EcoTech Vectra S2", maxGph:1400, minG:70,  maxG:140, beginner:true,  priceUSD:379 },
  { id:"ecotech_vectra_m2", brand:"EcoTech", model:"Vectra M2", name:"EcoTech Vectra M2", maxGph:2000, minG:100, maxG:200, beginner:true,  priceUSD:479 },
  { id:"ecotech_vectra_l2", brand:"EcoTech", model:"Vectra L2", name:"EcoTech Vectra L2", maxGph:3100, minG:160, maxG:350, beginner:false, priceUSD:579 },

  // Red Sea ReefRun
  { id:"redsea_reefrun_5500", brand:"Red Sea", model:"ReefRun 5500", name:"Red Sea ReefRun 5500", maxGph:1450, minG:70,  maxG:140, beginner:true,  priceUSD:329 },
  { id:"redsea_reefrun_7000", brand:"Red Sea", model:"ReefRun 7000", name:"Red Sea ReefRun 7000", maxGph:1850, minG:100, maxG:180, beginner:false, priceUSD:399 },
  { id:"redsea_reefrun_9000", brand:"Red Sea", model:"ReefRun 9000", name:"Red Sea ReefRun 9000", maxGph:2375, minG:140, maxG:240, beginner:false, priceUSD:449 },

  // Neptune COR
  { id:"neptune_cor15", brand:"Neptune", model:"COR-15", name:"Neptune COR-15", maxGph:1500, minG:70,  maxG:150, beginner:true,  priceUSD:309 },
  { id:"neptune_cor20", brand:"Neptune", model:"COR-20", name:"Neptune COR-20", maxGph:2000, minG:100, maxG:200, beginner:true,  priceUSD:369 },

  // Reef Octopus VarioS
  { id:"ro_varios2", brand:"Reef Octopus", model:"VarioS-2", name:"Reef Octopus VarioS-2", maxGph:792,  minG:50,  maxG:120, beginner:true,  priceUSD:259 },
  { id:"ro_varios4", brand:"Reef Octopus", model:"VarioS-4", name:"Reef Octopus VarioS-4", maxGph:1190, minG:100, maxG:180, beginner:true,  priceUSD:309 },
  { id:"ro_varios6", brand:"Reef Octopus", model:"VarioS-6", name:"Reef Octopus VarioS-6", maxGph:1720, minG:140, maxG:260, beginner:false, priceUSD:359 },

  // Abyzz (premium)
  { id:"abyzz_a100", brand:"Abyzz", model:"A100", name:"Abyzz A100", maxGph:2642, minG:160, maxG:400, beginner:false, priceUSD:1999 },
  { id:"abyzz_a200", brand:"Abyzz", model:"A200", name:"Abyzz A200", maxGph:5280, minG:240, maxG:600, beginner:false, priceUSD:2799 },
];

// ------------------------- POWERHEADS -------------------------
const POWERHEADS = [
  // AI Nero
  { id:"ai_nero3", brand:"AquaIllumination", model:"Nero 3", name:"AI Nero 3", gph:2000, minG:10, maxG:40,  beginner:true,  priceUSD:149 },
  { id:"ai_nero5", brand:"AquaIllumination", model:"Nero 5", name:"AI Nero 5", gph:3000, minG:25, maxG:90,  beginner:true,  priceUSD:249 },
  { id:"ai_nero7", brand:"AquaIllumination", model:"Nero 7", name:"AI Nero 7", gph:4000, minG:60, maxG:140, beginner:false, priceUSD:349 },

  // EcoTech VorTech
  { id:"vortech_mp10qd", brand:"EcoTech", model:"VorTech MP10QD", name:"VorTech MP10QD", gph:1500, minG:10, maxG:40,  beginner:true,  priceUSD:299 },
  { id:"ecotech_mp40qd", brand:"EcoTech", model:"VorTech MP40QD", name:"VorTech MP40QD", gph:4500, minG:60, maxG:150, beginner:true,  priceUSD:399 },
  { id:"ecotech_mp60qd", brand:"EcoTech", model:"VorTech MP60QD", name:"VorTech MP60QD", gph:7500, minG:150,maxG:400, beginner:false, priceUSD:699 },

  // Red Sea ReefWave
  { id:"redsea_reefwave25", brand:"Red Sea", model:"ReefWave 25", name:"Red Sea ReefWave 25", gph:2000, minG:25, maxG:70,  beginner:true,  priceUSD:279 },
  { id:"redsea_reefwave45", brand:"Red Sea", model:"ReefWave 45", name:"Red Sea ReefWave 45", gph:3960, minG:60, maxG:150, beginner:true,  priceUSD:349 },

  // Maxspect Gyre
  { id:"maxspect_xf330", brand:"Maxspect", model:"Gyre XF330", name:"Maxspect Gyre XF330", gph:2350, minG:30, maxG:90,  beginner:true,  priceUSD:329 },
  { id:"maxspect_xf350", brand:"Maxspect", model:"Gyre XF350", name:"Maxspect Gyre XF350", gph:5300, minG:90, maxG:200, beginner:false, priceUSD:369 },

  // Tunze
  { id:"tunze_6040", brand:"Tunze", model:"Turbelle 6040", name:"Tunze Turbelle 6040", gph:1190, minG:10, maxG:35,  beginner:true,  priceUSD:119 },
  { id:"tunze_6055", brand:"Tunze", model:"Turbelle 6055", name:"Tunze Turbelle 6055", gph:1450, minG:15, maxG:45,  beginner:true,  priceUSD:189 },
  { id:"tunze_6095", brand:"Tunze", model:"Turbelle 6095", name:"Tunze Turbelle 6095", gph:2500, minG:40, maxG:100, beginner:true,  priceUSD:249 },
  { id:"tunze_stream3", brand:"Tunze", model:"Stream 3",   name:"Tunze Stream 3",   gph:4500, minG:80, maxG:180, beginner:false, priceUSD:399 },

  // IceCap (gyre-style)
  { id:"icecap_2k", brand:"IceCap", model:"Gyre 2K", name:"IceCap Gyre 2K", gph:2000, minG:25, maxG:70,  beginner:true,  priceUSD:129 },
  { id:"icecap_4k", brand:"IceCap", model:"Gyre 4K", name:"IceCap Gyre 4K", gph:4000, minG:60, maxG:140, beginner:true,  priceUSD:159 },

  // Jebao (budget)
  { id:"jebao_slw10", brand:"Jebao", model:"SLW-10", name:"Jebao SLW-10", gph:1050, minG:8,  maxG:25,  beginner:true,  priceUSD:39 },
  { id:"jebao_slw20", brand:"Jebao", model:"SLW-20", name:"Jebao SLW-20", gph:2100, minG:20, maxG:60,  beginner:true,  priceUSD:49 },
  { id:"jebao_slw30", brand:"Jebao", model:"SLW-30", name:"Jebao SLW-30", gph:3170, minG:40, maxG:100, beginner:true,  priceUSD:59 },
];

// ------------------------- HEATERS -------------------------
const HEATERS = [
  // Eheim Jager
  { id:"eheim_50",  brand:"Eheim", model:"Jager 50W",  name:"Eheim Jager 50W",  watts:50,  minG:5,  maxG:15,  beginner:true, priceUSD:26 },
  { id:"eheim_100", brand:"Eheim", model:"Jager 100W", name:"Eheim Jager 100W", watts:100, minG:10, maxG:35,  beginner:true, priceUSD:32 },
  { id:"eheim_150", brand:"Eheim", model:"Jager 150W", name:"Eheim Jager 150W", watts:150, minG:25, maxG:55,  beginner:true, priceUSD:36 },
  { id:"eheim_200", brand:"Eheim", model:"Jager 200W", name:"Eheim Jager 200W", watts:200, minG:40, maxG:75,  beginner:true, priceUSD:40 },
  { id:"eheim_250", brand:"Eheim", model:"Jager 250W", name:"Eheim Jager 250W", watts:250, minG:55, maxG:95,  beginner:true, priceUSD:45 },
  { id:"eheim_300", brand:"Eheim", model:"Jager 300W", name:"Eheim Jager 300W", watts:300, minG:70, maxG:120, beginner:true, priceUSD:49 },

  // Fluval E
  { id:"fluval_50",  brand:"Fluval", model:"E-Series 50W",  name:"Fluval E 50W",  watts:50,  minG:5,  maxG:15,  beginner:true, priceUSD:57 },
  { id:"fluval_100", brand:"Fluval", model:"E-Series 100W", name:"Fluval E 100W", watts:100, minG:10, maxG:35,  beginner:true, priceUSD:67 },
  { id:"fluval_200", brand:"Fluval", model:"E-Series 200W", name:"Fluval E 200W", watts:200, minG:40, maxG:75,  beginner:true, priceUSD:79 },
  { id:"fluval_300", brand:"Fluval", model:"E-Series 300W", name:"Fluval E 300W", watts:300, minG:70, maxG:120, beginner:false, priceUSD:99 },

  // Cobalt Neo-Therm
  { id:"cobalt_neotherm_50",  brand:"Cobalt", model:"Neo-Therm 50W",  name:"Cobalt Neo-Therm 50W",  watts:50,  minG:5,  maxG:15,  beginner:true, priceUSD:62 },
  { id:"cobalt_neotherm_100", brand:"Cobalt", model:"Neo-Therm 100W", name:"Cobalt Neo-Therm 100W", watts:100, minG:10, maxG:35,  beginner:true, priceUSD:72 },
  { id:"cobalt_neotherm_150", brand:"Cobalt", model:"Neo-Therm 150W", name:"Cobalt Neo-Therm 150W", watts:150, minG:25, maxG:55,  beginner:true, priceUSD:82 },
  { id:"cobalt_neotherm_200", brand:"Cobalt", model:"Neo-Therm 200W", name:"Cobalt Neo-Therm 200W", watts:200, minG:40, maxG:75,  beginner:true, priceUSD:92 },

  // BRS Titanium (use with controller)
  { id:"brs_titanium_100", brand:"BRS", model:"Titanium 100W", name:"BRS Titanium 100W", watts:100, minG:10, maxG:35,  beginner:false, priceUSD:59 },
  { id:"brs_titanium_200", brand:"BRS", model:"Titanium 200W", name:"BRS Titanium 200W", watts:200, minG:40, maxG:75,  beginner:false, priceUSD:64 },
  { id:"brs_titanium_300", brand:"BRS", model:"Titanium 300W", name:"BRS Titanium 300W", watts:300, minG:70, maxG:120, beginner:false, priceUSD:69 },
  { id:"brs_titanium_500", brand:"BRS", model:"Titanium 500W", name:"BRS Titanium 500W", watts:500, minG:120,maxG:220, beginner:false, priceUSD:99 },
];

// ------------------------- UV STERILIZERS (NEW) -------------------------
const UVS = [
  // AIO-friendly
  { id:"gkm_9w",  brand:"AA",      model:"GKM 9W",  name:"Green Killing Machine 9W",  minG:5,  maxG:30,  beginner:true,  priceUSD:59 },
  { id:"gkm_24w", brand:"AA",      model:"GKM 24W", name:"Green Killing Machine 24W", minG:20, maxG:80,  beginner:true,  priceUSD:99 },
  // Inline
  { id:"aquauv_15w", brand:"AquaUV", model:"Classic 15W", name:"AquaUV Classic 15W", minG:20, maxG:60,  beginner:false, priceUSD:259 },
  { id:"aquauv_25w", brand:"AquaUV", model:"Classic 25W", name:"AquaUV Classic 25W", minG:40, maxG:120, beginner:false, priceUSD:329 },
  { id:"aquauv_57w", brand:"AquaUV", model:"Classic 57W", name:"AquaUV Classic 57W", minG:80, maxG:240, beginner:false, priceUSD:499 },
  { id:"pentair_40w", brand:"Pentair", model:"Smart UV 40W", name:"Pentair Smart UV 40W", minG:80,  maxG:180, beginner:false, priceUSD:549 },
  { id:"pentair_80w", brand:"Pentair", model:"Smart UV 80W", name:"Pentair Smart UV 80W", minG:150, maxG:350, beginner:false, priceUSD:769 },
];

// ------------------------- ATO SYSTEMS (NEW) -------------------------
const ATOS = [
  { id:"tunze_3155",     brand:"Tunze",   model:"Osmolator 3155",   name:"Tunze Osmolator 3155",   minG:10, maxG:400, beginner:true,  priceUSD:229 },
  { id:"xpaqua_duetto",  brand:"XP Aqua", model:"Duetto",            name:"XP Aqua Duetto ATO",     minG:5,  maxG:120, beginner:true,  priceUSD:124 },
  { id:"autoaqua_micro", brand:"AutoAqua",model:"Smart ATO Micro",   name:"AutoAqua Smart ATO Micro",minG:5,  maxG:120, beginner:true,  priceUSD:139 },
  { id:"redsea_reefato", brand:"Red Sea", model:"ReefATO+",          name:"Red Sea ReefATO+",       minG:20, maxG:400, beginner:true,  priceUSD:249 },
];

// ------------------------- MEDIA REACTORS (NEW) -------------------------
const REACTORS = [
  { id:"brs_mini", brand:"BRS",        model:"Mini Reactor", name:"BRS Mini Reactor",       minG:10,  maxG:60,  beginner:false, priceUSD:59 },
  { id:"am_fr_s",  brand:"AquaMaxx",   model:"FR-S",         name:"AquaMaxx FR-S",          minG:20,  maxG:90,  beginner:false, priceUSD:89 },
  { id:"am_fr_m",  brand:"AquaMaxx",   model:"FR-M",         name:"AquaMaxx FR-M",          minG:60,  maxG:150, beginner:false, priceUSD:119 },
  { id:"tlf_150",  brand:"Two Little Fishies", model:"PhosBan 150", name:"TLF PhosBan 150", minG:20,  maxG:90,  beginner:false, priceUSD:54 },
  { id:"tlf_550",  brand:"Two Little Fishies", model:"PhosBan 550", name:"TLF PhosBan 550", minG:90,  maxG:220, beginner:false, priceUSD:79 },
];

// Expose
window.LIGHTS = LIGHTS;
window.SKIMMERS = SKIMMERS;
window.RETURN_PUMPS = RETURN_PUMPS;
window.POWERHEADS = POWERHEADS;
window.HEATERS = HEATERS;
window.UVS = UVS;
window.ATOS = ATOS;
window.REACTORS = REACTORS;
