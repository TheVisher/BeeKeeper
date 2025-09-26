// Background script for BeeKeeper Clipper
// Handles context menu and message routing

const MENU_ID = 'bk-save';

function createContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: 'Save to BeeKeeper',
      contexts: ['page', 'link', 'image']
    });
  });
}

chrome.runtime.onInstalled.addListener(createContextMenu);
chrome.runtime.onStartup.addListener(createContextMenu);

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
