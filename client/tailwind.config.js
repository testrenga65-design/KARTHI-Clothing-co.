/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#1c1c1c', soft: '#3a3a3a', muted: '#6b6b66' },
        paper: { DEFAULT: '#faf8f4', warm: '#f2ede4', line: '#e4ddd0' },
        sand: { 100: '#efe8dc', 200: '#e0d5c2', 300: '#cdbba0', 400: '#b39f80', 500: '#8f7c5f' },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { wider2: '0.18em' },
    },
  },
  plugins: [],
};
