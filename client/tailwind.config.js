/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Manrope', 'system-ui', 'sans-serif'] },
      colors: {
        ink: '#1b2440',
        brand: { DEFAULT: '#2352d8', dark: '#1b41ad', tint: '#eaf0fe' },
        navy: { DEFAULT: '#0f1f4b', light: '#182d63' },
        horizon: '#f5a524',
        surface: '#f2f5fb',
      },
      keyframes: { 'toast-in': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } } },
      animation: { 'toast-in': 'toast-in 0.2s ease-out' },
    },
  },
  plugins: [],
};
