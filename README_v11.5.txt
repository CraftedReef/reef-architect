# 🪸 Reef Architect — v11.5

**Beginner-friendly reef tank planner** with live Google Sheets data, volume-aware equipment logic, visual tank builder, and full compatibility visualization.

---

## 🌊 What’s new in v11.5

### 🧩 Google Sheets Integration Finalized
- All tank, sump, equipment, and species tabs now fully load from **live Google Sheets CSVs**.  
- Fixed header normalization to prevent mismatched columns or blank data.  
- Improved auto-merging of tank/sump tabs with explicit handling for `type`, `aio`, and `netGal` detection.

### 💡 Lighting & Flow Logic
- Corrected **“Just Do It For Me” presets** to properly sum light and powerhead counts for all tank types.  
- Updated **LPS 90g Reef** preset: now includes two powerheads for adequate flow.  
- Improved **AI Prime / Hydra count calculation** to match tank length and coral category.  
- Refined turnover and flow warnings — now dynamically show *“Return Low,” “Flow Low,” “Heater Low”* only when relevant.

### 🔧 Stage 1 & Equipment Enhancements
- Added tiered equipment data from live Sheet (Lights, Skimmers, Pumps, Heaters, UV, ATO, Reactors).  
- Smarter beginner/experienced filtering for gear and livestock.  
- Auto-clearing fields in **ResetAll()** revalidated for each dropdown and count field.  
- Budget now recalculates instantly after resets or preset loads.

### 🧠 Visualizer (3D Tank Blueprint)
- Fixed **upside-down light cone orientation**.  
- Adjusted **front-view camera** to proper Z distance (slightly zoomed out for full tank visibility).  
- Top view and ¾ perspective now render correctly using unified tank coordinate centering.  
- Removed extraneous **AxesHelper marker**; kept clean GridHelper only.  
- Added better spacing logic for multi-light layouts above tank rim.

### 🖥️ Interface & UI Polish
- Minor spacing and alignment improvements to Stage 1 cards and controls.  
- Consistent logo glow (blue ambient effect) across all pages.  
- Updated **login screen** with animated hover glow and smoother transition.  
- Persistent dark theme overlay image with adjustable opacity for readability.  
- Added **Visualizer tab (Stage 5)** to navigation bar.

### 🧾 Crash Course & Documentation
- Crash Course retained as-is per v11.4 directive.  
- Internal `_headers` and `robots.txt` retained for Netlify deployment.

---

## 🧩 Core Features
- **Volume-aware filtering** for all lights, pumps, skimmers, and heaters.  
- **Beginner/Experienced toggle** controls complexity and stock visibility.  
- **Quick Start builds** (Nano 20g, BioCube 32g, Mixed 40g, FOWLR 75g, LPS 90g).  
- **Fit & sizing checks** for PAR, flow, and turnover.  
- **Live budget total** auto-updates with each change.  
- **Glossary modal** accessible from every page.  
- **Visualizer (3D)** provides a tank mockup with lighting and flow cones.  
- **Crash Course** covers eight foundational reef phases.  
- **Feedback form** (EmailJS + jsPDF) generates PDF and emails response.  
- **Password gate (login.html)** with animated glowing logo.

---

## 🧱 Project Structure
| File | Description |
|------|--------------|
| `index.html` | Main app shell, tab structure, Quick Start, summary, and new Visualizer tab. |
| `styles.css` | Updated blue glow highlight and layout polish across cards, tabs, and brand image. |
| `app.js` | Main logic: live Google Sheets import, Stage handlers, budget, fit checks, resets, and data binding. |
| `visualizer.js` | 3D scene render: corrected light cone orientation, grid-only markers, new camera alignment. |
| `matrix_starter.js` | Compatibility logic for coral families and species pairs. |
| `data_tanks.js` | Static backup for tank presets (now superseded by live data). |
| `data_equipment.js` | Static backup for equipment data with full pricing. |
| `data_species.js` | Static backup for species dataset (fish/inverts). |
| `crash-course.html` | Eight-phase reef guide with glossary and recaps. |
| `about.html` | Project overview with modal glossary. |
| `feedback.html` | Survey form with EmailJS + jsPDF. |
| `login.html` | Secure entry page with blue-glow logo animation. |
| `_headers` / `robots.txt` | Netlify/GitHub deploy configuration. |

---

## ⚙️ Run Locally
```bash
# macOS
python3 -m http.server 5173

# Windows
py -m http.server 5173
```

Then open `http://localhost:5173` in your browser.

---

## 📦 Deployment Notes
- **Publish Google Sheets** as *“Anyone with the link → CSV output”*.  
- Replace sheet URLs in `app.js` if tabs are reorganized.  
- Push to GitHub → force refresh with `Ctrl + Shift + R` to clear cache.  
- Ensure `_headers` and `robots.txt` remain unchanged for Netlify.  
- All visualizer assets and logic now load cleanly without external imports.

---

## 🕒 Changelog Summary (v11.4 → v11.5)

| Area | v11.4 | v11.5 Update |
|------|--------|--------------|
| **Data Source** | Static → Google Sheets CSV (initial link) | Fully merged multi-tab live import for tanks, sumps, equipment, species |
| **Lighting Logic** | One-light logic for nano tanks | Dynamic light count per length + coral type |
| **Powerheads** | Static 1 per preset | Flow-based multiple powerhead logic (LPS 90g fix) |
| **Quick Start** | Partial preset logic | Full preset + summary auto-calculation restored |
| **Fit Checks** | Limited to flow/heater | Added turnover, corrected threshold calculations |
| **Visualizer** | Axes markers visible, light cones inverted | Clean grid, fixed orientation, balanced camera |
| **UI/UX** | Minor spacing, plain logo | Polished layout, logo glow animation, visualizer tab |
| **Crash Course** | Initial release | Retained and stable (no modification) |
| **Sheets** | Manual fetch logic | Final normalized headers + merging & filtering |
| **ResetAll()** | Partial clearing | Fully validated field reset + event rebind |

---

_Last updated: October 14, 2025 21:01 _
