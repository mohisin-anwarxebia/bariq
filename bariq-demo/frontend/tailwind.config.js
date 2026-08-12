/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0f172a', 800: '#1e293b', 700: '#334155' },
        bariq: { purple: '#8b5cf6', blue: '#3b82f6' }
      }
    },
  },
  plugins: [],
}
