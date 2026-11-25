/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        royal: {
          cream: '#f5f0e7',
          paper: '#fbf8f2',
          green: '#173c31',
          moss: '#65705a',
          brown: '#6d452a',
          gold: '#b89054',
          ink: '#22231f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 24px 70px rgba(23, 60, 49, 0.10)',
      },
    },
  },
  plugins: [],
}
