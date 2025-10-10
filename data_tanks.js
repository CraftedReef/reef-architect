// data_tanks.js — expanded tank and sump presets + prices (USD)

const TANKS = [
  // --- Nano / Pico ---
  { id:"fluval_evo_13", brand:"Fluval", model:"EVO 13.5", name:"Fluval EVO 13.5 (AIO)", type:"aio", aio:true,
    dims:{L:22, W:11.5, H:13}, netGal:13.5, aioPack:{returnGph:132, stockLight:"fluval_evo_led"}, beginner:true, priceUSD:169 },
  { id:"im_nuvo_20", brand:"Innovative Marine", model:"Nuvo Fusion 20", name:"IM Nuvo 20 (AIO)", type:"aio", aio:true,
    dims:{L:24, W:15, H:13}, netGal:20, aioPack:{returnGph:211, stockLight:"ai_prime_16hd"}, beginner:true, priceUSD:299 },
  { id:"biocube_32", brand:"Coralife", model:"BioCube 32", name:"BioCube 32 (AIO)", type:"aio", aio:true,
    dims:{L:20.25, W:21.875, H:21.5}, netGal:32, aioPack:{returnGph:264, stockLight:"ai_prime_16hd"}, beginner:true, priceUSD:449 },
  { id:"im_nuvo_40", brand:"Innovative Marine", model:"Nuvo Fusion 40", name:"IM Nuvo 40 (AIO)", type:"aio", aio:true,
    dims:{L:24, W:20, H:19}, netGal:40, aioPack:{returnGph:476, stockLight:"ai_hydra_32hd"}, beginner:true, priceUSD:649 },

  // --- Midrange Reef-Ready ---
  { id:"wb_marinex_60_2", brand:"Waterbox", model:"Marine X 60.2", name:"Waterbox Marine X 60.2", type:"reef_ready", aio:false,
    dims:{L:24, W:24, H:20}, netGal:45, sump:{volumeGal:20, skimmerChamber:{depthIn:8, widthIn:10, lengthIn:12}}, beginner:true, priceUSD:1399 },
  { id:"wb_marinex_90_3", brand:"Waterbox", model:"Marine X 90.3", name:"Waterbox Marine X 90.3", type:"reef_ready", aio:false,
    dims:{L:36, W:24, H:22}, netGal:70, sump:{volumeGal:25, skimmerChamber:{depthIn:9, widthIn:11, lengthIn:14}}, beginner:true, priceUSD:1799 },
  { id:"standard_75", brand:"Standard", model:"75 Gallon", name:"Standard 75g (Reef-ready)", type:"reef_ready", aio:false,
    dims:{L:48, W:18, H:21}, netGal:75, sump:{volumeGal:30, skimmerChamber:{depthIn:8, widthIn:11, lengthIn:13}}, beginner:true, priceUSD:349 },
  { id:"standard_90", brand:"Standard", model:"90 Gallon", name:"Standard 90g (Reef-ready)", type:"reef_ready", aio:false,
    dims:{L:48, W:18, H:24}, netGal:90, sump:{volumeGal:36, skimmerChamber:{depthIn:8, widthIn:12, lengthIn:14}}, beginner:true, priceUSD:499 },
  { id:"redsea_reefer_250_g2", brand:"Red Sea", model:"Reefer 250 G2", name:"Red Sea Reefer 250 G2", type:"reef_ready", aio:false,
    dims:{L:35, W:21, H:20}, netGal:65, sump:{volumeGal:25, skimmerChamber:{depthIn:9, widthIn:10, lengthIn:12}}, beginner:true, priceUSD:2099 },
  { id:"redsea_reefer_350_g2", brand:"Red Sea", model:"Reefer 350 G2", name:"Red Sea Reefer 350 G2", type:"reef_ready", aio:false,
    dims:{L:47, W:22, H:21}, netGal:91, sump:{volumeGal:34, skimmerChamber:{depthIn:9, widthIn:12, lengthIn:14}}, beginner:true, priceUSD:2799 },

  // --- Large Systems ---
  { id:"redsea_reefer_425_g2", brand:"Red Sea", model:"Reefer 425 G2", name:"Red Sea Reefer 425 G2", type:"reef_ready", aio:false,
    dims:{L:47, W:26, H:22}, netGal:112, sump:{volumeGal:42, skimmerChamber:{depthIn:9, widthIn:13, lengthIn:16}}, beginner:false, priceUSD:3299 },
  { id:"redsea_reefer_525_g2", brand:"Red Sea", model:"Reefer 525 G2", name:"Red Sea Reefer 525 G2", type:"reef_ready", aio:false,
    dims:{L:59, W:24, H:24}, netGal:140, sump:{volumeGal:55, skimmerChamber:{depthIn:9, widthIn:14, lengthIn:18}}, beginner:false, priceUSD:3899 },
  { id:"wb_reef_135_4", brand:"Waterbox", model:"Marine Reef 135.4", name:"Waterbox Marine Reef 135.4", type:"reef_ready", aio:false,
    dims:{L:48, W:30, H:24}, netGal:135, sump:{volumeGal:45, skimmerChamber:{depthIn:9, widthIn:15, lengthIn:20}}, beginner:false, priceUSD:3399 },
  { id:"im_int_120", brand:"Innovative Marine", model:"INT 120", name:"IM INT 120 (Hybrid)", type:"aio", aio:true,
    dims:{L:48, W:24, H:24}, netGal:120, aioPack:{returnGph:2500, stockLight:null}, beginner:true, priceUSD:1999 },

  // --- New 200–400 g Additions ---
  { id:"wb_reef_180_5", brand:"Waterbox", model:"Reef 180.5", name:"Waterbox Reef 180.5", type:"reef_ready", aio:false,
    dims:{L:60, W:30, H:24}, netGal:180, sump:{volumeGal:60, skimmerChamber:{depthIn:10, widthIn:16, lengthIn:22}}, beginner:false, priceUSD:4999 },
  { id:"redsea_reefer_625_g2", brand:"Red Sea", model:"Reefer 625 G2", name:"Red Sea Reefer 625 G2", type:"reef_ready", aio:false,
    dims:{L:59, W:25, H:24}, netGal:165, sump:{volumeGal:60, skimmerChamber:{depthIn:10, widthIn:15, lengthIn:20}}, beginner:false, priceUSD:4499 },
  { id:"redsea_reefer_750_g2", brand:"Red Sea", model:"Reefer 750 G2", name:"Red Sea Reefer 750 G2", type:"reef_ready", aio:false,
    dims:{L:71, W:27, H:25}, netGal:200, sump:{volumeGal:75, skimmerChamber:{depthIn:10, widthIn:16, lengthIn:22}}, beginner:false, priceUSD:5999 },
  { id:"cda_250_custom", brand:"Crystal Dynamics", model:"Custom 250 Reef", name:"CDA Custom 250 Reef", type:"reef_ready", aio:false,
    dims:{L:72, W:30, H:27}, netGal:250, sump:{volumeGal:85, skimmerChamber:{depthIn:10, widthIn:18, lengthIn:24}}, beginner:false, priceUSD:6999 },
  { id:"planet_aquariums_300", brand:"Planet Aquariums", model:"Crystaline 300", name:"Planet Aquariums 300g Crystaline", type:"reef_ready", aio:false,
    dims:{L:96, W:30, H:30}, netGal:300, sump:{volumeGal:100, skimmerChamber:{depthIn:10, widthIn:20, lengthIn:28}}, beginner:false, priceUSD:7999 },
  { id:"reefer_900_g2", brand:"Red Sea", model:"Reefer 900 G2", name:"Red Sea Reefer 900 G2", type:"reef_ready", aio:false,
    dims:{L:84, W:30, H:27}, netGal:330, sump:{volumeGal:110, skimmerChamber:{depthIn:10, widthIn:22, lengthIn:30}}, beginner:false, priceUSD:9499 },
  { id:"wb_infinity_340_7", brand:"Waterbox", model:"Infinity 340.7", name:"Waterbox Infinity 340.7", type:"reef_ready", aio:false,
    dims:{L:96, W:30, H:28}, netGal:340, sump:{volumeGal:115, skimmerChamber:{depthIn:10, widthIn:22, lengthIn:30}}, beginner:false, priceUSD:10499 },

  // --- Existing 400g ---
  { id:"cda_400", brand:"Crystal Dynamics", model:"Custom 400 Reef", name:"CDA Custom 400 Reef", type:"reef_ready", aio:false,
    dims:{L:96, W:36, H:28}, netGal:400, sump:{volumeGal:120, skimmerChamber:{depthIn:10, widthIn:18, lengthIn:24}}, beginner:false, priceUSD:12999 }
];

