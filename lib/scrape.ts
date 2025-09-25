import { JSDOM } from 'jsdom'

export interface ScrapedData {
  title?: string
  description?: string
  image?: string
  favicon?: string
  domain?: string
}

export interface ClipPayload {
  url: string
  title?: string
  description?: string
  image?: string
  favicon?: string
  tags?: string[]
}

/**
 * Fetch HTML content from a URL
 */
async function fetchHTML(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BeeKeeper/1.0; +https://github.com/beekeeper-app)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    return html
  } catch (error) {
    console.error('Error fetching HTML:', error)
    throw new Error('Failed to fetch page content')
  }
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace(/^www\./, '')
  } catch {
    return 'unknown'
  }
}

/**
 * Resolve relative URLs to absolute URLs
 */
function resolveUrl(baseUrl: string, relativeUrl: string): string {
  try {
    return new URL(relativeUrl, baseUrl).href
  } catch {
    return relativeUrl
  }
}

/**
 * Get favicon URL from domain
 */
function getDefaultFavicon(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
}

/**
 * Extract meta data from HTML using JSDOM
 */
function extractMetaData(html: string, baseUrl: string): ScrapedData {
  const dom = new JSDOM(html)
  const document = dom.window.document

  // Extract title
  const title = document.querySelector('title')?.textContent?.trim() ||
    document.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim() ||
    document.querySelector('meta[name="twitter:title"]')?.getAttribute('content')?.trim()

  // Extract description
  const description = document.querySelector('meta[property="og:description"]')?.getAttribute('content')?.trim() ||
    document.querySelector('meta[name="twitter:description"]')?.getAttribute('content')?.trim() ||
    document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim()

  // Extract image
  const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content')
  const twitterImage = document.querySelector('meta[name="twitter:image"]')?.getAttribute('content')
  
  let image: string | undefined
  if (ogImage) {
    image = resolveUrl(baseUrl, ogImage)
  } else if (twitterImage) {
    image = resolveUrl(baseUrl, twitterImage)
  }

  // Extract favicon
  let favicon: string | undefined
  const faviconLink = document.querySelector('link[rel="icon"]') ||
    document.querySelector('link[rel="shortcut icon"]') ||
    document.querySelector('link[rel="apple-touch-icon"]')
  
  if (faviconLink) {
    const faviconHref = faviconLink.getAttribute('href')
    if (faviconHref) {
      favicon = resolveUrl(baseUrl, faviconHref)
    }
  }

  // Extract domain
  const domain = extractDomain(baseUrl)

  return {
    title: title || undefined,
    description: description || undefined,
    image: image || undefined,
    favicon: favicon || getDefaultFavicon(domain),
    domain,
  }
}

/**
 * Scrape a URL and extract metadata
 */
export async function scrapeUrl(url: string): Promise<ScrapedData> {
  try {
    // Validate URL
    new URL(url)
    
    // Fetch HTML content
    const html = await fetchHTML(url)
    
    // Extract metadata
    const scrapedData = extractMetaData(html, url)
    
    return scrapedData
  } catch (error) {
    console.error('Error scraping URL:', error)
    
    // Return minimal data with domain
    return {
      domain: extractDomain(url),
      favicon: getDefaultFavicon(extractDomain(url)),
    }
  }
}

/**
 * Enrich clip payload with scraped data
 */
export async function enrichClipPayload(payload: ClipPayload): Promise<ClipPayload> {
  const enriched = { ...payload }
  
  // If we have a URL but missing other fields, scrape it
  if (payload.url && (!payload.title || !payload.description || !payload.image || !payload.favicon)) {
    try {
      const scrapedData = await scrapeUrl(payload.url)
      
      // Fill in missing fields with scraped data
      if (!enriched.title && scrapedData.title) {
        enriched.title = scrapedData.title
      }
      if (!enriched.description && scrapedData.description) {
        enriched.description = scrapedData.description
      }
      if (!enriched.image && scrapedData.image) {
        enriched.image = scrapedData.image
      }
      if (!enriched.favicon && scrapedData.favicon) {
        enriched.favicon = scrapedData.favicon
      }
      
      // Always set domain from scraped data
      if (scrapedData.domain) {
        enriched.domain = scrapedData.domain
      }
    } catch (error) {
      console.error('Error enriching payload:', error)
      // Continue with original payload if scraping fails
    }
  }
  
  // Ensure we have a title (fallback to domain or URL)
  if (!enriched.title) {
    if (enriched.domain) {
      enriched.title = enriched.domain
    } else {
      enriched.title = new URL(payload.url).hostname
    }
  }
  
  // Ensure we have a favicon
  if (!enriched.favicon) {
    const domain = enriched.domain || extractDomain(payload.url)
    enriched.favicon = getDefaultFavicon(domain)
  }
  
  return enriched
}

/**
 * Validate and normalize clip payload
 */
export function validateClipPayload(payload: any): ClipPayload {
  if (!payload.url) {
    throw new Error('URL is required')
  }
  
  try {
    new URL(payload.url)
  } catch {
    throw new Error('Invalid URL format')
  }
  
  return {
    url: payload.url,
    title: payload.title?.trim() || undefined,
    description: payload.description?.trim() || undefined,
    image: payload.image?.trim() || undefined,
    favicon: payload.favicon?.trim() || undefined,
    tags: Array.isArray(payload.tags) ? payload.tags.filter(tag => typeof tag === 'string').map(tag => tag.trim()).filter(Boolean) : [],
  }
}
