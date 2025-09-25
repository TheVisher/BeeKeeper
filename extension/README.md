# BeeKeeper Browser Extension

A browser extension for the BeeKeeper bookmarking application that allows you to save web pages with a single click.

## Features

- **Context Menu**: Right-click on any page to save it to BeeKeeper
- **Popup Interface**: Edit title, description, and tags before saving
- **Auto-extraction**: Automatically extracts Open Graph data (title, description, image)
- **Dev Mode**: Supports development authentication for local testing

## Development Setup

### Prerequisites

- Node.js 18+ and pnpm
- BeeKeeper application running on `http://localhost:3000`
- Chrome or Chromium-based browser

### Installation

1. **Install dependencies:**
   ```bash
   cd extension
   pnpm install
   ```

2. **Build the extension:**
   ```bash
   pnpm build
   ```

3. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `extension/dist` folder

### Development Mode

1. **Start the dev server:**
   ```bash
   pnpm dev
   ```

2. **Configure dev authentication:**
   - Set `ALLOW_DEV_HEADER=true` in your `.env.local`
   - Set a dev user ID in the extension storage:
     ```javascript
     // In Chrome DevTools console on any page
     chrome.storage.local.set({ devUserId: 'your-dev-user-id' })
     ```

3. **Load the extension:**
   - Load the `extension/dist` folder in Chrome
   - The extension will auto-reload when you make changes

## Usage

### Context Menu

1. Right-click on any webpage
2. Select "Save to BeeKeeper" from the context menu
3. The popup will open with pre-filled data
4. Edit the title, description, and tags as needed
5. Click "Save" to add to your BeeKeeper collection

### Popup Interface

The popup shows:
- **Preview**: Page thumbnail, title, and description
- **Editable Fields**: Title, description, and tags
- **Save/Cancel**: Buttons to save or cancel the operation

### Auto-extraction

The extension automatically extracts:
- Page title (`<title>` or `og:title`)
- Description (`meta description` or `og:description`)
- Image (`og:image`)
- Favicon (`link[rel="icon"]`)
- Domain name

## API Integration

The extension communicates with the BeeKeeper API at `http://localhost:3000/api/clip`:

```typescript
interface SaveData {
  url: string
  title: string
  description: string
  image?: string
  favicon?: string
  tags?: string[]
}
```

### Authentication

- **Production**: Uses NextAuth session cookies
- **Development**: Uses `x-dev-user-id` header (when `ALLOW_DEV_HEADER=true`)

## File Structure

```
extension/
├── src/
│   ├── manifest.json          # Extension manifest
│   ├── background/
│   │   └── index.ts          # Background script (context menu)
│   ├── content/
│   │   └── index.ts          # Content script (page data extraction)
│   ├── popup/
│   │   ├── index.html        # Popup UI
│   │   └── index.ts          # Popup logic
│   └── icons/                # Extension icons
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## Building for Production

1. **Update version in `manifest.json`**
2. **Build the extension:**
   ```bash
   pnpm build
   ```
3. **Package for Chrome Web Store:**
   - Zip the contents of the `dist` folder
   - Upload to Chrome Web Store Developer Dashboard

## Troubleshooting

### Extension not loading
- Check that all files are present in the `dist` folder
- Verify the manifest.json is valid
- Check Chrome DevTools console for errors

### API connection issues
- Ensure BeeKeeper is running on `http://localhost:3000`
- Check CORS settings in the main application
- Verify authentication is configured correctly

### Context menu not appearing
- Refresh the extension in `chrome://extensions/`
- Check that the background script is running
- Verify permissions in manifest.json

## Permissions

The extension requires these permissions:
- `activeTab`: Access current tab information
- `contextMenus`: Add context menu items
- `storage`: Store extension data
- `host_permissions`: Access localhost:3000 and all websites

## Security

- Only works with `http://localhost:3000` in development
- Uses secure authentication methods
- No data is stored permanently in the extension
- All communication is over HTTPS in production
