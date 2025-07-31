/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'arcade-blue': '#007bff',
        'arcade-green': '#28a745',
        'arcade-red': '#dc3545',
        'arcade-yellow': '#ffc107',
        'arcade-purple': '#6f42c1',
      },
      fontFamily: {
        'arcade': ['Courier New', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}
