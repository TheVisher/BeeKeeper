// Popup script for BeeKeeper extension

interface PageData {
  title: string
  description: string
  image: string
  favicon: string
  domain: string
  url: string
}

interface SaveData {
  url: string
  title: string
  description: string
  image?: string
  favicon?: string
  tags?: string[]
}

class BeeKeeperPopup {
  private form: HTMLFormElement
  private saveBtn: HTMLButtonElement
  private cancelBtn: HTMLButtonElement
  private status: HTMLElement
  private preview: HTMLElement

  constructor() {
    this.form = document.getElementById('save-form') as HTMLFormElement
    this.saveBtn = document.getElementById('save-btn') as HTMLButtonElement
    this.cancelBtn = document.getElementById('cancel-btn') as HTMLButtonElement
    this.status = document.getElementById('status') as HTMLElement
    this.preview = document.getElementById('preview') as HTMLElement

    this.init()
  }

  private async init() {
    // Load page data
    const pageData = await this.loadPageData()
    
    if (pageData) {
      this.populateForm(pageData)
      this.showPreview(pageData)
    }

    // Set up event listeners
    this.form.addEventListener('submit', this.handleSubmit.bind(this))
    this.cancelBtn.addEventListener('click', this.handleCancel.bind(this))
  }

  private async loadPageData(): Promise<PageData | null> {
    try {
      // Check if we have pending save data from context menu
      const result = await chrome.storage.local.get(['pendingSave', 'currentPageData'])
      
      if (result.pendingSave) {
        // Clear the pending save data
        await chrome.storage.local.remove(['pendingSave'])
        return result.pendingSave
      }
      
      // Fallback to current page data
      if (result.currentPageData) {
        return result.currentPageData
      }

      // If no data available, try to get it from the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab?.id) {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractPageData' })
        return response
      }
    } catch (error) {
      console.error('Error loading page data:', error)
    }
    
    return null
  }

  private populateForm(pageData: PageData) {
    const titleInput = document.getElementById('title') as HTMLInputElement
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement
    
    titleInput.value = pageData.title
    descriptionInput.value = pageData.description
  }

  private showPreview(pageData: PageData) {
    const previewImage = document.getElementById('preview-image') as HTMLImageElement
    const previewTitle = document.getElementById('preview-title') as HTMLElement
    const previewDescription = document.getElementById('preview-description') as HTMLElement
    const previewDomain = document.getElementById('preview-domain') as HTMLElement

    if (pageData.image) {
      previewImage.src = pageData.image
      previewImage.style.display = 'block'
    } else {
      previewImage.style.display = 'none'
    }

    previewTitle.textContent = pageData.title
    previewDescription.textContent = pageData.description
    previewDomain.textContent = pageData.domain

    this.preview.style.display = 'block'
  }

  private async handleSubmit(e: Event) {
    e.preventDefault()
    
    const formData = new FormData(this.form)
    const pageData = await this.loadPageData()
    
    if (!pageData) {
      this.showStatus('Error: No page data available', 'error')
      return
    }

    const saveData: SaveData = {
      url: pageData.url,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: pageData.image || undefined,
      favicon: pageData.favicon || undefined,
      tags: (formData.get('tags') as string)
        ?.split(',')
        .map(tag => tag.trim())
        .filter(Boolean) || []
    }

    await this.saveToBeeKeeper(saveData)
  }

  private async saveToBeeKeeper(data: SaveData) {
    this.saveBtn.disabled = true
    this.showStatus('Saving...', 'loading')

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      // Always add dev user ID header for local development
      // This will use the fixed DEV_USER_ID from environment if available
      headers['x-dev-user-id'] = '00000000-0000-4000-8000-000000000000'

      const response = await fetch('http://localhost:3000/api/clip', {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      })

      if (response.ok) {
        this.showStatus('Saved successfully! 🎉', 'success')
        setTimeout(() => {
          window.close()
        }, 1500)
      } else {
        const errorData = await response.json()
        this.showStatus(`Error: ${errorData.message || 'Failed to save'}`, 'error')
      }
    } catch (error) {
      console.error('Error saving to BeeKeeper:', error)
      this.showStatus('Error: Could not connect to BeeKeeper', 'error')
    } finally {
      this.saveBtn.disabled = false
    }
  }

  private handleCancel() {
    window.close()
  }

  private showStatus(message: string, type: 'success' | 'error' | 'loading') {
    this.status.textContent = message
    this.status.className = `status ${type}`
    this.status.style.display = 'block'
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BeeKeeperPopup()
})
