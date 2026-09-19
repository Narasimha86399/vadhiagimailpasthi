# 📖 తన్నీర్ నిఘంటువు (Tannir Language Multi-Script Dictionary)

[![Language](https://img.shields.io/badge/Languages-Telugu%20%7C%20Malayalam%20%7C%20Tamil%20%7C%20English-6366f1.svg)](https://github.com)
[![Words](https://img.shields.io/badge/Words-7%2C585%2B-10b981.svg)](https://github.com)
[![Categories](https://img.shields.io/badge/Alphabet_Sections-44_Indic_Letters-38bdf8.svg)](https://github.com)
[![Deploy](https://img.shields.io/badge/Hosting-GitHub_Pages_Ready-f59e0b.svg)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A modern, fast, and multi-script web dictionary portal for the **Tannir (తన్నీర్)** language, featuring **7,585+ words** mapped across **Telugu (తెలుగు)**, **Malayalam (മലയാളം)**, **Tannir in Tamil script (தமிழ்)**, and **English phonetic romanization**.

---

## 🌟 Key Features

- 🔍 **Instant Multi-Script Search**:
  - Search simultaneously across Telugu (`మంచి`), Malayalam (`മംചി`), Tamil/Tannir (`நழின்`), or English phonetics (`manchi`).
  - Real-time instant filtering with keyboard shortcut (`/` or `Ctrl+K`).
- 🔠 **44 Indic Letter Categories**:
  - Alphabetical browse pills with live word counts across all vowels and consonants (`అ`, `ఆ`, `ఇ`, `క`, `గ`, `చ`...).
- 🌓 **Dynamic Theme Switcher**:
  - Glassmorphic sleek **Dark Mode** & clean **Light Mode** with persistent user preference.
- ⚡ **Full CRUD Capabilities**:
  - Add new words with bidirectional auto-sync between Telugu and Malayalam scripts.
  - Edit or delete entries with real-time `localStorage` persistence.
- 📤 **Data Export Options**:
  - Download the entire dictionary database as formatted **JSON** or **CSV/Excel** (with UTF-8 BOM encoding for perfect Indic script rendering).
- 📱 **100% Mobile & Desktop Responsive**:
  - Built with pure Vanilla HTML5, CSS3 tokens, and ES6+ JavaScript without bloated frameworks or build steps.
- 🚀 **GitHub Pages Ready**:
  - Zero-configuration static hosting on GitHub Pages or any CDN.

---

## 📸 Application Preview

| Dark Mode | Light Mode |
| :---: | :---: |
| High-contrast glassmorphic dark palette with indigo & cyan highlights | Crisp typography and warm readability |

---

## 📁 Repository Structure

```
├── index.html              # Main Single-Page Web Application
├── css/
│   └── style.css           # Modern CSS3 Design System & Theme Engine
├── js/
│   ├── app.js              # Application Controller & State Manager
│   ├── dictionary-data.js  # 7,585+ Words Static Database
│   └── transliterate.js    # Multi-Script Transliteration & Phonetic Engine
├── data/
│   └── dictionary.json     # Raw JSON Database
├── Tannir Dictionary.xlsx  # Original Reference Spreadsheet
├── android/                # Android Studio Project (WebView Native Wrapper)
├── .gitignore              # Git Ignore Rules
└── README.md               # Project Documentation
```

---

## 🚀 Quick Start (Running Locally)

Because this web app uses pure standard HTML, CSS, and JavaScript, you can run it immediately without complex installs:

### Option 1: Direct in Browser
Simply double-click `index.html` or open it in Google Chrome, Microsoft Edge, Firefox, or Safari.

### Option 2: Using Node.js / Local Server
```bash
# Using Python
python -m http.server 3000

# OR using Node.js
npx serve -l 3000 .
```
Then visit `http://localhost:3000` in your web browser.

---

## 🌐 How to Deploy to GitHub Pages (Free Live Website)

To publish this website on GitHub and get a free live URL:

1. **Create a GitHub repository** (e.g. `tannir-dictionary` or `own-dictionary`).
2. **Push the code**:
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
   git branch -M main
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Click on **Settings** ⚙️ > **Pages** (in the left sidebar).
   - Under **Build and deployment** > **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and folder `/ (root)`, then click **Save**.
   - Your live website will be accessible at:
     ```
     https://<YOUR_USERNAME>.github.io/<REPO_NAME>/
     ```

---

## 📊 Data Schema

Each dictionary entry contains:

```json
{
  "id": 1,
  "letterTe": "ష",
  "letterMl": "ഷ",
  "col": "AO",
  "malayalam": "ഷകടം",
  "telugu": "షకటం",
  "tannir": "வண்டலி",
  "note": "cart / vehicle",
  "romanTe": "shakatam",
  "romanMl": "shakatam",
  "romanTannir": "vandali"
}
```

---

## 📱 Android App Integration

The `android/` directory contains an Android Studio project that embeds this web application inside an optimized native `WebView`, allowing deployment as an Android APK with offline asset caching.

---

## 🤝 Contributing

Contributions, suggestions, and corrections to the Tannir vocabulary are warmly welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AddWords`)
3. Commit your Changes (`git commit -m 'Add new words'`)
4. Push to the Branch (`git push origin feature/AddWords`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
