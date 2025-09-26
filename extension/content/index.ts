// Content script for BeeKeeper Clipper
// Scrapes page data and responds on demand

(() => {
  function scrape() {
    const og = (p: string) =>
      document.querySelector<HTMLMetaElement>(`meta[property="${p}"]`)?.content;

    const pageData = {
      url: location.href,
      title: og('og:title') || document.title,
      description:
        og('og:description') ||
        document
          .querySelector<HTMLMetaElement>('meta[name="description"]')
          ?.content || '',
      image:
        og('og:image') ||
        document
          .querySelector<HTMLMetaElement>('meta[property="twitter:image"]')
          ?.content || '',
      favicon:
        document.querySelector<HTMLLinkElement>('link[rel~="icon"]')?.href || ''
    };

    console.log('[BK] Page data scraped:', pageData);

    chrome.runtime.sendMessage({
      type: 'PAGE_DATA',
      payload: pageData
    });
  }

  // Send once automatically
  scrape();

  // Listen for explicit requests
  chrome.runtime.onMessage.addListener((m) => {
    if (m.type === 'BK_REQUEST_PAGE_DATA') scrape();
  });
})();
