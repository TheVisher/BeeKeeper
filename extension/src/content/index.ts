// Content script for BeeKeeper extension

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractPageData') {
    const pageData = extractPageData()
    sendResponse(pageData)
  }
})

function extractPageData() {
  const getMetaContent = (name: string) => {
    const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
    return meta?.getAttribute('content') || ''
  }

  const getAbsoluteUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    if (url.startsWith('//')) return window.location.protocol + url
    if (url.startsWith('/')) return window.location.origin + url
    return new URL(url, window.location.href).href
  }

  return {
    title: document.title || getMetaContent('og:title') || '',
    description: getMetaContent('description') || getMetaContent('og:description') || '',
    image: getAbsoluteUrl(getMetaContent('og:image')),
    favicon: getAbsoluteUrl(
      document.querySelector('link[rel="icon"], link[rel="shortcut icon"]')?.getAttribute('href') || ''
    ),
    domain: window.location.hostname,
    url: window.location.href
  }
}

// Auto-extract data when page loads (for quick access)
const pageData = extractPageData()
chrome.storage.local.set({ currentPageData: pageData })
