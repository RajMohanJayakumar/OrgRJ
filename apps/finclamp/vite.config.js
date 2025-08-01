import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/prime/' : '/', // GitHub Pages for production, clean path for dev
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
        'src/scripts/',
        'scripts/',
        'dist/',
        'coverage/',
        'html/',
        'public/',
        'postcss.config.js',
        'tailwind.config.js',
        'vite.config.js',
        '**/*.md',
        '**/*.txt',
        '**/*.json',
        '**/*.config.{js,ts,cjs,mjs}',
        '**/sw.js',
        '**/index.html',
        '**/*.d.ts'
      ]
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true, // Fail if port is in use instead of trying another
    // Handle SPA routing during development
    historyApiFallback: {
      rewrites: [
        { from: /^\/calculators\/.*$/, to: '/index.html' },
        { from: /^\/games\/.*$/, to: '/index.html' },
        { from: /^\/calculator\/.*$/, to: '/index.html' },
      ]
    }
  },
  build: {
    // Ensure proper asset handling
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          motion: ['framer-motion'],
          icons: ['lucide-react']
        }
      }
    }
  },
  // Force Rollup to use WASM in CI environments
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  }
})
