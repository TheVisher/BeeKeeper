# 🐝 BeeKeeper Clipper Extension - Installation Guide

## Quick Start

### 1. **Build the Extension**
```bash
cd extension
pnpm install
pnpm build
```

### 2. **Load in Chrome**
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension/dist` folder
5. The BeeKeeper Clipper extension should appear in your extensions list

### 3. **Test the Extension**
1. Make sure your BeeKeeper app is running at `http://localhost:3000`
2. Visit any website (e.g., `https://example.com`)
3. Click the BeeKeeper extension icon in the toolbar OR right-click → "Save to BeeKeeper"
4. The popup should auto-fill with page data
5. Add tags and click "Save"
6. Switch to your BeeKeeper app - the card should appear instantly!

## Features

- **Auto-scrapes page data**: Title, description, image, favicon
- **Context menu integration**: Right-click any page to save
- **Toolbar button**: Click the extension icon
- **Instant saving**: Cards appear immediately in BeeKeeper
- **Tag support**: Add comma-separated tags
- **Works on all websites**: Universal host permissions

## Troubleshooting

### Extension not loading?
- Make sure you selected the `dist` folder, not the root `extension` folder
- Check that all files are in `dist/` (manifest.json, popup/, content/, background/, icons/)

### Cards not appearing?
- Ensure BeeKeeper app is running at `http://localhost:3000`
- Check browser console for errors
- Verify you're signed in to BeeKeeper

### Popup not auto-filling?
- Refresh the page and try again
- Check that the content script is running (look for `[BK] Page data scraped:` in console)

## File Structure
```
extension/dist/
├── manifest.json
├── background/index.js
├── content/index.js
├── popup/
│   ├── index.html
│   ├── index.js
│   └── styles.css
└── icons/
    ├── 16.png
    ├── 32.png
    ├── 48.png
    └── 128.png
```

## Development

To rebuild after changes:
```bash
pnpm build
```

Then reload the extension in Chrome (click the refresh button on the extension card).
