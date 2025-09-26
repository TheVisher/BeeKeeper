// Save helper for BeeKeeper Clipper
import { makeCard } from '../shared/cardHelpers';
import { BK_KEY } from '../shared/storageKey';

export async function saveToBeeKeeperTab(page: any, rawTags: string) {
  const tags = rawTags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const card = makeCard(page, tags);

  // Find open BeeKeeper tab
  const [bk] = await chrome.tabs.query({ url: 'http://localhost:3000/*' });
  if (!bk?.id) throw new Error('BeeKeeper tab not found');

  await chrome.scripting.executeScript({
    target: { tabId: bk.id },
    args: [card],
    func: (c) => {
      const list = JSON.parse(localStorage.getItem(BK_KEY) || '[]');
      list.unshift(c);
      localStorage.setItem(BK_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('beekeeper-card-added'));
      console.log('[BK] Card injected:', c);
    }
  });

  return { success: true };
}
