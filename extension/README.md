# 🐝 BeeKeeper Clipper Extension

A Chrome extension that lets you save any webpage to your BeeKeeper app with one click.

## Features

- **One-click saving**: Save any webpage to BeeKeeper instantly
- **Auto-scraping**: Automatically extracts title, description, image, and favicon
- **Tag support**: Add custom tags to organize your saved pages
- **Context menu**: Right-click any page to save
- **Toolbar button**: Click the extension icon for quick access
- **Real-time sync**: Cards appear immediately in your BeeKeeper app

## How It Works

1. **Page Scraping**: The content script runs on every page and extracts metadata
2. **Data Storage**: Page data is stored temporarily in Chrome storage
3. **Popup Interface**: Clean, simple UI for editing and saving
4. **Direct Injection**: Cards are saved directly to BeeKeeper's localStorage
5. **Instant Updates**: BeeKeeper app listens for new cards and updates in real-time

## Installation

See [INSTALL_NEW.md](./INSTALL_NEW.md) for detailed installation instructions.

## Development

Built with:
- **TypeScript** for type safety
- **Vite** for fast building
- **Chrome Extension Manifest V3** for modern extension APIs

### Project Structure

```
extension/
├── manifest.json          # Extension configuration
├── background/            # Background script (context menu)
├── content/              # Content script (page scraping)
├── popup/                # Popup UI (HTML, CSS, TS)
├── shared/               # Shared utilities
├── icons/                # Extension icons
└── dist/                 # Built extension files
```

### Building

```bash
pnpm install
pnpm build
```

The built extension will be in the `dist/` folder, ready to load in Chrome.

## Integration with BeeKeeper App

The extension integrates seamlessly with the BeeKeeper app by:

1. **Using the same localStorage key**: `bk_cards`
2. **Matching card structure**: Same interface as the main app
3. **Dispatching events**: Triggers `beekeeper-card-added` for real-time updates
4. **User ID detection**: Automatically detects the current user's session

## License

Part of the BeeKeeper project.