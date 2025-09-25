import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// Create dist directory
if (!existsSync('dist')) {
  mkdirSync('dist')
}

// Copy manifest
copyFileSync('src/manifest.json', 'dist/manifest.json')

// Copy popup HTML
if (!existsSync('dist/popup')) {
  mkdirSync('dist/popup')
}
copyFileSync('src/popup/index.html', 'dist/popup/index.html')

// Copy icons
if (!existsSync('dist/icons')) {
  mkdirSync('dist/icons')
}
const iconSizes = [16, 32, 48, 128]
iconSizes.forEach(size => {
  if (existsSync(`src/icons/icon-${size}.png`)) {
    copyFileSync(`src/icons/icon-${size}.png`, `dist/icons/icon-${size}.png`)
  }
})

console.log('Extension files copied to dist/')
