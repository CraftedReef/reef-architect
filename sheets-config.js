// ===================== GOOGLE SHEETS CONFIG (final with real IDs) =====================

// Keep cache short while debugging (2 minutes)
window.SHEETS_CACHE_MS = 2 * 60 * 1000;

/*
  Your spreadsheets and tabs:

  Coral     (spreadsheet) -> "Coral" tab
  Species   (spreadsheet) -> "Fish"  tab
  Equipment (spreadsheet) -> "Lights","Skimmers","ReturnPumps","Powerheads","Heaters","UV","ATO","Reactors"
  Tanks     (spreadsheet) -> "Tanks","Sumps"
*/

// Map logical keys → exact tab names
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
  corals:       "Coral",  // spreadsheet "Coral"
  fish:         "Fish",   // spreadsheet "Species"

  // Safety alias if old code looks for “invertebrates”
  invertebrates:"Fish"
};

// Assign each tab to the correct Google Sheet ID
window.SHEETS_SOURCES = {
  // ------------- Equipment (all these tabs live in the Equipment sheet) -------------
  "Lights":       "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "Skimmers":     "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "ReturnPumps":  "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "Powerheads":   "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "Heaters":      "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "UV":           "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "ATO":          "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "Reactors":     "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",

  // ------------- Tanks (both tabs live in the Tanks sheet) -------------
  "Tanks":        "14J8feKqP56iLo8FuYkPmx2AOaPNCRHE__4iJ22Dvf84",
  "Sumps":        "14J8feKqP56iLo8FuYkPmx2AOaPNCRHE__4iJ22Dvf84",

  // ------------- Species (Fish tab lives in the Species sheet) -------------
  "Fish":         "1gUX2L_52lN15q1uQo9_1AfHBATd3xAEuLutAnLK_1dI",

  // ------------- Coral (Coral tab lives in the Coral sheet) -------------
  "Coral":        "1FjHIah3paTJe9WokNTN1_94QxtdcmwXZBxIBmCd15ec"
};
