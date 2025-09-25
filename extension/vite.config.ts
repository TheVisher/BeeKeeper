import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        background: 'src/background/index.ts',
        content: 'src/content/index.ts',
        popup: 'src/popup/index.ts'
      },
      output: {
        entryFileNames: '[name]/index.js',
        chunkFileNames: '[name]/[name].js',
        assetFileNames: '[name]/[name].[ext]'
      }
    },
    outDir: 'dist'
  }
})
