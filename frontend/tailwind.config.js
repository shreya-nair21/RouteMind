/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        travel: {
          primary: '#FF385C',
          'primary-hover': '#E31C5F',
          secondary: '#00A699',
          dark: '#222222',
          muted: '#717171',
          light: '#F7F7F7',
          border: '#DDDDDD'
        }
      },
      borderRadius: {
        'travel-card': '12px',
        'travel-btn': '8px',
      },
      boxShadow: {
        'travel-card': '0 6px 16px rgba(0, 0, 0, 0.12)',
        'travel-pop': '0 1px 2px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
