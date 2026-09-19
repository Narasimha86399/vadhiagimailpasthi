# 📖 తన్నీర్ నిఘంటువు (Tannir Multi-Script Dictionary)

[![Languages](https://img.shields.io/badge/Languages-Telugu%20%7C%20Malayalam%20%7C%20Tamil%20%7C%20English-6366f1.svg)](https://github.com)
[![Words](https://img.shields.io/badge/Words-7%2C585%2B-10b981.svg)](https://github.com)
[![Platform](https://img.shields.io/badge/Platforms-Website%20%7C%20PWA%20%7C%20Android%20APK-38bdf8.svg)](https://github.com)
[![Deploy](https://img.shields.io/badge/Hosting-GitHub_Pages_Ready-f59e0b.svg)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A unified **Website**, **Progressive Web App (PWA)**, and **Native Android Application** for the **Tannir (తన్నీర్)** language, featuring **7,585+ words** mapped across **Telugu (తెలుగు)**, **Malayalam (മലയാളം)**, **Tannir in Tamil script (தமிழ்)**, and **English phonetic romanization**.

---

## 🎯 Two Deployment Forms in One Repository

This project is engineered to work seamlessly as **both**:

```
                              ┌────────────────────────────────────────┐
                              │     Tannir Dictionary Codebase         │
                              └───────────────────┬────────────────────┘
                                                  │
                    ┌─────────────────────────────┴─────────────────────────────┐
                    ▼                                                           ▼
       ┌─────────────────────────┐                                 ┌─────────────────────────┐
       │   🌐 1. WEBSITE / PWA    │                                 │   📱 2. ANDROID APP     │
       ├─────────────────────────┤                                 ├─────────────────────────┤
       │ • GitHub Pages hosting  │                                 │ • Installable .apk file │
       │ • Instant URL for web   │                                 │ • Offline Android App   │
       │ • Installable via PWA   │                                 │ • Android Studio build  │
       │ • Works on any browser  │                                 │ • Native back navigation│
       └─────────────────────────┘                                 └─────────────────────────┘
```

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
- 📲 **Installable PWA & Offline Support**:
  - Equipped with Service Worker caching (`sw.js`) and Web Manifest (`manifest.json`) for 100% offline usage.

---

## 🌐 Form 1: Website & PWA Deployment (GitHub Pages)

### Step 1: Upload to GitHub
```bash
git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
git branch -M main
git push -u origin main
```

### Step 2: Turn on GitHub Pages (Free Live Website)
1. Go to your GitHub repository -> **Settings** ⚙️.
2. In the left menu, click **Pages**.
3. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
4. Set branch to `main` and folder to `/ (root)`, then click **Save**.
5. Your website will be live at:
   ```
   https://<YOUR_USERNAME>.github.io/<REPO_NAME>/
   ```

*(Mobile visitors to this URL can also tap **"Add to Home Screen"** or **"Install App"** to install it directly onto their phones!)*

---

## 📱 Form 2: Native Android App (Build APK)

The `android/` directory contains an Android Studio native wrapper app configured with a hardware-accelerated, offline-cached `WebView`.

### To build the Android APK:

#### Option A: Using Android Studio
1. Open **Android Studio**.
2. Select **Open an Existing Project** and choose the `android/` folder in this repository.
3. Click **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
4. Android Studio will generate the APK at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

#### Option B: Using Command Line (Gradle)
```bash
cd android
./gradlew assembleDebug
```

---

## 🔄 Synchronizing Web and Android Assets

Whenever you modify any web files (`index.html`, `css/`, `js/`, `data/`), run the sync script to instantly update the Android assets:

```bash
npm run sync
```

---

## 📁 Repository Structure

```
├── index.html              # Main Web Application & PWA Entry Point
├── manifest.json           # Web App Manifest for PWA App Installation
├── sw.js                   # Service Worker for 100% Offline Caching
├── sync-assets.js          # Sync script between Web App and Android App
├── package.json            # Node project configuration & npm scripts
├── css/
│   └── style.css           # Modern CSS3 Glassmorphic Design System
├── js/
│   ├── app.js              # Application Controller & State Manager
│   ├── dictionary-data.js  # 7,585+ Words Static Database
│   └── transliterate.js    # Multi-Script Transliteration & Phonetic Engine
├── data/
│   └── dictionary.json     # Raw JSON Database
├── Tannir Dictionary.xlsx  # Original Reference Spreadsheet
├── android/                # Native Android Project (WebView Wrapper)
│   ├── app/src/main/
│   │   ├── java/           # Native Java Activity
│   │   ├── res/            # Android Launcher Icons & Resources
│   │   └── assets/         # Embedded Offline Web Assets
│   └── build.gradle
├── .gitignore              # Clean Git Ignore Rules
└── README.md               # Project Documentation
```

---

## 🚀 Running Locally

```bash
# Start local development server
npm start
```
Open `http://localhost:3000` in any web browser.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.
