// data_species.js – expanded for reef aquariums
// temperament: peaceful | semi-aggressive | aggressive
// coralType: soft | lps | sps

const FISH = [
  // --- Clownfish ---
  { id:"ocellaris_clown", name:"Ocellaris Clownfish", scientific:"Amphiprion ocellaris", minGallons:20, bu:10, temperament:"semi-aggressive", group:"Clownfish", beginner:true },
  { id:"percula_clown", name:"Percula Clownfish", scientific:"Amphiprion percula", minGallons:20, bu:10, temperament:"semi-aggressive", group:"Clownfish", beginner:true },
  { id:"black_ice_clown", name:"Black Ice Clownfish", scientific:"Amphiprion ocellaris var.", minGallons:20, bu:10, temperament:"semi-aggressive", group:"Clownfish", beginner:true },

  // --- Gobies & Blennies ---
  { id:"yellow_watchman", name:"Yellow Watchman Goby", scientific:"Cryptocentrus cinctus", minGallons:20, bu:7, temperament:"peaceful", group:"Gobies", beginner:true },
  { id:"neon_goby", name:"Neon Goby", scientific:"Elacatinus oceanops", minGallons:10, bu:3, temperament:"peaceful", group:"Gobies", beginner:true },
  { id:"diamond_goby", name:"Diamond Watchman Goby", scientific:"Valenciennea puellaris", minGallons:40, bu:15, temperament:"peaceful", group:"Gobies", beginner:true },
  { id:"tailspot_blenny", name:"Tailspot Blenny", scientific:"Ecsenius stigmatura", minGallons:20, bu:8, temperament:"peaceful", group:"Blennies", beginner:true },
  { id:"lawnmower_blenny", name:"Lawnmower Blenny", scientific:"Salarias fasciatus", minGallons:30, bu:12, temperament:"peaceful", group:"Blennies", beginner:true },
  { id:"midas_blenny", name:"Midas Blenny", scientific:"Ecsenius midas", minGallons:30, bu:12, temperament:"semi-aggressive", group:"Blennies", beginner:true },

  // --- Basslets / Dottybacks ---
  { id:"royal_gramma", name:"Royal Gramma", scientific:"Gramma loreto", minGallons:30, bu:12, temperament:"peaceful", group:"Basslets", beginner:true },
  { id:"swissguard_basslet", name:"Swissguard Basslet", scientific:"Liopropoma rubre", minGallons:30, bu:12, temperament:"peaceful", group:"Basslets", beginner:true },
  { id:"orchid_dottyback", name:"Orchid Dottyback", scientific:"Pseudochromis fridmani", minGallons:30, bu:12, temperament:"semi-aggressive", group:"Dottybacks", beginner:true },
  { id:"neon_dottyback", name:"Neon Dottyback", scientific:"Pseudochromis aldabraensis", minGallons:30, bu:12, temperament:"aggressive", group:"Dottybacks", beginner:false },

  // --- Cardinals / Chromis ---
  { id:"banggai_cardinal", name:"Banggai Cardinalfish", scientific:"Pterapogon kauderni", minGallons:30, bu:10, temperament:"peaceful", group:"Cardinals", beginner:true },
  { id:"pj_cardinal", name:"PJ Cardinalfish", scientific:"Sphaeramia nematoptera", minGallons:30, bu:10, temperament:"peaceful", group:"Cardinals", beginner:true },
  { id:"chromis", name:"Blue-Green Chromis", scientific:"Chromis viridis", minGallons:30, bu:8, temperament:"peaceful", group:"Chromis", beginner:true },

  // --- Wrasses (Reef Safe) ---
  { id:"sixline_wrasse", name:"Six-Line Wrasse", scientific:"Pseudocheilinus hexataenia", minGallons:40, bu:12, temperament:"aggressive", group:"Wrasse - Reef Safe", beginner:false },
  { id:"melanurus_wrasse", name:"Melanurus Wrasse", scientific:"Halichoeres melanurus", minGallons:55, bu:15, temperament:"semi-aggressive", group:"Wrasse - Reef Safe", beginner:true },
  { id:"yellow_wrasse", name:"Yellow Wrasse", scientific:"Halichoeres chrysus", minGallons:50, bu:15, temperament:"peaceful", group:"Wrasse - Reef Safe", beginner:true },
  { id:"fairy_wrasse", name:"Exquisite Fairy Wrasse", scientific:"Cirrhilabrus exquisitus", minGallons:70, bu:20, temperament:"peaceful", group:"Wrasse - Reef Safe", beginner:true },

  // --- Tangs / Surgeonfish ---
  { id:"yellow_tang", name:"Yellow Tang", scientific:"Zebrasoma flavescens", minGallons:75, bu:35, temperament:"semi-aggressive", group:"Tangs/Surgeons", beginner:false },
  { id:"kole_tang", name:"Kole Tang", scientific:"Ctenochaetus strigosus", minGallons:70, bu:30, temperament:"semi-aggressive", group:"Tangs/Surgeons", beginner:true },
  { id:"purple_tang", name:"Purple Tang", scientific:"Zebrasoma xanthurum", minGallons:120, bu:45, temperament:"semi-aggressive", group:"Tangs/Surgeons", beginner:false },
  { id:"powder_blue_tang", name:"Powder Blue Tang", scientific:"Acanthurus leucosternon", minGallons:125, bu:50, temperament:"semi-aggressive", group:"Tangs/Surgeons", beginner:false },

  // --- Damsels ---
  { id:"yellowtail_damsel", name:"Yellowtail Damsel", scientific:"Chrysiptera parasema", minGallons:20, bu:6, temperament:"aggressive", group:"Damsels", beginner:true },
  { id:"azure_damsel", name:"Azure Damsel", scientific:"Chrysiptera hemicyanea", minGallons:20, bu:6, temperament:"semi-aggressive", group:"Damsels", beginner:true },

  // --- Others ---
  { id:"firefish", name:"Firefish Goby", scientific:"Nemateleotris magnifica", minGallons:20, bu:6, temperament:"peaceful", group:"Dartfish", beginner:true },
  { id:"purple_firefish", name:"Purple Firefish", scientific:"Nemateleotris decora", minGallons:20, bu:6, temperament:"peaceful", group:"Dartfish", beginner:true },
  { id:"mandarin_dragonet", name:"Mandarin Dragonet", scientific:"Synchiropus splendidus", minGallons:30, bu:10, temperament:"peaceful", group:"Dragonets", beginner:false },
  { id:"royal_dottyback", name:"Royal Dottyback", scientific:"Pictichromis paccagnellae", minGallons:30, bu:10, temperament:"semi-aggressive", group:"Dottybacks", beginner:true },
  { id:"foxface", name:"Foxface Rabbitfish", scientific:"Siganus vulpinus", minGallons:75, bu:30, temperament:"peaceful", group:"Rabbitfish", beginner:true },
  { id:"flame_angel", name:"Flame Angelfish", scientific:"Centropyge loriculus", minGallons:70, bu:30, temperament:"semi-aggressive", group:"Angelfish", beginner:false },
  { id:"coral_beauty", name:"Coral Beauty Angelfish", scientific:"Centropyge bispinosa", minGallons:55, bu:25, temperament:"semi-aggressive", group:"Angelfish", beginner:true },

  // --- Invertebrates ---
  { id:"cleaner_shrimp", name:"Cleaner Shrimp", scientific:"Lysmata amboinensis", minGallons:10, bu:2, temperament:"peaceful", group:"Invertebrates", beginner:true },
  { id:"peppermint_shrimp", name:"Peppermint Shrimp", scientific:"Lysmata wurdemanni", minGallons:10, bu:2, temperament:"peaceful", group:"Invertebrates", beginner:true },
  { id:"fire_shrimp", name:"Fire Shrimp", scientific:"Lysmata debelius", minGallons:20, bu:3, temperament:"peaceful", group:"Invertebrates", beginner:true },
  { id:"emerald_crab", name:"Emerald Crab", scientific:"Mithraculus sculptus", minGallons:10, bu:3, temperament:"semi-aggressive", group:"Invertebrates", beginner:true },
  { id:"hermit_crab", name:"Blue Leg Hermit Crab", scientific:"Clibanarius tricolor", minGallons:5, bu:1, temperament:"peaceful", group:"Invertebrates", beginner:true },
  { id:"trochus_snail", name:"Trochus Snail", scientific:"Trochus spp.", minGallons:5, bu:1, temperament:"peaceful", group:"Invertebrates", beginner:true },
  { id:"turbo_snail", name:"Turbo Snail", scientific:"Turbo fluctuosa", minGallons:5, bu:1, temperament:"peaceful", group:"Invertebrates", beginner:true },
  { id:"nassarius_snail", name:"Nassarius Snail", scientific:"Nassarius vibex", minGallons:5, bu:1, temperament:"peaceful", group:"Invertebrates", beginner:true }
];

