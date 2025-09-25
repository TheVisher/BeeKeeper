# BeeKeeper Extension Installation

## Quick Start

1. **Build the extension:**
   ```bash
   cd extension
   pnpm build
   ```

2. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `extension/dist` folder

3. **Configure dev authentication (optional):**
   - Set `ALLOW_DEV_HEADER=true` in your main app's `.env.local`
   - In Chrome DevTools console on any page, run:
     ```javascript
     chrome.storage.local.set({ devUserId: 'your-dev-user-id' })
     ```

## Usage

1. **Right-click** on any webpage
2. Select **"Save to BeeKeeper"** from the context menu
3. The popup will open with pre-filled data
4. Edit the title, description, and tags as needed
5. Click **"Save"** to add to your BeeKeeper collection

## Troubleshooting

- **Extension not loading**: Check that all files are in the `dist` folder
- **API connection issues**: Ensure BeeKeeper is running on `http://localhost:3000`
- **Context menu not appearing**: Refresh the extension in `chrome://extensions/`

## Files Created

- `dist/manifest.json` - Extension manifest
- `dist/background/index.js` - Background script (context menu)
- `dist/content/index.js` - Content script (page data extraction)
- `dist/popup/index.html` - Popup UI
- `dist/popup/index.js` - Popup logic
- `dist/icons/` - Extension icons (placeholders)

The extension is now ready to use! 🐝
