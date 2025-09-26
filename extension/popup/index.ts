// Popup script for BeeKeeper Clipper
import { saveToBeeKeeperTab } from './save';

let pageData: any = null;
const saveBtn = document.getElementById('save') as HTMLButtonElement;

function enableSave() {
  saveBtn.disabled = !pageData;
}

chrome.runtime.onMessage.addListener((m) => {
  if (m.type === 'PAGE_DATA') {
    pageData = m.payload;
    (document.getElementById('title') as HTMLInputElement).value =
      pageData.title || '';
    (document.getElementById('description') as HTMLInputElement).value =
      pageData.description || '';
    enableSave();
  }
});

// Ask for data in case the content-script ran before popup opened
chrome.runtime.sendMessage({ type: 'BK_REQUEST_PAGE_DATA' });
enableSave(); // initial state (disabled)

saveBtn.onclick = async () => {
  try {
    const tagsRaw = (document.getElementById('tags') as HTMLInputElement).value;
    await saveToBeeKeeperTab(pageData, tagsRaw);
    const msgBar = document.getElementById('msg')!;
    msgBar.className = 'ok'; 
    msgBar.textContent = 'Saved 🎉';
    setTimeout(() => window.close(), 600);
  } catch (e) {
    const msgBar = document.getElementById('msg')!;
    msgBar.className = 'err'; 
    msgBar.textContent = (e as Error).message;
  }
};
