# 🪸 Reef Architect v11.4

An interactive web app for reef aquarium planning and equipment configuration.  
This version (v11.4) pulls live data directly from Google Sheets to keep livestock, coral, and equipment lists easily updatable.

---

## 🚀 Features

- Multi-stage builder: Tanks, Equipment, Fish & Inverts, Corals, and Summary  
- Auto-sizing and compatibility checks  
- Live Google Sheets integration for all datasets  
- "Just do it for me" quick-build presets  
- Beginner/advanced mode toggle  
- Export to PDF summary  
- Lightweight HTML, CSS, and JavaScript — no frameworks required  

---

## 🧩 File Structure

ReefArchitect/
├── index.html               # main app entry point
├── about.html               # about page
├── crash-course.html        # learning section
├── contact.html             # contact page
├── feedback.html            # user feedback form
├── login.html               # password gate
├── styles.css               # all styling
├── app.js                   # main app logic
├── sheets-config.js         # Google Sheets mapping + IDs
├── sheets-loader.js         # fetches and parses sheet data
├── data_species.js          # legacy data files (kept for fallback)
├── data_equipment.js        # legacy data files (kept for fallback)
├── data_tanks.js            # legacy data files (kept for fallback)
├── matrix_starter.js        # startup animations
└── /Images/                 # logos and assets

---

## ⚙️ Setup & Usage

### 1️⃣ Edit Google Sheets Access
Each Google Sheet must be **shared as Viewer**:
- In Google Sheets → click **Share** → set **Anyone with the link → Viewer**

### 2️⃣ Confirm Tab Names
Tab names inside each spreadsheet must match the configuration in  
`sheets-config.js`:

| Spreadsheet | Tabs |
|--------------|------|
| **Corals** | Coral |
| **Species** | Fish |
| **Equipment** | Lights, Skimmers, ReturnPumps, Powerheads, Heaters, UV, ATO, Reactors |
| **Tanks** | Tanks, Sumps |

### 3️⃣ Sheet IDs in `sheets-config.js`
IDs are already set to your live Google Sheets:

| Type | ID |
|------|----|
| Corals | 1FjHIah3paTJe9WokNTN1_94QxtdcmwXZBxIBmCd15ec |
| Species | 1gUX2L_52lN15q1uQo9_1AfHBATd3xAEuLutAnLK_1dI |
| Equipment | 1DwDdDr-1HyTUUj5MjeG_S7XuF_1fYv31A1mhVtLA41Q |
| Tanks | 14J8feKqP56iLo8FuYkPmx2AOaPNCRHE__4iJ22Dvf84 |

---

## 🧠 How It Works

1. `sheets-loader.js` requests each tab’s CSV through  
   `https://docs.google.com/spreadsheets/d/[ID]/gviz/tq?tqx=out:csv&sheet=[TabName]`
2. CSV data is parsed into JavaScript objects.
3. The data is assigned to global variables (`LIGHTS`, `TANKS`, `FISH`, `CORALS`, etc.).
4. Once all data loads, `init()` in `app.js` builds the interface dynamically.

---

## 🖥️ Local Testing

Chrome blocks Google Sheet requests from `file://` URLs.  
Use one of these methods instead:

### Option 1 — VS Code Live Server
1. Install the **Live Server** extension by Ritwick Dey.
2. Open the project folder → right-click `index.html` → “Open with Live Server.”

### Option 2 — Python (if installed)
```
cd path/to/ReefArchitect
python -m http.server 5500
```
Visit: [http://localhost:5500](http://localhost:5500)

---

## 🌐 Deployment

Works perfectly on **GitHub Pages** or **Netlify** — no backend required.

1. Commit and push all files to your repository.  
2. For GitHub Pages: enable Pages under **Settings → Pages → Deploy from branch**.  
3. For Netlify: drag the folder into the dashboard or use `git push`.

---

## 🧰 Developer Notes

- Keep only one `<script>` block at the bottom of `index.html`:
  ```html
  <script src="sheets-config.js"></script>
  <script src="sheets-loader.js"></script>
  <script src="app.js"></script>
  <script>
  document.addEventListener('DOMContentLoaded', async () => {
    try { await loadAllDataFromSheets(); }
    catch(e){ console.error(e); alert('Check Google Sheet access.'); return; }
    if (typeof window.init === 'function') window.init();
  });
  </script>
  ```
- Avoid calling `init()` manually in `app.js`; it runs only after the data loads.

---

## 🧾 License

© 2025 **Reef Architect Project**  
Created and maintained by **Sebastian A. Morales**

Use, fork, and adapt freely for non-commercial reefing education and planning projects.
