/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'] },
      colors: { ink: '#1d2433', brand: { DEFAULT: '#0f766e', dark: '#115e59' } },
    },
  },
  plugins: [],
};
