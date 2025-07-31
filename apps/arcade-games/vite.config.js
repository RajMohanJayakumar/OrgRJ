import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{js,jsx}',
        '**/*.spec.{js,jsx}',
        'dist/',
        'coverage/',
        'public/',
        'postcss.config.js',
        'tailwind.config.js',
        'vite.config.js',
        '**/*.md',
        '**/*.json',
        '**/*.config.{js,ts,cjs,mjs}',
        '**/index.html',
        '**/*.d.ts'
      ]
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5174
  },
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          icons: ['lucide-react']
        }
      }
    }
  }
})
