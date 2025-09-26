import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: 'background/index.ts',
        popup: 'popup/index.ts',
        content: 'content/index.ts'
      },
      output: {
        entryFileNames: '[name]/index.js',
        chunkFileNames: '[name]/[name].js',
        assetFileNames: '[name]/[name].[ext]',
      },
    },
    target: 'esnext',
    minify: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
});