# BatSlop

## What now?

BatSlop is a small Browser extension that aims to fix the current display issues in many subreddits where posts that are supposed to tell you about some AI project incorrectly display "I made" or "I programmed" when it should say "AI made..." and AI programmed...". Nothing more, nothing less. Enjoy.

## Install

### From Source

#### Chrome / Edge / Brave

1. Download or clone this repository
2. Open `chrome://extensions` (or `edge://extensions`, `brave://extensions`)
3. Enable **Developer mode** (toggle in top-right)
4. Click **Load unpacked** and select the `BatSlop` folder
5. Navigate to a target subreddit and enjoy

#### Firefox

1. Download or clone this repository
2. Open `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on**
4. Select the `manifest.json` file inside the `BatSlop` folder
5. Navigate to a target subreddit and enjoy

> **Note:** Temporary add-ons in Firefox are removed when the browser closes.

### From Release Packages

Release builds provide two installable archives:

- `BatSlop-<version>-chrome.zip`
- `BatSlop-<version>-firefox-unsigned.xpi`

#### Chrome / Edge / Brave

1. Download `BatSlop-<version>-chrome.zip` from the release artifacts
2. Extract the ZIP file
3. Open `chrome://extensions` (or `edge://extensions`, `brave://extensions`)
4. Enable **Developer mode**
5. Click **Load unpacked** and select the extracted extension folder

#### Firefox

1. Download `BatSlop-<version>-firefox-unsigned.xpi` from the release artifacts
2. Open `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on**
4. Select the `.xpi` file

> **Note:** The packaged Firefox `.xpi` is unsigned.
