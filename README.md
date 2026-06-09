# BatSlop

## What now?

BatSlop is a small Browser extension that aims to fix the current display issues in many subreddits where posts that are supposed to tell you about some AI project incorrectly display "I made" or "I programmed" when it should say "AI made..." and AI programmed...". Nothing more, nothing less. Enjoy.

## Install

### Firefox

Install BatSlop from the official Firefox Add-ons store:

<https://addons.mozilla.org/en-US/firefox/addon/batslop/>

This is the recommended Firefox installation method because the extension is signed and remains installed normally.

### Chrome / Edge / Brave

GitHub release builds provide a Chrome-family archive:

- `BatSlop-<version>-chrome.zip`

1. Download `BatSlop-<version>-chrome.zip` from the release artifacts
2. Extract the ZIP file
3. Open `chrome://extensions` (or `edge://extensions`, `brave://extensions`)
4. Enable **Developer mode**
5. Click **Load unpacked** and select the extracted extension folder

### Development / Testing

#### Load From Source

1. Download or clone this repository
2. Open your browser's extension debugging page:
   - Chrome / Edge / Brave: `chrome://extensions`, `edge://extensions`, or `brave://extensions`
   - Firefox: `about:debugging#/runtime/this-firefox`
3. Load the repository folder as an unpacked extension in Chrome-family browsers, or select `manifest.json` as a temporary add-on in Firefox

#### Unsigned Firefox Package

GitHub releases also include an unsigned Firefox package for testing:

- `BatSlop-<version>-firefox-unsigned.xpi`

1. Download `BatSlop-<version>-firefox-unsigned.xpi` from the release artifacts
2. Open `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on**
4. Select the `.xpi` file

> **Note:** The GitHub `.xpi` is unsigned and intended for temporary testing only. Firefox users should install the signed version from the Firefox Add-ons store.
