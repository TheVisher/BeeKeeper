// Background script for BeeKeeper Clipper
// Handles context menu and message routing

chrome.runtime.onInstalled.addListener(createMenu);
chrome.runtime.onStartup.addListener(createMenu); // ensure menu after reload

function createMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'bk-save',
      title: 'Save to BeeKeeper',
      contexts: ['page', 'link', 'image']
    });
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;
  chrome.tabs.sendMessage(tab.id, { type: 'BK_OPEN_POPUP' });
});

// Forward page data to popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_DATA') {
    // Store page data for popup to retrieve
    chrome.storage.local.set({ currentPageData: message.payload });
  }
});
