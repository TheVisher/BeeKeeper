# 🐝 BeeKeeper Extension - Chrome Installation Guide

## Quick Installation Steps

### 1. **Open Chrome Extensions Page**
- Open Google Chrome
- Go to `chrome://extensions/`
- OR click the three dots menu → More tools → Extensions

### 2. **Enable Developer Mode**
- Toggle the "Developer mode" switch in the top-right corner
- This will show additional buttons

### 3. **Load the Extension**
- Click "Load unpacked" button
- Navigate to: `C:\Users\eahol\BeeKeeper\BeeKeeper\extension\dist`
- Select the `dist` folder and click "Select Folder"

### 4. **Verify Installation**
- You should see "BeeKeeper" extension appear in your extensions list
- The extension icon should appear in your Chrome toolbar

## How to Use

### **Method 1: Right-Click Context Menu**
1. Right-click on any webpage, link, or image
2. Select "Save to BeeKeeper" from the context menu
3. A popup window will open with pre-filled data
4. Edit the title, description, and tags as needed
5. Click "Save" to add to your BeeKeeper collection

### **Method 2: Extension Icon**
1. Click the BeeKeeper extension icon in your toolbar
2. The popup will open with the current page's data
3. Edit and save as needed

## Requirements

- **BeeKeeper App**: Make sure your BeeKeeper app is running on `http://localhost:3000`
- **Authentication**: You need to be signed in to the BeeKeeper web app
- **localStorage**: The extension saves cards directly to your browser's localStorage (no API calls needed)

## Troubleshooting

### Extension Not Loading
- Make sure you selected the `dist` folder (not the `src` folder)
- Check that all files are present in the `dist` folder
- Try refreshing the extensions page

### "Could not connect to BeeKeeper" Error
- Ensure BeeKeeper is running on `http://localhost:3000`
- Check that you're signed in to the BeeKeeper web app
- Make sure you're on the BeeKeeper app page when using the extension
- Try refreshing the extension

### Context Menu Not Appearing
- Refresh the extension in `chrome://extensions/`
- Reload the webpage you're trying to save from
- Check that the extension is enabled

## Files in Extension

The extension contains these files in the `dist` folder:
- `manifest.json` - Extension configuration
- `background/index.js` - Background script (context menu)
- `content/index.js` - Content script (page data extraction)
- `popup/index.html` - Popup interface
- `popup/index.js` - Popup logic
- `icons/` - Extension icons

## Success! 🎉

Once installed, you can start saving bookmarks directly from any webpage to your BeeKeeper collection!
