# 🪸 Reef Architect — v11.4

**Beginner-friendly reef tank planner** with live data from Google Sheets, volume-aware equipment filtering, Quick Start presets, and visual fit checks for lighting, flow, and stocking.

---

## 🌊 What’s new in v11.4
- **Google Sheets live data**
  - All tank, equipment, and species data now loads directly from public Google Sheets CSVs.
  - Automatically updates when spreadsheet data changes — no more manual `.js` updates.

- **Cube/Nano lighting override**
  - Smart logic ensures 1-light defaults for 20–32g cube-style tanks (e.g., AI Prime 16HD).
  - Eliminates over-lighting issues in “Just Do It For Me” presets.

- **Quick Start fixes**
  - All presets (Nano 20g, BioCube 32, Mixed 40, FOWLR 75, LPS 90) now load correct lighting, return, and skimmer combos with price-aware selections.

- **Stage-1 layout & usability**
  - More compact card spacing, clearer metric notes, and re-labeled theme toggle (“🌙 Dark / 🌞 Light”).
  - Sump, Skimmer, and Heater values reset properly on “Restart”.

- **Beginner vs Experienced modes**
  - Beginner hides UV and Reactors + filters out advanced livestock.
  - Experienced reveals all advanced gear and SPS species.

- **Improved Fit & Sizing checks**
  - Real-time indicators for flow (× turnover), PAR, and heater wattage.
  - Tooltips added for clarity on each guideline.

- **Feedback form (EmailJS + PDF)**
  - Submissions now create a local PDF and email responses via EmailJS.
  - Optional follow-up and quote permissions included.

- **Crash Course polish**
  - Structured into eight readable tabs with summaries and definitions.
  - Glossary modal available across pages.

---

## 🧩 Headline features
- **Volume-aware equipment lists** — auto-filters lights, pumps, skimmers, and heaters by tank size.
- **Beginner / Experienced toggle** — instantly simplifies or expands equipment & livestock lists.
- **Quick Start builds** — preload tested setups in one click.
- **Capacity & PAR meters** — real-time stocking and lighting health indicators.
- **Budget calculator** — auto-summed prices from live data with currency formatting.
- **Glossary modal** — on-page reef terms with accessibility-ready structure.
- **Feedback page** — client-side EmailJS integration with jsPDF export.
- **Theme sync** — consistent dark/light toggle across all pages.

---

## 🧱 Project structure
| File | Description |
|------|--------------|
| `index.html` | App shell, tabs, Welcome/Quick Start, tooltips, summary, glossary modal. |
| `styles.css` | Theme variables, layout grid, cards, buttons, print styles. |
| `app.js` | Core logic: Google Sheets import, UI rendering, state, capacity & budget. |
| `matrix_starter.js` | Coral compatibility matrix + logic. |
| `data_tanks.js` | (Legacy backup) static tank presets, replaced by Sheets. |
| `data_equipment.js` | (Legacy backup) static equipment data, replaced by Sheets. |
| `data_species.js` | (Legacy backup) static species data, replaced by Sheets. |
| `crash-course.html` | Eight-phase beginner guide. |
| `about.html` | Overview of Reef Architect and glossary modal. |
| `feedback.html` | EmailJS + jsPDF feedback form. |
| `login.html` | Password gate with logo glow effect. |
| `_headers` / `robots.txt` | GitHub / Netlify deployment rules. |

---

## 🧪 Run locally
Open `index.html` directly in your browser, or for full EmailJS & PDF functionality:
```bash
# macOS
python3 -m http.server 5173

# Windows
py -m http.server 5173

📦 Deployment notes

Publish Google Sheets tabs as “Anyone with the link → CSV output”.

Push updates to GitHub, then force refresh (Ctrl + Shift + R) after deploy to clear cached CSV data.

robots.txt and _headers restrict search indexing while in development.

© 2025 Reef Architect — Built for reefers by reefers.
