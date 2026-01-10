/** @type {import('tailwindcss').Config} */
const contentPaths = ['./index.html', './src/**/*.{js,jsx,ts,tsx}'];

export default {
  content: contentPaths,
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};