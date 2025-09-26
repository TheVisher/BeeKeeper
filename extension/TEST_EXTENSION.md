# 🧪 Testing the BeeKeeper Extension

## Quick Test Steps

### 1. **Install the Extension**
- Follow the installation steps in `CHROME_INSTALL.md`
- Make sure the extension is loaded and enabled

### 2. **Test on BeeKeeper App**
1. Open your BeeKeeper app at `http://localhost:3000`
2. Sign in to your account
3. Right-click anywhere on the page
4. Select "Save to BeeKeeper" from the context menu
5. **Expected Result**: The popup should show "You are already on the BeeKeeper app 🎉" and disable the save button. This is the expected behavior when on the BeeKeeper app page.

### 3. **Test on External Websites**
1. Go to any website (e.g., `https://example.com`)
2. Make sure your BeeKeeper app is open at `http://localhost:3000`
3. Right-click on the page OR click the BeeKeeper toolbar icon
4. Select "Save to BeeKeeper" from the context menu (or popup opens automatically)
5. The popup should auto-fill with page metadata (title, description, image)
6. Add some tags in the tags field (e.g., "webdev, react, tutorial")
7. Click "Save" - you should see "Saved to BeeKeeper! 🎉"
8. Switch to your BeeKeeper app tab - the card should appear immediately
9. Check the BeeKeeper tab's console for "[BK] injected card" message

### 4. **Verify localStorage Integration**
1. Open Chrome DevTools (F12)
2. Go to Application tab → Local Storage → `http://localhost:3000`
3. Look for keys starting with `beekeeper_cards_`
4. You should see your saved cards in JSON format

## Expected Behavior

### ✅ **Success Indicators**
- Extension popup opens when right-clicking OR clicking toolbar icon
- Page metadata is automatically extracted and auto-fills the form
- Tags field accepts comma-separated values and parses them correctly
- "Saved to BeeKeeper! 🎉" message appears
- Card appears immediately in the main BeeKeeper app
- No API calls are made (check Network tab)
- Cards are stored in the BeeKeeper tab's localStorage
- Extension injects script into BeeKeeper tab to save cards
- Console shows "[BK] injected card" message in BeeKeeper tab
- Cards appear instantly without page refresh
- No "No page data available" errors
- Robust tag parsing handles various input formats

### ❌ **Error Scenarios**
- "You are already on the BeeKeeper app 🎉" - This is expected when on the BeeKeeper app page
- "BeeKeeper app is not open" - Make sure you have a tab open at `http://localhost:3000`
- "No page data available" - Content script may not have loaded yet, try refreshing the page
- Cards not appearing - Check if you're signed in to the main app and that the BeeKeeper tab is open

## Debugging

### Check Console Logs
1. Open DevTools (F12)
2. Go to Console tab
3. Look for messages starting with:
   - `[BK] Page data scraped:`
   - `[BK] injected card`
   - `Cards reloaded from localStorage`

### Check localStorage
1. DevTools → Application → Local Storage
2. Look for `beekeeper_cards_[userId]` keys
3. Verify card data is properly formatted

### Check Extension Console
1. Go to `chrome://extensions/`
2. Find BeeKeeper extension
3. Click "Inspect views: popup" or "background page"
4. Check for any error messages

## Troubleshooting

### Extension Not Working
- Refresh the extension in `chrome://extensions/`
- Try refreshing the webpage you're trying to save from
- Check that you're signed in to the main app

### Cards Not Appearing
- Check if the main app is listening for the `beekeeper-card-added` event
- Verify the user ID matches between extension and main app
- Check localStorage for the saved cards

### Communication Issues
- The extension uses both `chrome.tabs.sendMessage` and `postMessage`
- If one fails, it should fall back to the other
- Check the console for communication errors

## Success! 🎉

If everything works correctly, you should be able to:
1. Save cards from any website using the extension
2. See them appear immediately in your BeeKeeper app
3. All data is stored locally in your browser's localStorage
4. No API calls are made - everything works offline!
