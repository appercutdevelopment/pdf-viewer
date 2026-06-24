'use strict';
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VERSION = '4.4.168';
const MEDIA_DIR = path.join(__dirname, '..', 'media');
const DEST_DIR = path.join(MEDIA_DIR, 'pdfjs');
const VIEWER_HTML = path.join(DEST_DIR, 'web', 'viewer.html');

if (fs.existsSync(VIEWER_HTML)) {
    console.log('PDF.js already present — skipping download.');
    process.exit(0);
}

fs.mkdirSync(DEST_DIR, { recursive: true });

const ZIP_URL = `https://github.com/mozilla/pdf.js/releases/download/v${VERSION}/pdfjs-${VERSION}-dist.zip`;
const ZIP_PATH = path.join(MEDIA_DIR, 'pdfjs-dist.zip');

console.log(`Downloading PDF.js v${VERSION}...`);
execSync(`curl -L --fail -o "${ZIP_PATH}" "${ZIP_URL}"`, { stdio: 'inherit' });

console.log('Extracting...');
execSync(`unzip -q -o "${ZIP_PATH}" -d "${DEST_DIR}"`, { stdio: 'inherit' });

fs.unlinkSync(ZIP_PATH);
console.log('Done — PDF.js viewer is ready.');
