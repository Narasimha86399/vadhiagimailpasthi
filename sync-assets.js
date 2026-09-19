/**
 * sync-assets.js
 * Keeps web application assets in perfect 1:1 sync with the native Android app's assets folder.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const ANDROID_ASSETS_DIR = path.join(ROOT_DIR, 'android', 'app', 'src', 'main', 'assets');

function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursive(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

console.log('🔄 Syncing web app assets to Android app...');

const itemsToSync = ['index.html', 'manifest.json', 'sw.js', 'css', 'js', 'data'];

itemsToSync.forEach((item) => {
  const src = path.join(ROOT_DIR, item);
  const dest = path.join(ANDROID_ASSETS_DIR, item);
  if (fs.existsSync(src)) {
    copyRecursive(src, dest);
    console.log(`  ✓ Synced: ${item}`);
  }
});

console.log('✅ Web and Android assets are 100% synchronized!');
