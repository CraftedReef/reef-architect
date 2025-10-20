# 🪸 Reef Architect — v11.6 (October 19, 2025)

### **Overview**
Reef Architect v11.6 introduces complete integration of live Google Sheets data, refined page navigation, usability and styling consistency across all pages, and a new interactive **Feedback system** with PDF download and EmailJS support.  
This version builds on the v11.5 foundation by improving accessibility, navigation flow, and real-time data linkage between tanks, equipment, and species.

---

## 🚀 Core Updates (v11.6)

### **1. Live Data via Google Sheets**
**File:** app.js  
- Replaced all static JS data imports with **live-linked Google Sheets CSV feeds**.  
- Each workbook now updates automatically:
  - **Tanks & Sumps:** Two CSV tabs merged dynamically.
  - **Equipment:** Eight equipment categories (lights, skimmers, pumps, heaters, UV, ATO, reactors) fetched from separate tabs.
  - **Species:** Two tabs merged (`Fish & Inverts`, `Corals`), with dynamic beginner filtering.
- Added **auto-filtering** by volume and experience level (Beginner vs Experienced).

### **2. Equipment Data Expansion**
**File:** data_equipment.js  
- Updated to **v12** dataset.
- Added `priceUSD`, `beginner`, and `coverage/par/wattage` fields.
- Improved accuracy for return pump GPH, skimmer capacity, and heater wattage.
- Expanded brand coverage (AI, Kessil, Red Sea, EcoTech, Maxspect, ReefBrite, Abyzz, Reef Octopus, Nyos, Simplicity, Bubble Magus, AquaMaxx, Deltec, Royal Exclusiv).

### **3. Fish, Coral & Invert Expansion**
**File:** data_species.js  
- Expanded beginner-friendly fish and invertebrate database.
- Grouped by families (Clownfish, Gobies, Wrasses, Tangs, Damsels, Basslets, etc.).
- Added 35+ coral species with PAR ranges and aggression data (soft, LPS, SPS).
- Unified data model for coral `parLow`, `parHigh`, `placement`, `beginner`, `coralType`.

### **4. Builder & Data Handling Improvements**
**File:** app.js  
- Introduced full `fetchCSV()` parser with automatic header normalization.
- Added `byVolume()` filtering for accurate equipment selection by tank size.
- Added beginner lockouts for advanced gear (UV & reactors).
- Improved tank/sump preset handling and Red Sea ecosystem auto-pairing.
- Enhanced “fit check” system for turnover, flow, heater wattage, and powerhead coverage.
- Fixed logic for “Just Do It For Me” options (budgets and equipment populate correctly).
- Improved reset behavior (`resetAll()`) to fully clear selections and reinitialize state.

### **5. New Feedback System (Email + PDF)**
**File:** feedback.html  
- Added EmailJS submission form with live feedback capture.
- Built-in jsPDF integration automatically generates a **downloadable PDF report** after submission.
- Automatically timestamps feedback with `submitted_at`.
- Collects user info, ratings, open feedback, and follow-up permissions.
- Added **“Thank You”** confirmation and redirect options.

### **6. Global Navigation & Home Routing Fixes**
**Files:** index.html, about.html, feedback.html, crash-course.html  
- Unified topbar design across all pages:
  ```
  Home | Crash Course | About | Review
  ```
- “Home” button now routes back to `index.html` instead of builder.
- Added Home button to About and Feedback pages.
- Added consistent Glossary modal trigger across all pages.

### **7. Visual & Layout Refinements**
**File:** styles.css  
- Unified dark theme design; removed light theme.
- Added glowing blue highlight to all `.card` elements (matches login screen).
- Removed hover shadows for cleaner visual stability.
- Standardized padding, border radii, and font hierarchy.
- Added responsive `budget-table` and `keyterms-table` layouts for Crash Course.

### **8. Crash Course Overhaul**
**File:** crash-course.html  
- Completed missing “Maintenance & Upgrades” tab.
- Expanded to 8 modules with recaps and glossary support.
- Fixed header navigation link to return to Welcome page.

### **9. Accessibility & Compliance**
- All pages include `meta name="robots" content="noindex, nofollow"`.
- Added `sessionStorage reefAuth` page gate for security.
- Improved keyboard navigation and contrast ratios.
- Glossary modals are fully keyboard accessible.

---

## 🧭 Navigation Summary
| Page | Purpose | Auth Protected | Notes |
|------|----------|----------------|-------|
| login.html | Entry gate | ✅ | SessionStorage validation |
| index.html | Welcome & Stage 0 | ✅ | “Start” launches builder |
| crash-course.html | Reefing education | ✅ | 8-phase course |
| feedback.html | Feedback form | ✅ | EmailJS + jsPDF integration |
| about.html | Project description | ✅ | Includes glossary modal |

---

## 🧩 File Version Summary
| File | Version | Key Changes |
|------|----------|--------------|
| app.js | v11.6 | Live Sheets integration, resetAll fix, flow logic, budget sync |
| data_equipment.js | v12 | Pricing, beginner flags, expanded brand coverage |
| data_species.js | v11.6 | Family grouping, coral typing, inverts unified |
| styles.css | v11 | Dark theme, glowing panels, responsive tables |
| feedback.html | v11.6 | EmailJS + jsPDF |
| about.html | v11.6 | Home button + glossary |
| crash-course.html | v11.6 | Full 8-phase rebuild |
| robots.txt | — | Disallow all for prototype privacy |

---

## 🔧 Developer Notes
- Google Sheets must stay **“Published to Web (CSV)”** for live data.
- EmailJS key: `aTTbQPfXEePcBPeok`
- jsPDF requires pop-ups enabled for PDF auto-download.

---

## 🧾 Next Steps (Planned for v11.7)
- [ ] Add real-time budget calculator with live pricing.  
- [ ] Make Welcome page standalone.  
- [ ] Redesign PDF export button (portrait only).  
- [ ] Add scroll-to-top buttons.  
- [ ] Modularize glossary content.

---

© 2025 Reef Architect  
Version v11.6 — “Live Data + Feedback Integration”  
Author: Sebastian A. Morales  
Build Date: October 19, 2025
