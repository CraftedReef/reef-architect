# 🪸 Reef Architect — v11.1

Beginner-friendly reef tank planner with volume-aware equipment filtering, sensible presets, capacity/compatibility guidance, and print-ready summaries.

---

## What’s new in v11.1
- **Budget calculator sync fix**  
  Resolved a UI/state desync where repopulated selects could show one item while the budget used a stale one (e.g., Kessil showing $239 but subtotal using $599).
- **Coral matrix polish**  
  Normalizes more LPS labels (Euphyllia, galaxea, hydnophora) for clearer “OK / Caution / Incompatible” notes.

## Headline features (v11)
- **Volume-aware equipment lists** — Lighting, return, powerheads, skimmer, heater, UV, ATO, reactor all auto-filter to your tank gallons.
- **Beginner vs Experienced modes** — Beginner hides advanced gear (UV/reactors) and risky species; Experienced shows the full catalog.
- **Welcome tab + Quick Start** — One-click presets to preload realistic builds; “Start →” advances to Stage 1.
- **Stage 1 layout** — Tank & Sump side-by-side with Flow/Filtration/Heat below for better space on smaller screens.
- **Stage 2** — Fish/Inverts grouped by family and sorted A→Z. **Capacity** meter (replaces “Bioload”) to discourage crowding small tanks.
- **Stage 3** — Corals grouped (Soft / LPS / SPS) and sorted A→Z. PAR ranges table included.
- **Summary** — Color-coded compatibility comments + suggestions, plus a running budget summary.
- **Crash Course** — Linked from header and Welcome; quick phase-based guide to planning & cycling.
- **Glossary** — Modal with open/close buttons wired; beginner terms at a glance.
- **Print exports** — Portrait/Landscape PDF-friendly layout with single click.

---

## Project structure
- `index.html` — App shell, tabs, Welcome/Quick Start, tooltips, glossary modal, export buttons.
- `styles.css` — Theme, layout, buttons, cards, grids, modal, print tweaks.
- `app.js` — State, rendering, filtering, budget, capacity meter, suggestions, exports.
- `matrix_starter.js` — Coral family logic + species compatibility helper.
- `data_equipment.js` — Gear catalog with gallon ranges, prices, beginner flags.
- `data_species.js` — Fish, inverts, corals with groups, min gallons, tags.
- `data_tanks.js` — Presets and model dimensions.
- `crash-course.html` — Eight-phase quick guide.

---

## Run locally
Just open `index.html` in a browser.

Or serve for cleaner PDF printing:
```bash
# macOS
python3 -m http.server 5173

# Windows
py -m http.server 5173
