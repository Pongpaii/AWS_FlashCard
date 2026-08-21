/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // AWS brand orange used as the primary accent.
        aws: {
          orange: '#FF9900',
        },
      },
      keyframes: {
        'match-pop': {
          '0%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
      animation: {
        'match-pop': 'match-pop 0.45s ease-out',
        'fade-up': 'fade-up 0.25s ease-out',
        shake: 'shake 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
}
