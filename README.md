# Carton Dispatch Slip Generator (Multi-Company)

An automated web application for generating physical carton packing/dispatch slips across 6 pharmaceutical companies with exact **100 mm × 95 mm** slip dimensions and **6 slips per A4 sheet (2 columns × 3 rows)** printing layout.

---

## 🏢 Supported Companies & Templates

1. **MS**
2. **HARI MEDI PHARMA PVT. LTD.**
3. **ALIVIRA ANIMAL HEALTH LTD.**
4. **GANPATI ENTERPRISES**
5. **NUTRICA INTERNATIONAL PVT. LTD.**
6. **WOCKHARDT LTD.**

---

## 📐 Slip Specifications & Printing Standard

- **Physical Slip Size**: `100 mm × 95 mm` (Standard carton box label size)
- **A4 Printing Layout**: `2 columns × 3 rows = 6 slips per A4 sheet (210 mm × 297 mm)`
- **Dynamic Multi-page Pagination**:
  - `Number of Cases = Number of Slips Generated`
  - 9 Cases → Page 1 (6 slips) + Page 2 (3 slips) = 9 slips total
  - 12 Cases → Page 1 (6 slips) + Page 2 (6 slips) = 12 slips total
  - 15 Cases → Page 1 (6 slips) + Page 2 (6 slips) + Page 3 (3 slips) = 15 slips total

---

## ✨ Features

- **Live Dynamic Preview**: Real-time visual feedback of user inputs positioned directly on the template.
- **Pixel-Accurate Baseline Alignment**: Text sits cleanly above printed dotted lines, matching individual template geometries.
- **Bilingual Station & Transport Support**: Full support for English and Hindi text input (using Noto Sans Devanagari).
- **Direct PDF Export**: High-resolution vector-rendered PDF download via `html2pdf.js`.
- **Browser Print (Ctrl+P)**: Pre-configured print media styles for seamless direct printing on A4 sheets.

---

## 🚀 How to Run Locally

You can open `index.html` directly in any modern browser, or run a local static server:

```bash
# Using Python
python -m http.server 8085

# Then open in browser
http://localhost:8085
```

---

## 📁 Project Structure

```
├── index.html            # Main UI structure and form controls
├── style.css             # Glassmorphic UI design, overlays & A4 2x3 print layout
├── app.js                # Form validation, live preview, 6-per-A4 pagination & PDF generation
├── HARI MEDI PHARMA.png  # Hari Medi Pharma template image
├── ALIVIRA.png           # Alivira template image
├── GANPATI.png           # Ganpati template image
├── NUTRICA.png           # Nutrica template image
├── WOCKHARDT.png         # Wockhardt template image
└── README.md             # Documentation
```
