# BeeKeeper Browser Extension - Build & Installation Guide

## 🚀 **Quick Start**

### **1. Build the Extension**

```bash
# Navigate to extension directory
cd extension

# Install dependencies
pnpm install

# Build the extension
pnpm build
```

### **2. Load in Chrome/Edge**

1. **Open Chrome/Edge** and go to `chrome://extensions/`
2. **Enable Developer Mode** (toggle in top-right corner)
3. **Click "Load unpacked"**
4. **Select the `extension/dist` folder**
5. **Extension should appear** in your extensions list

### **3. Load in Firefox**

1. **Open Firefox** and go to `about:debugging`
2. **Click "This Firefox"** in the left sidebar
3. **Click "Load Temporary Add-on"**
4. **Select `extension/dist/manifest.json`**
5. **Extension should appear** in your add-ons list

## 🔧 **Development Setup**

### **Environment Variables**

Add to your `.env.local`:

```env
# Enable dev header authentication for browser extension
ALLOW_DEV_HEADER=true
```

### **Dev User ID Setup**

1. **Open the extension popup** on any webpage
2. **Enter a dev user ID** in the popup (e.g., "demo-user-123")
3. **Click "Save Dev User ID"**
4. **Now the extension will work** without signing in to the main app

### **Hot Reload Development**

```bash
# Start development server with watch mode
pnpm dev

# Make changes to source files
# Extension will automatically rebuild
# Refresh the extension in browser to see changes
```

## 📁 **Extension Structure**

```
extension/
├── src/
│   ├── manifest.json          # MV3 manifest
│   ├── background/
│   │   └── index.ts           # Service worker
│   ├── content/
│   │   ├── index.ts           # Content script
│   │   └── index.html         # Content script HTML
│   ├── popup/
│   │   ├── index.html         # Popup UI
│   │   └── index.ts           # Popup logic
│   └── icons/                 # Extension icons
├── dist/                      # Built extension (load this)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🎯 **Features**

### **Context Menu Integration**
- **Right-click** on any webpage
- **Select "Save to BeeKeeper"**
- **Popup opens** with page data pre-filled

### **Automatic Data Extraction**
- **Title**: Page title, Open Graph title, or Twitter title
- **Description**: Meta description, Open Graph description
- **Image**: Open Graph image or Twitter image
- **Favicon**: Site favicon or Google's favicon service
- **URL**: Current page URL
- **Domain**: Extracted domain name

### **Smart Tagging**
- **Add tags** in the popup (comma-separated)
- **Tags are automatically** sent to the API
- **Organize cards** by category

### **Development Mode**
- **Works without authentication** using dev user ID
- **Perfect for testing** and development
- **Seamless integration** with local API

## 🔐 **Authentication**

### **Production Mode**
- **Requires user authentication** in the main BeeKeeper app
- **Session-based** authentication
- **Secure user-specific** card storage

### **Development Mode**
- **Dev user ID header** (`x-dev-user-id`)
- **Controlled by** `ALLOW_DEV_HEADER=true`
- **Perfect for local development**

## 🛠 **API Integration**

### **Endpoint**
```
POST http://localhost:3000/api/clip
```

### **Headers**
```json
{
  "Content-Type": "application/json",
  "x-dev-user-id": "demo-user-123"  // Optional, for dev mode
}
```

### **Payload**
```json
{
  "url": "https://example.com",
  "title": "Example Title",
  "description": "Example description",
  "image": "https://example.com/image.jpg",
  "favicon": "https://example.com/favicon.ico",
  "tags": ["tag1", "tag2"]
}
```

### **Response**
```json
{
  "id": "generated-uuid",
  "user_id": "user-id",
  "type": "link",
  "title": "Example Title",
  "description": "Example description",
  "url": "https://example.com",
  "image": "https://example.com/image.jpg",
  "favicon": "https://example.com/favicon.ico",
  "domain": "example.com",
  "tags": ["tag1", "tag2"],
  "pinned": false,
  "created_at": "2025-01-25T16:30:03.707Z"
}
```

## 🚨 **Troubleshooting**

### **Extension Not Loading**
- **Check manifest.json** is valid
- **Ensure all files** are in the dist folder
- **Try refreshing** the extension in browser

### **API Connection Failed**
- **Check BeeKeeper app** is running on `http://localhost:3000`
- **Verify environment variables** are set correctly
- **Check browser console** for CORS errors

### **Dev Mode Not Working**
- **Set `ALLOW_DEV_HEADER=true`** in `.env.local`
- **Restart the BeeKeeper app** after changing env vars
- **Set dev user ID** in extension popup

### **Permission Errors**
- **Grant necessary permissions** when prompted
- **Check host permissions** in manifest.json
- **Ensure localhost:3000** is in host_permissions

## 📦 **Build Commands**

```bash
# Development build with watch
pnpm dev

# Production build
pnpm build

# Preview built extension
pnpm preview

# Clean build directory
rm -rf dist
```

## 🔄 **Update Process**

### **After Making Changes**
1. **Run `pnpm build`**
2. **Go to `chrome://extensions/`**
3. **Click the refresh icon** on the BeeKeeper extension
4. **Test the changes**

### **Version Updates**
1. **Update version** in `src/manifest.json`
2. **Run `pnpm build`**
3. **Reload extension** in browser
4. **Test new version**

## 🎨 **Customization**

### **UI Styling**
- **Edit `src/popup/index.html`** for layout changes
- **Modify CSS** in the HTML file
- **Update icons** in `src/icons/`

### **Functionality**
- **Edit `src/popup/index.ts`** for popup logic
- **Modify `src/content/index.ts`** for content script
- **Update `src/background/index.ts`** for background tasks

### **API Integration**
- **Change API endpoint** in popup script
- **Modify headers** and payload structure
- **Update error handling** logic

## 🚀 **Production Deployment**

### **Chrome Web Store**
1. **Create developer account** at Chrome Web Store
2. **Prepare store listing** (screenshots, description, etc.)
3. **Upload built extension** from `dist/` folder
4. **Submit for review**

### **Firefox Add-ons**
1. **Create developer account** at Mozilla Add-ons
2. **Upload built extension** from `dist/` folder
3. **Submit for review**

### **Edge Add-ons**
1. **Create developer account** at Microsoft Partner Center
2. **Upload built extension** from `dist/` folder
3. **Submit for review**

The extension is fully functional and ready for both development and production use!
