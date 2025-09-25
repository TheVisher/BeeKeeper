// Background script for BeeKeeper extension

chrome.runtime.onInstalled.addListener(() => {
  // Create context menu items for different contexts
  chrome.contextMenus.create({
    id: 'save-to-beekeeper',
    title: 'Save to BeeKeeper',
    contexts: ['page', 'link', 'image']
  })
  
  // Add specific menu items for better UX
  chrome.contextMenus.create({
    id: 'save-link-to-beekeeper',
    title: 'Save Link to BeeKeeper',
    contexts: ['link']
  })
  
  chrome.contextMenus.create({
    id: 'save-image-to-beekeeper',
    title: 'Save Image to BeeKeeper',
    contexts: ['image']
  })
})

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'save-to-beekeeper' || 
      info.menuItemId === 'save-link-to-beekeeper' || 
      info.menuItemId === 'save-image-to-beekeeper') {
    try {
      // Get the current active tab to ensure we're working with the right tab
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true })
      const currentTab = activeTab || tab
      
      // Determine what was right-clicked and get the appropriate URL
      let url = info.linkUrl || info.srcUrl || currentTab?.url
      let title = ''
      let description = ''
      let image = ''
      
      console.log('Context menu clicked:', {
        menuItemId: info.menuItemId,
        linkUrl: info.linkUrl,
        srcUrl: info.srcUrl,
        linkText: info.linkText,
        altText: info.altText,
        tabUrl: currentTab?.url,
        tabTitle: currentTab?.title,
        activeTabUrl: activeTab?.url
      })
      
      if (info.linkUrl) {
        // User right-clicked on a link - save the link URL
        url = info.linkUrl
        title = info.linkText || 'Link'
        description = `Link: ${info.linkText || info.linkUrl}`
        console.log('Saving link:', url)
      } else if (info.srcUrl) {
        // User right-clicked on an image/media - save the media URL
        url = info.srcUrl
        title = info.altText || 'Image'
        description = `Image: ${info.altText || 'Media content'}`
        image = info.srcUrl // Set image URL for images
        console.log('Saving image:', url)
      } else {
        // User right-clicked on the page - save the page URL
        url = currentTab?.url || ''
        title = currentTab?.title || 'Page'
        description = `Page: ${currentTab?.title || 'Web page'}`
        console.log('Saving page:', url)
      }

      if (!url) {
        console.error('No URL found to save')
        return
      }

      // Store the data for the popup to use - let server-side scraping handle metadata
      await chrome.storage.local.set({
        pendingSave: {
          url,
          title: title,
          description: description,
          image: image,
          favicon: '',
          domain: new URL(url).hostname,
          timestamp: Date.now()
        }
      })

      // Open popup window instead of using action.openPopup()
      await chrome.windows.create({
        url: chrome.runtime.getURL('popup/index.html'),
        type: 'popup',
        width: 400,
        height: 600,
        left: 100,
        top: 100
      })
    } catch (error) {
      console.error('Error saving to BeeKeeper:', error)
    }
  }
})

// Function to extract page data (runs in content script context)
function extractPageData(url: string, title: string, description: string) {
  const getMetaContent = (name: string) => {
    const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
    return meta?.getAttribute('content') || ''
  }

  // If it's a link or image, try to extract better metadata
  if (url !== window.location.href) {
    // For links and images, try to find better metadata from the current page
    return {
      title: title || document.title || getMetaContent('og:title') || '',
      description: description || getMetaContent('description') || getMetaContent('og:description') || '',
      image: getMetaContent('og:image') || '',
      favicon: document.querySelector('link[rel="icon"], link[rel="shortcut icon"]')?.getAttribute('href') || '',
      domain: new URL(url).hostname
    }
  }

  // For the main page, extract full metadata
  return {
    title: document.title || getMetaContent('og:title') || '',
    description: getMetaContent('description') || getMetaContent('og:description') || '',
    image: getMetaContent('og:image') || '',
    favicon: document.querySelector('link[rel="icon"], link[rel="shortcut icon"]')?.getAttribute('href') || '',
    domain: window.location.hostname
  }
}
