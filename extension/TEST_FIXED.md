# 🐝 BeeKeeper Clipper - Fixed Extension Test Guide

## ✅ **Fixes Applied**

1. **Content Script**: Always sends PAGE_DATA and handles BK_OPEN_POPUP
2. **Background Script**: Registers context menu on startup and reload
3. **Popup Script**: Requests PAGE_DATA and enables Save button properly
4. **Save Helper**: Created dedicated save.ts for card injection

## 🧪 **Test Steps**

### **1. Load the Fixed Extension**
1. Go to `chrome://extensions/`
2. Click "Load unpacked"
3. Select `extension/dist` folder
4. Enable the extension

### **2. Test Toolbar Button**
1. Visit any website (e.g., `https://example.com`)
2. Click the BeeKeeper extension icon in toolbar
3. **Expected**: Popup opens with auto-filled data, Save button enabled
4. Add tags and click "Save"
5. **Expected**: Card appears instantly in BeeKeeper app

### **3. Test Context Menu**
1. Right-click anywhere on a webpage
2. **Expected**: "Save to BeeKeeper" appears in context menu
3. Click "Save to BeeKeeper"
4. **Expected**: Popup opens with auto-filled data, Save button enabled
5. Click "Save"
6. **Expected**: Card appears instantly in BeeKeeper app

### **4. Test on Different Sites**
- News sites (CNN, BBC)
- Social media (Twitter, LinkedIn)
- Documentation (MDN, Stack Overflow)
- E-commerce (Amazon, eBay)

## 🔍 **Debugging**

### **Check Console Logs**
Look for these messages in browser console:
- `[BK] Page data scraped:` - Content script working
- `[BK] Card injected:` - Card saved successfully
- `Cards reloaded from localStorage` - BeeKeeper app updated

### **Check Extension Console**
1. Go to `chrome://extensions/`
2. Click "Inspect views: service worker" on BeeKeeper extension
3. Look for any errors in the background script

### **Verify localStorage**
1. Open BeeKeeper app at `http://localhost:3000`
2. Open DevTools → Application → Local Storage
3. Look for `bk_cards` key with your saved cards

## ✅ **Success Indicators**

- ✅ Popup auto-fills with page data
- ✅ Save button is enabled when data is available
- ✅ Context menu appears on right-click
- ✅ Cards save instantly to BeeKeeper
- ✅ No "No page data available" errors
- ✅ Works on all websites

## 🚨 **If Issues Persist**

1. **Reload extension**: Click refresh button on extension card
2. **Refresh BeeKeeper tab**: Ensure app is running
3. **Check permissions**: Extension needs tabs and scripting
4. **Clear storage**: Clear Chrome storage and try again

The extension should now work reliably with both toolbar clicks and context menu! 🐝✨
