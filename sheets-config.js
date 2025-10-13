// ===================== GOOGLE SHEETS CONFIG (clean) =====================

// Keep cache short while debugging (2 minutes)
window.SHEETS_CACHE_MS = 2 * 60 * 1000;

/*
  A) Logical key (lowercase)  →  Tab Name (as it appears in Google Sheets)
*/
window.SHEETS_TABS = {
  // Equipment
  lights:       "Lights",
  skimmers:     "Skimmers",
  returnPumps:  "ReturnPumps",
  powerheads:   "Powerheads",
  heaters:      "Heaters",
  uv:           "UV",
  ato:          "ATO",
  reactors:     "Reactors",

  // Tanks
  tanks:        "Tanks",
  sumps:        "Sumps",

  // Livestock
  fish:         "Fish",
  corals:       "Coral"   // <— Coral is its own tab in its own spreadsheet
};

/*
  B) Tab Name (Title Case)  →  Spreadsheet ID (from the sheet’s URL)
     Coral is mapped to its OWN spreadsheet here.
*/
window.SHEETS_SOURCES = {
  // Equipment (all these tabs live in the Equipment spreadsheet)
  "Lights":       "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "Skimmers":     "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "ReturnPumps":  "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "Powerheads":   "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "Heaters":      "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "UV":           "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "ATO":          "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "Reactors":     "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",

  // Tanks (both tabs live in the Tanks spreadsheet)
  "Tanks":        "14J8feKqP56iLo8FuYkPmx2AOaPNCRHE_4iJ22Dvf84",
  "Sumps":        "14J8feKqP56iLo8FuYkPmx2AOaPNCRHE_4iJ22Dvf84",

  // Species (Fish tab lives in the Species spreadsheet)
  "Fish":         "1gUX2L_52lN15q1uQo9_1AfHBATd3xAEuLutAnLK_1dI",

  // Coral (Coral tab lives in the Coral spreadsheet)
  "Coral":        "1FjHIah3paTJe9WokNTN1_94QxtdcmwXZBxIBmCd15ec"
};
