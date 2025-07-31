/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'memory-blue': '#667eea',
        'memory-purple': '#764ba2',
        'memory-red': '#ff6b6b',
        'memory-orange': '#ee5a24',
        'memory-teal': '#4ecdc4',
        'memory-green': '#44a08d',
        'memory-gold': '#ffd700',
      },
      fontFamily: {
        'memory': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'correct-pulse': 'correctPulse 0.5s ease',
        'incorrect-shake': 'incorrectShake 0.5s ease',
        'slide-in': 'slideIn 0.5s ease',
      },
      keyframes: {
        correctPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        incorrectShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        slideIn: {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