const CORALS = [
  // --- Soft Corals ---
  { id:"zoanthids", name:"Zoanthids", scientific:"Zoanthus spp.", par:[60,120], aggression:"peaceful", sweepers:false, placement:"low-mid", beginner:true, coralType:"soft" },
  { id:"palythoa", name:"Palythoa (Button Polyps)", scientific:"Palythoa spp.", par:[60,120], aggression:"peaceful", sweepers:false, placement:"low-mid", beginner:true, coralType:"soft" },
  { id:"green_star_polyps", name:"Green Star Polyps", scientific:"Pachyclavularia violacea", par:[60,120], aggression:"peaceful", sweepers:false, placement:"low", beginner:true, coralType:"soft" },
  { id:"mushroom_coral", name:"Mushroom Coral", scientific:"Discosoma/Rhodactis spp.", par:[50,100], aggression:"peaceful", sweepers:false, placement:"low", beginner:true, coralType:"soft" },
  { id:"toadstool_leather", name:"Toadstool Leather", scientific:"Sarcophyton spp.", par:[60,130], aggression:"peaceful", sweepers:false, placement:"mid", beginner:true, coralType:"soft" },
  { id:"kenya_tree", name:"Kenya Tree Coral", scientific:"Capnella spp.", par:[60,130], aggression:"peaceful", sweepers:false, placement:"low-mid", beginner:true, coralType:"soft" },

  // --- LPS Corals ---
  { id:"hammer_coral", name:"Hammer Coral", scientific:"Fimbriaphyllia ancora", par:[100,200], aggression:"aggressive", sweepers:true, placement:"mid", radiusInches:6, beginner:true, coralType:"lps" },
  { id:"frogspawn", name:"Frogspawn Coral", scientific:"Fimbriaphyllia divisa", par:[100,200], aggression:"aggressive", sweepers:true, placement:"mid", radiusInches:6, beginner:true, coralType:"lps" },
  { id:"torch_coral", name:"Torch Coral", scientific:"Fimbriaphyllia glabrescens", par:[120,220], aggression:"aggressive", sweepers:true, placement:"mid-high", radiusInches:8, beginner:false, coralType:"lps" },
  { id:"duncan", name:"Duncan Coral", scientific:"Duncanopsammia axifuga", par:[80,160], aggression:"peaceful", sweepers:false, placement:"low-mid", beginner:true, coralType:"lps" },
  { id:"candy_cane", name:"Candy Cane Coral", scientific:"Caulastrea furcata", par:[90,160], aggression:"semi-aggressive", sweepers:false, placement:"mid", beginner:true, coralType:"lps" },
  { id:"trachyphyllia", name:"Trachyphyllia (Open Brain)", scientific:"Trachyphyllia geoffroyi", par:[100,150], aggression:"semi-aggressive", sweepers:false, placement:"sandbed", beginner:true, coralType:"lps" },
  { id:"blastomussa", name:"Blastomussa Coral", scientific:"Blastomussa wellsi", par:[80,140], aggression:"semi-aggressive", sweepers:false, placement:"low-mid", beginner:true, coralType:"lps" },
  { id:"acan", name:"Acan Coral", scientific:"Micromussa lordhowensis", par:[100,180], aggression:"semi-aggressive", sweepers:true, placement:"mid", beginner:true, coralType:"lps" },
  { id:"favites", name:"Favites (Brain Coral)", scientific:"Favites spp.", par:[100,200], aggression:"semi-aggressive", sweepers:true, placement:"mid", beginner:true, coralType:"lps" },

  // --- SPS Corals ---
  { id:"acropora", name:"Acropora", scientific:"Acropora spp.", par:[250,350], aggression:"peaceful", sweepers:false, placement:"high", beginner:false, coralType:"sps" },
  { id:"montipora", name:"Montipora (Plating)", scientific:"Montipora capricornis", par:[180,300], aggression:"peaceful", sweepers:false, placement:"mid-high", beginner:false, coralType:"sps" },
  { id:"montipora_digi", name:"Montipora Digitata", scientific:"Montipora digitata", par:[180,300], aggression:"peaceful", sweepers:false, placement:"mid-high", beginner:false, coralType:"sps" },
  { id:"stylophora", name:"Stylophora", scientific:"Stylophora pistillata", par:[200,320], aggression:"peaceful", sweepers:false, placement:"mid-high", beginner:false, coralType:"sps" },
  { id:"pocillopora", name:"Pocillopora", scientific:"Pocillopora damicornis", par:[180,300], aggression:"peaceful", sweepers:false, placement:"mid-high", beginner:false, coralType:"sps" },
  { id:"birdsnest", name:"Birdsnest Coral", scientific:"Seriatopora hystrix", par:[200,300], aggression:"peaceful", sweepers:false, placement:"high", beginner:false, coralType:"sps" }
];