const SUMPS = [
  { id:"trigger_sapphire_26", brand:"Trigger Systems", model:"Sapphire 26", name:"Trigger Sapphire 26", volumeGal:29, skimmerChamber:{widthIn:10.5, lengthIn:12}, baffleDepthIn:9, beginner:true, priceUSD:329 },
  { id:"fiji_20", brand:"Fiji Cube", model:"20 Advanced", name:"Fiji Cube 20 Advanced", volumeGal:20, skimmerChamber:{widthIn:9.5, lengthIn:11}, baffleDepthIn:9, beginner:true, priceUSD:219 },
  { id:"trigger_sapphire_39", brand:"Trigger Systems", model:"Sapphire 39", name:"Trigger Sapphire 39", volumeGal:39, skimmerChamber:{widthIn:11, lengthIn:13}, baffleDepthIn:9, beginner:true, priceUSD:409 },
  { id:"bashsea_ss50", brand:"Bashsea", model:"Smart Series 50", name:"Bashsea SS-50", volumeGal:50, skimmerChamber:{widthIn:13, lengthIn:16}, baffleDepthIn:10, beginner:false, priceUSD:559 },
  { id:"redsea_g2_sump", brand:"Red Sea", model:"Reefer G2 Sump", name:"Red Sea Reefer G2 Sump", volumeGal:65, skimmerChamber:{widthIn:15, lengthIn:20}, baffleDepthIn:9, beginner:false, priceUSD:699 }
];

window.TANKS = TANKS;
window.SUMPS = SUMPS;
