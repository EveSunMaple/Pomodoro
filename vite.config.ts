import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';

export default defineConfig({
  plugins: [
    react(),
    electron({
      entry: 'electron/main.js',
      vite: {
        build: {
          rollupOptions: {
            external: ['electron']
          }
        }
      }
    })
  ],
  optimizeDeps: {
    exclude: ['electron']
  },
  base: './',
});