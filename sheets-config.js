<script>
// ===================== GOOGLE SHEETS CONFIG (working) =====================

// Keep cache short while debugging (2 minutes)
window.SHEETS_CACHE_MS = 2 * 60 * 1000;

/*
  Put the exact tab names from each spreadsheet on the left,
  and the spreadsheet ID (from its URL) on the right.
  (You already have these four IDs from your setup.)
*/
window.SHEETS_SOURCES = {
  // ----- Equipment (many tabs live in ONE sheet) -----
  "Lights":       "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "Skimmers":     "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "ReturnPumps":  "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "Powerheads":   "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "Heaters":      "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "UV":           "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "ATO":          "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",
  "Reactors":     "1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q",

  // ----- Tanks (both tabs live in ONE sheet) -----
  "Tanks":        "14J8feKqP56iLo8FuYkPmx2AOaPNCRHE__4iJ22Dvf84",
  "Sumps":        "14J8feKqP56iLo8FuYkPmx2AOaPNCRHE__4iJ22Dvf84",

  // ----- Species (Fish tab lives in ONE sheet) -----
  "Fish":         "1gUX2L_52lN15q1uQo9_1AfHBATd3xAEuLutAnLK_1dI",

  // ----- Coral (Coral tab lives in ONE sheet) -----
  "Coral":        "1FjHIah3paTJe9WokNTN1_94QxtdcmwXZBxIBmCd15ec"
};

/*
  Map the lowercase keys your app asks for → the EXACT tab names in Google Sheets.
  (Don’t change the left side; edit the right side only if your tab names differ.)
*/
window.SHEETS_TABS = {
  lights:       "Lights",
  skimmers:     "Skimmers",
  returnPumps:  "ReturnPumps",
  powerheads:   "Powerheads",
  heaters:      "Heaters",
  uv:           "UV",
  ato:          "ATO",
  reactors:     "Reactors",

  tanks:        "Tanks",
  sumps:        "Sumps",

  fish:         "Fish",
  corals:       "Coral"
};
</script>
