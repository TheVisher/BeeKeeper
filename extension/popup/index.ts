// Popup script for BeeKeeper Clipper
import { saveToBeeKeeperTab } from './save';

/* UI helpers */
const saveBtn = document.getElementById('save') as HTMLButtonElement;
const msgBar = document.getElementById('msg')!;

let pageData: any = null;

function enableSave() { 
  saveBtn.disabled = !pageData; 
}

// Receive page data
chrome.runtime.onMessage.addListener((m) => {
  if (m.type === 'PAGE_DATA') {
    pageData = m.payload;
    (document.getElementById('title') as HTMLInputElement).value = pageData.title || '';
    (document.getElementById('description') as HTMLInputElement).value = pageData.description || '';
    enableSave();
    msgBar.textContent = '';
  }
});

// If popup opened before PAGE_DATA arrives, request it
chrome.runtime.sendMessage({ type: 'BK_REQUEST_PAGE_DATA' });

// Load page data from storage on startup
chrome.storage.local.get(['currentPageData']).then((result) => {
  if (result.currentPageData) {
    pageData = result.currentPageData;
    (document.getElementById('title') as HTMLInputElement).value = pageData.title || '';
    (document.getElementById('description') as HTMLInputElement).value = pageData.description || '';
    enableSave();
    msgBar.textContent = '';
  } else {
    msgBar.textContent = 'No page data available';
  }
});

saveBtn.onclick = async () => {
  try {
    const tagsRaw = (document.getElementById('tags') as HTMLInputElement).value;
    await saveToBeeKeeperTab(pageData, tagsRaw);
    msgBar.className = 'ok'; 
    msgBar.textContent = 'Saved 🎉';
    setTimeout(() => window.close(), 600);
  } catch (e) {
    msgBar.className = 'err'; 
    msgBar.textContent = (e as Error).message;
  }
};

enableSave(); // initial state (disabled)
